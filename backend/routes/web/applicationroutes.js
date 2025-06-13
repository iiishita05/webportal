const express = require("express");
const router = express.Router();
const Application = require("../../models/web/Application");
const verifyrole = require("../../middleware/verifyrole");
const { v4: uuidv4 } = require("uuid");


router.post("/", verifyrole(["employee", "grouphead"]), async (req, res) => {
  try {
    const { subject, body } = req.body;
    const senderId = req.user._id;
    const senderRole = req.user.role;

    if (!subject || !body) {
      return res.status(400).json({ message: "Subject and body are required" });
    }

    const currentHandler = req.user.reportingTo;
    if (!currentHandler) {
      return res.status(400).json({ message: "No reporting authority found" });
    }
const status =
  senderRole === "grouphead" ? "Pending Head Approval" : "Pending Group Head";

    const application = new Application({
      applicationId: uuidv4(),
      subject,
      body,
      sender: senderId,
      senderRole,
      currentHandler,
      status,
      history: [
        {
          actor: senderId,
          role: senderRole,
          action: "created",
          date: new Date(),
        },
      ],
    });

    await application.save();
    res.status(201).json({ message: "Application submitted" });
  } catch (err) {
    console.error("Server error while saving application:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/forward", verifyrole(["grouphead"]), async (req, res) => {
  try {
    const appId = req.params.id;
    const groupHeadId = req.user._id;
    const headId = req.user.reportingTo;

    if (!headId) {
      return res.status(400).json({ message: "No reporting Head found" });
    }

    const application = await Application.findById(appId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.currentHandler.toString() !== groupHeadId.toString()) {
      return res.status(403).json({ message: "Not assigned to you" });
    }

    if (application.status !== "Pending Group Head") {
      return res
        .status(400)
        .json({ message: "Application not in a forwardable state" });
    }

    application.currentHandler = headId;
    application.status = "Pending Head Approval";

    if (!application.history) application.history = [];

    application.history.push({
      actor: groupHeadId,
      role: "grouphead",
      action: "forwarded to head",
      remark: "Forwarded by group head",
      date: new Date(),
    });

    await application.save();

    res.status(200).json({ message: "Application forwarded", application });
  } catch (err) {
    console.error("Forward Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.patch(
  "/:id/decision",
  verifyrole(["grouphead", "head"]),
  async (req, res) => {
    try {
      const appId = req.params.id;
      const { action, remark } = req.body;
      const userId = req.user._id;
      const userRole = req.user.role;

      

      const application = await Application.findById(appId);
      if (!application)
        return res.status(404).json({ message: "Application not found" });

      if (application.currentHandler.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Not assigned to you" });
      }

      if (
        userRole === "grouphead" &&
        application.status === "Pending Group Head"
      ) {
        if (action !== "reject") {
          return res
            .status(403)
            .json({ message: "Group Head can only reject" });
        }

        application.status = "rejected";
        application.currentHandler = userId; 

        application.history.push({
          actor: userId,
          role: userRole,
          action: "rejected",
          remark,
          date: new Date(),
        });

        await application.save();
        return res
          .status(200)
          .json({ message: "Application rejected", application });
      }

      if (
        userRole === "head" &&
        application.status === "Pending Head Approval"
      ) {
        if (action === "approve") {
          application.status = "approved";
        } else if (action === "reject") {
          application.status = "rejected";
        } else {
          return res.status(400).json({ message: "Invalid action" });
        }

        application.currentHandler = userId; 

        application.history.push({
          actor: userId,
          role: "head",
          action,
          remark,
          date: new Date(),
        });

        await application.save();
        return res
          .status(200)
          .json({ message: `Application ${action}ed`, application });
      }

      return res
        .status(403)
        .json({ message: "You are not allowed to perform this action" });
    } catch (err) {
      console.error("Decision route error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
router.patch("/:id/decision", verifyrole(["grouphead", "head"]), async (req, res) => {
  try {
    const appId = req.params.id;
    const { action, remark } = req.body;
    const actorId = req.user._id;
    const actorRole = req.user.role;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const application = await Application.findById(appId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.currentHandler.toString() !== actorId.toString()) {
      return res.status(403).json({ message: "Not assigned to you" });
    }

    const validStatuses = {
      grouphead: "Pending Group Head",
      head: "Pending Head Approval"
    };

    if (application.status !== validStatuses[actorRole]) {
      return res.status(400).json({ message: `Not in valid state for ${actorRole}` });
    }

    application.status = action === "approve" ? "Approved" : "Rejected";
    application.history.push({
      actor: actorId,
      role: actorRole,
      action,
      remark,
      date: new Date()
    });

    await application.save();
    res.status(200).json({ message: `Application ${action}ed` });
  } catch (err) {
    console.error("Decision Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.get(
  "/mine",
  verifyrole(["employee", "grouphead", "head"]),
  async (req, res) => {
    try {
      const apps = await Application.find({ sender: req.user._id })
        .sort({ createdAt: -1 })
        .populate("sender", "name");
      res.json(apps);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/assigned", verifyrole(["grouphead", "head"]), async (req, res) => {
  try {
    const apps = await Application.find({ currentHandler: req.user._id })
      .sort({ createdAt: -1 })
      .populate("sender", "name"); 
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



router.get(
  "/:id",
  verifyrole(["employee", "grouphead", "head"]),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const userRole = req.user.role;

      const application = await Application.findById(req.params.id)
        .populate("sender", "name role")
        .populate("currentHandler", "name role")
        .populate("history.actor", "name role");

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      
      const isSender =
        application.sender?._id?.toString() === userId.toString();
      const isCurrentHandler =
        application.currentHandler?._id?.toString() === userId.toString();
      const wasInvolvedBefore = application.history?.some(
        (entry) => entry.actor?.toString() === userId.toString()
      );

      if (
        isSender ||
        isCurrentHandler ||
        wasInvolvedBefore ||
        userRole === "head"
      ) {
        return res.json(application);
      }

      return res.status(403).json({ message: "Access denied" });
    } catch (err) {
      console.error("Error fetching application:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);



module.exports = router;
