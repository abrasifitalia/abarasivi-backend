const mailService = require('./_mailmiddleware');
const onboardingTemplate = require('../../utils/mailing-templates/_onboarding');
const Article = require('../../models/Article');

const sendOnboardingEmail = async (clientDetails) => {
  try {
    if (!clientDetails.email) {
      throw new Error('Email is required for sending onboarding email');
    }

    // Fetch featured products
    const featuredProducts = await Article.find()
      .select('name image description')
      .limit(3);

    await mailService.sendMail({
      type: 'auth',
      to: clientDetails.email,
      subject: 'Bienvenue chez Abrasif Italia',
      html: onboardingTemplate({
        ...clientDetails,
        featuredProducts
      }),
      productImage: featuredProducts[0]?.image
    });

    return true;
  } catch (error) {
    console.error('Error sending onboarding email:', error);
    return false;
  }
};

module.exports = sendOnboardingEmail;