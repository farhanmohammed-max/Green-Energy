export interface OrderedListItem {
  number: number;
  text: string;
  subItems: string[];
}

export type MessageBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullet-list'; items: string[] }
  | { type: 'ordered-list'; items: OrderedListItem[] };

export interface TextSegment {
  text: string;
  bold: boolean;
}

/**
 * Splits a plain-text AI reply into readable paragraphs, bullet lists, and numbered lists
 * (preserving nested bullet sub-items under numbered steps) without using raw HTML rendering.
 */
export function parseMessageBlocks(content: string): MessageBlock[] {
  const normalized = content.replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];

  const lines = normalized.split('\n');
  const blocks: MessageBlock[] = [];
  let paragraphLines: string[] = [];
  let bulletItems: string[] = [];
  let orderedItems: OrderedListItem[] = [];

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
    const isIndented = /^\s{2,}/.test(rawLine);
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushBullets();
      // Keep orderedItems open across single blank lines so "1. ...\n   - ...\n\n2. ..." stays a single list
      continue;
    }

    const orderedMatch = line.match(/^(\d+)[.)]\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      flushBullets();
      orderedItems.push({
        number: Number(orderedMatch[1]),
        text: orderedMatch[2].trim(),
        subItems: [],
      });
      continue;
    }

    const bulletMatch = line.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      flushParagraph();
      if (orderedItems.length > 0 && isIndented) {
        orderedItems[orderedItems.length - 1].subItems.push(bulletMatch[1].trim());
      } else {
        flushOrdered();
        bulletItems.push(bulletMatch[1].trim());
      }
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
