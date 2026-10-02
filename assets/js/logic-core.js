export function bit(value) {
    return value ? 1 : 0;
}

export function not(a) {
    return bit(!bit(a));
}

export function and(...values) {
    return bit(values.every(value => bit(value) === 1));
}

export function or(...values) {
    return bit(values.some(value => bit(value) === 1));
}

export function xor(...values) {
    return bit(values.reduce((acc, value) => acc ^ bit(value), 0));
}

export function xnor(...values) {
    return not(xor(...values));
}

export function nand(...values) {
    return not(and(...values));
}

export function nor(...values) {
    return not(or(...values));
}

export function halfAdder({ A, B }) {
    return { SUM: xor(A, B), CARRY: and(A, B) };
}

export function fullAdder({ A, B, CIN }) {
    const axb = xor(A, B);
    return {
        SUM: xor(axb, CIN),
        COUT: or(and(A, B), and(CIN, axb))
    };
}

export function halfSubtractor({ A, B }) {
    return { DIFF: xor(A, B), BORROW: and(not(A), B) };
}

export function fullSubtractor({ A, B, BIN }) {
    const axb = xor(A, B);
    return {
        DIFF: xor(axb, BIN),
        BOUT: or(and(not(A), B), and(BIN, not(axb)))
    };
}

export function mux2to1({ D0, D1, S }) {
    return { Y: bit(S ? D1 : D0) };
}

export function decoder2to4({ A, B, E }) {
    if (!bit(E)) return { Y0: 0, Y1: 0, Y2: 0, Y3: 0 };
    return {
        Y0: and(not(A), not(B)),
        Y1: and(not(A), B),
        Y2: and(A, not(B)),
        Y3: and(A, B)
    };
}

export function comparator2Bit({ A1, A0, B1, B0 }) {
    const a = (bit(A1) << 1) | bit(A0);
    const b = (bit(B1) << 1) | bit(B0);
    return { GT: bit(a > b), EQ: bit(a === b), LT: bit(a < b) };
}

export function enumerateInputStates(inputKeys) {
    const count = 2 ** inputKeys.length;
    return Array.from({ length: count }, (_, index) => {
        const state = {};
        inputKeys.forEach((key, position) => {
            const shift = inputKeys.length - position - 1;
            state[key] = (index >> shift) & 1;
        });
        return state;
    });
}

export function normalizeOutputs(result, outputs) {
    const source = typeof result === 'object' && result !== null
        ? result
        : { [outputs[0].key]: result };

    return Object.fromEntries(outputs.map(output => [output.key, bit(source[output.key])]));
}

export function buildTruthTable(component) {
    const keys = component.inputs.map(input => input.key);
    return enumerateInputStates(keys).map(inputs => ({
        inputs,
        outputs: normalizeOutputs(component.evaluate(inputs), component.outputs)
    }));
}

export function stateKey(inputs, inputDefinitions) {
    return inputDefinitions.map(input => bit(inputs[input.key])).join('');
}
