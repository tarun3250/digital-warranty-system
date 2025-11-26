const express = require("express");
const upload = require("../middleware/upload");
const { uploadBill } = require("../controllers/billController");
const Bill = require("../models/bill"); // make sure this matches: 'bill.js'

const router = express.Router();

// Upload bill

router.post("/upload", upload.single("file"), uploadBill);


// Get all bills
router.get("/all", async (req, res) => {
  try {
    const bills = await Bill.findAll();
    res.json(bills);
  } catch (err) {
    console.error("Error fetching bills:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get one bill by ID
router.get("/:id", async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.json(bill);
  } catch (err) {
    console.error("Error fetching bill:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete bill
router.delete("/delete/:id", async (req, res) => {
  try {
    await Bill.destroy({ where: { id: req.params.id } });
    res.json({ message: "Bill deleted successfully" });
  } catch (err) {
    console.error("Error deleting bill:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
