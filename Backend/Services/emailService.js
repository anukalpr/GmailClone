const nodemailer = require('nodemailer');
const Email = require('../model/email');
const UserCredentials = require('../model/userCredentials');

const sendMail = async (userId, to, subject, text) => {
  const user = await UserCredentials.findOne({ userId });
  if (!user) throw new Error('User not found');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: userId,
      pass: user.password  
    }
  });

  const mailOptions = {
    from: userId,
    to,
    subject,
    text
  };

  const email = new Email({ from: userId, to, subject, text });
  await email.save();
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
