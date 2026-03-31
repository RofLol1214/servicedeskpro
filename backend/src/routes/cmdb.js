const express = require("express");
const {
  getCIs, getCIById, createCI, updateCI, deleteCI, addRelationship, getImpact,
} = require("../controllers/cmdbController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getCIs)
  .post(authorize("admin", "it_staff"), createCI);

router.post("/relationship", authorize("admin", "it_staff"), addRelationship);

router.route("/:id")
  .get(getCIById)
  .put(authorize("admin", "it_staff"), updateCI)
  .delete(authorize("admin"), deleteCI);

router.get("/:id/impact", getImpact);

module.exports = router;
