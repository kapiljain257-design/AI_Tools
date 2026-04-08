const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/microservice_tools';

// Define Schemas
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  apiKey: String,
  userGroups: [String],
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  theme: { type: String, default: 'light' },
  metadata: {
    browser: String,
    ipAddress: String,
    userAgent: String
  }
});

const LoginSessionSchema = new mongoose.Schema({
  email: String,
  timestamp: { type: Date, default: Date.now },
  success: Boolean,
  userGroups: [String],
  sessionId: String,
  expiresAt: Date,
  metadata: {
    browser: String,
    operatingSystem: String,
    ipAddress: String,
    location: String
  }
});

LoginSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired

const ToolUsageSchema = new mongoose.Schema({
  toolId: String,
  userEmail: String,
  userGroups: [String],
  timestamp: { type: Date, default: Date.now },
  inputLength: Number,
  outputLength: Number,
  executionTime: Number,
  status: { type: String, enum: ['success', 'error', 'timeout'] },
  errorMessage: String,
  type: String,
  result: String,
  apiKey: String
});

ToolUsageSchema.index({ timestamp: -1 });
ToolUsageSchema.index({ userEmail: 1 });
ToolUsageSchema.index({ toolId: 1 });

const ToolStatusHistorySchema = new mongoose.Schema({
  toolId: String,
  timestamp: { type: Date, default: Date.now },
  active: Boolean,
  responseTime: Number,
  statusCode: Number,
  errorMessage: String,
  uptime: Number
});

ToolStatusHistorySchema.index({ toolId: 1, timestamp: -1 });
ToolStatusHistorySchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 }); // 7 days

const ExecutionLogsSchema = new mongoose.Schema({
  toolId: String,
  userEmail: String,
  timestamp: { type: Date, default: Date.now },
  logLevel: { type: String, enum: ['info', 'debug', 'warning', 'error', 'success'] },
  message: String,
  details: mongoose.Schema.Types.Mixed,
  stackTrace: String
});

ExecutionLogsSchema.index({ timestamp: -1 });
ExecutionLogsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

const UserStatisticsSchema = new mongoose.Schema({
  email: String,
  totalLogins: { type: Number, default: 0 },
  totalToolExecutions: { type: Number, default: 0 },
  successfulExecutions: { type: Number, default: 0 },
  failedExecutions: { type: Number, default: 0 },
  averageExecutionTime: { type: Number, default: 0 },
  toolBreakdown: {
    nova: { type: Number, default: 0 },
    'indus-report': { type: Number, default: 0 },
    'perfectto': { type: Number, default: 0 },
    'repro-tool': { type: Number, default: 0 },
    'image-generator': { type: Number, default: 0 }
  },
  lastActivityDate: Date,
  accountCreatedDate: { type: Date, default: Date.now },
  preferredTools: [String],
  dataUsedInMB: { type: Number, default: 0 }
});

// Initialize connection (non-blocking)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(mongoUri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      maxPoolSize: 5
    });
    isConnected = true;
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.warn('⚠️ Database connection warning:', err.message);
    // Don't crash - services can still run
  }
};

// Initialize models
let User, LoginSession, ToolUsage, ToolStatusHistory, ExecutionLogs, UserStatistics;

const initModels = () => {
  try {
    User = mongoose.model('User', UserSchema);
  } catch (e) {
    User = mongoose.model('User');
  }
  
  try {
    LoginSession = mongoose.model('LoginSession', LoginSessionSchema);
  } catch (e) {
    LoginSession = mongoose.model('LoginSession');
  }
  
  try {
    ToolUsage = mongoose.model('ToolUsage', ToolUsageSchema);
  } catch (e) {
    ToolUsage = mongoose.model('ToolUsage');
  }
  
  try {
    ToolStatusHistory = mongoose.model('ToolStatusHistory', ToolStatusHistorySchema);
  } catch (e) {
    ToolStatusHistory = mongoose.model('ToolStatusHistory');
  }
  
  try {
    ExecutionLogs = mongoose.model('ExecutionLogs', ExecutionLogsSchema);
  } catch (e) {
    ExecutionLogs = mongoose.model('ExecutionLogs');
  }
  
  try {
    UserStatistics = mongoose.model('UserStatistics', UserStatisticsSchema);
  } catch (e) {
    UserStatistics = mongoose.model('UserStatistics');
  }
};

