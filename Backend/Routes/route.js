const express = require("express");
const sendMail = require('../Services/emailService');
const Email = require('../model/email');
const UserCredentials = require('../model/userCredentials');
const fetchMail = require('../Services/receiveMail');
const router = express.Router();

router.post('/send-email', async (req, res) => {
  const { userId, to, subject, text } = req.body;
  try {
    await sendMail(userId, to, subject, text);
    res.send('Email sent successfully!');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/signup', async (req, res) => {
  const { userId, password } = req.body;
  try {
    const existing = await UserCredentials.findOne({ userId });
    if (existing) return res.status(400).json({ error: 'User already exists.' });

    const user = new UserCredentials({ userId, password });
    await user.save();
    res.status(201).json({ message: 'User signed up successfully ✅' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed.' });
  }
});

router.post('/login-track', async (req, res) => {
  const { userId } = req.body;
  console.log(`📥 Login detected for: ${userId}`);
  res.send("Login tracked");
});

router.get('/fetch-emails', async (req, res) => {
  const { userId } = req.query;
  try {
    await fetchMail(userId);
    const emails = await Email.find({ to: userId });
    res.json({ message: 'Fetched successfully', emails });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch emails', error: error.message });
  }
});

router.get('/emails', async (req, res) => {
  try {
    const emails = await Email.find();
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/emails/search', async (req, res) => {
  const { query } = req.query;
  try {
    const emails = await Email.find({
      $or: [
        { subject: { $regex: query, $options: 'i' } },
        { text: { $regex: query, $options: 'i' } },
        { to: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/emails/:id/star', async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    email.starred = !email.starred;
    await email.save();
    res.json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/emails/:id/snooze', async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    email.snoozed = !email.snoozed;
    await email.save();
    res.json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/draft-emails', async (req, res) => {
  try {
    const { to, from, subject, text, draft = true } = req.body;
    const email = new Email({ to, from, subject, text, draft });
    await email.save();
    res.status(201).json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/emails/:id/save-draft', async (req, res) => {
  try {
    let email = await Email.findById(req.params.id);
    email.to = req.body.to || email.to;
    email.subject = req.body.subject || email.subject;
    email.text = req.body.text || email.text;
    email.draft = true;
    await email.save();
    res.json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/emails/:id/bin', async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    email.bin = true;
    await email.save();
    res.json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/emails/delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await Email.deleteMany({ _id: { $in: ids }, bin: true });
    res.json({ message: 'Emails permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/emails/:id/delete', async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (email.bin) {
      await Email.findByIdAndDelete(req.params.id);
      res.json({ message: 'Email permanently deleted' });
    } else {
      email.bin = true;
      await email.save();
      res.json({ message: 'Email moved to bin' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/emails/bin', async (req, res) => {
  try {
    const { ids } = req.body;
    await Email.updateMany({ _id: { $in: ids } }, { $set: { bin: true } });
    res.json({ message: 'Emails moved to bin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
