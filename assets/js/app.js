import { categories, components, componentById } from './catalog.js';
import { bit, buildTruthTable, normalizeOutputs, stateKey } from './logic-core.js';

const $ = selector => document.querySelector(selector);
const elements = {
    search: $('#component-search'),
    componentList: $('#component-list'),
    componentCount: $('#component-count'),
    category: $('#component-category'),
    title: $('#component-title'),
    summary: $('#component-summary'),
    insight: $('#component-insight'),
    inputs: $('#input-controls'),
    outputs: $('#output-controls'),
    diagram: $('#circuit-diagram'),
    formulas: $('#formula-list'),
    truthHead: $('#truth-head'),
    truthBody: $('#truth-body'),
    truthMeta: $('#truth-meta'),
    randomize: $('#randomize-inputs'),
    reset: $('#reset-inputs'),
    challengeInputs: $('#challenge-inputs'),
    challengePredictions: $('#challenge-predictions'),
    challengeFeedback: $('#challenge-feedback'),
    challengeCheck: $('#challenge-check'),
    challengeNext: $('#challenge-next'),
    challengeScore: $('#challenge-score')
};

const categoryById = new Map(categories.map(category => [category.id, category]));
const initialId = location.hash.slice(1) || localStorage.getItem('logic-lab.component') || 'and';
const state = {
    component: componentById.get(initialId) || components[0],
    inputs: {},
    challenge: { inputs: {}, predictions: {}, checked: false, correct: 0, attempts: 0 }
};

const initialInputs = component => Object.fromEntries(component.inputs.map(item => [item.key, 0]));
const evaluate = (component = state.component, inputState = state.inputs) =>
    normalizeOutputs(component.evaluate(inputState), component.outputs);

