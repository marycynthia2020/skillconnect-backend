const { Op } = require("sequelize");
const {User, Artisan, Client, RefreshToken, RevokedToken} = require("../models")
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;


async function register(req, res, next) {
  const { firstName, lastName, email, phoneNumber, password, currentRole } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !password ||
    !currentRole
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const requestSchema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    phoneNumber: Joi.string()
      .pattern(/^\+234[7-9][0-9]{9}$/)
      .required()
      .messages({
        "string.pattern.base": "Enter a valid phone number",
      }),
    password: Joi.string()
      .min(4)
      .max(30)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|:;'"<>,.?/])\S+$/,
        "strong password"
      )
      .required()
      .messages({
        "string.pattern.name":
          "Password must include at least one lowercase letter, uppercase letter, number, and special character, and contain no spaces.",
      }),
    currentRole: Joi.string()
      .valid("artisan", "client")
      .default("client")
      .required(),
  });

  const { error } = requestSchema.validate(req.body, {
    abortEarly: true,
  });
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.details[0].message,
    });
  }

  try {
    const existigUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
    });

    if (existigUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email or phone number already exist",
      });
    }

    const hashedPasswword = await bcrypt.hash(password, 10);
    const newUser = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPasswword,
      currentRole,
    };
    const createdUser = await User.create(newUser);

    const UserRole = currentRole == "artisan" ? Artisan : Client;
    await UserRole.create({ userId: createdUser.id });
    return res.status(201).json({
      success: true,
      message: "User registration succesful",
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const loginSchema = Joi.object({
    user: Joi.alternatives()
      .try(
        Joi.string()
          .email({ minDomainSegments: 2 })
          .messages({ "string.email": "Enter a valid email address" }),
        Joi.string()
          .pattern(/^\+234[7-9][0-9]{9}$/)
          .messages({ "string.pattern.base": "Enter a valid phone number" })
      )
      .required()
      .messages({
        "any.required": "Email or phone number is required",
        "alternatives.match": "Enter a valid email or phone number",
      }),

    password: Joi.string()
      .min(4)
      .max(30)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|:;'"<>,.?/])\S+$/,
        "strong password"
      )
      .required()
      .messages({
        "string.pattern.name":
          "Password must include at least one lowercase letter, uppercase letter, number, and special character, and contain no spaces.",
        "string.empty": "Password is required",
      }),
  });

  const { error } = loginSchema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.details[0].message,
    });
  }

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: user }, { phoneNumber: user }],
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "No user with this details found",
      });
    }

    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Incorrect user password",
      });
    }
    const payload = {
      id: existingUser.id,
      email: existingUser.email,
    };
    const accessToken = jwt.sign(payload, secretKey, {
      expiresIn: "24hr",
    });

    const refreshToken = jwt.sign(payload, secretKey, {
      expiresIn: "7d",
    });
    const decodedRefreshToken = jwt.verify(refreshToken, secretKey);
    const expiresAt = new Date(decodedRefreshToken.exp * 1000);

    await RefreshToken.create({
      userId: existingUser.id,
      token: refreshToken,
      expiresAt,
    });
    const existingUserModel =
      existingUser.currentRole == "artisan" ? Artisan : Client;

    const roleDetails = await existingUserModel.findOne({
      where: { userId: existingUser.id },
    });

    const userDetails = existingUser.toJSON();
    delete userDetails.password;

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      accessToken,
      refreshToken,
      userDetails,
      roleDetails,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function logout(req, res, next) {
  const { refreshToken } = req.body;
  let decodedRefreshToken;
  let decodedAccessToken;

  if (!refreshToken || typeof refreshToken !== "string") {
    return res.status(400).json({
      success: false,
      message: "Refresh token is required and must be a string",
    });
  }
  try {
    const refreshTokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken },
    });

    if (!refreshTokenRecord) {
      return res.status(404).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    decodedRefreshToken = jwt.verify(refreshToken, secretKey);

    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken || typeof accessToken !== "string") {
      return res.status(400).json({
        success: false,
        message: "Access token is required and must be a string",
      });
    }

    decodedAccessToken = jwt.verify(accessToken, secretKey);
    const expiresAt = new Date(decodedAccessToken.exp * 1000);

    if (decodedAccessToken.id !== decodedRefreshToken.id) {
      return res.status(403).json({
        success: false,
        message: "Token mismatch",
      });
    }

    await refreshTokenRecord.destroy();
    await RevokedToken.create({
      token: accessToken,
      expiresAt,
    });

    return res.status(200).json({
      success: true,
      message: "Logout succesful",
    });
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  const { refreshToken } = req.body;

  if (!refreshToken || typeof refreshToken !== "string") {
    return res.status(400).json({
      success: false,
      message: "Refresh token is required and must be a string",
    });
  }
  try {
    const refreshTokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken },
    });

    if (!refreshTokenRecord) {
      return res.status(404).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    if (refreshTokenRecord.expiresAt < new Date()) {
      await refreshTokenRecord.destroy();
      return res.status(401).json({
        success: false,
        message: "Expired token",
      });
    }

    const decodedRefreshToken = jwt.verify(refreshToken, secretKey);
    const payload = {
      userId: decodedRefreshToken.id,
      email: decodedRefreshToken.email,
    };
    const accessToken = jwt.sign(payload, secretKey, {
      expiresIn: "15m",
    });
    return res.status(200).json({
      success: true,
      message: "Token succesfully generated",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  refresh,
};
