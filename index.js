const axios = require('axios');

axios.get('https://api.binance.com/api/v3/time')
  .then(response => {
    console.log('Data from Binance:', response.data);
  })
  .catch(error => {
    console.error('Error calling Binance API:', error);
  });
