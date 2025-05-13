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
    <div class="header red">
      <img src="cid:logo" alt="Abrasif Italia" class="logo" />
      <h1>Nouvelle Demande de Devis</h1>
    </div>
    
    <div class="content">
      <h2 style="color: var(--primary-red); margin-bottom: 1.5rem;">
        Détails de la Demande
      </h2>
      
      <div class="details">
        <li><strong>Client:</strong> ${orderDetails.name}</li>
        <li><strong>Email:</strong> ${orderDetails.email}</li>
        <li><strong>Téléphone:</strong> ${orderDetails.phone}</li>
        <li><strong>Date:</strong> ${orderDetails.date}</li>
        <li><strong>Produit:</strong> ${orderDetails.product}</li>
        <li><strong>Quantité:</strong> ${orderDetails.quantity}</li>
      </div>

      ${orderDetails.productImage 
        ? `<div style="text-align: center;">
            <img src="cid:productImage" alt="Product Image" class="product-image" />
           </div>`
        : ''}
      
      <div style="background: #fff3f3; padding: 1rem; border-radius: 8px; margin-top: 1.5rem;">
        <p style="color: var(--primary-red); font-weight: 500; margin: 0;">
          Action Requise : Veuillez contacter le client pour finaliser le devis.
        </p>
      </div>
    </div>

    <div class="footer">
      <p style="font-weight: 500;">Abrasif Italia</p>
      <p>Email: support@abrasifitalia.com</p>
      <p>Tél: +216 28182762</p>
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
