
/* =================================
   1. MENJALANKAN JAVASCRIPT
================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================
       2. MENGAMBIL ELEMEN HTML
    ================================= */

    const form = document.getElementById("uploadForm");
    const daftarHasil = document.getElementById("daftarHasil");

    const inputNama = document.getElementById("nama");
    const inputKelas = document.getElementById("kelas");
    const inputMapel = document.getElementById("mapel");
    const inputJudul = document.getElementById("judul");
    const inputPemahaman = document.getElementById("pemahaman");
    const inputBerkas = document.getElementById("berkas");

    // Memastikan elemen yang dibutuhkan tersedia
    if (
        !form || !daftarHasil ||
        !inputNama || !inputKelas ||
        !inputMapel || !inputJudul ||
        !inputPemahaman || !inputBerkas
    ) {
        console.warn("Elemen form atau daftar hasil tidak ditemukan.");
        return;
    }


    /* =================================
       3. MENGAMBIL DATA LOCAL STORAGE
    ================================= */

    let dataHasil = [];

    try {
        const dataTersimpan = JSON.parse(
            localStorage.getItem("dataHasil")
        );

        if (Array.isArray(dataTersimpan)) {
            dataHasil = dataTersimpan;
        }

    } catch (error) {
        console.error("Gagal membaca data:", error);
    }


    /* =================================
       4. FUNGSI MENYIMPAN DATA
    ================================= */

    function simpanData() {

        try {
            localStorage.setItem(
                "dataHasil",
                JSON.stringify(dataHasil)
            );

            return true;

        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            alert("Data gagal disimpan. Penyimpanan browser mungkin penuh.");

            return false;
        }

    }


    /* =================================
       5. FUNGSI MEMBUAT CARD
    ================================= */

    function tampilkanHasil(data) {

        const card = document.createElement("article");
        card.classList.add("card");

        const mapel = document.createElement("span");
        mapel.classList.add("mapel");
        mapel.textContent = data.mapel;

        const judul = document.createElement("h3");
        judul.textContent = data.judul;

        const identitas = document.createElement("p");
        identitas.textContent =
            `Oleh: ${data.nama} | Kelas: ${data.kelas}`;

        const pemahaman = document.createElement("p");
        pemahaman.textContent = data.pemahaman;

        const berkas = document.createElement("p");
        berkas.textContent =
            `Nama berkas: ${data.namaBerkas}`;

        const tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus";
        tombolHapus.type = "button";
        tombolHapus.classList.add("btn-hapus");

        tombolHapus.addEventListener("click", function () {
            hapusHasil(data.id);
        });

        card.append(
            mapel,
            judul,
            identitas,
            pemahaman,
            berkas,
            tombolHapus
        );

        daftarHasil.append(card);

    }


    /* =================================
       6. MENAMPILKAN SEMUA DATA
    ================================= */

    function tampilkanSemuaHasil() {

        daftarHasil.innerHTML = "";

        // Data terbaru ditampilkan paling atas
        [...dataHasil].reverse().forEach(function (data) {

            tampilkanHasil(data);

        });

    }


    /* =================================
       7. PROSES SUBMIT FORM
    ================================= */

    form.addEventListener("submit", function (event) {

        // Mencegah halaman melakukan refresh
        event.preventDefault();

        // Mengambil file yang dipilih
        const file = inputBerkas.files[0];

        if (!file) {
            alert("Silakan pilih berkas terlebih dahulu!");
            return;
        }

        // Memeriksa ukuran file maksimal 10 MB
        if (file.size > 10 * 1024 * 1024) {
            alert("Ukuran berkas maksimal 10 MB!");
            return;
        }

        // Memeriksa ekstensi file
        const ekstensi = file.name
            .split(".")
            .pop()
            .toLowerCase();

        const ekstensiDiizinkan = [
            "pdf",
            "doc",
            "docx",
            "ppt",
            "pptx"
        ];

        if (!ekstensiDiizinkan.includes(ekstensi)) {
            alert("Format berkas tidak didukung!");
            return;
        }

        // Membuat objek data baru
        const hasilBaru = {

            id: Date.now(),

            nama: inputNama.value.trim(),

            kelas: inputKelas.value.trim(),

            mapel: inputMapel.value,

            judul: inputJudul.value.trim(),

            pemahaman: inputPemahaman.value.trim(),

            namaBerkas: file.name

        };

        // Memasukkan data ke dalam array
        dataHasil.push(hasilBaru);

        // Menyimpan data ke Local Storage
        const berhasilDisimpan = simpanData();

        if (!berhasilDisimpan) {
            dataHasil.pop();
            return;
        }

        // Memperbarui tampilan card
        tampilkanSemuaHasil();

        // Mengosongkan form
        form.reset();

        // Pemberitahuan berhasil
        alert("Hasil belajar berhasil ditambahkan!");

    });


    /* =================================
       8. FUNGSI MENGHAPUS DATA
    ================================= */

    function hapusHasil(id) {

        const konfirmasi = confirm(
            "Apakah kamu yakin ingin menghapus hasil belajar ini?"
        );

        if (!konfirmasi) {
            return;
        }

        // Menyaring data berdasarkan ID
        const dataSebelumnya = dataHasil;

        dataHasil = dataHasil.filter(function (data) {
            return data.id !== id;
        });

        // Menyimpan perubahan
        const berhasilDisimpan = simpanData();

        if (!berhasilDisimpan) {
            dataHasil = dataSebelumnya;
            return;
        }

        // Memperbarui tampilan
        tampilkanSemuaHasil();

    }


    /* =================================
       9. MENAMPILKAN DATA SAAT HALAMAN DIBUKA
    ================================= */

    tampilkanSemuaHasil();

});
