const express = require("express");
const {
  getAssets, getAssetById, createAsset,
  updateAsset, deleteAsset, assignAsset, getAssetStats,
} = require("../controllers/assetController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/stats", getAssetStats);

router.route("/")
  .get(getAssets)
  .post(authorize("admin", "it_staff"), createAsset);

router.route("/:id")
  .get(getAssetById)
  .put(authorize("admin", "it_staff"), updateAsset)
  .delete(authorize("admin"), deleteAsset);

router.post("/:id/assign", authorize("admin", "it_staff"), assignAsset);

module.exports = router;