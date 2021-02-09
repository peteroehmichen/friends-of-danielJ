const aws = require("aws-sdk");
const cryptoRandomString = require("crypto-random-string");

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
