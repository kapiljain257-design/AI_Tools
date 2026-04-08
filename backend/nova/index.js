const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const config = {
  toolId: 'translator',
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/microservice_tools',
  messages: {
    start: 'Translator service started',
    process: 'Translating prompt to Pig Latin'
  }
};

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.info(`[${config.toolId}] Request ${req.method} ${req.url}`);
  next();
});

mongoose.connect(config.mongoUri)
  .then(() => console.info(`[${config.toolId}] Connected to MongoDB`))
  .catch(err => console.warn(`[${config.toolId}] MongoDB connection error (non-blocking): ${err.message}`));

let ToolUsage;
try {
  ToolUsage = mongoose.model('ToolUsage', new mongoose.Schema({ toolId: String, prompt: String, result: String, createdAt: { type: Date, default: Date.now } }));
} catch (e) {
  // Model already defined
  ToolUsage = mongoose.model('ToolUsage');
}

app.get('/health', (req, res) => {
  console.info(`[${config.toolId}] Health check`);
  res.json({ active: true, tool: config.toolId });
});

app.post('/process', async (req, res) => {
  const { prompt = '' } = req.body;
  console.info(`[${config.toolId}] ${config.messages.process}`, prompt);

  const result = prompt
    .split(' ')
    .map(w => (w.length > 0 ? `${w.slice(1)}${w[0]}ay` : ''))
    .join(' ');

  try {
    await ToolUsage.create({ toolId: config.toolId, prompt, result });
  } catch (e) {
    console.warn(`[${config.toolId}] Mongo write failed`, e.message);
  }

  res.json({ result });
});

app.listen(config.port, () => console.log(`[${config.toolId}] ${config.messages.start} on ${config.port}`));
