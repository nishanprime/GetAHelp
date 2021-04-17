import express from "express";
import {
  addMedicalInformations,
  loginUser,
  registerUser,
  addEmergencyContacts,
  updateUserInfo,
  getUserInfo,
} from "../controllers/userController.js";

const router = express.Router();

//auth
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/addMedicalInformations").post(addMedicalInformations);
router.route("/addEmergencyContacts").post(addEmergencyContacts);
router.route("/updateUserInfo").post(updateUserInfo);
router.route("/:email").get(getUserInfo);

export default router;
