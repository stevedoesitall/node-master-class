import { callbackify } from "util";
import _data from "./data";
import helpers from "./helpers";

const handlers = {

    users: (data, cb) => {
        const acceptableMethods = ["post", "get", "put", "delete"];

        if (acceptableMethods.includes(data.method)) {
            handlers._users[data.method](data, cb);
        } else {
            cb(405);
        }
    },

    _users: {
        post: (data, cb) => {
            const firstName = typeof(data.payload.firstName) === "string" && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
            const lastName = typeof(data.payload.lastName) === "string" && data.payload.firstName.trim().length > 0 ? data.payload.lastName.trim() : false;
            const phone = typeof(data.payload.phone) === "string" && data.payload.phone.trim().length > 10 ? data.payload.phone.trim() : false;
            const password = typeof(data.payload.password) === "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
            const tosAgreement = typeof(data.payload.tosAgreement) === "boolean" && data.payload.tosAgreement;

            if (firstName && lastName && phone && password && tosAgreement) {
                _data.read("users", phone, (err, data) => {
                    if (err) {
                        const hashedPassword = helpers.hash(password);

                        if (hashedPassword) {
                            const usersObj = {
                                firstName,
                                lastName,
                                phone,
                                hashedPassword,
                                tosAgreement
                            };
    
                            _data.create("users", phone, usersObj, (err) => {
                                if (!err) {
                                    cb(200);
                                } else {
                                    console.log(err);
                                    cb(500, {
                                        "error": "Error creating user."
                                    });
                                }
                            })
                        } else {
                            cb(500, {
                                "error": "Could not has the user's password."
                            })
                        }
                    } else {
                        cb(400, {
                            "error": "User with that phone number already exists."
                        });
                    }
                });
            } else {
                cb(400, {
                    "error": "Missing required fields"
                });
            }
        },

        get: (data, cb) => {

        },

        put: (data, cb) => {

        },

        delete: (data, cb) => {

        }
    },

    ping: (data, cb) => {
        cb(200);
    },

    notFound: (data, cb) => {
        cb(404);
    }
};

export default handlers;