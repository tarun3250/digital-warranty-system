const Tesseract = require("tesseract.js");
const Bill = require("../models/bill");
const fs = require("fs");

exports.uploadBill = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Run OCR
    const result = await Tesseract.recognize(filePath, "eng");
    const text = result.data.text;
    console.log("===== OCR TEXT START =====");
    console.log(text);
    console.log("===== OCR TEXT END =====");

    // helper
    function extractField(patterns, text) {
      for (let p of patterns) {
        const match = text.match(p);
        if (match) return match[1].trim();
      }
      return null;
    }

    // Product / item name
    const productName = extractField(
      [
        /Product[:\- ]+([A-Za-z0-9 \-\+]+)/i,
        /Item[:\- ]+([A-Za-z0-9 \-\+]+)/i,
        /Model[:\- ]+([A-Za-z0-9 \-\+]+)/i,
        /Description[:\- ]+([A-Za-z0-9 \-\+]+)/i,
      ],
      text
    );

    // Purchase date: supports DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
    let purchaseDateRaw = extractField(
      [
        /Purchase Date[:\- ]+(\d{2}[\/\-.]\d{2}[\/\-.]\d{4})/i,
        /Date[:\- ]+(\d{2}[\/\-.]\d{2}[\/\-.]\d{4})/i,
        /Dated[:\- ]+(\d{2}[\/\-.]\d{2}[\/\-.]\d{4})/i,
      ],
      text
    );

    let parsedDate = null;
    if (purchaseDateRaw) {
      try {
        const [day, month, year] = purchaseDateRaw.split(/[\/\-.]/);
        parsedDate = `${year}-${month}-${day}`; // YYYY-MM-DD
      } catch (e) {
        parsedDate = null;
      }
    }

    // Warranty period: captures "1 year", "2 years", "18 months", "6 Months", "1 Yr", etc.
    const warrantyPeriod = extractField(
      [
        /Warranty[:\- ]+([0-9]+ ?(year|years|yr|yrs))/i,
        /Warranty[:\- ]+([0-9]+ ?(month|months|mon))/i,
        /Wty[:\- ]+([0-9]+ ?(year|years|yr|yrs|month|months|mon))/i,
      ],
      text
    );

    // Store / Seller
    const storeName = extractField(
      [
        /Store[:\- ]+([A-Za-z0-9 &\.,\-]+)/i,
        /Sold By[:\- ]+([A-Za-z0-9 &\.,\-]+)/i,
        /Seller[:\- ]+([A-Za-z0-9 &\.,\-]+)/i,
        /Dealer[:\- ]+([A-Za-z0-9 &\.,\-]+)/i,
        /Shop[:\- ]+([A-Za-z0-9 &\.,\-]+)/i,
      ],
      text
    );

    // Compute expiry date if possible
    let expiryDate = null;
    if (parsedDate && warrantyPeriod) {
      const start = new Date(parsedDate);
      let monthsToAdd = 0;

      const numMatch = warrantyPeriod.match(/([0-9]+)/);
      const num = numMatch ? parseInt(numMatch[1]) : 0;

      if (/year|years|yr|yrs/i.test(warrantyPeriod)) {
        monthsToAdd = num * 12;
      } else if (/month|months|mon/i.test(warrantyPeriod)) {
        monthsToAdd = num;
      }

      if (monthsToAdd > 0 && !isNaN(start.getTime())) {
        start.setMonth(start.getMonth() + monthsToAdd);
        expiryDate = start.toISOString().split("T")[0];
      }
    }

    const savedBill = await Bill.create({
      userId: 1,
      productName,
      purchaseDate: parsedDate,
      warrantyPeriod,
      expiryDate,
      storeName,
      filePath,
    });

    res.json({
      message: "Bill uploaded & OCR processed",
      data: savedBill,
    });
  } catch (err) {
    console.error("Upload/OCR error:", err);
    res.status(500).json({ error: err.message });
  }
};