// Logger functions
const logLogin = async (email, userGroups, success, metadata = {}) => {
  if (!isConnected) return;
  try {
    const sessionId = `${email}_${Date.now()}`;
    await LoginSession.create({
      email,
      timestamp: new Date(),
      success,
      userGroups,
      sessionId,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      metadata
    });
    
    // Update user stats
    if (success) {
      await User.findOneAndUpdate(
        { email },
        { 
          $inc: { loginCount: 1 },
          $set: { lastLogin: new Date() }
        },
        { upsert: true }
      );
    }
  } catch (err) {
    console.warn('⚠️ Failed to log login:', err.message);
  }
};

const logToolUsage = async (toolId, userEmail, userGroups, data = {}) => {
  if (!isConnected) return;
  try {
    const usage = await ToolUsage.create({
      toolId,
      userEmail,
      userGroups,
      timestamp: new Date(),
      inputLength: data.inputLength || 0,
      outputLength: data.outputLength || 0,
      executionTime: data.executionTime || 0,
      status: data.status || 'success',
      errorMessage: data.errorMessage,
      type: data.type || 'text',
      result: data.result ? data.result.substring(0, 1000) : '',
      apiKey: data.apiKey
    });

    // Update user statistics
    await updateUserStats(userEmail, toolId, data);
    
    return usage;
  } catch (err) {
    console.warn('⚠️ Failed to log tool usage:', err.message);
  }
};

const logExecution = async (toolId, userEmail, logLevel, message, details = {}) => {
  if (!isConnected) return;
  try {
    await ExecutionLogs.create({
      toolId,
      userEmail,
      timestamp: new Date(),
      logLevel,
      message,
      details,
      stackTrace: details.stackTrace
    });
  } catch (err) {
    console.warn('⚠️ Failed to log execution:', err.message);
  }
};

const logToolStatus = async (toolId, active, responseTime = 0, statusCode = 0, errorMessage = '') => {
  if (!isConnected) return;
  try {
    await ToolStatusHistory.create({
      toolId,
      timestamp: new Date(),
      active,
      responseTime,
      statusCode,
      errorMessage,
      uptime: active ? 100 : 0
    });
  } catch (err) {
    console.warn('⚠️ Failed to log tool status:', err.message);
  }
};

const updateUserStats = async (email, toolId, data = {}) => {
  if (!isConnected) return;
  try {
    const isSuccess = data.status === 'success';
    const update = {
      $inc: {
        totalToolExecutions: 1,
        ...(isSuccess ? { successfulExecutions: 1 } : { failedExecutions: 1 }),
        [`toolBreakdown.${toolId}`]: 1,
        dataUsedInMB: (data.outputLength || 0) / (1024 * 1024)
      },
      $set: { lastActivityDate: new Date() }
    };
    
    if (data.executionTime) {
      update.$avg = { averageExecutionTime: data.executionTime };
    }

    await UserStatistics.findOneAndUpdate(
      { email },
      update,
      { upsert: true }
    );
  } catch (err) {
    console.warn('⚠️ Failed to update user stats:', err.message);
  }
};

const getAnalytics = async (query = {}) => {
  if (!isConnected) return null;
  try {
    const analytics = {
      totalUsers: await User.countDocuments(),
      totalLogins: await LoginSession.countDocuments(),
      totalToolUsage: await ToolUsage.countDocuments(),
      successRate: await ToolUsage.aggregate([
        { $group: { _id: null, success: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } }, total: { $sum: 1 } } }
      ]),
      toolBreakdown: await ToolUsage.aggregate([
        { $group: { _id: '$toolId', count: { $sum: 1 } } }
      ]),
      topUsers: await UserStatistics.find().sort({ totalToolExecutions: -1 }).limit(5)
    };
    return analytics;
  } catch (err) {
    console.warn('⚠️ Failed to get analytics:', err.message);
    return null;
  }
};

module.exports = {
  connectDB,
  initModels,
  logLogin,
  logToolUsage,
  logExecution,
  logToolStatus,
  updateUserStats,
  getAnalytics,
  models: {
    User: () => User,
    LoginSession: () => LoginSession,
    ToolUsage: () => ToolUsage,
    ToolStatusHistory: () => ToolStatusHistory,
    ExecutionLogs: () => ExecutionLogs,
    UserStatistics: () => UserStatistics
  }
};
