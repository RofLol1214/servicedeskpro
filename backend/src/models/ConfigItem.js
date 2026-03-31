const mongoose = require("mongoose");

const configItemSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true, trim: true },
    type:   { type: String, enum: ["Application", "Server", "Database", "Cloud Service"], required: true },
    status: { type: String, enum: ["Running", "Degraded", "Down"], default: "Running" },
    owner:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    metadata:      { type: Map, of: String, default: {} },
    relationships: [{ type: mongoose.Schema.Types.ObjectId, ref: "ConfigItem" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ConfigItem", configItemSchema);