function setComponent(id, { updateHash = true } = {}) {
    const next = componentById.get(id);
    if (!next) return;
    state.component = next;
    state.inputs = initialInputs(next);
    localStorage.setItem('logic-lab.component', id);
    if (updateHash && location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`);
    renderAll();
    newChallenge();
}

function toggleInput(key) {
    if (!(key in state.inputs)) return;
    state.inputs[key] = state.inputs[key] ? 0 : 1;
    renderSimulator();
}

function randomizeInputs() {
    state.component.inputs.forEach(item => {
        state.inputs[item.key] = Math.random() >= 0.5 ? 1 : 0;
    });
    renderSimulator();
}

function resetInputs() {
    state.inputs = initialInputs(state.component);
    renderSimulator();
}

function renderAll() {
    renderComponentList(elements.search.value);
    renderComponentHeader();
    renderSimulator();
}

function renderComponentList(query = '') {
    const normalized = query.trim().toLowerCase();
    elements.componentList.replaceChildren();

    categories.forEach(category => {
        const matches = components.filter(component => {
            if (component.category !== category.id) return false;
            if (!normalized) return true;
            return [component.name, component.summary, ...component.expressions]
                .join(' ').toLowerCase().includes(normalized);
        });
        if (!matches.length) return;

        const group = document.createElement('section');
        group.className = 'component-group';

        const heading = document.createElement('h2');
        heading.className = 'component-group-title';
        heading.textContent = category.label;

        const list = document.createElement('div');
        list.className = 'component-group-list';

        matches.forEach(component => {
            const button = document.createElement('button');
            const active = component.id === state.component.id;
            button.type = 'button';
            button.className = 'component-item';
            button.dataset.active = String(active);
            button.setAttribute('aria-pressed', String(active));
            button.addEventListener('click', () => setComponent(component.id));

            const name = document.createElement('span');
            name.className = 'component-item-name';
            name.textContent = component.name;

            const meta = document.createElement('span');
            meta.className = 'component-item-meta mono';
            meta.textContent = `${component.inputs.length}I / ${component.outputs.length}O`;

            button.append(name, meta);
            list.appendChild(button);
        });

        group.append(heading, list);
        elements.componentList.appendChild(group);
    });

    elements.componentCount.textContent =
        `${elements.componentList.querySelectorAll('.component-item').length} dari ${components.length} komponen`;
}

function renderComponentHeader() {
    elements.category.textContent = categoryById.get(state.component.category)?.label || state.component.category;
    elements.title.textContent = state.component.name;
    elements.summary.textContent = state.component.summary;
    elements.insight.textContent = state.component.insight;
    elements.formulas.replaceChildren();

    state.component.expressions.forEach(expression => {
        const code = document.createElement('code');
        code.className = 'formula mono';
        code.textContent = expression;
        elements.formulas.appendChild(code);
    });
}

function renderSimulator() {
    const outputs = evaluate();
    renderInputs();
    renderOutputs(outputs);
    renderDiagram(outputs);
    renderTruthTable();
}

function renderInputs() {
    elements.inputs.replaceChildren();
    state.component.inputs.forEach((definition, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'bit-control';
        button.dataset.active = String(Boolean(state.inputs[definition.key]));
        button.setAttribute('aria-pressed', String(Boolean(state.inputs[definition.key])));
        button.setAttribute('aria-label', `${definition.label}, nilai ${state.inputs[definition.key]}. Tekan untuk mengubah.`);
        button.addEventListener('click', () => toggleInput(definition.key));

        const label = document.createElement('span');
        label.className = 'bit-label';
        label.textContent = definition.label;
        const value = document.createElement('strong');
        value.className = 'bit-value mono';
        value.textContent = state.inputs[definition.key];
        const shortcut = document.createElement('span');
        shortcut.className = 'bit-shortcut mono';
        shortcut.textContent = `Key ${index + 1}`;

        button.append(label, value, shortcut);
        if (definition.hint) button.title = definition.hint;
        elements.inputs.appendChild(button);
    });
}

function renderOutputs(outputs) {
    elements.outputs.replaceChildren();
    state.component.outputs.forEach(definition => {
        const item = document.createElement('div');
        item.className = 'output-readout';
        item.dataset.active = String(Boolean(outputs[definition.key]));

        const label = document.createElement('span');
        label.className = 'output-label';
        label.textContent = definition.label;
        const value = document.createElement('strong');
        value.className = 'output-value mono';
        value.textContent = outputs[definition.key];
        const status = document.createElement('span');
        status.className = 'output-state';
        status.textContent = outputs[definition.key] ? 'ON' : 'OFF';

        item.append(label, value, status);
        elements.outputs.appendChild(item);
    });

    elements.outputs.setAttribute(
        'aria-label',
        `Output: ${state.component.outputs.map(d => `${d.label} ${outputs[d.key]}`).join(', ')}`
    );
}

function renderTruthTable() {
    const rows = buildTruthTable(state.component);
    const currentKey = stateKey(state.inputs, state.component.inputs);
    elements.truthHead.replaceChildren();
    elements.truthBody.replaceChildren();

    const header = document.createElement('tr');
    [...state.component.inputs, ...state.component.outputs].forEach((definition, index) => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = definition.label;
        if (index >= state.component.inputs.length) th.classList.add('output-column');
        header.appendChild(th);
    });
    elements.truthHead.appendChild(header);

    rows.forEach(row => {
        const tr = document.createElement('tr');
        const active = stateKey(row.inputs, state.component.inputs) === currentKey;
        tr.dataset.active = String(active);
        if (active) tr.setAttribute('aria-current', 'true');

        state.component.inputs.forEach((definition, index) => {
            const td = document.createElement('td');
            if (active && index === 0) {
                const sr = document.createElement('span');
                sr.className = 'sr-only';
                sr.textContent = 'Kombinasi aktif. ';
                td.appendChild(sr);
            }
            td.append(String(row.inputs[definition.key]));
            tr.appendChild(td);
        });

        state.component.outputs.forEach(definition => {
            const td = document.createElement('td');
            td.className = 'output-column';
            td.dataset.active = String(Boolean(row.outputs[definition.key]));
            td.textContent = row.outputs[definition.key];
            tr.appendChild(td);
        });
        elements.truthBody.appendChild(tr);
    });

    elements.truthMeta.textContent =
        `${rows.length} kombinasi · ${state.component.inputs.length} input · ${state.component.outputs.length} output`;
}

const positions = (count, start = 105, end = 235) => {
    if (count === 1) return [(start + end) / 2];
    const step = (end - start) / (count - 1);
    return Array.from({ length: count }, (_, index) => start + step * index);
};

const signalClass = value => value ? 'signal signal-on' : 'signal signal-off';

function renderDiagram(outputs) {
    elements.diagram.innerHTML = state.component.kind === 'gate'
        ? gateDiagram(state.component, state.inputs, outputs)
        : blockDiagram(state.component, state.inputs, outputs);
}

function gateDiagram(component, inputs, outputs) {
    const inputY = positions(component.inputs.length, 120, 220);
    const outputValue = outputs[component.outputs[0].key];
    const gate = component.gate;
    const orShape = ['OR', 'NOR', 'XOR', 'XNOR'].includes(gate);
    const xorShape = ['XOR', 'XNOR'].includes(gate);
    const inverted = ['NOT', 'NAND', 'NOR', 'XNOR'].includes(gate);
    const oneInput = gate === 'NOT';

    const inputLines = component.inputs.map((definition, index) => `
        <text x="44" y="${inputY[index] - 14}" class="diagram-label">${definition.label} = ${inputs[definition.key]}</text>
        <line x1="54" y1="${inputY[index]}" x2="280" y2="${oneInput ? 170 : inputY[index]}" class="${signalClass(inputs[definition.key])}" />
        <circle cx="54" cy="${inputY[index]}" r="7" class="${inputs[definition.key] ? 'node-on' : 'node-off'}" />
    `).join('');

    let body;
    if (gate === 'NOT') body = '<path d="M 280 95 L 440 170 L 280 245 Z" class="gate-shape" />';
    else if (orShape) body = '<path d="M 280 90 Q 350 90 460 170 Q 350 250 280 250 Q 325 170 280 90 Z" class="gate-shape" />';
    else body = '<path d="M 280 90 L 350 90 A 80 80 0 0 1 350 250 L 280 250 Z" class="gate-shape" />';

    const xorBack = xorShape ? '<path d="M 262 90 Q 305 170 262 250" class="gate-extra" />' : '';
    const invertX = gate === 'NOT' ? 450 : 470;
    const invert = inverted ? `<circle cx="${invertX}" cy="170" r="10" class="gate-shape" />` : '';
    const outputStart = inverted ? invertX + 10 : (gate === 'NOT' ? 440 : 460);

    return `
        <svg viewBox="0 0 760 340" role="img" aria-label="Diagram ${component.name}">
            ${inputLines}${xorBack}${body}${invert}
            <text x="365" y="178" text-anchor="middle" class="gate-name">${gate}</text>
            <line x1="${outputStart}" y1="170" x2="700" y2="170" class="${signalClass(outputValue)}" />
            <circle cx="700" cy="170" r="9" class="${outputValue ? 'node-on output-node' : 'node-off'}" />
            <text x="706" y="146" text-anchor="end" class="diagram-label">${component.outputs[0].label} = ${outputValue}</text>
        </svg>`;
}

function blockDiagram(component, inputs, outputs) {
    const inputY = positions(component.inputs.length, 95, 245);
    const outputY = positions(component.outputs.length, 105, 235);

    const inputLines = component.inputs.map((definition, index) => `
        <text x="40" y="${inputY[index] - 12}" class="diagram-label">${definition.label} = ${inputs[definition.key]}</text>
        <line x1="54" y1="${inputY[index]}" x2="255" y2="${inputY[index]}" class="${signalClass(inputs[definition.key])}" />
        <circle cx="54" cy="${inputY[index]}" r="7" class="${inputs[definition.key] ? 'node-on' : 'node-off'}" />`).join('');

    const outputLines = component.outputs.map((definition, index) => `
        <line x1="505" y1="${outputY[index]}" x2="700" y2="${outputY[index]}" class="${signalClass(outputs[definition.key])}" />
        <circle cx="700" cy="${outputY[index]}" r="8" class="${outputs[definition.key] ? 'node-on output-node' : 'node-off'}" />
        <text x="706" y="${outputY[index] - 12}" text-anchor="end" class="diagram-label">${definition.label} = ${outputs[definition.key]}</text>`).join('');

    const stages = component.stages.map((stage, index) =>
        `<text x="380" y="${160 + index * 24}" text-anchor="middle" class="stage-label">${stage}</text>`
    ).join('');

    return `
        <svg viewBox="0 0 760 340" role="img" aria-label="Diagram blok ${component.name}">
            ${inputLines}
            <rect x="255" y="65" width="250" height="210" rx="16" class="logic-block" />
            <text x="380" y="118" text-anchor="middle" class="block-name">${component.name}</text>
            <line x1="290" y1="135" x2="470" y2="135" class="block-divider" />
            ${stages}${outputLines}
        </svg>`;
}

function newChallenge() {
    state.challenge.inputs = Object.fromEntries(
        state.component.inputs.map(definition => [definition.key, Math.random() >= 0.5 ? 1 : 0])
    );
    state.challenge.predictions = Object.fromEntries(state.component.outputs.map(output => [output.key, 0]));
    state.challenge.checked = false;
    renderChallenge();
}

function renderChallenge() {
    elements.challengeInputs.replaceChildren();
    elements.challengePredictions.replaceChildren();

    state.component.inputs.forEach(definition => {
        const item = document.createElement('span');
        item.className = 'challenge-value mono';
        item.textContent = `${definition.label}=${state.challenge.inputs[definition.key]}`;
        elements.challengeInputs.appendChild(item);
    });

    state.component.outputs.forEach(definition => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'prediction-control';
        button.dataset.active = String(Boolean(state.challenge.predictions[definition.key]));
        button.disabled = state.challenge.checked;
        button.setAttribute('aria-pressed', String(Boolean(state.challenge.predictions[definition.key])));
        button.setAttribute('aria-label', `Prediksi ${definition.label}, nilai ${state.challenge.predictions[definition.key]}`);
        button.addEventListener('click', () => {
            state.challenge.predictions[definition.key] = state.challenge.predictions[definition.key] ? 0 : 1;
            renderChallenge();
        });

        const label = document.createElement('span');
        label.textContent = definition.label;
        const value = document.createElement('strong');
        value.className = 'mono';
        value.textContent = state.challenge.predictions[definition.key];
        button.append(label, value);
        elements.challengePredictions.appendChild(button);
    });

    elements.challengeCheck.disabled = state.challenge.checked;
    elements.challengeNext.hidden = !state.challenge.checked;
    elements.challengeScore.textContent = `${state.challenge.correct}/${state.challenge.attempts}`;

    if (!state.challenge.checked) {
        elements.challengeFeedback.textContent = 'Atur prediksi output, lalu periksa jawaban.';
        elements.challengeFeedback.dataset.result = 'idle';
    }
}

function checkChallenge() {
    if (state.challenge.checked) return;
    const actual = evaluate(state.component, state.challenge.inputs);
    const correct = state.component.outputs.every(definition =>
        bit(actual[definition.key]) === bit(state.challenge.predictions[definition.key])
    );
    state.challenge.checked = true;
    state.challenge.attempts += 1;
    if (correct) state.challenge.correct += 1;
    renderChallenge();
    elements.challengeFeedback.dataset.result = correct ? 'correct' : 'wrong';
    elements.challengeFeedback.textContent = correct
        ? 'Benar. Prediksi sesuai dengan rangkaian.'
        : `Belum tepat. Output benar: ${state.component.outputs.map(d => `${d.label}=${actual[d.key]}`).join(', ')}.`;
}

function handleKeyboard(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    const number = Number(event.key);
    if (Number.isInteger(number) && number >= 1 && number <= state.component.inputs.length) {
        toggleInput(state.component.inputs[number - 1].key);
        return;
    }
    if (event.key.toLowerCase() === 'r') randomizeInputs();
}

elements.search.addEventListener('input', event => renderComponentList(event.target.value));
elements.randomize.addEventListener('click', randomizeInputs);
elements.reset.addEventListener('click', resetInputs);
elements.challengeCheck.addEventListener('click', checkChallenge);
elements.challengeNext.addEventListener('click', newChallenge);
window.addEventListener('keydown', handleKeyboard);
window.addEventListener('hashchange', () => setComponent(location.hash.slice(1), { updateHash: false }));

state.inputs = initialInputs(state.component);
renderAll();
newChallenge();
