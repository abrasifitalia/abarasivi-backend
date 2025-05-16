const sharedStyles = require('./_shared-styles');

module.exports = (messageDetails) => `
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
      <h1>Nouveau Message de Contact</h1>
    </div>
    
    <div class="content">
      <h2 style="color: var(--primary-red); margin-bottom: 1.5rem;">
        Détails du Message
      </h2>
      
      <div class="details">
        <li><strong>Client:</strong> ${messageDetails.nom}</li>
        <li><strong>Email:</strong> ${messageDetails.email}</li>
        <li><strong>Téléphone:</strong> ${messageDetails.phone}</li>
        <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
        <li><strong>Objet:</strong> ${messageDetails.objet}</li>
      </div>

      <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-top: 1.5rem;">
        <h3 style="color: var(--primary-red); margin-top: 0;">Message:</h3>
        <p style="margin-bottom: 0;">${messageDetails.message}</p>
      </div>
      
      <div style="background: #fff3f3; padding: 1rem; border-radius: 8px; margin-top: 1.5rem;">
        <p style="color: var(--primary-red); font-weight: 500; margin: 0;">
          Action Requise : Veuillez traiter ce message dans les plus brefs délais.
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
      <p>&copy; ${new Date().getFullYear()} Abrasif Italia</p>
    </div>
  </div>
</body>
</html>
`;
