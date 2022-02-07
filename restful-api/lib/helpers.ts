import * as crypto from "node:crypto";
import config from "../config";

const helpers = {
    hash: (str) => {
        if (typeof(str) === "string" && str.length > 0) {
            const hash = crypto.createHmac("sha256", config.hashingSecret).update(str).digest("hex");
            return hash;
        }
    },

    parseJsonToObject: (str) => {
        try {
            return JSON.parse(str);
        } catch (err) {
            return {};
        }
    }
};

export default helpers;