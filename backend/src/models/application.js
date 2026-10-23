const pool = require("../config/db");

const Application = {
  // Membuat lamaran pekerjaan
  async create({ job_id, applicant_id, cover_letter }) {
    const [result] = await pool.query(
      `INSERT INTO applications (
        job_id,
        applicant_id,
        cover_letter
      )
      VALUES (?, ?, ?)`,
      [job_id, applicant_id, cover_letter ?? null],
    );

    return result.insertId;
  },

  // Mengambil semua lamaran milik job seeker
  async findByApplicantId(applicantId) {
    const [applications] = await pool.query(
      `SELECT
        applications.id,
        applications.job_id,
        applications.applicant_id,
        applications.cover_letter,
        applications.status,
        applications.applied_at,
        jobs.title AS job_title,
        jobs.company,
        jobs.location,
        jobs.type
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      WHERE applications.applicant_id = ?
      ORDER BY applications.applied_at DESC`,
      [applicantId],
    );

    return applications;
  },

  // Mengambil semua pelamar untuk lowongan milik recruiter
  async findByJobId(jobId) {
    const [applications] = await pool.query(
      `SELECT
        applications.id,
        applications.job_id,
        applications.applicant_id,
        applications.cover_letter,
        applications.status,
        applications.applied_at,
        users.name AS applicant_name,
        users.email AS applicant_email
      FROM applications
      JOIN users ON applications.applicant_id = users.id
      WHERE applications.job_id = ?
      ORDER BY applications.applied_at DESC`,
      [jobId],
    );

    return applications;
  },

  // Mengambil detail lamaran beserta recruiter pemilik lowongan
  async findById(id) {
    const [applications] = await pool.query(
      `SELECT
            applications.id,
            applications.job_id,
            applications.applicant_id,
            applications.cover_letter,
            applications.status,
            applications.applied_at,
            jobs.recruiter_id
        FROM applications
        JOIN jobs ON applications.job_id = jobs.id
        WHERE applications.id = ?
        LIMIT 1`,
      [id],
    );
    return applications[0] || null;
  },

  // Memperbarui status lamaran
  async updateStatus(id, status) {
    const [result] = await pool.query(
      `UPDATE applications
       SET status = ?
       WHERE id = ?`,
      [status, id],
    );

    return result.affectedRows;
  },

  // Memeriksa apakah user sudah melamar lowongan
  async findByJobAndApplicant(jobId, applicantId) {
    const [applications] = await pool.query(
      `SELECT id
       FROM applications
       WHERE job_id = ? AND applicant_id = ?
       LIMIT 1`,
      [jobId, applicantId],
    );

    return applications[0] || null;
  },
};

module.exports = Application;
