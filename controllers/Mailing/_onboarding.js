const mailService = require('./_mailmiddleware');
const onboardingTemplate = require('../../utils/mailing-templates/_onboarding');
const Article = require('../../models/Article');

const sendOnboardingEmail = async (clientDetails) => {
  try {
    if (!clientDetails.email) {
      throw new Error('Email is required for sending onboarding email');
    }

    // Fetch featured products (limit to 3 products)
    const featuredProducts = await Article.find()
      .select('name image description')
      .limit(3);

    await mailService.sendMail({
      to: clientDetails.email,
      subject: 'Bienvenue chez Abrasif Italia',
      html: onboardingTemplate({
        ...clientDetails,
        featuredProducts
      }),
      attachments: [
        // Include logo attachment as before
        {
          filename: 'logo.png',
          path: 'public/assets/logo.png',
          cid: 'logo'
        },
        // Add product images
        ...featuredProducts.map((product, index) => ({
          filename: `product-${index}.png`,
          path: `public${product.image}`,
          cid: `product-${index}`
        }))
      ]
    });

    console.log(`Onboarding email sent successfully to ${clientDetails.email}`);
    return true;
  } catch (error) {
    console.error('Error sending onboarding email:', error);
    return false;
  }
};

module.exports = sendOnboardingEmail;