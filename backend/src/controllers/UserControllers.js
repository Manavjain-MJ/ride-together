const { genSaltSync } = require("bcrypt");
const userModel = require("../models/UserModels");
const { json } = require("express");
const bcrypt = require("bcrypt")
const addUser1 = async (req, res) => {
  try {
    const createdUser = await userModel.create(req.body);
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
  const user = await userModel.create(req.body);
  res.json({
    message: "User is created",
    data: user,
  });
};

const getUser = async (req, res) => {
  const savedUser = await userModel.find().populate("roleId");
  res.json({
    message: "all the user are fetched",
    data: savedUser,
  });
};

const deleteUser = async (req, res) => {
  const deleted = await userModel.findByIdAndDelete(req.params.id);
  res.json({
    message: "user is deleted.....",
    data: deleted,
  });
};
const getUserId = async (req, res) => {
  const getId = await userModel.findById(req.params.id);
  res.json({
    message: "user id is fetched",
    data: getId,
  });
};
const loginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const foundUserFromEmail = await userModel.findOne({ email: email });
  console.log(foundUserFromEmail);
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
  }else{
    res.status(404).json({
        message:"email not found"
    })
  }
};
const signUp = async (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  req.body.password = hashedPassword;
  const createdUser = await userModel.create(req.body);
  res.status(201).json({
    message: "User created",
    data: createdUser,
  });
};

module.exports = {
  addUser,
  getUser,
  deleteUser,
  getUserId,
  addUser1,
  loginUser,
  signUp
};
