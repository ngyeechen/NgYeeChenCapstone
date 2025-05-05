// When in doubt, just include import React from 'react'
//import React from 'react';
import React, { useState } from 'react';



//const validateStockSymbol = (symbol) => {}
// alphaVantage API key: YLQSM14YBNTNAFRE
const validateStockSymbol = async (symbol) => {
    const API_KEY = 'UA4EBSAZW1OPXPYO'; // Replace with your actual Alpha Vantage API key
    //const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${API_KEY}`;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo`;
    //const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
  
      // Check if 'Global Quote' exists and is not empty
      if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
        return true; // symbol is valid
      } else {
          return false; // invalid symbol
      }
    } catch (error) {
        console.error('Error validating stock symbol:', error);
        return false;
    }
};

//fetches the current price of the stock using the Alpha Vantage API
const fetchCurrentPrice = async (symbol) => {
  const API_KEY = 'UA4EBSAZW1OPXPYO';
    //const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${API_KEY}`;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo`;
    //const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const price = data['Global Quote'] && data['Global Quote']['05. price'];
    //return price ? parseFloat(price) : null;
    //return price ? parseFloat(price) : 245.55; //follow teacher's demo $  

    if (!price){
      return 'Ignored due to invalid symbol.'; 
    }
    return price ? parseFloat(price) : null;
  } catch (error) {
    console.error('Error fetching current price:', error);
    //return 245.55;
    return 'Ignored due to invalid symbol.'; 
  }
};






const Stockform = () => {
  //store input fields in state
  const [stockSymbol, setStockSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [stocks, setStocks] = useState([]); //store the stocks added by the user

  
  //adds a stock to the list of stocks
  const handleAddStock = async () => {
    const isValid = await validateStockSymbol(stockSymbol);

    if (!isValid) {
      alert('Invalid stock symbol. Please re-enter a valid stock symbol.');
      setStockSymbol('');
      setQuantity('');
      setPurchasePrice('');
      return;
    }

    const currentPrice = await fetchCurrentPrice(stockSymbol);

    if (typeof currentPrice !== 'number') {
      alert('Could not fetch current price.');
      return;
    }

    const newStock = {
      symbol: stockSymbol.toUpperCase(),
      quantity: Number(quantity),
      purchasePrice: Number(purchasePrice),
      currentPrice: currentPrice,
      profitLoss: (currentPrice - Number(purchasePrice)) * Number(quantity)
    };

    setStocks([...stocks, newStock]);
    setStockSymbol('');
    setQuantity('');
    setPurchasePrice('');
};

  

  return (
    <div className="container">
      <h1 className="header">Finance Dashboard</h1>
      <div className="form" style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between'}}>
        <input 
          type="text" 
          placeholder="Stock Symbol (e.g., BA, BAAPL)" 
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', flex: '1' }}
        />
        <input 
          type="number" 
          placeholder="Quantity" 
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', flex: '1' }}
        />
        <input 
          type="number" 
          step="0.01" 
          placeholder="Purchase Price" 
          value ={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', flex: '1' }}
        />
        <button 
            onClick={handleAddStock}
            className="submit-button" 
            style={{
                //marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
        >
            Add Stock
        </button>
      </div>
      
      <h2>Stock List</h2>

      {stocks.length === 0 ? (
        <p>No stocks added yet.</p>
      ) : (
        <ul>
          {stocks.map((stock, index) => (
            <li key={index}>
              <strong>{stock.symbol}</strong> - Quantity: {stock.quantity}, Purchase Price: ${stock.purchasePrice.toFixed(2)}, Current Price: ${typeof stock.currentPrice === 'number' ? stock.currentPrice.toFixed(2) : 'N/A'}, Profit/Loss: ${typeof stock.profitLoss === 'number' ? stock.profitLoss.toFixed(2) : 'N/A'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Stockform;
