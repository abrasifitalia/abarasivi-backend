const sharedStyles = require('./_shared-styles');

module.exports = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${sharedStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header green">
      <img src="cid:logo" alt="Abrasif Italia" class="logo" />
      <h1>Vérification de votre compte</h1>
    </div>
    
    <div class="content">
      <p>Bonjour ${data.firstName},</p>
      <p>Merci de vous être inscrit chez Abrasif Italia. Pour activer votre compte, veuillez utiliser le code suivant :</p>
      
      <div style="text-align: center; margin: 2rem 0;">
        <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; font-size: 24px; letter-spacing: 4px;">
          <strong>${data.verificationCode}</strong>
        </div>
      </div>
      
      <p>Ce code expirera dans 24 heures.</p>
      <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
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