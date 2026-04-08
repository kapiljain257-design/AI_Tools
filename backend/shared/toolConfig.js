const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/microservice_tools';
const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 3000,
  connectTimeoutMS: 3000
};

const PYTHON_EXECUTABLE = process.env.PYTHON_EXECUTABLE || 'python3';

const SERVICE_DEFINITIONS = {
  translator: {
    toolId: 'translator',
    defaultPort: 5001,
    pythonScript: path.join(ROOT_DIR, 'nova', 'tool_info.py'),
    messages: {
      start: 'Translator service started',
      process: 'Translating prompt to Pig Latin'
    }
  },
  reporter: {
    toolId: 'reporter',
    defaultPort: 5002,
    pythonScript: path.join(ROOT_DIR, 'indus-report', 'tool_info.py'),
    messages: {
      start: 'Report service started',
      process: 'Generating report summary'
    }
  },
  sentiment: {
    toolId: 'sentiment',
    defaultPort: 5003,
    pythonScript: path.join(ROOT_DIR, 'perfectto', 'tool_info.py'),
    messages: {
      start: 'Sentiment service started',
      process: 'Analyzing sentiment'
    }
  },
  calculator: {
    toolId: 'calculator',
    defaultPort: 5004,
    pythonScript: path.join(ROOT_DIR, 'repro-tool', 'tool_info.py'),
    messages: {
      start: 'Calculator service started',
      process: 'Evaluating expression'
    }
  },
  'image-generator': {
    toolId: 'image-generator',
    defaultPort: 5005,
    pythonScript: path.join(ROOT_DIR, 'image-generator', 'tool_info.py'),
    messages: {
      start: 'Image generation service started',
      process: 'Generating image description'
    }
  }
};

const SUPPORT = {
  proxyError: 'Tool service proxy failed'
};

module.exports = {
  MONGODB_URI,
  MONGO_OPTIONS,
  PYTHON_EXECUTABLE,
  SERVICE_DEFINITIONS,
  SUPPORT
};
