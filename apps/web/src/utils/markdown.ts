const escapeHtml = (input: string): string =>
  input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const applyInlineFormatting = (input: string): string =>
  input
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

export const markdownToHtml = (markdown: string): string => {
  const escaped = escapeHtml(markdown.trim());
  const lines = escaped.split(/\r?\n/);
  const htmlParts: string[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) {
      return;
    }
    const listItems = listBuffer
      .map(item => `<li>${applyInlineFormatting(item)}</li>`)
      .join('');
    htmlParts.push(`<ul class="list-disc pl-6 space-y-1">${listItems}</ul>`);
    listBuffer = [];
  };

  lines.forEach(line => {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ')) {
      listBuffer.push(trimmed.slice(2));
      return;
    }

    flushList();

    if (trimmed.length === 0) {
      htmlParts.push('<br />');
      return;
    }

    htmlParts.push(`<p>${applyInlineFormatting(trimmed)}</p>`);
  });

  flushList();

  return htmlParts.join('');
};
