const { Op } = require("sequelize");
const db = require("../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/** @type {import('sequelize').ModelStatic<import('../models').User>} */
const User = db.User;
const Artisan = db.Artisan;
const Client = db.Client;

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
      email: existingUser.email
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    const existingUserModel = existingUser.currentRole == "artisan" ? Artisan : Client;

    const roleDetails = await existingUserModel.findOne({
      where: { userId: existingUser.id },
    });

    const safeUser = existingUser.toJSON();
    delete safeUser.password;
    safeUser.roleDetails = roleDetails;
    // delete safeUser.roleDetails.user_id

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      safeUser
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};
