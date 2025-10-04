const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  console.log('Contact function called');
  console.log('Method:', event.httpMethod);
  console.log('Body:', event.body);

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Please provide all required fields' })
      };
    }

    // Email transporter setup - EXACT same as server.js
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: 'contact.ragogekanz@gmail.com',
        pass: 'irbp fzgl jvys vxgr'
      }
    });

    // Email to organization - EXACT same as server.js
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

    // Thank you email to user - EXACT same as server.js
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully' 
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message
      })
    };
  }
};