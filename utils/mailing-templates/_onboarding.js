const sharedStyles = require('./_shared-styles');

module.exports = (clientDetails) => `
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
      <h1>Bienvenue chez Abrasif Italia!</h1>
    </div>
    
    <div class="content">
      <div class="welcome-section">
        <h2 style="color: var(--primary-green);">Bonjour ${clientDetails.firstName} ${clientDetails.lastName},</h2>
        <p>Nous sommes ravis de vous compter parmi nos clients.</p>
      </div>

      <div class="details">
        <h3>Votre compte a été créé avec succès!</h3>
        <p>Vous pouvez maintenant profiter des avantages suivants:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li>✓ Accès à notre catalogue complet de produits</li>
          <li>✓ Demande de devis personnalisés</li>
          <li>✓ Suivi de vos commandes en temps réel</li>
          <li>✓ Offres exclusives réservées aux membres</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 2rem 0;">
        <a href="https://abrasifitalia.com/articles" class="cta-button">
          Découvrir Notre Catalogue
        </a>
      </div>

      <div class="next-steps">
        <h3 style="color: var(--primary-green);">Besoin d'aide?</h3>
        <p>Notre équipe est à votre disposition pour toute question:</p>
        <div class="contact-info">
          <p>✉️ support@abrasifitalia.com</p>
          <p>📞 +216 28 182 762</p>
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