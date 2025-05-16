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
    <div class="header green">
      <img src="cid:logo" alt="Abrasif Italia" class="logo" />
      <h1>Message Reçu</h1>
    </div>
    
    <div class="content">
      <h2 style="color: var(--primary-green); margin-bottom: 1.5rem;">
        Confirmation de réception
      </h2>
      
      <div class="message-content">
        <p>Bonjour ${messageDetails.nom},</p>
        <p>Nous avons bien reçu votre message. Un membre de notre équipe vous contactera prochainement.</p>
        
        <div class="details">
          <h3>Récapitulatif de votre message :</h3>
          <li><strong>Objet:</strong> ${messageDetails.objet}</li>
          <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
        </div>

        <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-top: 1.5rem;">
          <p style="color: var(--primary-green); font-weight: 500; margin: 0;">
            Notre équipe s'engage à vous répondre dans les plus brefs délais.
          </p>
        </div>
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
