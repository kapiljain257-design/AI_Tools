const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const config = {
  toolId: 'sentiment',
  port: process.env.PORT || 5003,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/microservice_tools',
  messages: {
    start: 'Sentiment service started',
    process: 'Analyzing sentiment'
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
  .catch(err => console.error(`[${config.toolId}] MongoDB connection error`, err));

const ToolUsage = mongoose.model('ToolUsage', new mongoose.Schema({ toolId: String, prompt: String, result: String, createdAt: { type: Date, default: Date.now } }));

app.get('/health', (req, res) => {
  console.info(`[${config.toolId}] Health check`);
  res.json({ active: true, tool: config.toolId });
});

app.post('/process', async (req, res) => {
  const { prompt = '' } = req.body;
  console.info(`[${config.toolId}] ${config.messages.process}`, prompt);

  const lower = prompt.toLowerCase();
  let sentiment = 'neutral';
  if (/(good|great|excellent|happy|love|awesome)/.test(lower)) sentiment = 'positive';
  if (/(bad|sad|terrible|hate|worst|angry)/.test(lower)) sentiment = 'negative';

  const result = `Sentiment: ${sentiment}`;

  try {
    await ToolUsage.create({ toolId: config.toolId, prompt, result });
  } catch (e) {
    console.warn(`[${config.toolId}] Mongo write failed`, e.message);
  }

  res.json({ result });
});

app.listen(config.port, () => console.log(`[${config.toolId}] ${config.messages.start} on ${config.port}`));
