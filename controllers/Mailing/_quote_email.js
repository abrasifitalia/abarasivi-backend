const mailService = require('./_mailmiddleware');
const quoteClientTemplate = require('../../utils/mailing-templates/_quote_client');
const quoteAdminTemplate = require('../../utils/mailing-templates/_quote_admin');

const sendQuoteEmail = async ({ quoteDetails, articleImage, isAdmin }) => {
  try {
    if (isAdmin) {
      // Send to admin team
      await mailService.sendMail({
        to: ['abrasifitalia2@gmail.com', 'soukra@abrasifitalia.com'],
        subject: `Nouvelle Demande de Devis - ${quoteDetails.name}`,
        html: quoteAdminTemplate(quoteDetails),
        productImage: articleImage
      });
    } else {
      // Send to client
      await mailService.sendMail({
        to: quoteDetails.email,
        subject: 'Confirmation de votre demande de devis',
        html: quoteClientTemplate(quoteDetails),
        productImage: articleImage
      });
    }

    return true;
  } catch (error) {
    console.error('Error in sendQuoteEmail:', error);
    return false;
  }
};

module.exports = sendQuoteEmail;