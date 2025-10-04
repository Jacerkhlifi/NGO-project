import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contact.ragogekanz@gmail.com',
    pass: 'irbp fzgl jvys vxgr'
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    // Email to organization
    await transporter.sendMail({
      from: 'contact.ragogekanz@gmail.com',
      to: 'jacerk15@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    // Thank you email to user
    await transporter.sendMail({
      from: 'contact.ragogekanz@gmail.com',
      to: email,
      subject: 'Thank you for contacting Ragoge El Kanz',
      html: `
        <h3>Thank you for reaching out to Ragoge El Kanz</h3>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Thank you for your interest in our clean water initiatives in Tunisia.</p>
        <br>
        <p>Best regards,</p>
        <p>The Ragoge El Kanz Team</p>
      `
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});