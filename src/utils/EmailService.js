const nodemailer = require("nodemailer");
const config = require("../config/config.js");

const sendEmail = async (to, otp, refNo) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: false,
        auth: {
            user: config.email.user,
            pass: config.email.pass
        }
    });

    await transporter.sendMail({
        from: {
            name: 'BlueStone',
            address: config.email.user
        },
        to,
        subject:"Your OTP Code",
        text:`OTP : ${otp} refNo : ${refNo} This code will expire in 3 minutes.`
    });
};

module.exports = sendEmail;