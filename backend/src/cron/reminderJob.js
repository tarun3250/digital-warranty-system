const cron = require("node-cron");
const { sendReminderEmail } = require("../utils/email");
const Bill = require("../models/bill");
const User = require("../models/Users");

// runs every morning at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Running warranty reminder cron job...");

  const bills = await Bill.findAll({ include: [User] });

  bills.forEach(async (bill) => {
    if (!bill.expiryDate) return;

    const today = new Date();
    const exp = new Date(bill.expiryDate);

    const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));

    let subject = "";
    let message = "";

    if (diff === 7) {
      subject = `⏳ Warranty expires in 7 days: ${bill.productName}`;
      message = `<p>Your product <strong>${bill.productName}</strong> will expire in <b>7 days</b>.</p>`;
    }

    if (diff === 3) {
      subject = `⚠️ Warranty expires in 3 days`;
      message = `<p>Your product <strong>${bill.productName}</strong> will expire in <b>3 days</b>.</p>`;
    }

    if (diff === 1) {
      subject = `🚨 Warranty expires tomorrow!`;
      message = `<p>Your product <strong>${bill.productName}</strong> expires <b>tomorrow</b>.</p>`;
    }

    if (diff === 0) {
      subject = `❗ Warranty expires TODAY!`;
      message = `<p>Your product <strong>${bill.productName}</strong> expires <b>today</b>.</p>`;
    }

    if (subject) {
      await sendReminderEmail(bill.User.email, subject, message);
    }
  });
});
