import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';

import { createApp } from '../../src/app';
import { POST_CATEGORIES } from '../../src/config/posts';
import { InMemoryPostsRepository } from '../../src/db/posts.memory';

const ownerHeaders = {
  'x-user-id': 'ayman-test-user',
  'x-user-name': 'Ayman',
};

const otherHeaders = {
  'x-user-id': 'other-test-user',
  'x-user-name': 'Other User',
};

const validPost = {
  title: 'My Summit post',
  description: 'A full post created by the integration test.',
  category: 'Technology',
  anonymous: false,
};

function createTestApp() {
  const repository = new InMemoryPostsRepository();

  return {
    repository,
    app: createApp({
      repository,
      allowDevUserHeaders: true,
    }),
  };
}

async function seededApp() {
  const fixture = createTestApp();

  const created = await request(fixture.app)
    .post('/api/posts')
    .set(ownerHeaders)
    .send(validPost);

  assert.equal(created.status, 201);

  return {
    ...fixture,
    postId: created.body.id as string,
  };
}

test('complete post workflow works through the API', async () => {
  const { app, repository } = createTestApp();

  const invalid = await request(app)
    .post('/api/posts')
    .set(ownerHeaders)
    .send({
      ...validPost,
      title: '',
      description: '',
    });

  assert.equal(invalid.status, 400);

  const created = await request(app)
    .post('/api/posts')
    .set(ownerHeaders)
    .send(validPost);

  assert.equal(created.status, 201);
  assert.equal(created.body.title, validPost.title);
  assert.equal(created.body.isOwner, true);

  const postId = created.body.id as string;

  const feed = await request(app)
    .get('/api/posts')
    .set(ownerHeaders);

  assert.equal(feed.status, 200);
  assert.equal(feed.body.length, 1);

  const detail = await request(app)
    .get(`/api/posts/${postId}`)
    .set(ownerHeaders);

  assert.equal(detail.status, 200);
  assert.equal(detail.body.description, validPost.description);

  const comment = await request(app)
    .post(`/api/posts/${postId}/comments`)
    .set(ownerHeaders)
    .send({ body: 'My first comment.' });

  assert.equal(comment.status, 201);

  const comments = await request(app)
    .get(`/api/posts/${postId}/comments`);

  assert.equal(comments.status, 200);
  assert.equal(comments.body.length, 1);
  assert.equal(comments.body[0].body, 'My first comment.');
  assert.equal(comments.body[0].authorId, undefined);

  const voted = await request(app)
    .post(`/api/posts/${postId}/vote`)
    .set(ownerHeaders)
    .send({ value: 1 });

  assert.equal(voted.status, 200);
  assert.equal(voted.body.voteCount, 1);
  assert.equal(voted.body.commentCount, 1);

  const forbiddenEdit = await request(app)
    .patch(`/api/posts/${postId}`)
    .set(otherHeaders)
    .send({ title: 'Not allowed' });

  assert.equal(forbiddenEdit.status, 403);

  const edited = await request(app)
    .patch(`/api/posts/${postId}`)
    .set(ownerHeaders)
    .send({ title: 'Edited by owner' });

  assert.equal(edited.status, 200);
  assert.equal(edited.body.title, 'Edited by owner');
  assert.equal(edited.body.description, validPost.description);

  const filtered = await request(app)
    .get('/api/posts?category=Technology')
    .set(ownerHeaders);

  assert.equal(filtered.status, 200);
  assert.equal(filtered.body.length, 1);

  const forbiddenDelete = await request(app)
    .delete(`/api/posts/${postId}`)
    .set(otherHeaders);

  assert.equal(forbiddenDelete.status, 403);

  const deleted = await request(app)
    .delete(`/api/posts/${postId}`)
    .set(ownerHeaders);

  assert.equal(deleted.status, 200);
  assert.deepEqual(deleted.body, { deleted: true });
  assert.deepEqual(await repository.listComments(postId), []);

  const emptyFeed = await request(app).get('/api/posts');

  assert.equal(emptyFeed.status, 200);
  assert.deepEqual(emptyFeed.body, []);
});

test('write endpoints require a user; reads remain public', async () => {
  const { app, postId } = await seededApp();

  const results = await Promise.all([
    request(app)
      .post('/api/posts')
      .send(validPost),

    request(app)
      .patch(`/api/posts/${postId}`)
      .send({ title: 'Changed' }),

    request(app)
      .delete(`/api/posts/${postId}`),

    request(app)
      .post(`/api/posts/${postId}/vote`)
      .send({ value: 1 }),

    request(app)
      .post(`/api/posts/${postId}/comments`)
      .send({ body: 'Hello' }),
  ]);

  for (const result of results) {
    assert.equal(result.status, 401);
  }

  const feed = await request(app).get('/api/posts');

  assert.equal(feed.status, 200);
  assert.equal(feed.body[0].isOwner, false);
});

