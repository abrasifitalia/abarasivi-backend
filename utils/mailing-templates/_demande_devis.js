const sharedStyles = require('./_shared-styles');

module.exports = (orderDetails) => `
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
      <h1>Confirmation de Demande de Devis</h1>
    </div>
    
    <div class="content">
      <div class="welcome-section">
        <h2>Merci pour votre demande!</h2>
        <p>Nous avons bien reçu votre demande de devis. Notre équipe commerciale l'examine actuellement.</p>
      </div>

      <div class="details">
        <h3>Détails de votre demande:</h3>
        <li><strong>Référence:</strong> #${Date.now().toString().slice(-6)}</li>
        <li><strong>Nom:</strong> ${orderDetails.name}</li>
        <li><strong>Email:</strong> ${orderDetails.email}</li>
        <li><strong>Date:</strong> ${orderDetails.date}</li>
        <li><strong>Produit:</strong> ${orderDetails.product}</li>
        <li><strong>Quantité:</strong> ${orderDetails.quantity}</li>
      </div>

      ${orderDetails.productImage 
        ? `<div class="product-image-container">
            <img src="cid:productImage" alt="Product Image" class="product-image" />
           </div>`
        : ''}
      
      <div class="next-steps">
        <h3>Prochaines étapes</h3>
        <p>Notre équipe commerciale vous contactera dans les plus brefs délais pour discuter des détails et finaliser votre devis.</p>
      </div>

      <div class="cta-section">
        <p>Pour toute question, n'hésitez pas à nous contacter:</p>
        <div class="contact-info">
          <p>✉️ support@abrasifitalia.com</p>
          <p>📞 +21658982743</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="social-links">
        <a href="https://www.facebook.com/profile.php?id=100057219229918">Facebook</a> |
        <a href="https://www.instagram.com/abrasif_italia_hg/">Instagram</a>
      </div>
      <p>&copy; 2025 Abrasif Italia</p>
    </div>
  </div>
</body>
</html>
`;
