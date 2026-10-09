// Development identity only.
// Replace it with the team's authenticated session later.
const demoHeaders = {
  'x-user-id': 'ayman-local-user',
  'x-user-name': 'Ayman',
};

export async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...demoHeaders,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

export const postsApi = {
  categories: () => api('/api/posts/categories'),

  list: (category = '') =>
    api(
      '/api/posts' +
        (category ? '?category=' + encodeURIComponent(category) : ''),
    ),

  get: (id) =>
    api('/api/posts/' + encodeURIComponent(id)),

  create: (input) =>
    api('/api/posts', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  update: (id, input) =>
    api('/api/posts/' + encodeURIComponent(id), {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),

  remove: (id) =>
    api('/api/posts/' + encodeURIComponent(id), {
      method: 'DELETE',
    }),

  vote: (id, value) =>
    api('/api/posts/' + encodeURIComponent(id) + '/vote', {
      method: 'POST',
      body: JSON.stringify({ value }),
    }),

  comments: (id) =>
    api('/api/posts/' + encodeURIComponent(id) + '/comments'),

  comment: (id, body) =>
    api('/api/posts/' + encodeURIComponent(id) + '/comments', {
      method: 'POST',
      body: JSON.stringify({ body }),
    }),
};