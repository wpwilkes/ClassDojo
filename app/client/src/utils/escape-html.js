export function escapeHtml(value) {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  };

  return String(value).replace(
    /[&<>'"]/g,
    (character) => entities[character],
  );
}