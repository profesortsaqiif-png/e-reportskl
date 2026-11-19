 const namaSekolah = "SMK IDN Mesir 2 ";
    document.getElementById("namaSekolahDisplay").textContent = namaSekolah;

    let daftarLaporan = JSON.parse(localStorage.getItem("dataAspirasiOsis")) || [];

    const formLaporan = document.getElementById("formLaporan");
    const deskripsiInput = document.getElementById("deskripsi");
    const charCounter = document.getElementById("charCounter");
    const charBarFill = document.getElementById("charBarFill");

    // SAPAAN & WAKTU SETEMPAT
    function updateSapaanDanWaktu() {
      const sekarang = new Date();
      const jam = sekarang.getHours();

      let sapaan = "Selamat datang";
      let ikonWaktu = "☀️";
      if (jam >= 4 && jam < 11) {
        sapaan = "Selamat pagi";
        ikonWaktu = "🌅";
      } else if (jam >= 11 && jam < 15) {
        sapaan = "Selamat siang";
        ikonWaktu = "☀️";
      } else if (jam >= 15 && jam < 18) {
        sapaan = "Selamat sore";
        ikonWaktu = "🌇";
      } else {
        sapaan = "Selamat malam";
        ikonWaktu = "🌙";
      }

      document.getElementById("greetingText").textContent = `${ikonWaktu} ${sapaan}, Sobat Siswa!`;

      const formatTanggal = sekarang.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      const formatJam = sekarang.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

      const zonaWaktu = Intl.DateTimeFormat().resolvedOptions().timeZone;
      document.getElementById("localTimeDisplay").textContent = `${formatTanggal} • ${formatJam} (${zonaWaktu})`;
    }

    // DARK MODE SWITCH
    function sinkronkanTampilanSwitch(isDark) {
      const switchInput = document.getElementById("toggleDarkSwitch");
      const labelSwitch = document.getElementById("labelDarkSwitch");

      switchInput.checked = isDark;
      if (isDark) {
        document.body.classList.add("dark-mode");
        labelSwitch.textContent = "☀️ Mode Gelap";
      } else {
        document.body.classList.remove("dark-mode");
        labelSwitch.textContent = "🌙 Mode Gelap";
      }
    }

    function muatTema() {
      const isDark = localStorage.getItem("darkMode") === "true";
      sinkronkanTampilanSwitch(isDark);
    }

    function toggleDarkMode(isChecked) {
      localStorage.setItem("darkMode", isChecked);
      sinkronkanTampilanSwitch(isChecked);
    }

    // TOGGLE ANONIM CEPAT
    function toggleAnonim(isAnonim) {
      const inputNama = document.getElementById("namaPeminjam");
      if (isAnonim) {
        inputNama.value = "Anonim (Siswa)";
        inputNama.readOnly = true;
      } else {
        inputNama.value = "";
        inputNama.readOnly = false;
        inputNama.focus();
      }
    }

    // COUNTER KARAKTER & PROGRESS BAR
    deskripsiInput.addEventListener("input", function () {
      const panjang = this.value.trim().length;
      const persentase = Math.min((panjang / 10) * 100, 100);
      charBarFill.style.width = `${persentase}%`;

      if (panjang < 10) {
        charBarFill.style.backgroundColor = "#dc2626";
        charCounter.style.color = "#dc2626";
        charCounter.textContent = `${panjang} / 10 karakter (Minimal 10 huruf)`;
      } else {
        charBarFill.style.backgroundColor = "#16a34a";
        charCounter.style.color = "#16a34a";
        charCounter.textContent = `✔ ${panjang} karakter (Siap dikirim)`;
      }
    });

    function getBadgePrioritas(prioritas) {
      let kelasBadge = "";
      switch (prioritas) {
        case "Rendah": kelasBadge = "prio-rendah"; break;
        case "Sedang": kelasBadge = "prio-sedang"; break;
        case "Darurat": kelasBadge = "prio-darurat"; break;
        default: kelasBadge = "prio-rendah";
      }
      return `<span class="badge ${kelasBadge}">${prioritas}</span>`;
    }

    function simpanKeStorage() {
      localStorage.setItem("dataAspirasiOsis", JSON.stringify(daftarLaporan));
      updateStatistik();
    }

    function updateStatistik() {
      const total = daftarLaporan.length;
      const menunggu = daftarLaporan.filter(i => i.status === "Menunggu").length;
      const diproses = daftarLaporan.filter(i => i.status === "Diproses").length;
      const selesai = daftarLaporan.filter(i => i.status === "Selesai").length;
      
      const persentaseSelesai = total > 0 ? Math.round((selesai / total) * 100) : 0;

      document.getElementById("statTotal").textContent = total;
      document.getElementById("statMenunggu").textContent = menunggu;
      document.getElementById("statDiproses").textContent = diproses;
      document.getElementById("statSelesai").textContent = selesai;
      document.getElementById("labelSelesai").textContent = `SELESAI (${persentaseSelesai}%)`;
    }

    formLaporan.addEventListener("submit", function (e) {
      e.preventDefault();

      const editId = document.getElementById("editId").value;
      const namaPeminjam = document.getElementById("namaPeminjam").value.trim();
      const kategori = document.querySelector('input[name="kategoriRadio"]:checked').value;
      const prioritas = document.querySelector('input[name="prioritasRadio"]:checked').value;
      const deskripsi = deskripsiInput.value.trim();

      if (deskripsi.length < 10) {
        alert("Isi aspirasi minimal harus 10 karakter!");
        return;
      }

      const tanggalOtomatis = new Date().toLocaleDateString("id-ID", {
        day: "2-digit", month: "short", year: "numeric"
      });

      if (editId) {
        const index = daftarLaporan.findIndex(item => item.id == editId);
        if (index !== -1) {
          daftarLaporan[index].namaPeminjam = namaPeminjam;
          daftarLaporan[index].kategori = kategori;
          daftarLaporan[index].prioritas = prioritas;
          daftarLaporan[index].deskripsi = deskripsi;
        }
        batalEdit();
      } else {
        const laporanBaru = {
          id: Date.now(),
          tanggal: tanggalOtomatis,
          namaPeminjam: namaPeminjam,
          kategori: kategori,
          prioritas: prioritas,
          deskripsi: deskripsi,
          status: "Menunggu"
        };
        daftarLaporan.unshift(laporanBaru);
      }

      simpanKeStorage();
      resetFormVisual();
      renderTabel();
    });

    function resetFormVisual() {
      formLaporan.reset();
      const inputNama = document.getElementById("namaPeminjam");
      inputNama.readOnly = false;
      charBarFill.style.width = "0%";
      charBarFill.style.backgroundColor = "#dc2626";
      charCounter.style.color = "#dc2626";
      charCounter.textContent = "0 / 10 karakter (Minimal 10 huruf)";
    }

    function renderTabel() {
      const tbody = document.getElementById("tabelBody");
      const pilihKategori = document.getElementById("filterKategori").value;
      const pilihStatus = document.getElementById("filterStatus").value;

      const dataTersaring = daftarLaporan.filter(item => {
        const cocokKategori = (pilihKategori === "Semua") || (item.kategori === pilihKategori);
        const cocokStatus = (pilihStatus === "Semua") || (item.status === pilihStatus);
        return cocokKategori && cocokStatus;
      });

      tbody.innerHTML = "";

      if (dataTersaring.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 1.5rem; color: var(--text-muted);">Tidak ada data aspirasi yang sesuai.</td></tr>`;
        return;
      }

      dataTersaring.forEach(item => {
        let badgeStatus = "";
        switch(item.status) {
          case "Menunggu": badgeStatus = `<span class="badge status-menunggu">Menunggu</span>`; break;
          case "Diproses": badgeStatus = `<span class="badge status-proses">Diproses</span>`; break;
          case "Selesai": badgeStatus = `<span class="badge status-selesai">Selesai</span>`; break;
          default: badgeStatus = `<span class="badge status-menunggu">Menunggu</span>`;
        }

        let tombolAksiStatus = "";
        if (item.status === "Menunggu") {
          tombolAksiStatus = `<button class="btn-sm btn-proses" onclick="ubahStatus(${item.id}, 'Diproses')">⚙️ Proses</button>`;
        } else if (item.status === "Diproses") {
          tombolAksiStatus = `<button class="btn-sm btn-selesai" onclick="ubahStatus(${item.id}, 'Selesai')">✔ Selesai</button>`;
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.tanggal}</td>
          <td><strong>${item.namaPeminjam}</strong></td>
          <td>
            <small style="color: var(--primary); font-weight: 600;">${item.kategori}</small><br>
            <span>${item.deskripsi}</span>
          </td>
          <td>${getBadgePrioritas(item.prioritas)}</td>
          <td>${badgeStatus}</td>
          <td>
            <div class="action-btns">
              ${tombolAksiStatus}
              <button class="btn-sm btn-edit" onclick="editLaporan(${item.id})">✏️ Edit</button>
              <button class="btn-sm btn-hapus" onclick="hapusLaporan(${item.id})">🗑️</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function ubahStatus(id, statusBaru) {
      const target = daftarLaporan.find(item => item.id === id);
      if (target) {
        target.status = statusBaru;
        simpanKeStorage();
        renderTabel();
      }
    }

    function hapusLaporan(id) {
      if (confirm("Hapus aspirasi ini?")) {
        daftarLaporan = daftarLaporan.filter(item => item.id !== id);
        simpanKeStorage();
        renderTabel();
      }
    }

    function bersihkanSelesai() {
      const jumlahSelesai = daftarLaporan.filter(item => item.status === "Selesai").length;
      if (jumlahSelesai === 0) {
        alert("Tidak ada aspirasi berstatus 'Selesai' untuk dibersihkan.");
        return;
      }

      if (confirm(`Hapus ${jumlahSelesai} riwayat aspirasi yang sudah berstatus 'Selesai'?`)) {
        daftarLaporan = daftarLaporan.filter(item => item.status !== "Selesai");
        simpanKeStorage();
        renderTabel();
      }
    }

    function editLaporan(id) {
      const data = daftarLaporan.find(item => item.id === id);
      if (!data) return;

      document.getElementById("editId").value = data.id;
      const inputNama = document.getElementById("namaPeminjam");
      const cekAnon = document.getElementById("cekAnonim");

      inputNama.value = data.namaPeminjam;
      if (data.namaPeminjam === "Anonim (Siswa)") {
        cekAnon.checked = true;
        inputNama.readOnly = true;
      } else {
        cekAnon.checked = false;
        inputNama.readOnly = false;
      }

      const radioKat = document.querySelector(`input[name="kategoriRadio"][value="${data.kategori}"]`);
      if (radioKat) radioKat.checked = true;

      const radioPrio = document.querySelector(`input[name="prioritasRadio"][value="${data.prioritas}"]`);
      if (radioPrio) radioPrio.checked = true;

      deskripsiInput.value = data.deskripsi;
      deskripsiInput.dispatchEvent(new Event("input"));

      document.getElementById("formTitle").textContent = "Edit Aspirasi";
      document.getElementById("btnSubmit").textContent = "💾 Simpan Perubahan";
      document.getElementById("btnCancelEdit").style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function batalEdit() {
      document.getElementById("editId").value = "";
      resetFormVisual();
      document.getElementById("formTitle").textContent = "Kirim Aspirasi & Saran";
      document.getElementById("btnSubmit").textContent = "🚀 Kirim Aspirasi Sekarang";
      document.getElementById("btnCancelEdit").style.display = "none";
    }

    updateSapaanDanWaktu();
    setInterval(updateSapaanDanWaktu, 1000);
    muatTema();
    updateStatistik();
    renderTabel();