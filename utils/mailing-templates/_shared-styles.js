// First, let's create a shared styles file for consistency across all templates
module.exports = `
    :root {
      --primary-red: #e63946;
      --primary-green: #2a9d8f;
      --background-light: #f8f9fa;
      --text-dark: #2b2d42;
      --text-light: #ffffff;
      --border-color: #dee2e6;
      --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: var(--background-light);
      color: var(--text-dark);
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow);
    }
    
    .header {
      padding: 2rem;
      text-align: center;
      position: relative;
    }
    
    .header.red {
      background-color: var(--primary-red);
      color: var(--text-light);
    }
    
    .header.green {
      background-color: var(--primary-green);
      color: var(--text-light);
    }
    
    .logo {
      max-width: 150px;
      margin-bottom: 1rem;
    }
    
    .header h1 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .content {
      padding: 2rem;
      background: #ffffff;
    }
    
    .details {
      margin: 1.5rem 0;
      padding: 1.5rem;
      background-color: var(--background-light);
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }
    
    .details li {
      margin-bottom: 0.8rem;
      padding-bottom: 0.8rem;
      border-bottom: 1px solid var(--border-color);
      list-style: none;
    }
    
    .details li:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .details strong {
      color: var(--primary-red);
      display: inline-block;
      width: 140px;
    }
    
    .product-image {
      max-width: 100%;
      margin: 1.5rem 0;
      display: block;
      border-radius: 8px;
      box-shadow: var(--shadow);
    }
    
    .cta-button {
      display: inline-block;
      padding: 12px 24px;
      background-color: var(--primary-red);
      color: var(--text-light);
      text-decoration: none;
      border-radius: 6px;
      margin: 1rem 0;
      font-weight: 500;
    }
    
    .footer {
      padding: 1.5rem;
      text-align: center;
      font-size: 0.9rem;
      background-color: var(--background-light);
      border-top: 1px solid var(--border-color);
    }
    
    .footer p {
      margin: 0.5rem 0;
      color: var(--text-dark);
    }
    
    .social-links {
      margin-top: 1rem;
    }
    
    .social-links a {
      margin: 0 8px;
      color: var(--primary-red);
      text-decoration: none;
    }
`;