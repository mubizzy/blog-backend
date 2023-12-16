import User from "../model/User.js";
import bcrypt from "bcryptjs";

export const getAllUser = async (req, res, next) => {
  let users;

  try {
    users = await User.find();
  } catch (error) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({
      message: "No user Found",
    });
  }
  return res.status(200).json({ users });
};

export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return console.log(err);
  }
  if (existingUser) {
    return res.status(400).json({
      message: "User Already Exists! Login Instead",
    });
  }

  const hashPassword = bcrypt.hashSync(password);

  const user = new User({
    name,
    email,
    password: hashPassword,
    blogs: [],
  });

  try {
    await user.save();
  } catch (error) {
    return console.log(error);
  }
  return res.status(201).json({ user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(404).json({
      message: "Couldnt find user by this Email",
    });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(404).json({ message: "incorrect Password" });
  }
  return res.status(200).json({ message: "Login Successful" });
};
