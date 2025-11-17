import {isHealthy} from './src/shared/health';

const health = isHealthy();
console.log(`Status: ${health.status}, Timestamp: ${health.timestamp}`);