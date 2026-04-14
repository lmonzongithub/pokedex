export function renderInlineMessage(message, type = 'info') {
  return `<div class="message message-${type}">${message}</div>`;
}
