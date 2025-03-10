const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

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
  res.sendFile(__dirname + '/public/index.html');
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
