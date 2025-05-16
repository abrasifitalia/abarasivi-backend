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
    <div class="header red">
      <img src="cid:logo" alt="Abrasif Italia" class="logo" />
      <h1>Réinitialisation de mot de passe</h1>
    </div>
    
    <div class="content">
      <p>Bonjour ${data.firstName},</p>
      <p>Voici votre code de vérification pour réinitialiser votre mot de passe :</p>
      
      <div style="text-align: center; margin: 2rem 0;">
        <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; font-size: 24px; letter-spacing: 4px;">
          <strong>${data.verificationCode}</strong>
        </div>
      </div>
      
      <p>Ce code expirera dans 15 minutes.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Abrasif Italia</p>
    </div>
  </div>
</body>
</html>
`;