import * as Yup from "yup";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";

//models imports
import User from "../models/userModel.js";

// @desc    Register a new user
// @route   POST /users/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email } = req.body;

  const schema = Yup.object().shape({
    name: Yup.string().required("Name is a required field"),
    email: Yup.string().required("Email is a required field"),
  });

  try {
    await schema.validate(
      {
        name,
        email,
      },
      { abortEarly: false }
    );

    let userExists = await User.findOne({
      email,
    });

    if (userExists) {
      return res.status(400).json({
        errors: ["User with this email already registered!"],
      });
    }
    let password = crypto.randomBytes(8);

    const user = await User.create({
      name,
      email,
      password: password.toString("hex"),
    });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    //yup error catch here
    if (err.errors) {
      return res
        .status(400)
        .json({ errors: [err.errors || "Validation Error"] });
    }

    return res.status(500).json({
      errors: ["Internal Server Error"],
    });
  }
};

// @desc    Login user
// @route   POST /users/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const schema = Yup.object().shape({
    email: Yup.string().required("Email is a required field"),
    password: Yup.string().required("Password is a required field"),
  });

  try {
    await schema.validate(
      {
        email,
        password,
      },
      { abortEarly: false }
    );

    let user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        errors: ["Invalid email or password !"],
      });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({
        errors: ["Invalid email or password !"],
      });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    //yup error catch here
    if (err.errors) {
      return res
        .status(400)
        .json({ errors: [err.errors || "Validation Error"] });
    }

    return res.status(500).json({
      errors: ["Internal Server Error"],
    });
  }
};
