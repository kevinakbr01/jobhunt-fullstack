const pool = require("../config/db");

function buildJobFilters({ keyword, type, location }) {
  const conditions = ["jobs.is_active = TRUE"];
  const values = [];

  if (keyword) {
    conditions.push("(jobs.title LIKE ? OR jobs.company LIKE ?)");
    values.push(`%${keyword}%`, `%${keyword}%`);
  }

  if (type) {
    conditions.push("jobs.type = ?");
    values.push(type);
  }

  if (location) {
    conditions.push("jobs.location LIKE ?");
    values.push(`%${location}%`);
  }

  return {
    whereClause: conditions.join(" AND "),
    values,
  };
}

const Job = {
  // Mengambil lowongan aktif dengan pencarian, filter, dan pagination
  async findAll({ page, limit, keyword, type, location, sort }) {
    const { whereClause, values } = buildJobFilters({
      keyword,
      type,
      location,
    });
    const offset = (page - 1) * limit;
    const orderBy =
      sort === "most_applicants"
        ? "applicant_count DESC, jobs.created_at DESC, jobs.id DESC"
        : "jobs.created_at DESC, jobs.id DESC";

    const [jobs] = await pool.query(
      `SELECT
        jobs.id,
        jobs.title,
        jobs.company,
        jobs.location,
        jobs.type,
        jobs.description,
        jobs.requirements,
        jobs.salary_min,
        jobs.salary_max,
        jobs.created_at,
        users.name AS recruiter_name,
        (
          SELECT COUNT(*)
          FROM applications
          WHERE applications.job_id = jobs.id
        ) AS applicant_count
      FROM jobs
      JOIN users ON jobs.recruiter_id = users.id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?`,
      [...values, limit, offset],
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM jobs
       WHERE ${whereClause}`,
      values,
    );

    return { jobs, total };
  },

  // Mengambil semua lowongan milik recruiter
  async findByRecruiterId(recruiterId) {
    const [jobs] = await pool.query(
      `SELECT
        jobs.id,
        jobs.title,
        jobs.company,
        jobs.location,
        jobs.type,
        jobs.description,
        jobs.requirements,
        jobs.salary_min,
        jobs.salary_max,
        jobs.is_active,
        jobs.created_at
      FROM jobs
      WHERE jobs.recruiter_id = ?
      ORDER BY jobs.created_at DESC, jobs.id DESC`,
      [recruiterId],
    );

    return jobs;
  },

  // Mengambil lowongan berdasarkan ID
  async findById(id) {
    const [jobs] = await pool.query(
      `SELECT
        jobs.id,
        jobs.recruiter_id,
        jobs.title,
        jobs.company,
        jobs.location,
        jobs.type,
        jobs.description,
        jobs.requirements,
        jobs.salary_min,
        jobs.salary_max,
        jobs.is_active,
        jobs.created_at,
        users.name AS recruiter_name
      FROM jobs
      JOIN users ON jobs.recruiter_id = users.id
      WHERE jobs.id = ?`,
      [id],
    );

    return jobs[0] || null;
  },

  // Membuat lowongan baru
  async create({
    recruiter_id,
    title,
    company,
    location,
    type,
    description,
    requirements,
    salary_min,
    salary_max,
  }) {
    const [result] = await pool.query(
      `INSERT INTO jobs (
        recruiter_id,
        title,
        company,
        location,
        type,
        description,
        requirements,
        salary_min,
        salary_max
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recruiter_id,
        title,
        company,
        location ?? null,
        type,
        description,
        requirements ?? null,
        salary_min ?? null,
        salary_max ?? null,
      ],
    );

    return result.insertId;
  },

  // Mengubah data lowongan
  async update(
    id,
    recruiterId,
    {
      title,
      company,
      location,
      type,
      description,
      requirements,
      salary_min,
      salary_max,
    },
  ) {
    const [result] = await pool.query(
      `UPDATE jobs
      SET title = ?,
          company = ?,
          location = ?,
          type = ?,
          description = ?,
          requirements = ?,
          salary_min = ?,
          salary_max = ?
      WHERE id = ? AND recruiter_id = ?`,
      [
        title,
        company,
        location ?? null,
        type,
        description,
        requirements ?? null,
        salary_min ?? null,
        salary_max ?? null,
        id,
        recruiterId,
      ],
    );

    return result.affectedRows;
  },

  // Menonaktifkan lowongan
  async deactivate(id, recruiterId) {
    const [result] = await pool.query(
      `UPDATE jobs 
       SET is_active = FALSE
       WHERE id = ? AND recruiter_id = ? AND is_active = TRUE`,
      [id, recruiterId],
    );

    return result.affectedRows;
  },
};

module.exports = Job;
