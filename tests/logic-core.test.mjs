import test from 'node:test';
import assert from 'node:assert/strict';

import {
    and, or, not, nand, nor, xor, xnor,
    halfAdder, fullAdder, halfSubtractor, fullSubtractor,
    mux2to1, decoder2to4, comparator2Bit,
    enumerateInputStates, buildTruthTable
} from '../assets/js/logic-core.js';

import { componentById, components } from '../assets/js/catalog.js';

const binaryPairs = [[0,0],[0,1],[1,0],[1,1]];

test('basic gates return correct truth values', () => {
    const expected = {
        and:[0,0,0,1], or:[0,1,1,1], nand:[1,1,1,0],
        nor:[1,0,0,0], xor:[0,1,1,0], xnor:[1,0,0,1]
    };
    const fns = { and, or, nand, nor, xor, xnor };
    Object.entries(fns).forEach(([name, fn]) => {
        assert.deepEqual(binaryPairs.map(([a,b]) => fn(a,b)), expected[name]);
    });
    assert.equal(not(0), 1);
    assert.equal(not(1), 0);
});

test('half adder matches binary addition', () => {
    assert.deepEqual(halfAdder({A:0,B:0}), {SUM:0,CARRY:0});
    assert.deepEqual(halfAdder({A:1,B:0}), {SUM:1,CARRY:0});
    assert.deepEqual(halfAdder({A:1,B:1}), {SUM:0,CARRY:1});
});

test('full adder matches arithmetic sum for every input', () => {
    enumerateInputStates(['A','B','CIN']).forEach(inputs => {
        const output = fullAdder(inputs);
        const numeric = inputs.A + inputs.B + inputs.CIN;
        assert.equal(output.SUM, numeric & 1);
        assert.equal(output.COUT, numeric > 1 ? 1 : 0);
    });
});

test('half and full subtractors match one-bit subtraction', () => {
    assert.deepEqual(halfSubtractor({A:0,B:1}), {DIFF:1,BORROW:1});
    assert.deepEqual(halfSubtractor({A:1,B:1}), {DIFF:0,BORROW:0});
    enumerateInputStates(['A','B','BIN']).forEach(inputs => {
        const output = fullSubtractor(inputs);
        let numeric = inputs.A - inputs.B - inputs.BIN;
        const borrow = numeric < 0 ? 1 : 0;
        if (numeric < 0) numeric += 2;
        assert.equal(output.DIFF, numeric);
        assert.equal(output.BOUT, borrow);
    });
});

test('mux routes the selected data input', () => {
    enumerateInputStates(['D0','D1','S']).forEach(inputs => {
        assert.equal(mux2to1(inputs).Y, inputs.S ? inputs.D1 : inputs.D0);
    });
});

test('decoder produces one-hot output only when enabled', () => {
    enumerateInputStates(['A','B','E']).forEach(inputs => {
        const output = decoder2to4(inputs);
        const active = Object.values(output).reduce((sum, value) => sum + value, 0);
        assert.equal(active, inputs.E ? 1 : 0);
        if (inputs.E) {
            const index = (inputs.A << 1) | inputs.B;
            assert.equal(output[`Y${index}`], 1);
        }
    });
});

test('2-bit comparator always produces exactly one relation', () => {
    enumerateInputStates(['A1','A0','B1','B0']).forEach(inputs => {
        const output = comparator2Bit(inputs);
        assert.equal(output.GT + output.EQ + output.LT, 1);
        const a = (inputs.A1 << 1) | inputs.A0;
        const b = (inputs.B1 << 1) | inputs.B0;
        assert.equal(output.GT, a > b ? 1 : 0);
        assert.equal(output.EQ, a === b ? 1 : 0);
        assert.equal(output.LT, a < b ? 1 : 0);
    });
});

test('every catalog component builds a complete truth table', () => {
    assert.equal(components.length, 14);
    components.forEach(component => {
        const table = buildTruthTable(component);
        assert.equal(table.length, 2 ** component.inputs.length, component.id);
        table.forEach(row => component.outputs.forEach(output => {
            assert.ok(row.outputs[output.key] === 0 || row.outputs[output.key] === 1);
        }));
    });
});

test('catalog IDs are unique and resolvable', () => {
    const ids = components.map(component => component.id);
    assert.equal(new Set(ids).size, ids.length);
    ids.forEach(id => assert.equal(componentById.get(id)?.id, id));
});
