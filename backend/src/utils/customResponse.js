class CustomResponse {
  constructor(message, data = null, errors = null) {
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}

module.exports = {
  CustomResponse,
};
