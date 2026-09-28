import express from "express";
import Application from "../models/Application.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const applications = await Application.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(applications);
  } catch {
    res.status(500).json({ message: "Could not fetch applications" });
  }
});

router.post("/", async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      user: req.userId
    });
    res.status(201).json(application);
  } catch {
    res.status(400).json({ message: "Could not create application" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch {
    res.status(400).json({ message: "Could not update application" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted" });
  } catch {
    res.status(400).json({ message: "Could not delete application" });
  }
});

export default router;
