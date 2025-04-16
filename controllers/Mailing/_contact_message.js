const nodemailer = require('nodemailer');
const contactMessageClientTemplate = require('../../utils/mailing-templates/_contact_message_client');
const contactMessageSalesTemplate = require('../../utils/mailing-templates/_contact_message_sales');
const path = require('path');
require('dotenv').config();

const sendContactMessageEmail = async (messageDetails) => {
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT,
    secure: false,
    auth: {
      user: process.env.BREVO_ID,
      pass: process.env.BREVO_PWD,
    },
  });

  const mailOptionsClient = {
    from: `"Abrasif Italia" <${process.env.BREVO_SENDER_DEVIS}>`,
    to: messageDetails.email,
    subject: 'Confirmation de votre message',
    html: contactMessageClientTemplate(messageDetails),
  };

  const mailOptionsSales = {
    from: `"Abrasif Italia" <${process.env.BREVO_SENDER_DEVIS}>`,
    to: 'support@abrasifitalia.com',
    subject: `Nouveau Message de Contact - ${messageDetails.nom}`,
    html: contactMessageSalesTemplate(messageDetails),
  };

  try {
    // Send email to client
    await transporter.sendMail(mailOptionsClient);
    console.log('Contact message email sent to client successfully.');

    // Send email to sales team
    await transporter.sendMail(mailOptionsSales);
    console.log('Contact message email sent to sales team successfully.');
  } catch (error) {
    console.error('Error sending contact message email:', error);
  }
};

module.exports = sendContactMessageEmail;
