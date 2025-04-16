const nodemailer = require('nodemailer');
const demandeDevisTemplate = require('../../utils/mailing-templates/_demande_devis');
const demandeDevisSalesTemplate = require('../../utils/mailing-templates/_demande_devis_sales'); // Import sales team template
const path = require('path');
require('dotenv').config();

const sendDemandeDevisEmail = async (orderDetails) => {
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT,
    secure: false,
    auth: {
      user: process.env.BREVO_ID,
      pass: process.env.BREVO_PWD,
    },
  });

  // Debugging: Log orderDetails
  console.log('Sending email with orderDetails:', orderDetails);

  if (!orderDetails.email) {
    console.error('Error: No recipient email defined for client.');
    return;
  }

  const mailOptionsClient = {
    from: `"Abrasif Italia" <${process.env.BREVO_SENDER_DEVIS}>`,
    to: orderDetails.email,
    subject: 'Votre Demande de Devis',
    html: demandeDevisTemplate(orderDetails),
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../../public/assets/logo.png'),
        cid: 'logo',
      },
      ...(orderDetails.productImage
        ? [
            {
              filename: 'product-image.png',
              path: path.join(__dirname, `../../public${orderDetails.productImage}`), // Fixed path
              cid: 'productImage',
            },
          ]
        : []), // Attach product image only if it exists
    ],
  };

  const mailOptionsCompany = {
    from: `"Abrasif Italia" <${process.env.BREVO_SENDER_DEVIS}>`,
    to: 'abrasifitalia2@gmail.com',
    subject: `Nouvelle Demande de Devis - ${orderDetails.name}`,
    html: demandeDevisSalesTemplate(orderDetails), // Use sales team template
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../../public/assets/logo.png'),
        cid: 'logo',
      },
      ...(orderDetails.productImage
        ? [
            {
              filename: 'product-image.png',
              path: path.join(__dirname, `../../public${orderDetails.productImage}`), // Fixed path
              cid: 'productImage',
            },
          ]
        : []), // Attach product image only if it exists
    ],
  };

  try {
    // Send email to client
    await transporter.sendMail(mailOptionsClient);
    console.log('Demande de devis email sent to client successfully.');

    // Send email to company sales team
    await transporter.sendMail(mailOptionsCompany);
    console.log('Demande de devis email sent to company sales team successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendDemandeDevisEmail;
