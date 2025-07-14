const { genSaltSync } = require("bcrypt");
const { json } = require("express");
const bcrypt = require("bcrypt");
const RideModel = require("../models/RideModel");
const mailUtils = require("../utils/MailUtils");
const jwt = require("jsonwebtoken");
const UserProfileModel = require("../models/UserProfileModel");
const secret = "secert";

const addUser1 = async (req, res) => {
  try {
    const createdUser = await RideModel.create(req.body);
    res.status(201).json({
      message: "user created..",
      data: createdUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      data: err,
    });
  }
};

const addUser = async (req, res) => {
  const user = await RideModel.create(req.body);
  res.json({
    message: "User is created",
    data: user,
  });
};

const getUser = async (req, res) => {
  const savedUser = await RideModel.find();
  res.json({
    message: "all the user are fetched",
    data: savedUser,
  });
};

const deleteUser = async (req, res) => {
  const deleted = await RideModel.findByIdAndDelete(req.params.id);
  res.json({
    message: "user is deleted.....",
    data: deleted,
  });
};

const getUserId = async (req, res) => {
  const getId = await RideModel.findById(req.params.id);
  res.json({
    message: "user id is fetched",
    data: getId,
  });
};

const loginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const foundUserFromEmail = await RideModel.findOne({ email: email }).populate(
    "roleId"
  );
  console.log(foundUserFromEmail);
  try {
    if (foundUserFromEmail != null) {
      const isMatch = bcrypt.compareSync(password, foundUserFromEmail.password);
      if (isMatch == true) {
        res.status(200).json({
          message: "login success",
          data: foundUserFromEmail,
        });
      } else {
        res.status(404).json({
          message: "invalid password",
        });
      }
    } else {
      res.status(404).json({
        message: "email not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const signUp = async (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  // const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  req.body.password = hashedPassword;
  const createdUser = await RideModel.create(req.body);

  await UserProfileModel.create({
    userId: createdUser._id,
  });

  await mailUtils.sendingMail(
    createdUser.email,
    "Welcome To RideTogether",
    "This is a Welcome Email From RideTogether"
  );
  try {
    res.status(201).json({
      message: "User created",
      data: createdUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const foundUser = await RideModel.findOne({ email: email });
    if (!foundUser) {
      return res.status(404).json({ message: "User not find please register" });
    }
    // if (foundUser) {
    const token = jwt.sign({ _id: foundUser._id }, secret, {
      expiresIn: "10m",
    });
    console.log(token);
    const url = `http://localhost:5173/resetpassword/${token}`;
    const mailContent = `<html>
  <head>
      <style>
          .email-container {
              font-family: Arial, sans-serif;
              max-width: 500px;
              margin: auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
              background-color: #f9f9f9;
              text-align: center;
          }
          .reset-button {
              display: inline-block;
              padding: 12px 20px;
              font-size: 16px;
              color: #fff;
              background-color: #007BFF;
              text-decoration: none;
              border-radius: 5px;
          }
          .reset-button:hover {
              background-color: #0056b3;
          }
          p {
              color: #333;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <a href="${url}" class="reset-button">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards, <br> <strong>RideTogether Team</strong></p>
      </div>
  </body>
  </html>`;
    await mailUtils.sendingMail(foundUser.email, "reset password", mailContent);
    res.json({
      message: "Reset password link send to mail",
    });
  } catch (error) {
    console.error(error),
      res.status(500).json({
        message: "User not found register first",
      });
  }
};

const resetpassword = async (req, res) => {
  const token = req.body.token;
  const newPassword = req.body.password;

  const userFromToken = jwt.verify(token, secret);

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(newPassword, salt);

  const updatedUser = await RideModel.findByIdAndUpdate(userFromToken._id, {
    password: hashedPassword,
  });
  res.json({
    message: "Password Updated Succesfully",
  });
};

module.exports = {
  addUser,
  getUser,
  deleteUser,
  getUserId,
  addUser1,
  loginUser,
  signUp,
  forgetPassword,
  resetpassword,
};
