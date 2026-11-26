import test from 'node:test';
import assert from 'node:assert/strict';
import { parseInlineEmphasis, parseMessageBlocks } from './formatMessage';

test('parseMessageBlocks separates paragraphs, bullets, and numbered lists cleanly', () => {
  const sample = `Berikut cara menghemat listrik:

1. Matikan lampu saat tidak digunakan.
2. Gunakan lampu LED hemat energi.

Tips tambahan:
- Cabut pengisi daya saat penuh
- Manfaatkan cahaya matahari pagi`;

  const blocks = parseMessageBlocks(sample);
  assert.equal(blocks.length, 4);
  assert.deepEqual(blocks[0], { type: 'paragraph', text: 'Berikut cara menghemat listrik:' });
  assert.deepEqual(blocks[1], {
    type: 'ordered-list',
    items: [
      { number: 1, text: 'Matikan lampu saat tidak digunakan.', subItems: [] },
      { number: 2, text: 'Gunakan lampu LED hemat energi.', subItems: [] },
    ],
  });
  assert.deepEqual(blocks[2], { type: 'paragraph', text: 'Tips tambahan:' });
  assert.deepEqual(blocks[3], {
    type: 'bullet-list',
    items: ['Cabut pengisi daya saat penuh', 'Manfaatkan cahaya matahari pagi'],
  });
});

test('parseMessageBlocks preserves numbered list sequence when items have indented sub-bullets', () => {
  const sample = `1. **Ganti Lampu dengan LED**:
   - Lampu LED lebih efisien.

2. **Gunakan Perangkat Hemat Energi**:
   - Pilih peralatan berlabel efisien.`;

  const blocks = parseMessageBlocks(sample);
  assert.equal(blocks.length, 1);
  assert.deepEqual(blocks[0], {
    type: 'ordered-list',
    items: [
      { number: 1, text: '**Ganti Lampu dengan LED**:', subItems: ['Lampu LED lebih efisien.'] },
      {
        number: 2,
        text: '**Gunakan Perangkat Hemat Energi**:',
        subItems: ['Pilih peralatan berlabel efisien.'],
      },
    ],
  });
});

test('parseInlineEmphasis safely splits bold segments without HTML injection', () => {
  const segments = parseInlineEmphasis('Gunakan **Lampu LED** dan **Panel Surya** di rumah.');
  assert.deepEqual(segments, [
    { text: 'Gunakan ', bold: false },
    { text: 'Lampu LED', bold: true },
    { text: ' dan ', bold: false },
    { text: 'Panel Surya', bold: true },
    { text: ' di rumah.', bold: false },
  ]);
});
