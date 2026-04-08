export const API = {
  base: '/api',
  endpoints: {
    tools: '/api/tools',
    filteredTools: '/api/tools/filtered',
    toolStatus: id => `/api/tools/${id}/status`,
    toolProcess: id => `/api/tools/${id}/process`
  }
};

export const USER_GROUPS = {
  NOVA_USERS: 'qipl.nova.users',
  INDUS_USERS: 'qipl.indus.users',
  PERFECTTO_USERS: 'qipl.perfectto.users',
  REPRO_USERS: 'qipl.repro.users',
  TDA_DEVELOPERS: 'qipl.tda.developers'
};

export const SUPPORT = {
  email: 'support@example.com',
  inactive: 'Tool is currently offline. Contact support.',
  error: 'An error occurred. Please try again later.'
};

export const UI = {
  expandLabel: expanded => (expanded ? 'Collapse tools' : 'Expand tools'),
  placeholder: 'Enter prompt here',
  processing: 'Processing...',
  apiKeyCreationLink: 'https://qgenie.ai/create-api-key' // Link for users to create Qgenie API key
};
