const Ticket = require("../models/Ticket");

/**
 * GET /api/tickets
 * Admins & staff see all tickets; regular users see only their own.
 */
const getTickets = async (req, res) => {
  try {
    const query = req.user.role === "user" ? { reporter: req.user._id } : {};
    const tickets = await Ticket.find(query)
      .populate("reporter", "name email avatar")
      .populate("assignee", "name email avatar")
      .populate("ciId", "name type")
      .sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/tickets/:id
 */
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("reporter", "name email avatar")
      .populate("assignee", "name email avatar")
      .populate("ciId", "name type")
      .populate("comments.user", "name avatar");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/tickets
 */
const createTicket = async (req, res) => {
  try {
    const { title, description, priority, category, ciId } = req.body;
    const ticket = await Ticket.create({
      title, description, priority, category,
      ciId: ciId || null,
      reporter: req.user._id,
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/tickets/:id
 */
const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/tickets/:id
 */
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/tickets/:id/comments
 */
const addComment = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    ticket.comments.push({ user: req.user._id, text: req.body.text });
    await ticket.save();
    await ticket.populate("comments.user", "name avatar");
    res.status(201).json(ticket.comments[ticket.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTickets, getTicketById, createTicket, updateTicket, deleteTicket, addComment };
