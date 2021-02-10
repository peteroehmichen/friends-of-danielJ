const aws = require("aws-sdk");
const cryptoRandomString = require("crypto-random-string");
const { S3URL } = require("../config.json");
const multer = require("multer");
const uidSafe = require("uid-safe");
const fs = require("fs");
const path = require("path");

let secrets;
if (process.env.NODE_ENV === "production") {
    secrets = process.env;
} else {
    secrets = require("../secrets.json");
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-central-1",
});

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

module.exports.uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
module.exports.uploadToAWS = (req, res, next) => {
    if (!req.file) {
        res.json({ error: "File does not match standards" });
    } else {
        const { filename, mimetype, size, path } = req.file;
        const promise = s3
            .putObject({
                Bucket: "oehmichen-messageboard",
                ACL: "public-read",
                Key: filename,
                Body: fs.createReadStream(path),
                ContentType: mimetype,
                ContentLength: size,
            })
            .promise();
        promise
            .then(() => {
                fs.unlink(path, () => {});
                req.body.url = S3URL + req.file.filename;
                next();
            })
            .catch((err) => {
                console.log("error in AWS-Upload:", err);
            });
    }
};

module.exports.sendEMail = function (recipient) {
    const newCode = cryptoRandomString({ length: 6 });
    return ses
        .sendEmail({
            Source: "The Makers of MessageBoard <oehmichenp@gmail.com>",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `The code to reset your password is ${newCode}.`,
                    },
                },
                Subject: {
                    Data:
                        "MESSAGE BOARD: Your Validation Code for Password Reset",
                },
            },
        })
        .promise()
        .then(() => newCode)
        .catch((err) => {
            console.log("error on ASW SES:", err);
        });
};
