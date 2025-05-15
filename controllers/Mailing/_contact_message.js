const mailService = require('./_mailmiddleware');
const contactMessageClientTemplate = require('../../utils/mailing-templates/_contact_message_client');
const contactMessageSalesTemplate = require('../../utils/mailing-templates/_contact_message_sales');

const sendContactMessageEmail = async (messageDetails) => {
  try {
    // Send to client
    await mailService.sendMail({
      to: messageDetails.email,
      subject: 'Confirmation de votre message',
      html: contactMessageClientTemplate(messageDetails)
    });

    // Send to sales team
    await mailService.sendMail({
      to: ['abrasifitalia2@gmail.com', 'soukra@abrasifitalia.com'],
      subject: `Nouveau Message de Contact - ${messageDetails.nom}`,
      html: contactMessageSalesTemplate(messageDetails)
    });

    return true;
  } catch (error) {
    console.error('Error in sendContactMessageEmail:', error);
    return false;
  }
};

module.exports = sendContactMessageEmail;
