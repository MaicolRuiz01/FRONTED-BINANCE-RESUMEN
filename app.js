const express = require('express');
const app = express();
const port = 3000;

// Controllers
const p2pController = require('./components/p2pController');
const paymentController = require('./components/PaymentController');
const testController = require('./components/testController');
const futuresController = require('./components/futuresController'); // Asegúrate de que la ruta sea correcta


// Routes
app.use('/api/p2p', p2pController);
app.use('/api/payments', paymentController);
app.use('/api/test', testController);
app.use('/api/futures', futuresController);

app.get('/', (req, res) => {
  res.send('Hola Mundo con Express y Node.js!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
