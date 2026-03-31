const express = require("express");
const {
  getTickets, getTicketById, createTicket, updateTicket, deleteTicket, addComment,
} = require("../controllers/ticketController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // All ticket routes require login

router.route("/")
  .get(getTickets)
  .post(createTicket);

router.route("/:id")
  .get(getTicketById)
  .put(authorize("admin", "it_staff"), updateTicket)
  .delete(authorize("admin"), deleteTicket);

router.post("/:id/comments", addComment);

module.exports = router;
