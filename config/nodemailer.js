const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Get config variables
dotenv.config();

// // access secret token
// const user = process.env.USER;
// const pass = process.env.PASS;

// console.log(process.env.USER, process.env.PASS);

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ksuraj23081999@gmail.com",
    pass: 'kolkata1',
  },
});

function sendActivationLink(name, email, activationCode) {
  transport
    .sendMail({
      from: process.env.USER,
      to: email,
      subject: "Please activate your account",
      html: `<h1>Account Activation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for signing up. Please activate your email by clicking on the following link</p>
        <a href=http://localhost:5000/users/activate/${activationCode}> Click here</a>
        </div>`,
    })
    .catch((err) => console.log(err));
}


function sendPasswordForgotLink(name, email, resetPasswordCode) {
  transport
    .sendMail({
      from: process.env.USER,
      to: email,
      subject: "Password Reset Link",
      html: `<h1>Forgot Password</h1>
        <h2>Hello , ${name}</h2>
        <p>Thank you for signing up. Please activate your email by clicking on the following link</p>
        <a href=http://localhost:5000/password/forgotpassword/${resetPasswordCode}> Click here</a>
        </div>`,
    })
    .catch((err) => console.log(err));
}

exports.sendActivationLink = sendActivationLink;
exports.sendPasswordForgotLink = sendPasswordForgotLink;
