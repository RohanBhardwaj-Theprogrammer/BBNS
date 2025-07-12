const mongoose = require('mongoose');

// MongoDB Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/yourDatabaseName', {
    //useNewUrlParser: true,  // Ensures the MongoDB URI string is properly parsed
    //useUnifiedTopology: true,  // Avoids deprecation warnings related to the MongoDB driver
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


// Manufacturer Schema
const manufacturerSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productCategory: { type: String, required: true },
  productPhoto: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productDescription: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Retailer Schema
const retailerSchema = new mongoose.Schema({
  productQRCode: { type: String, required: true },
  productName: { type: String, required: true },
  productCategory: { type: String },
  verificationStatus: { type: Boolean, default: false },
  warrantyGranted: { type: Boolean, default: false },
  customerDetails: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
  },
  grantedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Product Schema
const productSchema = new mongoose.Schema({
  qrCode: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  productCategory: { type: String, required: true },
  manufacturer: { type: String, required: true },
  retailer: { type: String },
  isGenuine: { type: Boolean, default: true },
  price: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: function () { return this.isSignup; } },
  email: { type: String, unique: true, required: function () { return this.isSignup; } },
  phone: { type: String, required: function () { return this.isSignup; } },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  category: { type: String, enum: ['customer', 'retailer', 'manufacturer'], required: function () { return this.isSignup; } },
  createdAt: { type: Date, default: Date.now },
});

// Export Models
module.exports = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema),
  Retailer: mongoose.model('Retailer', retailerSchema),
  Manufacturer: mongoose.model('Manufacturer', manufacturerSchema),
};
