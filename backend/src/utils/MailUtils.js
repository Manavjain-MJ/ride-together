const mailer = require("nodemailer");

const sendingMail = async (to, subject, text) => {
  const transpoter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: "ridetogether3@gmail.com",
      pass: "omkg webm wuji pnwp",
    },
  });
  const mailOptions = {
    from: "ridetogether3@gmail.com",
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
