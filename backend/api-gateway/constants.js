// User group/list enum - customize as needed
const USER_GROUPS = {
  NOVA_USERS: 'qipl.nova.users',
  INDUS_USERS: 'qipl.indus.users',
  PERFECTTO_USERS: 'qipl.perfectto.users',
  REPRO_USERS: 'qipl.repro.users',
  TDA_DEVELOPERS: 'qipl.tda.developers' // Super admin - can access all tools
};

const TOOLS = [
  {
    id: 'nova',
    name: 'Nova',
    port: 5001,
    description: 'Advanced text processing and translation tool',
    requiredGroups: [USER_GROUPS.NOVA_USERS, USER_GROUPS.TDA_DEVELOPERS]
  },
  {
    id: 'indus-report',
    name: 'Indus Report',
    port: 5002,
    description: 'Comprehensive reporting and data analysis',
    requiredGroups: [USER_GROUPS.INDUS_USERS, USER_GROUPS.TDA_DEVELOPERS]
  },
  {
    id: 'perfectto',
    name: 'Perfectto',
    port: 5003,
    description: 'Quality assurance and optimization tool',
    requiredGroups: [USER_GROUPS.PERFECTTO_USERS, USER_GROUPS.TDA_DEVELOPERS]
  },
  {
    id: 'repro-tool',
    name: 'Repro Tool',
    port: 5004,
    description: 'Reproduction and testing framework',
    requiredGroups: [USER_GROUPS.REPRO_USERS, USER_GROUPS.TDA_DEVELOPERS]
  },
  {
    id: 'image-generator',
    name: 'Image Generator',
    port: 5005,
    description: 'AI-powered image and visual content generation',
    requiredGroups: [USER_GROUPS.TDA_DEVELOPERS] // Only for TDA developers
  }
];

const SUPPORT = {
  email: 'support@example.com',
  downtimeMessage: 'Currently offline. Contact support for help.',
  proxyError: 'Tool service proxy failed'
};

const API = {
  basePath: '/api',
  timeout: {
    health: 3000,
    process: 10000
  }
};

module.exports = { TOOLS, SUPPORT, API, USER_GROUPS };
