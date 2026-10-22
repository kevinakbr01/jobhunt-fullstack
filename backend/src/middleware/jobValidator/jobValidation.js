const { body, param, query } = require("express-validator");

const jobListQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1, max: 2147483647 })
    .withMessage("Page harus berupa bilangan bulat positif!"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit harus berupa bilangan bulat antara 1 dan 100!"),

  query("keyword")
    .optional()
    .isString()
    .withMessage("Keyword harus berupa teks!")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Keyword maksimal 200 karakter!"),

  query("type")
    .optional()
    .isIn(["full-time", "part-time", "contract", "internship"])
    .withMessage("Tipe pekerjaan tidak valid!"),

  query("location")
    .optional()
    .isString()
    .withMessage("Lokasi harus berupa teks!")
    .bail()
    .isLength({ max: 150 })
    .withMessage("Lokasi maksimal 150 karakter!"),

  query("sort")
    .optional()
    .isIn(["newest", "most_applicants"])
    .withMessage("Sorting harus newest atau most_applicants!"),
];

// Validasi field
const jobFieldsValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Judul lowongan wajib diisi!")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Judul lowongan maksimal 200 karakter!"),

  body("company")
    .trim()
    .notEmpty()
    .withMessage("Nama perusahaan wajib diisi!")
    .bail()
    .isLength({ max: 150 })
    .withMessage("Nama perusahaan maksimal 150 karakter!"),

  body("location")
    .optional({ values: "null" })
    .isString()
    .withMessage("Lokasi pekerjaan harus berupa teks!")
    .bail()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Lokasi maksimal 150 karakter!"),

  body("type")
    .isIn(["full-time", "part-time", "contract", "internship"])
    .withMessage("Tipe pekerjaan tidak valid!"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Deskripsi pekerjaan wajib diisi!"),

  body("requirements")
    .optional({ values: "null" })
    .isString()
    .withMessage("Persyaratan pekerjaan harus berupa teks!")
    .bail()
    .trim(),

  body("salary_min")
    .optional({ values: "null" })
    .isInt({ min: 0 })
    .withMessage("Gaji minimum tidak boleh negatif!")
    .bail()
    .custom((value, { req }) => {
      const max = req.body.salary_max;

      if (
        value !== undefined &&
        value !== null &&
        max !== undefined &&
        max !== null &&
        value !== "" &&
        max !== "" &&
        Number(value) > Number(max)
      ) {
        throw new Error(
          "Gaji minimum tidak boleh lebih besar daripada gaji maksimum!",
        );
      }
      return true;
    }),

  body("salary_max")
    .optional({ values: "null" })
    .isInt({ min: 0 })
    .withMessage("Gaji maksimum tidak boleh negatif!"),
];

// Validasi saat membuat lowongan
const createJobValidation = [...jobFieldsValidation];

// Validasi saat memperbarui lowongan
const updateJobValidation = [...jobFieldsValidation];

// Validasi parameter ID lowongan
const jobIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID lowongan harus berupa bilangan bulat positif!"),
];

module.exports = {
  jobListQueryValidation,
  createJobValidation,
  updateJobValidation,
  jobIdValidation,
};
