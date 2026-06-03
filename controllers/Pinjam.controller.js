import Pinjam from "../models/pinjam.models.js";
import Mahasiswa from "../models/mahasiswa.models.js";
import DetailPinjam from "../models/detailpinjam.models.js";
import Buku from "../models/buku.models.js";
import sequelize from "../config/db.config.js";

//================================================ GET ALL PINJAM =========================================
export const getAllPinjam = async (req, res) => {
  try {
    const data = await Pinjam.findAll({
      include: [
        { model: Mahasiswa },
        {
          model: DetailPinjam,
          include: [Buku]
        }
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================================ GET PINJAM BY NIM =========================================
export const getLoansByStudentID = async (req, res) => {
  try {
    const data = await Pinjam.findAll({
      include: [
        {
          model: Mahasiswa,
          where: {
            nim: req.params.nim
          }
        },
        {
          model: DetailPinjam,
          include: [Buku]
        }
      ]
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Detail pinjam
export const getDetailPinjam = async (req, res) => {
  try {
    const data = await Pinjam.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        { model: Mahasiswa },
        {
          model: DetailPinjam,
          include: [Buku]
        }
      ],
    });

    if (!data) {
      return res.status(404).json({
        message: "Detail pinjam tidak ditemukan",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// TAMBAH PINJAM
export const tambahPinjam = async (req, res) => {
  try {
    const data = await Pinjam.create(req.body);

    res.status(201).json({
      message: "Data pinjam berhasil ditambahkan",
      data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE PINJAM
export const updatePinjam = async (req, res) => {
  try {
    const [updated] = await Pinjam.update(
      {
        status: 0
      },
      {
        where: {
          id: req.params.pinjam_id
        },
        transaction: t
      }
    );

    if (updated === 0) {
      return res.status(404).json({
        message: "Data pinjam tidak ditemukan"
      });
    }

    res.status(200).json({
      message: "Data pinjam berhasil diupdate"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Hapus pinjam
export const deletePinjam = async (req, res) => {
  try {
    const deleted = await Pinjam.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (deleted === 0) {
      return res.status(404).json({
        message: "Data pinjam tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Data pinjam berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//============================================ cari buku yang di pinjam  =======================================
export const cariBukuDipinjamMahasiswa = async (req, res) => {
  try {

    const data = await DetailPinjam.findAll({
      where: {
        status: 1
      },

      include: [
        {
          model: Pinjam,
          where: {
            nim: req.params.nim
          },
          include: [Mahasiswa]
        },
        {
          model: Buku
        }
      ]
    });

    if (data.length === 0) {
      return res.status(404).json({
        message: "Tidak ada buku yang sedang dipinjam"
      });
    }

    const hasil = data.map((item) => ({
      detail_pinjam_id: item.id,
      nama_mahasiswa: item.pinjam.mahasiswa.nama,
      judul_buku: item.buku.judul,
      jumlah_pinjam: item.jml_pinjam
    }));

    res.status(200).json(hasil);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//===================================================== INSERT PINJAM DAN DETAIL PINJAM  =========================================
export const insertPinjam = async (req, res) => {
  try {
    const pinjam = await Pinjam.create(
      {
        tanggal_pinjam: req.body.tanggal_pinjam,
        tanggal_kembali: req.body.tanggal_kembali,
        nim: req.body.nim,
        pegawai_id: req.body.pegawai_id,
        detail_pinjams: req.body.detail_pinjams,
      },
      {
        include: [DetailPinjam],
      }
    );

    if (pinjam && req.body.detail_pinjams) { //tru dua"nya 
      for (let i = 0; i < req.body.detail_pinjams.length; i++) {
        Buku.decrement(
          { jumlah: req.body.detail_pinjams[i].jml_pinjam },
          { where: { kode_buku: req.body.detail_pinjams[i].buku_id } }
        )
      }
    }

    res.json(pinjam);
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

//========================================KEMBALIKAN SATU BUKU========================================
export const kembalikanSatuBuku = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { pinjam_id, buku_id } = req.params;

    // Cari detail pinjam yang masih aktif (status = 1)
    const detail = await DetailPinjam.findOne({
      where: {
        pinjam_id,
        buku_id,
        status: 1,
      },
      transaction: t,
    });

    // Jika data tidak ditemukan
    if (!detail) {
      await t.rollback();

      return res.status(404).json({
        message: "Data pinjam tidak ditemukan",
      });
    }

    // Ubah status menjadi sudah dikembalikan
    await detail.update(
      {
        status: 0,
        tanggal_kembali: new Date(),
      },
      {
        transaction: t,
      }
    );

    // Ambil data buku
    const buku = await Buku.findOne({
      where: {
        kode_buku: buku_id,
      },
      transaction: t,
    });

    // Tambahkan stok buku
    await buku.update(
      {
        jumlah: buku.jumlah + detail.jml_pinjam,
      },
      {
        transaction: t,
      }
    );

    // Simpan semua perubahan
    await t.commit();

    return res.status(200).json({
      message: "Buku berhasil dikembalikan dan stok bertambah",
    });

  } catch (error) {
    await t.rollback();

    return res.status(500).json({
      message: error.message,
    });
  }
};

//========================================KEMBALIKAN SEMUA BUKU========================================
export const kembalikanSemuaBuku = async (req, res) => {
  const t = await sequelize.transaction();

  try {

    const detailPinjam = await DetailPinjam.findAll({
      where: {
        pinjam_id: req.params.pinjam_id,
        status: 1
      },
      transaction: t
    });

    if (detailPinjam.length === 0) {

      await t.rollback();

      return res.status(404).json({
        message: "Data pinjam tidak ditemukan"
      });

    }


    // loop semua buku
    for (const item of detailPinjam) {

      await item.update(
        {
          status: 0,
          tanggal_kembali: new Date()
        },
        {
          transaction: t
        }
      );

      const buku = await Buku.findOne({
        where: {
          kode_buku: item.buku_id,
        },
        transaction: t
      });

      await buku.update(
        {
          jumlah: buku.jumlah + item.jml_pinjam
        },
        {
          transaction: t
        }
      );

    }


    // commit transaksi
    await t.commit();

    res.status(200).json({
      message: "Semua buku berhasil dikembalikan dan stok diperbarui"
    });

  } catch (error) {

    await t.rollback();

    res.status(500).json({
      message: error.message
    });

  }
};


//========================================KEMBALIKAN SEBAGIAN BUKU========================================
export const kembalikanSebagianBuku = async (req, res) => {

  const t = await sequelize.transaction();

  try {

    const pinjam_id = req.params.pinjam_id;//

    const { data_buku } = req.body;

    for (const item of data_buku) {

      const detail = await DetailPinjam.findOne({
        where: {
          pinjam_id,
          buku_id: item.buku_id,
          status: 1
        },
        transaction: t
      });

      // cek data pinjam
      if (!detail) {

        await t.rollback();

        return res.status(404).json({
          message: "Data pinjam tidak ditemukan"
        });

      }

      // VALIDASI
      if (item.jml_kembali > detail.jml_pinjam) {

        await t.rollback();

        return res.status(400).json({
          message: "Jumlah kembali melebihi jumlah pinjam"
        });

      }

      // =========================================
      // KEMBALI SEMUA
      // =========================================
      if (item.jml_kembali == detail.jml_pinjam) {

        await detail.update(
          {
            status: 0,
            tanggal_kembali: new Date()
          },
          {
            transaction: t
          }
        );

      }

      // =========================================
      // KEMBALI SEBAGIAN
      // =========================================
      else {

        // update sisa pinjaman
        await detail.update(
          {
            jml_pinjam:
              detail.jml_pinjam - item.jml_kembali
          },
          {
            transaction: t
          }
        );

        // insert riwayat pengembalian
        await DetailPinjam.create(
          {
            pinjam_id,
            buku_id: item.buku_id,
            jml_pinjam: item.jml_kembali,
            status: 2,
            tanggal_kembali: new Date()
          },
          {
            transaction: t
          }
        );

      }

      // =========================================
      // UPDATE STOK BUKU
      // =========================================
      const buku = await Buku.findOne({
        where: {
          kode_buku: item.buku_id
        },
        transaction: t
      });

      await buku.update(
        {
          jumlah:
            buku.jumlah + item.jml_kembali
        },
        {
          transaction: t
        }
      );

    }

    await t.commit();

    res.status(200).json({
      message: "Pengembalian berhasil"
    });

  } catch (error) {

    await t.rollback();

    res.status(500).json({
      message: error.message
    });

  }

};

//======================================== LAPORAN PENGEMBALIAN ========================================
export const laporanPengembalian = async (req, res) => {

  try {

    const data = await DetailPinjam.findAll({

      where: {
        status: [0,2]
      },

      include: [

        // relasi buku
        {
          model: Buku
        },

        // relasi pinjam -> mahasiswa
        {
          model: Pinjam,
          include: [
            {
              model: Mahasiswa
            }
          ]
        }

      ]

    });

    // cek jika tidak ada data
    if (data.length === 0) {

      return res.status(404).json({
        message: "Belum ada data pengembalian"
      });

    }

    // format laporan
    const hasil = data.map((item) => ({

      detail_pinjam_id: item.id,

      nama_mahasiswa:
        item.pinjam?.mahasiswa?.nama,

      judul_buku:
        item.buku?.judul,

      jumlah_pinjam:
        item.jml_pinjam,

      tanggal_kembali:
        item.pinjam?.tanggal_kembali,

      hari_terlambat:
        item.tanggal_kembali && item.pinjam?.tanggal_kembali
          ? Math.ceil(
            (new Date(item.tanggal_kembali) - new Date(item.pinjam.tanggal_kembali)) / (1000 * 60 * 60 * 24)
          )
          : 0,

      status:
        item.status == 0
          ? "dikembalikan"
          : "dikembalikan sebagian"

    }));


    res.status(200).json({

      message:
        "Laporan pengembalian berhasil diambil",

      total_data:
        hasil.length,

      data: hasil

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};