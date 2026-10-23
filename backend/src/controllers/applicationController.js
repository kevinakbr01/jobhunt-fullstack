const Application = require("../models/application");
const Job = require("../models/job");
const { CustomResponse } = require("../utils/customResponse");

// Membuat lamaran pekerjaan
async function createApplication(req, res, next) {
  try {
    const { cover_letter } = req.body;
    const job_id = req.params.id;
    const applicant_id = req.user.id;

    // Pastikan lowongan tersedia dan masih aktif
    const job = await Job.findById(job_id);

    if (!job || !job.is_active) {
      return res
        .status(404)
        .json(
          new CustomResponse("Lowongan tidak ditemukan atau sudah nonaktif."),
        );
    }

    // Cegah recruiter melamar lowongannya sendiri
    if (Number(job.recruiter_id) === Number(applicant_id)) {
      return res
        .status(403)
        .json(
          new CustomResponse(
            "Recruiter tidak dapat melamar lowongannya sendiri.",
          ),
        );
    }

    // Cegah lamaran duplikat
    const existingApplication = await Application.findByJobAndApplicant(
      job_id,
      applicant_id,
    );

    if (existingApplication) {
      return res
        .status(409)
        .json(new CustomResponse("Kamu sudah melamar lowongan ini."));
    }

    const applicationId = await Application.create({
      job_id,
      applicant_id,
      cover_letter,
    });

    return res.status(201).json(
      new CustomResponse("Lamaran berhasil dikirim.", {
        id: applicationId,
      }),
    );
  } catch (error) {
    next(error);
  }
}

// Melihat semua lamaran milik job seeker yang login
async function getMyApplications(req, res, next) {
  try {
    const applications = await Application.findByApplicantId(req.user.id);

    return res
      .status(200)
      .json(
        new CustomResponse("Daftar lamaran berhasil diambil.", applications),
      );
  } catch (error) {
    next(error);
  }
}

// Melihat semua pelamar untuk lowongan milik recruiter
async function getJobApplications(req, res, next) {
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
            "Kamu tidak memiliki akses ke daftar pelamar ini.",
          ),
        );
    }

    const applications = await Application.findByJobId(id);

    return res
      .status(200)
      .json(
        new CustomResponse("Daftar pelamar berhasil diambil.", applications),
      );
  } catch (error) {
    next(error);
  }
}

// Memperbarui status lamaran oleh recruiter pemilik lowongan
async function updateApplicationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id);

    if (!application) {
      return res
        .status(404)
        .json(new CustomResponse("Lamaran tidak ditemukan."));
    }

    if (Number(application.recruiter_id) !== Number(req.user.id)) {
      return res
        .status(403)
        .json(
          new CustomResponse(
            "Kamu tidak memiliki akses untuk mengubah lamaran ini.",
          ),
        );
    }

    await Application.updateStatus(id, status);

    return res.status(200).json(
      new CustomResponse("Status lamaran berhasil diperbarui.", {
        id: application.id,
        status,
      }),
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createApplication,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};
