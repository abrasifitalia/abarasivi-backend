const mailService = require('./_mailmiddleware');
const demandeDevisTemplate = require('../../utils/mailing-templates/_demande_devis');
const demandeDevisSalesTemplate = require('../../utils/mailing-templates/_demande_devis_sales');

const sendDemandeDevisEmail = async (orderDetails) => {
  try {
    if (!orderDetails.email) {
      throw new Error('No recipient email defined for client.');
    }

    // Send to client
    await mailService.sendMail({
      to: orderDetails.email,
      subject: 'Votre Demande de Devis',
      html: demandeDevisTemplate(orderDetails),
      productImage: orderDetails.productImage
    });

    // Send to sales team
    await mailService.sendMail({
      to: ['abrasifitalia2@gmail.com', 'soukra@abrasifitalia.com'],
      subject: `Nouvelle Demande de Devis - ${orderDetails.name}`,
      html: demandeDevisSalesTemplate(orderDetails),
      productImage: orderDetails.productImage
    });

    return true;
  } catch (error) {
    console.error('Error in sendDemandeDevisEmail:', error);
    return false;
  }
};

module.exports = sendDemandeDevisEmail;
