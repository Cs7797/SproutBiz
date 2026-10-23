import  { useState } from 'react';
import axios from 'axios';

const CryptoCalculator = () => {
  const [maticValue, setMaticValue] = useState('');
  const [usdPrice, setUsdPrice] = useState('');

  const handleChange = (event) => {
    setMaticValue(event.target.value);
  };

  const convertToUsd = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd`
      );
      const maticPriceInUsd = response.data['matic-network'].usd;
      const usdValue = parseFloat(maticValue) * maticPriceInUsd;
      setUsdPrice(usdValue.toFixed(2));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
console.log(usdPrice)
  return (
    <div>
      <h2>Crypto Calculator</h2>
      <label>
        Enter Matic Value:
        <input type="number" value={maticValue} onChange={handleChange} />
      </label>
      <button onClick={convertToUsd}>Convert to USD</button>
      {usdPrice && (
        <div>
          <p>Price in USD: ${usdPrice}</p>
        </div>
      )}
    </div>
  );
};

export default CryptoCalculator;
