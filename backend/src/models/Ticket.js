const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const slaSchema = new mongoose.Schema({
  responseTarget:   { type: Number, default: 4  },   // hours
  resolutionTarget: { type: Number, default: 24 },   // hours
  breached:         { type: Boolean, default: false },
});

const ticketSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    priority:    { type: String, enum: ["Critical", "High", "Medium", "Low"], default: "Medium" },
    category:    { type: String, enum: ["Incident", "Service Request", "Change Request", "Problem"], default: "Incident" },
    status:      { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
    reporter:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignee:    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    ciId:        { type: mongoose.Schema.Types.ObjectId, ref: "ConfigItem", default: null },
    sla:         { type: slaSchema, default: () => ({}) },
    comments:    [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
