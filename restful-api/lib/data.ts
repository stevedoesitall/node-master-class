import * as fs from "node:fs";
import { PathLike } from "node:fs";
import * as path from "node:path";

const baseDir = path.join(__dirname, "../.data/");

const lib = {
    create: (dir, file, data, cb) => {
        fs.open(`${baseDir}/${dir}/${file}.json`, "wx", (err, fileDesc) => {
            if (!err && fileDesc) {
                const stringData = JSON.stringify(data);
                fs.writeFile(fileDesc, stringData, (err) => {
                    if (!err) {
                        fs.close(fileDesc, (err) => {
                            if (!err) {
                                cb(false);
                            } else {
                                console.log("Error closing file");
                            }
                        })
                    } else {
                        cb("Error writing to new file.");
                    }
                })
            } else {
                cb("Could not create new file.");
            }
        });
    },

    read: (dir, file, cb) => {
        fs.readFile(`${baseDir}/${dir}/${file}.json`, "utf-8", (err, data) => {
            cb(err, data);
        });
    },

    update: (dir, file, data, cb) => {
        fs.open(`${baseDir}/${dir}/${file}.json`, "r+", (err, fileDesc) => {
            if (!err && fileDesc) {
                const stringData = JSON.stringify(data);
                fs.truncate(`${baseDir}/${dir}/${file}.json`, (err) => {
                    if (!err) {
                        fs.writeFile(fileDesc, stringData, () => {
                            if (!err) {
                                fs.close(fileDesc, (err) => {
                                    if (!err) {
                                        cb(false);
                                    } else {
                                        cb("Error closing file.");
                                    }
                                });
                            } else {
                                cb("Error writing to existing file");
                            }
                        })
                    } else {
                        cb("Error truncating file.");
                    }
                })
            } else {
                cb("Could not create new file.");
            }
        });
    },

    delete: (dir, file, cb) => {
        fs.unlink(`${baseDir}/${dir}/${file}.json`, (err) => {
            if (!err) {
                cb(false);
            } else {
                cb("Error deleting file.");
            }
        })
    }
};

export default lib;

