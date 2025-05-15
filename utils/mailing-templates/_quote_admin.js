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
    <div class="header red">
      <img src="cid:logo" alt="Abrasif Italia" class="logo" />
      <h1>Nouvelle Demande de Devis</h1>
    </div>
    
    <div class="content">
      <div class="alert">
        <h2>Nouvelle demande à traiter</h2>
      </div>

      <div class="details">
        <h3>Détails du Client:</h3>
        <li><strong>Nom:</strong> ${quoteDetails.name}</li>
        <li><strong>Email:</strong> ${quoteDetails.email}</li>
        <li><strong>Téléphone:</strong> ${quoteDetails.phone}</li>
        
        <h3>Détails de la Demande:</h3>
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

      <div style="background: #fff3f3; padding: 1rem; border-radius: 8px; margin-top: 1.5rem;">
        <p style="color: var(--primary-red); font-weight: 500; margin: 0;">
          Action Requise : Veuillez traiter cette demande de devis dans les plus brefs délais.
        </p>
      </div>
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Abrasif Italia</p>
    </div>
  </div>
</body>
</html>
`;