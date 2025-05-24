interface EnvironmentConfig {
  API: {
    BASE_URL: string;
    KEY: string;
  };
  ENV: string;
}

const Constants: EnvironmentConfig = {
  API: {
    BASE_URL: process.env.EXPO_PUBLIC_API_URL ?? '',
    KEY: process.env.EXPO_PUBLIC_API_KEY ?? '',
  },
  ENV: process.env.EXPO_PUBLIC_NODE_ENV ?? 'development',
};

export default Constants;
