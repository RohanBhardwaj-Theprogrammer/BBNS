// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcrypt');
require('dotenv').config(); // For environment variables

const auth = require('../../middleware/auth'); // Import the middleware

// Import database models
const { User, Product, Retailer, Manufacturer } = require('../db/conn');

// Initialize the app
const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = 5500 ; 


// Set up static directory
const staticPath = path.join(__dirname, 'public');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(staticPath));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the default page.');
});

// User Signup
app.post('/defaul', async (req, res) => {
  const { name, email, phone, userId, password, category } = req.body;

  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'UserID already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phone, userId, password: hashedPassword, category });

    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Signup failed.', error: error.message });
  }
});

// User Login
app.post('/login', async (req, res) => {
  res.send("this is login page");
  const { userId, password } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    res.status(200).json({ success: true, message: 'Login successful.', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed.', error: error.message });
  }
});

// Manufacturer Data Upload
app.post('/api/manufacturer/create', upload.single('product-photo'), async (req, res) => {
  try {
    const { productName, productCategory, productPrice, productDescription } = req.body;

    const manufacturer = new Manufacturer({
      productName,
      productCategory,
      productPhoto: req.file.path,
      productPrice,
      productDescription,
    });

    await manufacturer.save();
    res.status(201).json({ success: true, message: 'Product saved successfully.', data: manufacturer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving product.', error: error.message });
  }
});

// Scan QR Code
app.post('/scan', async (req, res) => {
  const { qrCode } = req.body;

  try {
    const product = await Product.findOne({ qrCode });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found or not genuine.' });
    }

    res.status(200).json({ success: true, message: 'Product details retrieved successfully.', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving product details.', error: error.message });
  }
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});





// Example protected route
app.get('/dashboard', auth, (req, res) => {
    res.status(200).json({
        success: true,
        message: `Welcome, ${req.user.name}!`,
    });
});




app.post("/signup", async (req, res) => {
  const { username, password, email, category, additionalInfo } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    // Create a new user
    const newUser = new User({
      username,
      password,
      email,
      category,
      additionalInfo,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ success: false, message: "Error during signup.", error: error.message });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password." });
    }

    res.status(200).json({ success: true, message: "Login successful!", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Error during login.", error: error.message });
  }
});



//retailer section

app.post("/verifyProduct", async (req, res) => {
  const { qrCode } = req.body;
  
  try {
    const product = await Product.findOne({ qr_code: qrCode });

    if (product) {
      res.status(200).json({
        success: true,
        message: "Product verified successfully",
        product: product,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found or invalid QR code.",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Database error." });
  }
});

// app.get('/h',funtion(req,res){
//   res.send("thi")
// })

// Endpoint to grant warranty to a product
app.post("/grantWarranty", async (req, res) => {
  const { qrCode, warrantyInfo } = req.body;

  try {
    const product = await Product.findOne({ qr_code: qrCode });

    if (product) {
      product.warranty_granted = true;
      product.warranty_info = warrantyInfo;
      await product.save();
      res.status(200).json({ success: true, message: "Warranty granted successfully." });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found or QR code invalid.",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to grant warranty." });
  }
});

// Endpoint to see previously granted warranties
app.get("/previousWarranties", async (req, res) => {
  try {
    const products = await Product.find({ warranty_granted: true });

    res.status(200).json({
      success: true,
      warranties: products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Database error." });
  }
});



// buyer section


app.post('/api/check-product-genenity', async (req, res) => {
  const { QrDetails } = req.body;
  
  try {
    // Query the database for the product based on QR code data
    const product = await Product.findOne({ qrCode: QrDetails });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({
      isGenuine: product.genuineness,
      manufacturerDetails: product.manufacturerDetails,
      manufacturer: product.manufacturer
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to rate the product (Retailer and Manufacturer)
app.post('/api/rate-product', async (req, res) => {
  const { productId, retailerRating, manufacturerRating } = req.body;

  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product ratings here (Optional: store ratings in DB)
    // For now, let's just log the ratings to the console
    console.log(`Product ID: ${productId} | Retailer Rating: ${retailerRating} | Manufacturer Rating: ${manufacturerRating}`);
    
    res.json({ verified: "success" });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to save product details (For initial QR code scan data)
app.post('/api/product-details', async (req, res) => {
  const { productDetails } = req.body;

  try {
    const newProduct = new Product({
      qrCode: productDetails,
      manufacturer: "Sample Manufacturer",
      genuineness: true, // Sample data; You can update based on QR data
      retailer: "Sample Retailer",
      manufacturerDetails: { address: "Sample Address", contact: "123456789" }
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product details saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
