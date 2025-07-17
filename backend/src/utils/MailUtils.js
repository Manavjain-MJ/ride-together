const mailer = require("nodemailer");

const sendingMail = async (to, subject, text) => {
  const transpoter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_GMAIL,
      pass: process.env.MAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_GMAIL,
    to: to,
    subject: subject,
    html: text,
  };

  const mailresponse = await transpoter.sendMail(mailOptions);
  console.log(mailresponse);
  return mailresponse;
};
module.exports = {
  sendingMail,
};
