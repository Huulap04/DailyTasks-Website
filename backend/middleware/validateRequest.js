const { sendError } = require("../utils/http");

const PRIORITIES = ["Thấp", "Trung bình", "Cao"];
const CATEGORIES = ["Công việc", "Cá nhân", "Mua sắm", "Sức khỏe", "Khác"];

const isPlainObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeText = (value) => (typeof value === "string" ? value.trim() : value);

const validDateTime = (value) =>
  value === null || value === "" || (typeof value === "string" && !Number.isNaN(Date.parse(value)));

function validateRegister(req, res, next) {
  if (!isPlainObject(req.body)) {
    return sendError(res, 400, "INVALID_BODY", "Dữ liệu gửi lên không hợp lệ.");
  }

  const username = normalizeText(req.body.username);
  const email = normalizeText(req.body.email)?.toLowerCase();
  const { password } = req.body;

  if (typeof username !== "string" || username.length < 2 || username.length > 50) {
    return sendError(res, 400, "INVALID_USERNAME", "Tên người dùng phải có từ 2 đến 50 ký tự.");
  }
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return sendError(res, 400, "INVALID_EMAIL", "Email không hợp lệ.");
  }
  if (typeof password !== "string" || password.length < 8 || password.length > 128) {
    return sendError(res, 400, "INVALID_PASSWORD", "Mật khẩu phải có từ 8 đến 128 ký tự.");
  }

  req.body = { username, email, password };
  return next();
}

function validateLogin(req, res, next) {
  if (!isPlainObject(req.body)) {
    return sendError(res, 400, "INVALID_BODY", "Dữ liệu gửi lên không hợp lệ.");
  }

  const email = normalizeText(req.body.email)?.toLowerCase();
  const { password } = req.body;

  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return sendError(res, 400, "INVALID_EMAIL", "Email không hợp lệ.");
  }
  if (typeof password !== "string" || password.length === 0) {
    return sendError(res, 400, "INVALID_PASSWORD", "Mật khẩu không được để trống.");
  }

  req.body = { email, password };
  return next();
}

function validateTodo(req, res, next) {
  if (!isPlainObject(req.body)) {
    return sendError(res, 400, "INVALID_BODY", "Dữ liệu gửi lên không hợp lệ.");
  }

  const title = normalizeText(req.body.title);
  const note = req.body.note === null || req.body.note === undefined
    ? null
    : normalizeText(req.body.note);
  const reminder = req.body.reminder || null;
  const priority = req.body.priority || "Trung bình";
  const category = req.body.category || "Khác";

  if (typeof title !== "string" || title.length < 1 || title.length > 200) {
    return sendError(res, 400, "INVALID_TITLE", "Tiêu đề phải có từ 1 đến 200 ký tự.");
  }
  if (note !== null && (typeof note !== "string" || note.length > 2000)) {
    return sendError(res, 400, "INVALID_NOTE", "Ghi chú không được vượt quá 2000 ký tự.");
  }
  if (!validDateTime(reminder)) {
    return sendError(res, 400, "INVALID_REMINDER", "Thời gian nhắc không hợp lệ.");
  }
  if (!PRIORITIES.includes(priority)) {
    return sendError(res, 400, "INVALID_PRIORITY", "Mức ưu tiên không hợp lệ.");
  }
  if (!CATEGORIES.includes(category)) {
    return sendError(res, 400, "INVALID_CATEGORY", "Danh mục không hợp lệ.");
  }

  req.body = { title, note: note || null, reminder, priority, category };
  return next();
}

function validateCompleted(req, res, next) {
  if (!isPlainObject(req.body) || typeof req.body.completed !== "boolean") {
    return sendError(res, 400, "INVALID_COMPLETED", "completed phải là giá trị đúng hoặc sai.");
  }

  return next();
}

function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return sendError(res, 400, "INVALID_ID", "ID công việc không hợp lệ.");
  }

  req.params.id = String(id);
  return next();
}

module.exports = {
  validateCompleted,
  validateId,
  validateLogin,
  validateRegister,
  validateTodo,
};
