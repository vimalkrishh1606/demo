// worker.js
const { parentPort, workerData } = require('worker_threads');
const bcrypt = require('bcrypt');

(async () => {
  try {
    const hash = await bcrypt.hash(workerData.input, workerData.saltRounds);
    parentPort.postMessage({ hash });
  } catch (err) {
    parentPort.postMessage({ error: err.message });
  }
})();
