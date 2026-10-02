import {
    and, or, not, nand, nor, xor, xnor,
    halfAdder, fullAdder, halfSubtractor, fullSubtractor,
    mux2to1, decoder2to4, comparator2Bit
} from './logic-core.js';

const input = (key, label, hint = '') => ({ key, label, hint });
const output = (key, label) => ({ key, label });

export const categories = [
    { id: 'gates', label: 'Gerbang' },
    { id: 'arithmetic', label: 'Aritmetika' },
    { id: 'routing', label: 'Routing' },
    { id: 'comparison', label: 'Komparasi' }
];

export const components = [
    {
        id: 'and', name: 'AND', category: 'gates', kind: 'gate', gate: 'AND',
        inputs: [input('A', 'A'), input('B', 'B')], outputs: [output('Q', 'Q')],
        expressions: ['Q = A · B'],
        summary: 'Output aktif hanya ketika seluruh input aktif.',
        insight: 'AND cocok untuk kondisi yang mensyaratkan semua syarat terpenuhi.',
        evaluate: ({ A, B }) => ({ Q: and(A, B) })
    },
    {
        id: 'or', name: 'OR', category: 'gates', kind: 'gate', gate: 'OR',
        inputs: [input('A', 'A'), input('B', 'B')], outputs: [output('Q', 'Q')],
        expressions: ['Q = A + B'],
        summary: 'Output aktif jika sedikitnya satu input aktif.',
        insight: 'OR mewakili kondisi alternatif: satu jalur benar sudah cukup.',
        evaluate: ({ A, B }) => ({ Q: or(A, B) })
    },
    {
        id: 'not', name: 'NOT', category: 'gates', kind: 'gate', gate: 'NOT',
        inputs: [input('A', 'A')], outputs: [output('Q', 'Q')],
        expressions: ['Q = ¬A'],
        summary: 'Membalik nilai biner input.',
        insight: 'NOT adalah inverter: 0 menjadi 1 dan 1 menjadi 0.',
        evaluate: ({ A }) => ({ Q: not(A) })
    },
    {
        id: 'nand', name: 'NAND', category: 'gates', kind: 'gate', gate: 'NAND',
        inputs: [input('A', 'A'), input('B', 'B')], outputs: [output('Q', 'Q')],
        expressions: ['Q = ¬(A · B)'],
        summary: 'Kebalikan AND; output hanya 0 ketika semua input 1.',
        insight: 'NAND bersifat universal: seluruh fungsi Boolean dapat dibangun hanya dengan NAND.',
        evaluate: ({ A, B }) => ({ Q: nand(A, B) })
    },
    {
        id: 'nor', name: 'NOR', category: 'gates', kind: 'gate', gate: 'NOR',
        inputs: [input('A', 'A'), input('B', 'B')], outputs: [output('Q', 'Q')],
        expressions: ['Q = ¬(A + B)'],
        summary: 'Kebalikan OR; output 1 hanya ketika semua input 0.',
        insight: 'Seperti NAND, NOR juga merupakan gerbang universal.',
        evaluate: ({ A, B }) => ({ Q: nor(A, B) })
    },
    {
        id: 'xor', name: 'XOR', category: 'gates', kind: 'gate', gate: 'XOR',
        inputs: [input('A', 'A'), input('B', 'B')], outputs: [output('Q', 'Q')],
        expressions: ['Q = A ⊕ B'],
        summary: 'Output aktif ketika kedua input berbeda.',
        insight: 'XOR adalah inti operasi penjumlahan bit tanpa carry.',
        evaluate: ({ A, B }) => ({ Q: xor(A, B) })
    },
    {
        id: 'xnor', name: 'XNOR', category: 'gates', kind: 'gate', gate: 'XNOR',
        inputs: [input('A', 'A'), input('B', 'B')], outputs: [output('Q', 'Q')],
        expressions: ['Q = ¬(A ⊕ B)'],
        summary: 'Output aktif ketika kedua input sama.',
        insight: 'XNOR dapat dipakai sebagai pemeriksa kesamaan satu bit.',
        evaluate: ({ A, B }) => ({ Q: xnor(A, B) })
    },
    {
        id: 'half-adder', name: 'Half Adder', category: 'arithmetic', kind: 'block',
        stages: ['XOR', 'AND'],
        inputs: [input('A', 'A'), input('B', 'B')],
        outputs: [output('SUM', 'SUM'), output('CARRY', 'CARRY')],
        expressions: ['SUM = A ⊕ B', 'CARRY = A · B'],
        summary: 'Menjumlahkan dua bit tanpa carry masuk.',
        insight: 'SUM berasal dari XOR, sedangkan CARRY berasal dari AND.',
        evaluate: halfAdder
    },
    {
        id: 'full-adder', name: 'Full Adder', category: 'arithmetic', kind: 'block',
        stages: ['XOR ×2', 'AND ×2', 'OR'],
        inputs: [input('A', 'A'), input('B', 'B'), input('CIN', 'Cin', 'Carry in')],
        outputs: [output('SUM', 'SUM'), output('COUT', 'Cout')],
        expressions: ['SUM = A ⊕ B ⊕ Cin', 'Cout = A·B + Cin·(A ⊕ B)'],
        summary: 'Menjumlahkan dua bit dan satu carry masuk.',
        insight: 'Full Adder menjadi blok dasar penjumlahan biner multi-bit.',
        evaluate: fullAdder
    },
    {
        id: 'half-subtractor', name: 'Half Subtractor', category: 'arithmetic', kind: 'block',
        stages: ['XOR', 'NOT', 'AND'],
        inputs: [input('A', 'A'), input('B', 'B')],
        outputs: [output('DIFF', 'DIFF'), output('BORROW', 'BORROW')],
        expressions: ['DIFF = A ⊕ B', 'BORROW = ¬A · B'],
        summary: 'Mengurangkan satu bit B dari A tanpa borrow masuk.',
        insight: 'Borrow aktif ketika A tidak cukup besar untuk mengurangi B.',
        evaluate: halfSubtractor
    },
    {
        id: 'full-subtractor', name: 'Full Subtractor', category: 'arithmetic', kind: 'block',
        stages: ['XOR ×2', 'NOT', 'AND ×2', 'OR'],
        inputs: [input('A', 'A'), input('B', 'B'), input('BIN', 'Bin', 'Borrow in')],
        outputs: [output('DIFF', 'DIFF'), output('BOUT', 'Bout')],
        expressions: ['DIFF = A ⊕ B ⊕ Bin', 'Bout = ¬A·B + Bin·¬(A ⊕ B)'],
        summary: 'Mengurangkan B dan borrow masuk dari A.',
        insight: 'Full Subtractor dapat dirangkai untuk membangun pengurang biner multi-bit.',
        evaluate: fullSubtractor
    },
    {
        id: 'mux-2-1', name: 'MUX 2:1', category: 'routing', kind: 'block',
        stages: ['NOT', 'AND ×2', 'OR'],
        inputs: [input('D0', 'D0'), input('D1', 'D1'), input('S', 'S', 'Select')],
        outputs: [output('Y', 'Y')],
        expressions: ['Y = ¬S·D0 + S·D1'],
        summary: 'Memilih satu dari dua jalur data menggunakan input select.',
        insight: 'S=0 meneruskan D0; S=1 meneruskan D1.',
        evaluate: mux2to1
    },
    {
        id: 'decoder-2-4', name: 'Decoder 2-to-4', category: 'routing', kind: 'block',
        stages: ['NOT ×2', 'AND ×4'],
        inputs: [input('A', 'A'), input('B', 'B'), input('E', 'E', 'Enable')],
        outputs: [output('Y0', 'Y0'), output('Y1', 'Y1'), output('Y2', 'Y2'), output('Y3', 'Y3')],
        expressions: ['Y0 = E·¬A·¬B', 'Y1 = E·¬A·B', 'Y2 = E·A·¬B', 'Y3 = E·A·B'],
        summary: 'Mengubah dua bit alamat menjadi satu dari empat jalur aktif.',
        insight: 'Enable mematikan seluruh keluaran ketika E=0.',
        evaluate: decoder2to4
    },
    {
        id: 'comparator-2bit', name: 'Comparator 2-bit', category: 'comparison', kind: 'block',
        stages: ['XNOR ×2', 'AND', 'OR'],
        inputs: [input('A1', 'A1'), input('A0', 'A0'), input('B1', 'B1'), input('B0', 'B0')],
        outputs: [output('GT', 'A>B'), output('EQ', 'A=B'), output('LT', 'A<B')],
        expressions: ['A = 2·A1 + A0', 'B = 2·B1 + B0', 'GT/EQ/LT menunjukkan relasi nilai A dan B'],
        summary: 'Membandingkan dua bilangan biner 2-bit.',
        insight: 'Tepat satu dari GT, EQ, atau LT akan aktif untuk setiap pasangan input.',
        evaluate: comparator2Bit
    }
];

export const componentById = new Map(components.map(component => [component.id, component]));
