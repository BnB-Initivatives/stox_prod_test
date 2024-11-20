// const express = require('express');
// const app = express();
// const authRoutes = require('./routes/auth');

// app.use(express.json());
// app.use('/api/auth', authRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const cors = require('cors');

// Importing data files
const employees = require('./EmployeeData');
const products = require('./productData');

const app = express();
const port = 3001; // Single port for the backend

app.use(cors());
app.use(express.json());

// Employee validation route
app.post('/validate-employee', (req, res) => {
  const { employeeId } = req.body;
  console.log('Received Employee ID:', employeeId);

  const employee = employees.find((emp) => emp.employeeId === employeeId);

  if (employee) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false, message: 'Invalid Employee ID' });
  }
});

// Product routes
app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/product/:itemNumber', (req, res) => {
  const { itemNumber } = req.params;
  const product = products.find((prod) => prod.itemNumber === itemNumber);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.post('/update-stock', (req, res) => {
  const { itemNumber, stockChange } = req.body;

  const productIndex = products.findIndex((prod) => prod.itemNumber === itemNumber);

  if (productIndex !== -1) {
    products[productIndex].inStock += stockChange;

    if (products[productIndex].inStock < 0) {
      products[productIndex].inStock = 0;
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      product: products[productIndex]
    });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
