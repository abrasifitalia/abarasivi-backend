module.exports = (orderDetails) => `
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
      background-color: #ff0000; /* Red */
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
    .content p {
      margin: 0 0 15px;
    }
    .details {
      margin: 20px 0;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 8px;
      border: 1px solid #ddd;
    }
    .details li {
      margin-bottom: 10px;
      font-size: 14px;
    }
    .product-image {
      max-width: 100%;
      margin: 20px 0;
      display: block;
      border-radius: 8px;
      border: 1px solid #ddd;
    }
    .footer {
      background-color: #008000; /* Green */
      color: #ffffff;
      text-align: center;
      padding: 15px;
      font-size: 14px;
    }
    .footer p {
      margin: 0;
    }
    .logo {
      max-width: 120px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="cid:logo" alt="Logo" class="logo" />
      <h1>Nouvelle Demande de Devis</h1>
    </div>
    <div class="content">
      <p>Bonjour Équipe Commerciale,</p>
      <p>Un client a demandé un devis. Voici les détails :</p>
      <ul class="details">
        <li><strong>Nom du Client:</strong> ${orderDetails.name}</li>
        <li><strong>Email du Client:</strong> ${orderDetails.email}</li>
        <li><strong>Date de Demande:</strong> ${orderDetails.date}</li>
        <li><strong>Produit:</strong> ${orderDetails.product}</li>
        <li><strong>Quantité:</strong> ${orderDetails.quantity}</li>
      </ul>
      ${
        orderDetails.productImage
          ? `<img src="cid:productImage" alt="Product Image" class="product-image" />`
          : ''
      }
      <p>Veuillez contacter le client pour finaliser le devis.</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Abrasif Italia. Tous droits réservés.</p>
      <p>Contactez-nous : support@abrasifitalia.com</p>
    </div>
  </div>
</body>
</html>
`;
