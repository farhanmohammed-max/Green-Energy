export type MessageBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullet-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] };

export interface TextSegment {
  text: string;
  bold: boolean;
}

/**
 * Splits a plain-text AI reply into readable paragraphs, bullet lists, and numbered lists
 * without using raw HTML rendering.
 */
export function parseMessageBlocks(content: string): MessageBlock[] {
  const normalized = content.replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];

  const lines = normalized.split('\n');
  const blocks: MessageBlock[] = [];
  let paragraphLines: string[] = [];
  let bulletItems: string[] = [];
  let orderedItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
      paragraphLines = [];
    }
  };

  const flushBullets = () => {
    if (bulletItems.length > 0) {
      blocks.push({ type: 'bullet-list', items: [...bulletItems] });
      bulletItems = [];
    }
  };

  const flushOrdered = () => {
    if (orderedItems.length > 0) {
      blocks.push({ type: 'ordered-list', items: [...orderedItems] });
      orderedItems = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushBullets();
      flushOrdered();
      continue;
    }

    const bulletMatch = line.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      flushParagraph();
      flushOrdered();
      bulletItems.push(bulletMatch[1].trim());
      continue;
    }

    const orderedMatch = line.match(/^\d+[.)]\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      flushBullets();
      orderedItems.push(orderedMatch[1].trim());
      continue;
    }

    flushBullets();
    flushOrdered();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushBullets();
  flushOrdered();

  return blocks;
}

/**
 * Safely parses `**bold**` inline emphasis into structured text segments.
 */
export function parseInlineEmphasis(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), bold: false });
    }
    segments.push({ text: match[1], bold: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), bold: false });
  }

  return segments.length > 0 ? segments : [{ text, bold: false }];
}
