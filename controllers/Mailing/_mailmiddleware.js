const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: process.env.BREVO_PORT,
      secure: false,
      auth: {
        user: process.env.BREVO_ID,
        pass: process.env.BREVO_PWD,
      },
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

      // Log email attempt (remove in production)
      console.log(`Sending ${options.type || 'default'} email from: ${sender}`);

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}

module.exports = new MailService();