# Logic Gate Simulator

![Logic Gate Simulator Demo](assets/img/logic-gate-simulator.jpg)

Aplikasi web interaktif untuk mempelajari gerbang logika melalui input biner, visualisasi sinyal, status output, dan tabel kebenaran.

**[Buka live demo](https://aldoprawiroa.github.io/logic-gate-simulator/)**

## Fitur

- Mendukung enam gerbang: AND, OR, NOT, NAND, NOR, dan XOR.
- Input A dan B dapat diubah langsung antara 0 dan 1. Gerbang NOT menggunakan satu input.
- Diagram SVG memperlihatkan jalur sinyal aktif dan tidak aktif secara real-time.
- Status output tersedia secara visual dan sebagai teks ON/OFF.
- Tabel kebenaran diperbarui otomatis dan menandai kombinasi input yang sedang aktif.
- Antarmuka menggunakan tema gelap dengan kontras dan state yang dirancang untuk pembacaan diagram digital.
- Kontrol dapat digunakan dengan keyboard dan menyediakan focus state yang terlihat.
- Layout circuit menyesuaikan ruang vertikal pada layar sempit agar tidak sekadar mengecilkan layout desktop.

## Teknologi

- HTML5 untuk struktur halaman.
- SVG untuk diagram gerbang, kabel, dan indikator output.
- CSS3 dan Tailwind CSS via CDN untuk layout dan styling.
- Vanilla JavaScript untuk state, perhitungan gerbang, dan pembaruan UI.

## Cara menggunakan

1. Buka live demo.
2. Pilih jenis gerbang melalui tombol pada bagian **Pilih gerbang**.
3. Tekan input A atau B untuk mengubah nilainya antara 0 dan 1.
4. Amati perubahan jalur sinyal dan status output.
5. Cocokkan kondisi tersebut dengan baris aktif pada tabel kebenaran.

## Arah desain

Keputusan visual dan accessibility proyek didokumentasikan di [DESIGN.md](DESIGN.md).

## Target pengguna

Simulator ini ditujukan untuk mahasiswa dan pelajar yang sedang mempelajari dasar Sistem Digital atau logika Boolean dan membutuhkan cara interaktif untuk menghubungkan tabel kebenaran dengan perilaku rangkaian.

Created by [aldoprawiroa](https://github.com/aldoprawiroa).
