const Asset = require("../models/Asset");

/** GET /api/assets */
const getAssets = async (req, res) => {
  try {
    const { type, status, search } = req.query;
    const query = {};
    if (type)   query.type   = type;
    if (status) query.status = status;
    if (search) query.name   = { $regex: search, $options: "i" };

    const assets = await Asset.find(query)
      .populate("assignedTo", "name email avatar")
      .sort({ createdAt: -1 });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** GET /api/assets/:id */
const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("assignedTo", "name email avatar");
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** POST /api/assets */
const createAsset = async (req, res) => {
  try {
    const asset = await Asset.create(req.body);
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** PUT /api/assets/:id */
const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    ).populate("assignedTo", "name email avatar");
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** DELETE /api/assets/:id */
const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json({ message: "Asset deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** POST /api/assets/:id/assign */
const assignAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.userId, status: "Active" },
      { new: true }
    ).populate("assignedTo", "name email avatar");
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** GET /api/assets/stats */
const getAssetStats = async (req, res) => {
  try {
    const total      = await Asset.countDocuments();
    const active     = await Asset.countDocuments({ status: "Active" });
    const inRepair   = await Asset.countDocuments({ status: "In Repair" });
    const retired    = await Asset.countDocuments({ status: "Retired" });
    const inStock    = await Asset.countDocuments({ status: "In Stock" });

    // Assets with warranty expiring in 30 days
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    const warrantyExpiring = await Asset.countDocuments({
      warrantyExpiry: { $lte: thirtyDays, $gte: new Date() },
    });

    // Total value
    const valueResult = await Asset.aggregate([
      { $group: { _id: null, total: { $sum: "$purchaseCost" } } }
    ]);
    const totalValue = valueResult[0]?.total || 0;

    // By type breakdown
    const byType = await Asset.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    res.json({ total, active, inRepair, retired, inStock, warrantyExpiring, totalValue, byType });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAssets, getAssetById, createAsset, updateAsset, deleteAsset, assignAsset, getAssetStats };