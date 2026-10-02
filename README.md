# Digital Logic Lab

Digital Logic Lab adalah aplikasi web statis untuk mempelajari gerbang logika dan rangkaian kombinasional melalui simulasi biner, diagram sinyal, ekspresi Boolean, tabel kebenaran, dan latihan prediksi output.

**Live demo:** https://aldoprawiroa.github.io/logic-gate-simulator/

## Cakupan komponen

### Gerbang
- AND
- OR
- NOT
- NAND
- NOR
- XOR
- XNOR

### Aritmetika
- Half Adder
- Full Adder
- Half Subtractor
- Full Subtractor

### Routing
- Multiplexer 2:1
- Decoder 2-to-4 dengan Enable

### Komparasi
- Comparator 2-bit

## Fitur

- Input interaktif dengan status 0/1 dan shortcut keyboard.
- Diagram sinyal SVG yang berubah sesuai state input dan output.
- Dukungan komponen dengan satu sampai empat input dan satu sampai empat output.
- Tabel kebenaran otomatis untuk seluruh kombinasi input, termasuk 16 baris pada Comparator 2-bit.
- Ekspresi Boolean dan penjelasan konsep per komponen.
- Pencarian katalog komponen.
- Randomize dan reset input.
- Hash URL per komponen, misalnya `#full-adder`.
- Mode latihan untuk memprediksi output dan mencatat skor sesi.
- State aksesibel melalui teks, `aria-pressed`, focus indicator, dan status output yang tidak bergantung pada warna saja.
- Responsive layout untuk mobile, tablet, dan desktop.
- `prefers-reduced-motion` untuk pengguna yang membatasi animasi.

## Arsitektur

```text
logic-gate-simulator/
├─ index.html
├─ assets/
│  ├─ css/
│  │  └─ styles.css
│  ├─ img/
│  └─ js/
│     ├─ app.js
│     ├─ catalog.js
│     └─ logic-core.js
├─ tests/
│  └─ logic-core.test.mjs
├─ .github/
│  └─ workflows/
│     └─ test.yml
├─ DESIGN.md
└─ package.json
```

`logic-core.js` berisi operasi Boolean murni dan pembentuk truth table. `catalog.js` mendefinisikan komponen sebagai data. `app.js` menangani state dan rendering DOM. Pemisahan ini membuat komponen baru dapat ditambahkan tanpa menumpuk logika di `index.html`.

## Menjalankan secara lokal

Karena JavaScript memakai ES modules, jalankan melalui HTTP server lokal.

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Testing

Test memakai test runner bawaan Node.js tanpa test framework eksternal.

```bash
npm test
```

Test mencakup gerbang dasar, adder/subtractor, MUX, decoder, comparator, kelengkapan truth table, dan integritas katalog komponen.

## Deployment

Proyek tetap kompatibel dengan GitHub Pages karena seluruh runtime berupa file statis. Tidak diperlukan backend atau build step untuk deployment.

## Design direction

Arah visual, hierarchy, motion, dan accessibility didokumentasikan di [DESIGN.md](DESIGN.md).

Created by [aldoprawiroa](https://github.com/aldoprawiroa).
