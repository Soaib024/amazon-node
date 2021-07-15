var validator = require("validator");
const User = require("../modals/UserModal");
const jwt = require("jsonwebtoken");

const { promisify } = require("util");

const response = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: "error",
    message: message,
  });
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendToken = (res, statusCode, user) => {
  const token = signToken(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOption);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

exports.signin = async (req, res) => {
  if (!req.body) {
    return response(res, 400, "Invalid body parameter");
  }
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return response(res, 400, "Invalid body parameter");
  }

  if (!validator.isEmail(email)) {
    return response(res, 400, "Email is invalid");
  }

  if (password.trim().length < 6) {
    return response(res, 400, "Password should be atleast 6 characters long");
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password, user.password))) {
      return response(res, 401, "Incorrect email or password");
    }

    return sendToken(res, 200, user);
  } catch (err) {
    console.log(err);
  }
};

exports.signup = async (req, res) => {
  if (!req.body) {
    return response(res, 400, "Invalid body parameter");
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const confirmPassword = req.body.confirmPassword;

  if (!email || !password || !name || !confirmPassword) {
    return response(res, 400, "Invalid body parameter");
  }

  try {
    const isEmailAlreadyUsed = await User.findOne({ email });
    if (isEmailAlreadyUsed) {
      return response(
        res,
        400,
        "Email already in use, Please Login or use another email"
      );
    }
  } catch (err) {
    console.log(err);
    return response(res, 500, "Something went wrong, Please try again later");
  }

  if (!validator.isEmail(email)) {
    return response(res, 400, "Email is invalid");
  }

  if (password.trim().length < 6) {
    return response(res, 400, "Password should be atleast 6 characters long");
  }

  if (name.trim().length < 4) {
    return response(res, 400, "Name should be atleast 6 characters long");
  }

  if (confirmPassword !== password) {
    return response(res, 400, "Password and confirm password does not matches");
  }

  const user = { email, password, name };

  const newUser = await User.create(user);

  sendToken(res, 201, newUser);
};

exports.protected = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return response(
      res,
      401,
      "Your are not logged in, Please login to continue"
    );
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return response(res, 401, "Either is expired or invalid");
    }

    req.user = user;
  } catch (err) {
    console.log(err);
    return response(res, 500, "Something went wrong");
  }

  next();
};
