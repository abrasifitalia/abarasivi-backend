const sharedStyles = require('./_shared-styles');

module.exports = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${sharedStyles}
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 2rem 0;
    }
    .product-card {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      transition: transform 0.3s ease;
    }
    .product-card:hover {
      transform: translateY(-5px);
    }
    .product-image {
      width: 100%;
      max-width: 200px;
      height: auto;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .product-name {
      color: var(--primary-red);
      font-weight: 600;
      margin: 0.5rem 0;
    }
    .product-description {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="cid:logo" alt="Abrasif Italia" class="logo" />
      <h1>Bienvenue chez Abrasif Italia</h1>
    </div>
    
    <div class="content">
      <h2>Bonjour ${data.firstName},</h2>
      <p>Nous sommes ravis de vous accueillir chez Abrasif Italia !</p>
      
      <div class="welcome-section">
        <p>Votre compte a été créé avec succès. Vous pouvez maintenant :</p>
        <ul>
          <li>Explorer notre catalogue de produits</li>
          <li>Demander des devis personnalisés</li>
          <li>Suivre vos commandes</li>
          <li>Contacter notre équipe commerciale</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p>Abrasif Italia</p>
      <p>Email: support@abrasifitalia.com</p>
      <p>Tél: +216 28182762</p>
      <p>&copy; ${new Date().getFullYear()} Abrasif Italia. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>
`;