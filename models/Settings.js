import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      default: "Restaurant360 - Main Branch",
    },

    taxRate: {
      type: Number,
      default: 5,
    },

    currency: {
      type: String,
      default: "INR",
    },

    printerEnabled: {
      type: Boolean,
      default: true,
    },

    autoPrintKOT: {
      type: Boolean,
      default: true,
    },

    enableLoyalty: {
      type: Boolean,
      default: true,
    },

    theme: {
      type: String,
      enum: ["dark", "light"],
      default: "dark",
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model(
  "Settings",
  settingsSchema
);

export default Settings;