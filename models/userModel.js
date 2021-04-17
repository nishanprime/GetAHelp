import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    currentAddress: {
      type: String,
      required: true,
    },
    userProfile: {
      type: String,
    },
    emergencyNotes: {
      type: Array,
      default: [],
    },
    chronicDiseases: {
      type: Array,
      default: [],
    },
    allergies: {
      type: Array,
      default: [],
    },
    seriousInjuries: {
      type: Array,
      default: [],
    },
    vaccinations: {
      type: Array,
      default: [],
    },
    emergencyContacts: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
