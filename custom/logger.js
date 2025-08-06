const fs = require('node:fs')
const path = require('node:path')

const logFilePath = path.join(__dirname, 'log.txt');
let logStream = null;

function create() {
  logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
}

function log(message) {
  if (!logStream) return;

  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  logStream.write(logMessage);
}

function close() {
  logStream.end();
}

module.exports = {
  create,
  log,
  close
}
