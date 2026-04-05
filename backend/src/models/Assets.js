const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    type:         { 
      type: String, 
      enum: ["Laptop", "Desktop", "Monitor", "Peripheral", "Server", 
             "Network Equipment", "Software License", "Mobile Device"],
      required: true 
    },
    status:       { 
      type: String, 
      enum: ["Active", "In Repair", "Retired", "Disposed", "In Stock"],
      default: "Active" 
    },
    assetTag:     { type: String, unique: true, sparse: true },
    serialNumber: { type: String },
    assignedTo:   { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    department:   { type: String },
    location:     { type: String },
    purchaseCost: { type: Number, default: 0 },
    purchaseDate: { type: Date },
    warrantyExpiry: { type: Date },
    vendor:       { type: String },
    notes:        { type: String },
    metadata:     { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", assetSchema);