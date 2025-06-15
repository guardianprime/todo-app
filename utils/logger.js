const log = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`, meta);
};

module.exports = {
  info: (msg, meta) => log("INFO", msg, meta),
  error: (msg, meta) => log("ERROR", msg, meta),
};
