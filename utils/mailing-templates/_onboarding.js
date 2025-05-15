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
    <div class="header green">
      <img src="cid:logo" alt="Abrasif Italia" class="logo" />
      <h1>Bienvenue chez Abrasif Italia!</h1>
    </div>
    
    <div class="content">
      <div class="welcome-section">
        <h2 style="color: var(--primary-green);">Bonjour ${data.firstName} ${data.lastName},</h2>
        <p>Nous sommes ravis de vous compter parmi nos clients.</p>
      </div>

      <div class="details">
        <h3>Votre compte a été créé avec succès!</h3>
        <p>Découvrez notre sélection de produits populaires:</p>
      </div>

      <div class="product-grid">
        ${data.featuredProducts.map((product, index) => `
          <div class="product-card">
            <img src="cid:product-${index}" alt="${product.name}" class="product-image">
            <h4 class="product-name">${product.name}</h4>
            <p class="product-description">${product.description.substring(0, 100)}...</p>
          </div>
        `).join('')}
      </div>

      <div style="text-align: center; margin: 2rem 0;">
        <a href="https://abrasifitalia.com/articles" class="cta-button">
          Voir Notre Catalogue Complet
        </a>
      </div>

      <div class="next-steps">
        <h3 style="color: var(--primary-green);">Besoin d'aide?</h3>
        <p>Notre équipe est à votre disposition pour toute question:</p>
        <div class="contact-info">
          <p>✉️ support@abrasifitalia.com</p>
          <p>📞 +216 20235829</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="social-links">
        <a href="https://www.facebook.com/profile.php?id=100057219229918">Facebook</a> |
        <a href="https://www.instagram.com/abrasif_italia_hg/">Instagram</a>
      </div>
      <p>&copy; ${new Date().getFullYear()} Abrasif Italia. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>
`;