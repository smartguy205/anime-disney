const User = require("../../Models/Users");
const tryCatchAsync = require("../../../../util/tryCatchAsync");
const apiResponse = require("../../../../util/apiResponse");
const jwt = require("jsonwebtoken");
const AppError = require("../../../../util/appError");
const { promisify } = require("util");
const nodemailer = require("nodemailer");
const { badRequest, success, unauthorized, notFound, unprocessable } =
  require("../../../../util/statusCode").statusCode;

// create reusable transporter object using SMTP transport
let transporter = nodemailer.createTransport({
  host: "api.animedisney.com",
  port: 465, // replace with your SMTP server port
  secure: true, // true for 465, false for other ports
  auth: {
    user: "smart@api.animedisney.com",
    pass: "smartguy0205",
  },
});

const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = tryCatchAsync(async (req, res, next) => {
  const { email } = req.body;

  const registeredUserWithEmail = await User.findOne({
    email,
  });

  if (registeredUserWithEmail)
    throw new AppError(`Email ${email} already exist`, badRequest);

  const user = await User.create({ role: "user", ...req.body });
  const token = generateJWT(user._id);

  let response_data = { user: user, token: token };
  return apiResponse.successResponse(res, response_data, "success", 200);
});

exports.update = tryCatchAsync(async (req, res) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Unauthorized", unauthorized));
  }
  const decoded_token = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  let current_user = await User.findById(decoded_token.id).select("+password");

  current_user.name = req.body?.name ? req.body?.name : current_user.name;
  current_user.role = req.body?.role ? req.body?.role : current_user.role;
  current_user.race = req.body?.race ? req.body?.race : current_user.race;
  current_user.password = req.body?.password
    ? req.body?.password
    : current_user.password;
  current_user.gender = req.body?.gender
    ? req.body?.gender
    : current_user.gender;
  current_user.email = req.body?.email ? req.body?.email : current_user.email;
  current_user.dob = req.body?.dob ? req.body?.dob : current_user.dob;
  current_user.age = req.body?.age ? req.body?.age : current_user.age;
  current_user.star = req.body?.star ? req.body?.star : current_user.star;
  current_user.zodiac = req.body?.zodiac
    ? req.body?.zodiac
    : current_user.zodiac;
  current_user.planet = req.body?.planet
    ? req.body?.planet
    : current_user.planet;
  // current_user.hair = req.body?.hair ? req.body?.hair : current_user.hair;
  // current_user.eyes = req.body?.eyes ? req.body?.eyes : current_user.eyes;
  // current_user.height = req.body?.height
  //   ? req.body?.height
  //   : current_user.height;
  // current_user.weight = req.body?.weight
  //   ? req.body?.weight
  //   : current_user.weight;
  // current_user.blood = req.body?.blood ? req.body?.blood : current_user.blood;
  current_user.relationship = req.body?.relationship
    ? req.body?.relationship
    : current_user.relationship;
  current_user.country = req.body?.phone?.formattedValue
    ? req.body?.phone?.data?.countryCode
    : current_user.phone?.countryCode;
  current_user.phone = req.body?.phone?.formattedValue
    ? req.body?.phone?.formattedValue
    : current_user.phone?.formattedValue;
  // current_user.facebook = req.body?.facebook
  //   ? req.body?.facebook
  //   : current_user.facebook;
  // current_user.instagram = req.body?.instagram
  //   ? req.body?.instagram
  //   : current_user.instagram;
  // current_user.twitter = req.body?.twitter
  //   ? req.body?.twitter
  //   : current_user.twitter;
  // current_user.youtube = req.body?.youtube
  //   ? req.body?.youtube
  //   : current_user.youtube;
  // current_user.snapchat = req.body?.snapchat
  //   ? req.body?.snapchat
  //   : current_user.snapchat;
  // current_user.tiktok = req.body?.tiktok
  //   ? req.body?.tiktok
  //   : current_user.tiktok;
  // current_user.discord = req.body?.discord
  //   ? req.body?.discord
  //   : current_user.discord;
  // current_user.paypal = req.body?.paypal
  //   ? req.body?.paypal
  //   : current_user.paypal;

  await current_user.save();

  let response_data = { user: current_user };
  return apiResponse.successResponse(
    res,
    response_data,
    "User data updated",
    success
  );
});

exports.addProfilePicture = tryCatchAsync(async (req, res) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Unauthorized", unauthorized));
  }
  const decoded_token = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  let current_user = await User.findById(decoded_token.id).select("+password");
  current_user.profile_picture = req.body.url;

  await current_user.save();

  let response_data = { user: current_user };
  return apiResponse.successResponse(res, response_data, "", success);
});

exports.login = tryCatchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    return next(
      new AppError("Email and password field is required", unprocessable)
    );
  }
  if (!email) {
    return next(new AppError("Email  field is required", badRequest));
  }
  if (!password) {
    return next(new AppError("Password  field is required", badRequest));
  }
  const current_user = await User.findOne({ email });
  if (current_user) {
    if (password === current_user.password) {
      // current_user.password = null;
      const token = generateJWT(current_user._id);
      current_user.online = true;
      current_user.save();
      let response_data = { user: current_user, token: token };
      return apiResponse.successResponse(res, response_data, "", success);
    }
    return next(new AppError("password is wrong", unauthorized));
  }
  return next(new AppError("User Not Found", notFound));
});

