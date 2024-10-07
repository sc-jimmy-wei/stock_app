import React, { useState, useEffect} from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Alert } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';

type Portfolio = {
  ticker: string;
  quantity: number;
}

const portfolioColumns: TableColumn<Portfolio>[] = [
  {
    name: 'Ticker',
    selector: row => row.ticker,
    sortable: true,
    maxWidth: 'fit-content',
  },
  {
    name: 'Quantity',
    selector: row => row.quantity,
    sortable: true,
    maxWidth: 'fit-content',
  },
];

const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async() => {
    const response = await fetch('/v1/portfolio');
    const data = await response.json();
    setPortfolio(data);
  };

  const buyStock = async () => {
    try {
      await axios.post('/v1/stock/buy', {
        headers: {'Content-Type': 'application/json'},
        ticker: ticker,
        quantity: quantity,
      })
      setError("")
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setError('Error buying stock. Please double check ticker and quantity.')
    }
    fetchPortfolio()
  }

  const sellStock = async () => {
    try {
      await axios.post('/v1/stock/sell', {
        headers: {'Content-Type': 'application/json'},
        ticker: ticker, 
        quantity: quantity,
      })
      setError("")
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setError('Error selling stock. Please double check ticker and quantity.')
    }
    fetchPortfolio()
  }

  const showPortfolio = () => {
    setError("")
  }

  return (
    <div>
      <div className="w-50 px-3">
        <h2 className="shadow font-weight-bolder">Portfolio</h2>
        <div className="px-3 input-group input-group-lg">
          <input className="border ps-3" value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="Enter ticker. E.g. GOOG" />
          <input className="border ps-3" type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} placeholder="Quantity" />
          <button className="btn btn-success btn-lg" onClick={buyStock}>Buy Stock</button>
          <button className="btn btn-danger btn-lg" onClick={sellStock}>Sell Stock</button>
        </div>
        <div className="px-3">
          <button className="btn btn-info btn-lg" onClick={showPortfolio}>Show Portfolio</button>
        </div>
        <div className="px-3">
          { error ? (
            <div className="d-flex justify-content-center align-items-center">
              <Alert variant="danger" className="m-3">
                {error}
              </Alert>
            </div>
            ) : (
            <DataTable
                title="Personal Porfolio"
                columns={portfolioColumns}
                data={portfolio}
                pagination
                paginationPerPage={10}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
