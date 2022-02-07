const enviornments = {
    staging: {
        httpPort: 3000,
        httpsPort: 3001,
        envName: "staging",
        hashingSecret: "thisIsASecret"
    },

    production: {
        httpPort: 5000,
        httpsPort: 5001,
        envName: "production",
        hashingSecret: "thisIsABetterSecret"
    }
};

const currentEnv = typeof(process.env.NODE_ENV) === "string" ? process.env.NODE_ENV.toLowerCase() : "";

const envToExport = typeof(enviornments[currentEnv]) === "object" ? enviornments[currentEnv] : enviornments.staging;

export default envToExport;