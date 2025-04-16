module.exports = (messageDetails) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #008000; /* Green */
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      line-height: 1.6;
    }
    .footer {
      background-color: #ff0000; /* Red */
      color: #ffffff;
      text-align: center;
      padding: 15px;
      font-size: 14px;
    }
    .footer p {
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Merci pour votre message</h1>
    </div>
    <div class="content">
      <p>Bonjour ${messageDetails.nom},</p>
      <p>Nous avons bien reçu votre message avec l'objet "<strong>${messageDetails.objet}</strong>".</p>
      <p>Notre équipe vous répondra dans les plus brefs délais.</p>
      <p>Merci de nous avoir contactés.</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Abrasif Italia. Tous droits réservés.</p>
      <p>Contactez-nous : support@abrasifitalia.com</p>
    </div>
  </div>
</body>
</html>
`;
