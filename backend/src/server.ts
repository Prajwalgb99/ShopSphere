import app from './app.js';
import { config } from './config/env.js';

const server = app.listen(config.port, () => {
  console.log(`🚀 ShopSphere Backend running on port ${config.port} in ${config.nodeEnv} mode`);
  console.log(`🔗 Health check available at: http://localhost:${config.port}/api/v1/health`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
