const express = require('express');
const axios = require('axios');
const cors = require('cors');

const { TOOLS, SUPPORT, API, USER_GROUPS } = require('./constants');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.info(`API Gateway request: ${req.method} ${req.url}`);
  next();
});

app.get('/api/tools', (req, res) => {
  console.info('Returning tool list', TOOLS.map(t => t.id));
  res.json({ tools: TOOLS });
});

app.post('/api/tools/filtered', (req, res) => {
  // Filter tools based on user groups
  // Expected: { userGroups: ['qipl.nova.users', 'qipl.indus.users'] }
  const { userGroups } = req.body;
  
  if (!userGroups || !Array.isArray(userGroups)) {
    console.warn('Invalid user groups provided');
    return res.status(400).json({ error: 'userGroups must be an array' });
  }

  const filteredTools = TOOLS.filter(tool => {
    // Check if user belongs to any of the required groups for this tool
    return tool.requiredGroups.some(group => userGroups.includes(group));
  });

  console.info('Returning filtered tools for groups:', userGroups, '| Tools:', filteredTools.map(t => t.id));
  res.json({ tools: filteredTools });
});

app.get('/api/tools/:id/status', async (req, res) => {
  const tool = TOOLS.find(t => t.id === req.params.id);
  if (!tool) {
    console.warn(`Status check failed, tool not found: ${req.params.id}`);
    return res.status(404).json({ error: 'Tool not found' });
  }

  console.info(`Health check for ${tool.id} on port ${tool.port}`);
  try {
    const health = await axios.get(`http://localhost:${tool.port}/health`, { timeout: API.timeout.health });
    return res.json({ active: health.data.active === true });
  } catch (err) {
    console.warn(`Health check failed for ${tool.id}`, err.message);
    return res.json({ active: false });
  }
});

app.post('/api/tools/:id/process', async (req, res) => {
  const tool = TOOLS.find(t => t.id === req.params.id);
  if (!tool) {
    console.warn(`Tool not found: ${req.params.id}`);
    return res.status(404).json({ error: 'Tool not found' });
  }

  console.info(`Proxying process request for ${tool.id}`);
  try {
    const response = await axios.post(`http://localhost:${tool.port}/process`, req.body, { timeout: API.timeout.process });
    return res.json(response.data);
  } catch (err) {
    console.error(`Proxy error for ${tool.id}`, err.message);
    return res.status(500).json({ error: SUPPORT.proxyError });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on ${PORT}`));