exports.isLoggedIn = tryCatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Unauthorized", unauthorized));
  }
  const decoded_token = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const logged_in_user = await User.findById(decoded_token.id).select(
    "+passwordChangedAt"
  );
  if (!logged_in_user) return next(new AppError("Unauthorized", unauthorized));
  if (logged_in_user.hasPasswordChanged(decoded_token.iat))
    return next(
      new AppError("Password has been changed, Login again", unauthorized)
    );
  req.user = logged_in_user;
  next();
});

exports.recover = tryCatchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  // setup email data
  let mailOptions = {
    from: "smart@api.animedisney.com",
    to: email,
    subject: "Anime Disney - Recover Your Account",
    text: `Please use this email and password to login.
Email: ${email}
Password: ${user.password}
    `,
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return apiResponse.successResponse(
    res,
    "",
    "Check Your email for recover account",
    success
  );
});

exports.forgotPassword = tryCatchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select([
    "+otp_code",
    "+otp_expiry",
  ]);
  if (!user)
    throw new AppError("User Not Exist against Given Email", badRequest);

  let response_data = {};
  if (user.otp_expiry && new Date() < user.otp_expiry) {
    response_data.expiry_time = Math.round(
      (user.otp_expiry - new Date()) / 1000
    );

    return apiResponse.successResponse(
      res,
      response_data,
      "OTP already Sent Please wait 1 minute to request new reset code",
      success
    );
  }

  const otp_code = Math.floor(100000 + Math.random() * 900000);

  user.otp_code = otp_code;
  user.otp_expiry = new Date();
  user.otp_expiry.setMinutes(user.otp_expiry.getMinutes() + 1);

  await user.save();

  //   sendEmail({ user, template: "forgot-password" });
  await user.save();

  response_data.expiry_time = 59;

  return apiResponse.successResponse(
    res,
    response_data,
    "Check Your email for reset code",
    success
  );
});

exports.verifyOTP = tryCatchAsync(async (req, res, next) => {
  let { email, otp_code } = req.body;

  const user = await User.findOne({ email }).select([
    "+otp_verified",
    "+otp_code",
    "+otp_expiry",
  ]);
  if (!user) throw new AppError("User not exist", notFound);

  if (user.otp_code !== otp_code) throw new AppError("Invalid Code", notFound);
  if (new Date() > user.otp_expiry)
    throw new AppError("Otp Expired", badRequest);

  user.otp_verified = true;
  user.otp_code = undefined;
  user.otp_expiry = undefined;
  await user.save();
  let response_data = {};
  return apiResponse.successResponse(
    res,
    response_data,
    "OTP Verified",
    success
  );
});

exports.resetPassword = tryCatchAsync(async (req, res) => {
  const { email, password } = req.body;

  let current_user = await User.findOne({ email }).select([
    "+password",
    "+otp_verified",
  ]);

  if (!current_user) return next(new AppError("User Not Found", notFound));

  if (current_user.otp_verified === false)
    return next(new AppError("Please Verify Your OTP Code", notFound));

  current_user.password = password;
  current_user.otp_verified = undefined;

  await current_user.save();

  let response_data = {};

  return apiResponse.successResponse(
    res,
    response_data,
    "Password Reset Successfully",
    success
  );
});

exports.delete = tryCatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  let decoded_token;
  if (token) {
    decoded_token = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  }

  const user_id = decoded_token ? decoded_token.id : "";
  const user = await User.findOneAndDelete({ _id: user_id });

  let response_data = {};
  return apiResponse.successResponse(
    res,
    response_data,
    "User deleted",
    success
  );
});

exports.background = tryCatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Unauthorized", unauthorized));
  }
  const decoded_token = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const current_user = await User.findById(decoded_token.id).select(
    "+password"
  );

  current_user.background = req.body.background;
  current_user.property = req.body.property;
  current_user.video = "";

  await current_user.save();

  let response_data = { user: current_user };
  return apiResponse.successResponse(
    res,
    response_data,
    "Background change successfully",
    success
  );
});

exports.video = tryCatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Unauthorized", unauthorized));
  }
  const decoded_token = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const current_user = await User.findById(decoded_token.id).select(
    "+password"
  );
  current_user.property = "";
  current_user.background = "";
  current_user.video = req.body.video;

  await current_user.save();

  let response_data = { user: current_user };
  return apiResponse.successResponse(
    res,
    response_data,
    "Background change successfully",
    success
  );
});

exports.music = tryCatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Unauthorized", unauthorized));
  }
  const decoded_token = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const current_user = await User.findById(decoded_token.id).select(
    "+password"
  );

  current_user.music = req.body.music;

  await current_user.save();

  let response_data = { user: current_user };
  return apiResponse.successResponse(
    res,
    response_data,
    "User data updated",
    success
  );
});

exports.outfit = tryCatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Unauthorized", unauthorized));
  }
  const decoded_token = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const current_user = await User.findById(decoded_token.id).select(
    "+password"
  );

  current_user.outfit = req.body.outfit;

  await current_user.save();

  let response_data = { user: current_user };
  return apiResponse.successResponse(
    res,
    response_data,
    "User data updated",
    success
  );
});

// exports.logout = tryCatchAsync(async (req, res, next) => {
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }
//   if (!token) {
//     return next(new AppError("Unauthorized", unauthorized));
//   }
//   const decoded_token = await promisify(jwt.verify)(
//     token,
//     process.env.JWT_SECRET
//   );
//   const current_user = await User.findById(decoded_token.id).select(
//     "+password"
//   );

//   current_user.online = false;

//   await current_user.save();

//   let response_data = { user: current_user };
//   return apiResponse.successResponse(
//     res,
//     response_data,
//     "User log out",
//     success
//   );
// });
