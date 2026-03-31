const ConfigItem = require("../models/ConfigItem");

/**
 * GET /api/cmdb
 */
const getCIs = async (req, res) => {
  try {
    const cis = await ConfigItem.find()
      .populate("owner", "name email")
      .populate("relationships", "name type status");
    res.json(cis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/cmdb/:id
 */
const getCIById = async (req, res) => {
  try {
    const ci = await ConfigItem.findById(req.params.id)
      .populate("owner", "name email")
      .populate("relationships", "name type status");
    if (!ci) return res.status(404).json({ message: "CI not found" });
    res.json(ci);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/cmdb
 */
const createCI = async (req, res) => {
  try {
    const ci = await ConfigItem.create({ ...req.body, owner: req.user._id });
    res.status(201).json(ci);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/cmdb/:id
 */
const updateCI = async (req, res) => {
  try {
    const ci = await ConfigItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ci) return res.status(404).json({ message: "CI not found" });
    res.json(ci);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/cmdb/:id
 */
const deleteCI = async (req, res) => {
  try {
    const ci = await ConfigItem.findByIdAndDelete(req.params.id);
    if (!ci) return res.status(404).json({ message: "CI not found" });
    res.json({ message: "CI deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/cmdb/relationship
 * Body: { fromId, toId }
 */
const addRelationship = async (req, res) => {
  try {
    const { fromId, toId } = req.body;
    const ci = await ConfigItem.findById(fromId);
    if (!ci) return res.status(404).json({ message: "Source CI not found" });
    if (!ci.relationships.includes(toId)) {
      ci.relationships.push(toId);
      await ci.save();
    }
    res.json(ci);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/cmdb/:id/impact
 * BFS traversal to find all CIs impacted if this CI goes down.
 */
const getImpact = async (req, res) => {
  try {
    const allCIs = await ConfigItem.find();
    const ciMap  = Object.fromEntries(allCIs.map((c) => [c._id.toString(), c]));
    const visited = new Set();
    const queue   = [req.params.id];

    while (queue.length) {
      const id = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      allCIs.forEach((c) => {
        if (c.relationships.map((r) => r.toString()).includes(id) && !visited.has(c._id.toString())) {
          queue.push(c._id.toString());
        }
      });
    }

    visited.delete(req.params.id);
    const impacted = [...visited].map((id) => ciMap[id]).filter(Boolean);
    res.json(impacted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCIs, getCIById, createCI, updateCI, deleteCI, addRelationship, getImpact };
