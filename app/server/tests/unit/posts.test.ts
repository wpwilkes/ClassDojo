import assert from 'node:assert/strict';
import test from 'node:test';
import { POST_CATEGORIES, POST_LIMITS } from '../../src/config/posts';
import { validateCommentInput } from '../../src/utils/comments.validation';
import { validatePostInput } from '../../src/utils/posts.validation';

const validPost = {
  title: 'Docker is finally working',
  description: 'This is a valid Summit post.',
  category: 'Technology',
  anonymous: false,
};

test('valid post input passes validation', () => {
  const result = validatePostInput(validPost);

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('empty post fields are rejected', () => {
  const result = validatePostInput({
    ...validPost,
    title: '   ',
    description: '',
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('Title is required.'));
  assert.ok(result.errors.includes('Post content is required.'));
});

test('invalid category is rejected', () => {
  const result = validatePostInput({
    ...validPost,
    category: 'Random',
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('A valid category is required.'));
});

test('every configured category is accepted', () => {
  for (const category of POST_CATEGORIES) {
    assert.equal(
      validatePostInput({ ...validPost, category }).valid,
      true,
    );
  }
});

test('post lengths accept the limit and reject the next character', () => {
  const input = {
    ...validPost,
    title: 'a'.repeat(POST_LIMITS.title),
    description: 'b'.repeat(POST_LIMITS.description),
  };

  assert.equal(validatePostInput(input).valid, true);

  assert.equal(
    validatePostInput({
      ...input,
      title: input.title + 'a',
    }).valid,
    false,
  );

  assert.equal(
    validatePostInput({
      ...input,
      description: input.description + 'b',
    }).valid,
    false,
  );
});

test('anonymous must be an actual boolean', () => {
  assert.equal(
    validatePostInput({ ...validPost, anonymous: true }).valid,
    true,
  );

  for (const anonymous of ['false', 'true', 0, 1, null, undefined]) {
    const result = validatePostInput({
      ...validPost,
      anonymous,
    });

    assert.ok(
      result.errors.includes('Anonymous must be true or false.'),
    );
  }
});

test('non-object input is rejected without throwing', () => {
  for (const input of [null, undefined, [], 'text', 12, true]) {
    assert.equal(validatePostInput(input).valid, false);
    assert.equal(validateCommentInput(input).valid, false);
  }
});

test('non-string content is rejected', () => {
  assert.equal(
    validatePostInput({ ...validPost, title: 123 }).valid,
    false,
  );

  assert.equal(
    validatePostInput({ ...validPost, description: {} }).valid,
    false,
  );

  assert.equal(validateCommentInput({ body: 123 }).valid, false);
});

test('blank comments are rejected', () => {
  const result = validateCommentInput({ body: '   ' });

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('Comment is required.'));
});

test('comment lengths accept the limit and reject the next character', () => {
  assert.equal(
    validateCommentInput({
      body: 'a'.repeat(POST_LIMITS.comment),
    }).valid,
    true,
  );

  const result = validateCommentInput({
    body: 'a'.repeat(POST_LIMITS.comment + 1),
  });

  assert.equal(result.valid, false);

  assert.ok(
    result.errors.includes('Comment must be 2,000 characters or fewer.'),
  );
});

test('surrounding whitespace is ignored when validating content length', () => {
  assert.equal(
    validatePostInput({
      ...validPost,
      title: '  ' + 'a'.repeat(POST_LIMITS.title) + '  ',
    }).valid,
    true,
  );

  assert.equal(
    validateCommentInput({
      body: '  A useful comment.  ',
    }).valid,
    true,
  );
});