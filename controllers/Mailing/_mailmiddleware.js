const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

class MailService {
  constructor() {
    // Update SMTP configuration for Brevo
    this.transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",  // Fixed host
      port: 587,                     // Fixed port
      secure: false,
      auth: {
        user: process.env.BREVO_ID,
        pass: process.env.BREVO_PWD,
      },
      tls: {
        rejectUnauthorized: false    // Add for production
      }
    });

    // Define email senders for different cases
    this.senders = {
      devis: process.env.BREVO_SENDER_DEVIS,
      auth: process.env.BREVO_SENDER_AUTH,
      contact: process.env.BREVO_SENDER_CONTACT,
      support: process.env.BREVO_SENDER_SUPPORT,
      default: process.env.BREVO_SENDER_DEFAULT
    };
  }

  // Add connection verification method
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Mail server connection verified');
      return true;
    } catch (error) {
      console.error('Mail server connection failed:', error);
      return false;
    }
  }

  // Update sendMail method with better error handling
  async sendMail(options) {
    try {
      // Determine the appropriate sender based on email type
      const sender = this.senders[options.type] || this.senders.default;
      
      const mailOptions = {
        from: `"Abrasif Italia" <${sender}>`,
        ...options,
        attachments: [
          {
            filename: 'logo.png',
            path: path.join(__dirname, '../../public/assets/logo.png'),
            cid: 'logo',
          },
          ...(options.productImage
            ? [
                {
                  filename: 'product-image.png',
                  path: path.join(__dirname, `../../public${options.productImage}`),
                  cid: 'productImage',
                },
              ]
            : []),
          ...(options.attachments || []),
        ],
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      // Log detailed error for debugging in production
      if (error.code === 'ESOCKET') {
        console.error('SMTP Connection Details:', {
          host: this.transporter.options.host,
          port: this.transporter.options.port,
          auth: this.transporter.options.auth.user
        });
      }
      return false;
    }
  }
}

// Create and verify instance
const mailService = new MailService();
mailService.verifyConnection();

module.exports = mailService;