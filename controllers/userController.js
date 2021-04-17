import * as Yup from "yup";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

//models imports
import User from "../models/userModel.js";

export const registerUser = async (req, res) => {
  const { name, email, password, currentAddress, bloodGroup } = req.body;

  const schema = Yup.object().shape({
    name: Yup.string().required("Name is a required field"),
    email: Yup.string().required("Email is a required field"),
    currentAddress: Yup.string().required(
      "Current Address is a required field"
    ),
    bloodGroup: Yup.string().required("BloodGroup is a required field"),
  });

  try {
    await schema.validate(
      {
        name,
        email,
        password,
        currentAddress,
        bloodGroup,
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

    const user = await User.create({
      name,
      email,
      password,
      currentAddress,
      bloodGroup,
    });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currentAddress: user.currentAddress,
        bloodGroup: user.bloodGroup,
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
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
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

export const addMedicalInformations = async (req, res) => {
  const {
    chronicDiseases,
    allergies,
    seriousInjuries,
    vaccinations,
    email,
  } = req.body;

  try {
    let user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        errors: ["User doesnot exist with this email!"],
      });
    }

    if (chronicDiseases) {
      user.chronicDiseases = user.chronicDiseases.concat(chronicDiseases);
    }

    if (allergies) {
      user.allergies = user.allergies.concat(allergies);
    }

    if (seriousInjuries) {
      user.seriousInjuries = user.seriousInjuries.concat(seriousInjuries);
    }

    if (vaccinations) {
      user.vaccinations = user.vaccinations.concat(vaccinations);
    }

    await user.save();

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currentAddress: user.currentAddress,
        bloodGroup: user.bloodGroup,
        chronicDiseases: user.chronicDiseases,
        allergies: user.allergies,
        seriousInjuries: user.seriousInjuries,
        vaccinations: user.vaccinations,
        emergencyContacts: user.emergencyContacts,
      },
    });
  } catch (err) {
    console.log("calling after catching:");
    console.log(err);
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

export const addEmergencyContacts = async (req, res) => {
  const { emergencyContacts, email } = req.body;

  try {
    let user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        errors: ["User doesnot exist with this email!"],
      });
    }

    if (emergencyContacts) {
      user.emergencyContacts = user.emergencyContacts.concat(emergencyContacts);
    }

    await user.save();

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currentAddress: user.currentAddress,
        bloodGroup: user.bloodGroup,
        chronicDiseases: user.chronicDiseases,
        allergies: user.allergies,
        seriousInjuries: user.seriousInjuries,
        vaccinations: user.vaccinations,
        emergencyContacts: user.emergencyContacts,
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

export const updateUserInfo = async (req, res) => {
  const {
    name,
    email,
    bloodGroup,
    address,
    emergencyNotes,
    userProfile,
  } = req.body;

  try {
    let user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        errors: ["User doesnot exist with this email!"],
      });
    }

    if (name) {
      user.name = user.name;
    }

    if (bloodGroup) {
      user.bloodGroup = user.bloodGroup;
    }

    if (address) {
      user.address = user.address;
    }

    if (userProfile) {
      user.userProfile = user.userProfile;
    }

    if (emergencyNotes) {
      user.emergencyNotes = user.emergencyNotes.concat(emergencyNotes);
    }

    await user.save();

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currentAddress: user.currentAddress,
        bloodGroup: user.bloodGroup,
        chronicDiseases: user.chronicDiseases,
        allergies: user.allergies,
        seriousInjuries: user.seriousInjuries,
        vaccinations: user.vaccinations,
        emergencyContacts: user.emergencyContacts,
        emergencyNotes: user.emergencyNotes,
      },
    });
  } catch (err) {
    console.log("calling after catching:");
    console.log(err);
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
