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
  }

  async sendMail(options) {
    try {
      const mailOptions = {
        from: `"Abrasif Italia" <${process.env.BREVO_SENDER_DEVIS}>`,
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