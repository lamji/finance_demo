export const ACCOUNT_FEATURES: Record<AccountType, AccountFeatures> = {
  guest: {
    maxRecords: 20,
    storage: "shared",
    cloudBackup: false,
    price: "Free",
  },
  "one-time": {
    maxRecords: Infinity,
    storage: "local",
    cloudBackup: false,
    price: "$9.99",
  },
  monthly: {
    maxRecords: Infinity,
    storage: "local",
    cloudBackup: true,
    price: "$4.99/mo",
  },
};
