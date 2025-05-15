const sharedStyles = require('./_shared-styles');

module.exports = (quoteDetails) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${sharedStyles}
  </style>
</head>
<body>
  <div class="container">
    <div class="header green">
      <img src="cid:logo" alt="Abrasif Italia" class="logo" />
      <h1>Demande de Devis Reçue</h1>
    </div>
    
    <div class="content">
      <h2>Merci pour votre demande de devis!</h2>
      <p>Cher(e) ${quoteDetails.name},</p>
      <p>Nous avons bien reçu votre demande de devis avec les détails suivants:</p>

      <div class="details">
        <li><strong>Référence:</strong> #${quoteDetails._id.toString().slice(-6)}</li>
        <li><strong>Produit:</strong> ${quoteDetails.articleName}</li>
        <li><strong>Catégorie:</strong> ${quoteDetails.category}</li>
        <li><strong>Sous-catégorie:</strong> ${quoteDetails.subCategory}</li>
        <li><strong>Quantité:</strong> ${quoteDetails.quantity}</li>
        <li><strong>Date:</strong> ${new Date(quoteDetails.createdAt).toLocaleDateString()}</li>
      </div>

      ${quoteDetails.productImage ? `
        <div style="text-align: center; margin: 2rem 0;">
          <img src="cid:productImage" alt="${quoteDetails.articleName}" class="product-image" />
        </div>
      ` : ''}

      <div class="next-steps">
        <h3>Prochaines étapes</h3>
        <p>Notre équipe commerciale examinera votre demande et vous contactera dans les plus brefs délais.</p>
      </div>

      <div class="contact-info">
        <p>Pour toute question, n'hésitez pas à nous contacter:</p>
        <p>✉️ support@abrasifitalia.com</p>
        <p>📞 +216 28 182 762</p>
      </div>
    </div>

    <div class="footer">
      <div class="social-links">
        <a href="https://www.facebook.com/profile.php?id=100057219229918">Facebook</a> |
        <a href="https://www.instagram.com/abrasif_italia_hg/">Instagram</a>
      </div>
      <p>&copy; ${new Date().getFullYear()} Abrasif Italia</p>
    </div>
  </div>
</body>
</html>
`;