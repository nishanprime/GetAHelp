import express from "express";
import {
  addMedicalInformations,
  loginUser,
  registerUser,
  addEmergencyContacts,
  updateUserInfo,
} from "../controllers/userController.js";

const router = express.Router();

//auth
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/addMedicalInformations").post(addMedicalInformations);
router.route("/addEmergencyContacts").post(addEmergencyContacts);
router.route("/updateUserInfo").post(updateUserInfo);

export default router;