test('demo identity headers can be disabled', async () => {
  const app = createApp({
    allowDevUserHeaders: false,
  });

  const response = await request(app)
    .post('/api/posts')
    .set(ownerHeaders)
    .send(validPost);

  assert.equal(response.status, 401);
});

test('an injected session resolver takes precedence over spoofed demo headers', async () => {
  const repository = new InMemoryPostsRepository();

  const app = createApp({
    repository,
    allowDevUserHeaders: true,
    resolveUser: async () => ({
      id: 'session-user',
      name: 'Session User',
    }),
  });

  const created = await request(app)
    .post('/api/posts')
    .set(ownerHeaders)
    .send(validPost);

  assert.equal(created.status, 201);

  const stored = await repository.getPost(created.body.id);

  assert.equal(stored?.authorId, 'session-user');
  assert.equal(created.body.author, 'Session User');
});

test('anonymous posts hide identity in create, list, detail, edit, and vote responses', async () => {
  const { app } = createTestApp();

  const created = await request(app)
    .post('/api/posts')
    .set(ownerHeaders)
    .send({
      ...validPost,
      anonymous: true,
    });

  assert.equal(created.status, 201);

  const id = created.body.id as string;

  const feed = await request(app)
    .get('/api/posts')
    .set(otherHeaders);

  const detail = await request(app)
    .get(`/api/posts/${id}`);

  const edited = await request(app)
    .patch(`/api/posts/${id}`)
    .set(ownerHeaders)
    .send({ title: 'Still anonymous' });

  const vote = await request(app)
    .post(`/api/posts/${id}/vote`)
    .set(otherHeaders)
    .send({ value: 1 });

  for (const post of [
    created.body,
    feed.body[0],
    detail.body,
    edited.body,
    vote.body,
  ]) {
    assert.equal(post.author, 'Anonymous');
    assert.equal(post.authorId, undefined);
    assert.equal(post.authorName, undefined);
    assert.equal(post.votes, undefined);
  }

  assert.equal(created.body.isOwner, true);
  assert.equal(feed.body[0].isOwner, false);
});

test('category filtering and the categories endpoint use the configured values', async () => {
  const { app } = await seededApp();

  await request(app)
    .post('/api/posts')
    .set(ownerHeaders)
    .send({
      ...validPost,
      category: 'Health',
    })
    .expect(201);

  const response = await request(app)
    .get('/api/posts?category=Health');

  assert.equal(response.status, 200);
  assert.equal(response.body.length, 1);
  assert.equal(response.body[0].category, 'Health');

  const empty = await request(app)
    .get('/api/posts?category=Sports');

  assert.deepEqual(empty.body, []);

  const categories = await request(app)
    .get('/api/posts/categories');

  assert.equal(categories.status, 200);
  assert.deepEqual(categories.body, [...POST_CATEGORIES]);

  for (const query of [
    'Random',
    '',
    'Technology&category=Health',
  ]) {
    await request(app)
      .get('/api/posts?category=' + query)
      .expect(400);
  }
});

test('repeated votes toggle off and opposite votes replace previous votes', async () => {
  const { app, postId } = await seededApp();

  for (const [value, expected] of [
    [1, 1],
    [1, 0],
    [-1, -1],
    [1, 1],
  ]) {
    const result = await request(app)
      .post(`/api/posts/${postId}/vote`)
      .set(ownerHeaders)
      .send({ value });

    assert.equal(result.status, 200);
    assert.equal(result.body.voteCount, expected);
  }

  const secondUser = await request(app)
    .post(`/api/posts/${postId}/vote`)
    .set(otherHeaders)
    .send({ value: -1 });

  assert.equal(secondUser.body.voteCount, 0);

  for (const value of [0, 2, '1', null]) {
    await request(app)
      .post(`/api/posts/${postId}/vote`)
      .set(ownerHeaders)
      .send({ value })
      .expect(400);
  }
});

test('arbitrary user IDs do not change the vote object prototype', async () => {
  const { app, postId } = await seededApp();

  for (const expected of [1, 0]) {
    const response = await request(app)
      .post(`/api/posts/${postId}/vote`)
      .set({ 'x-user-id': '__proto__' })
      .send({ value: 1 });

    assert.equal(response.status, 200);
    assert.equal(response.body.voteCount, expected);
  }
});

