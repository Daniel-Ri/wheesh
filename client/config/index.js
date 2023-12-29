import development from '@config/development';
import production from '@config/production';
import test from '@config/test.env';

const nodeENV = process.env.NODE_ENV || 'development';

const env = { production, development, test }[nodeENV];

const config = {
  api: {
    host: env.API_HOST,
    cryptoKey: env.CRYPTO_KEY,
  },
};

export default config;
