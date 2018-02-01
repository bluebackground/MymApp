const {
  PROD,
  DEV,
  TEST
} = require('./serverConfig.js');

const env = process.env.NODE_ENV || DEV;

const TEST_ENV_DB_URI = 'mongodb://localhost:27017/MymApp';
const DEV_ENV_DB_URI = 'mongodb://localhost:27017/Mym';
const PROD_EVN_DB_URI = '';

if (env === 'test' || env === 'dev') {
  const config = require('./processConfig.json');
  const envConfig = config[env];

  Object.keys(envConfig).forEach((k) => {
    process.env[k] = envConfig[k];
  });
}