test('invalid patches do not change or transfer ownership of a post', async () => {
  const { app, postId } = await seededApp();

  for (const input of [
    {},
    [],
    { title: null },
    { title: ' ' },
    { anonymous: null },
    { anonymous: 'false' },
    { category: 'Random' },
    { authorId: otherHeaders['x-user-id'] },
  ]) {
    await request(app)
      .patch(`/api/posts/${postId}`)
      .set(ownerHeaders)
      .send(input)
      .expect(400);
  }

  const unchanged = await request(app)
    .get(`/api/posts/${postId}`)
    .set(ownerHeaders);

  assert.equal(unchanged.body.title, validPost.title);
  assert.equal(unchanged.body.isOwner, true);
});

test('content is trimmed and extra creation fields cannot override ownership', async () => {
  const { app, repository } = createTestApp();

  const created = await request(app)
    .post('/api/posts')
    .set(ownerHeaders)
    .send({
      ...validPost,
      title: '  Trim me  ',
      description: '  Content  ',
      authorId: otherHeaders['x-user-id'],
      votes: { fake: 1 },
    });

  assert.equal(created.status, 201);
  assert.equal(created.body.title, 'Trim me');
  assert.equal(created.body.description, 'Content');
  assert.equal(created.body.voteCount, 0);

  assert.equal(
    (await repository.getPost(created.body.id))?.authorId,
    ownerHeaders['x-user-id'],
  );

  const comment = await request(app)
    .post(`/api/posts/${created.body.id}/comments`)
    .set(ownerHeaders)
    .send({ body: '  A reply  ' });

  assert.equal(comment.body.body, 'A reply');
});

test('unknown post IDs return 404 on every post-specific operation', async () => {
  const { app } = createTestApp();

  const results = await Promise.all([
    request(app)
      .get('/api/posts/missing'),

    request(app)
      .patch('/api/posts/missing')
      .set(ownerHeaders)
      .send({ title: 'Test' }),

    request(app)
      .delete('/api/posts/missing')
      .set(ownerHeaders),

    request(app)
      .post('/api/posts/missing/vote')
      .set(ownerHeaders)
      .send({ value: 1 }),

    request(app)
      .get('/api/posts/missing/comments'),

    request(app)
      .post('/api/posts/missing/comments')
      .set(ownerHeaders)
      .send({ body: 'Test' }),
  ]);

  for (const result of results) {
    assert.equal(result.status, 404);
  }
});

test('invalid comments are rejected without changing comment count', async () => {
  const { app, postId } = await seededApp();

  for (const body of ['', '   ', 123, 'a'.repeat(2001)]) {
    await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set(ownerHeaders)
      .send({ body })
      .expect(400);
  }

  const post = await request(app)
    .get(`/api/posts/${postId}`);

  assert.equal(post.body.commentCount, 0);
});

test('missing, malformed, and oversized JSON produce JSON errors', async () => {
  const { app } = createTestApp();

  await request(app)
    .post('/api/posts')
    .set(ownerHeaders)
    .expect(400);

  const malformed = await request(app)
    .post('/api/posts')
    .set(ownerHeaders)
    .set('Content-Type', 'application/json')
    .send('{broken');

  assert.equal(malformed.status, 400);
  assert.match(
    malformed.headers['content-type'],
    /application\/json/,
  );
  assert.equal(
    malformed.body.message,
    'Request body must be valid JSON.',
  );

  const oversized = await request(app)
    .post('/api/posts')
    .set(ownerHeaders)
    .send({
      ...validPost,
      description: 'a'.repeat(110_000),
    });

  assert.equal(oversized.status, 413);
});

test('each application has isolated temporary storage', async () => {
  const { app: first } = await seededApp();
  const { app: second } = createTestApp();

  const populated = await request(first).get('/api/posts');
  const empty = await request(second).get('/api/posts');

  assert.equal(populated.body.length, 1);
  assert.deepEqual(empty.body, []);
});

test('repository failures return a generic JSON error without leaking details', async () => {
  class FailingRepository extends InMemoryPostsRepository {
    override async listPosts(): Promise<never> {
      throw new Error('Internal connection details');
    }
  }

  const app = createApp({
    repository: new FailingRepository(),
  });

  const response = await request(app).get('/api/posts');

  assert.equal(response.status, 500);
  assert.deepEqual(response.body, {
    message: 'An unexpected server error occurred.',
  });
});

test('the development page and assets are served from the client directory', async () => {
  const { app } = createTestApp();

  for (const url of ['/posts', '/api/posts-page']) {
    const page = await request(app).get(url);

    assert.equal(page.status, 200);
    assert.match(
      page.text,
      /\/posts-assets\/pages\/posts.js/,
    );
  }

  for (const asset of [
    'pages/posts.css',
    'pages/posts.js',
    'services/posts.api.js',
    'utils/escape-html.js',
  ]) {
    await request(app)
      .get('/posts-assets/' + asset)
      .expect(200);
  }

  await request(app)
    .get('/api/not-a-route')
    .expect(404);
});