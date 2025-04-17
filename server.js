const express = require('express');
const { Worker } = require('worker_threads');
const path = require('path');

const app = express();

function runWorker(input) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, './worker.js'), {
      workerData: {
        input,
        saltRounds: 10
      }
    });

    worker.on('message', (msg) => {
      if (msg.error) {
        reject(new Error(msg.error));
      } else {
        resolve(msg.hash);
      }
    });

    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

app.get('/heavy-work', async (req, res) => {
  try {
    const [hash1, hash2] = await Promise.all([
      runWorker('hello'),
      runWorker('world')
    ]);

    setTimeout(() => {
      res.send({ hash1, hash2 });
    }, 200);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
