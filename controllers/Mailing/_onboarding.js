const mailService = require('./_mailmiddleware');
const onboardingTemplate = require('../../utils/mailing-templates/_onboarding');

const sendOnboardingEmail = async (clientDetails) => {
  try {
    if (!clientDetails.email) {
      throw new Error('Email is required for sending onboarding email');
    }

    await mailService.sendMail({
      to: clientDetails.email,
      subject: 'Bienvenue chez Abrasif Italia',
      html: onboardingTemplate(clientDetails)
    });

    console.log(`Onboarding email sent successfully to ${clientDetails.email}`);
    return true;
  } catch (error) {
    console.error('Error sending onboarding email:', error);
    return false;
  }
};

module.exports = sendOnboardingEmail;