const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définir le schéma de commande
const orderSchema = new Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  items: [
    {
      articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
}, { timestamps: true });

// Middleware `pre-save` pour calculer le prix total
orderSchema.pre('save', async function (next) {
  if (this.isModified('items')) {
    let totalPrice = 0;
    try {
      for (const item of this.items) {
        const article = await mongoose.model('Article').findById(item.articleId);
        if (article) {
          totalPrice += article.price * item.quantity;
        } else {
          console.error(`Article not found for ID: ${item.articleId}`);
          throw new Error(`Invalid articleId: ${item.articleId}`);
        }
      }
      console.log('Total price calculated:', totalPrice); // Log du total
      this.totalPrice = totalPrice;
    } catch (err) {
      console.error('Error calculating totalPrice:', err.message);
      return next(err); // Propager l'erreur pour qu'elle apparaisse dans les logs
    }
  }
  next();
});


// Exporter le modèle
module.exports = mongoose.model('Order', orderSchema);
