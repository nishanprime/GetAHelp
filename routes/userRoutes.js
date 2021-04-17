import express from "express";
import {
  addMedicalInformations,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

const router = express.Router();

//auth
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/addMedicalInformations").post(addMedicalInformations);

export default router;
