const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { execFile } = require('child_process');
const { MONGODB_URI, MONGO_OPTIONS, PYTHON_EXECUTABLE, SERVICE_DEFINITIONS, SUPPORT } = require('../shared/toolConfig');

const serviceKey = 'reporter';
const serviceConfig = SERVICE_DEFINITIONS[serviceKey];

const config = {
  toolId: serviceConfig.toolId,
  port: process.env.PORT || serviceConfig.defaultPort,
  mongoUri: MONGODB_URI,
  pythonScript: serviceConfig.pythonScript,
  messages: serviceConfig.messages
};

const executePythonTool = (scriptPath, username, apiKey, prompt) => new Promise((resolve, reject) => {
  const args = ['--username', username, '--api_key', apiKey, '--prompt', prompt];
  execFile(PYTHON_EXECUTABLE, [scriptPath, ...args], { timeout: 15000 }, (error, stdout, stderr) => {
    if (error) {
      return reject(new Error(stderr.toString().trim() || error.message));
    }
    return resolve(stdout.toString().trim());
  });
});

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.info(`[${config.toolId}] Request ${req.method} ${req.url}`);
  next();
});

mongoose.connect(config.mongoUri, MONGO_OPTIONS)
  .then(() => console.info(`[${config.toolId}] Connected to MongoDB`))
  .catch(err => console.warn(`[${config.toolId}] MongoDB connection error (non-blocking): ${err.message}`));

let ToolUsage;
try {
  ToolUsage = mongoose.model('ToolUsage', new mongoose.Schema({ toolId: String, prompt: String, result: String, createdAt: { type: Date, default: Date.now } }));
} catch (e) {
  // Model already defined
  ToolUsage = mongoose.model('ToolUsage');
}

const logToolUsage = (prompt, result) => {
  if (mongoose.connection.readyState === 1) {
    ToolUsage.create({ toolId: config.toolId, prompt, result })
      .catch(e => console.warn(`[${config.toolId}] Mongo write failed`, e.message));
  } else {
    console.warn(`[${config.toolId}] Mongo not ready, skipping usage log`);
  }
};

app.get('/health', (req, res) => {
  console.info(`[${config.toolId}] Health check`);
  res.json({ active: true, tool: config.toolId });
});

app.post('/process', async (req, res) => {
  const { prompt = '', username = 'anonymous', apiKey = '' } = req.body;
  console.info(`[${config.toolId}] ${config.messages.process}`, prompt);

  try {
    const result = await executePythonTool(config.pythonScript, username, apiKey, prompt);
    logToolUsage(prompt, result);
    res.json({ result });
  } catch (err) {
    console.error(`[${config.toolId}] Python tool error`, err.message);
    logToolUsage(prompt, `ERROR: ${err.message}`);
    res.status(500).json({ error: SUPPORT.proxyError, details: err.message });
  }
});

app.listen(config.port, () => console.log(`[${config.toolId}] ${config.messages.start} on ${config.port}`));
