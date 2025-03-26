const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["Owner", "Bank", "Govt", "Admin"], 
    required: true 
  },
  passwordHash: { type: String, required: function() { return this.role !== "Owner"; } },
  aadhaarNumber: { type: String, unique: true, required: function() { return this.role === "Owner"; } },
  govtID: { type: String, unique: true, required: function() { return this.role === "Govt"; } },
  bankID: { type: String, unique: true, required: function() { return this.role === "Bank"; } },
  kycVerified: { type: Boolean, default: false },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
