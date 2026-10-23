const Job = require("../models/job");
const { CustomResponse } = require("../utils/customResponse");

// Menampilkan semua lowongan aktif
async function getAllJobs(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const { keyword, type, location, sort = "newest" } = req.query;
    const { jobs, total } = await Job.findAll({
      page,
      limit,
      keyword,
      type,
      location,
      sort,
    });

    return res.status(200).json(
      new CustomResponse("Daftar lowongan berhasil diambil.", {
        jobs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }),
    );
  } catch (error) {
    next(error);
  }
}

async function getMyJobs(req, res, next) {
  try {
    const jobs = await Job.findByRecruiterId(req.user.id);

    return res
      .status(200)
      .json(new CustomResponse("Daftar lowongan berhasil diambil.", jobs));
  } catch (error) {
    next(error);
  }
}

// Menampilkan detail lowongan berdasarkan ID
async function getJobById(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);

    if (!job || !job.is_active) {
      return res
        .status(404)
        .json(new CustomResponse("Lowongan tidak ditemukan."));
    }

    return res
      .status(200)
      .json(new CustomResponse("Detail lowongan berhasil diambil.", job));
  } catch (error) {
    next(error);
  }
}

// Membuat lowongan baru
async function createJob(req, res, next) {
  try {
    const jobId = await Job.create({
      ...req.body,
      recruiter_id: req.user.id,
    });

    const job = await Job.findById(jobId);

    return res
      .status(201)
      .json(new CustomResponse("Lowongan berhasil dibuat.", job));
  } catch (error) {
    next(error);
  }
}

// Memperbarui lowongan milik recruiter
async function updateJob(req, res, next) {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res
        .status(404)
        .json(new CustomResponse("Lowongan tidak ditemukan."));
    }

    if (Number(job.recruiter_id) !== Number(req.user.id)) {
      return res
        .status(403)
        .json(
          new CustomResponse(
            "Anda tidak memiliki akses untuk mengubah lowongan ini.",
          ),
        );
    }

    await Job.update(id, req.user.id, req.body);

    const updatedJob = await Job.findById(id);

    return res
      .status(200)
      .json(new CustomResponse("Lowongan berhasil diperbarui.", updatedJob));
  } catch (error) {
    next(error);
  }
}

// Menonaktifkan lowongan milik recruiter
async function deactivateJob(req, res, next) {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res
        .status(404)
        .json(new CustomResponse("Lowongan tidak ditemukan!"));
    }

    if (Number(job.recruiter_id) !== Number(req.user.id)) {
      return res
        .status(403)
        .json(
          new CustomResponse(
            "Anda tidak memiliki akses untuk menonaktifkan lowongan ini!",
          ),
        );
    }

    const affectedRows = await Job.deactivate(id, req.user.id);
    if (affectedRows === 0) {
      return res
        .status(404)
        .json(
          new CustomResponse("Lowongan tidak ditemukan atau sudah nonaktif!"),
        );
    }

    return res
      .status(200)
      .json(new CustomResponse("Lowongan berhasil dinonaktifkan."));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllJobs,
  getMyJobs,
  getJobById,
  createJob,
  updateJob,
  deactivateJob,
};
