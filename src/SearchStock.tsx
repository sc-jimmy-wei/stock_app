import React, { useState } from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Alert, Spinner } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';

type Stock = {
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
  dividends: number,
  stock_splits: number,
  date: string
}

// Define columns for DataTable
const stockColumns: TableColumn<Stock>[] = [
  {
    name: 'Date',
    selector: row => row.date,
    sortable: true,
    maxWidth: 'fit-content',
  },
  {
    name: 'Open',
    selector: row => row.open,
    sortable: true,
    maxWidth: 'fit-content',
  },
  {
    name: 'High',
    selector: row => row.high,
    sortable: true,
    maxWidth: 'fit-content',
  },
  {
    name: 'Low',
    selector: row => row.low,
    sortable: true,
    maxWidth: 'fit-content',
  },
  {
    name: 'Close',
    selector: row => row.close,
    sortable: true,
    maxWidth: 'fit-content',
  },
  {
    name: 'Volume',
    selector: row => row.volume,
    sortable: true,
    maxWidth: 'fit-content',
  },
  {
    name: 'Dividends',
    selector: row => row.dividends,
    sortable: true,
    maxWidth: 'fit-content',
  },
  {
    name: 'Stock Splits',
    selector: row => row.stock_splits,
    sortable: true,
    maxWidth: 'fit-content',
  },
];

const SearchStock: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [historicalData, setHistoricalData] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Loading icon
  const [error, setError] = useState<string | null>(null); // Error message

  const lookupStock = async() => {
    try {
        setLoading(true)
        const response = await axios.get('/v1/stock/' + ticker);
        setHistoricalData(response.data);
        setLoading(false)
        setError(null)
    } catch (error) {
        console.error('Error fetching historical data:', error);
        setError('Error fetching historical data. Please double check entered ticker.')
        setLoading(false)
    }
  };

  return (
    <div>
        <div className="w-50 px-3">
          <h1 className="shadow font-weight-bolder">SellScaleHood</h1>
          <div className="px-3 input-group input-group-lg">
              <input className="form-control-lg border ps-3" value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="Enter ticker. E.g. GOOG" />
              <button className="btn btn-primary btn-lg" onClick={lookupStock}>Lookup Stock Price</button>
          </div>
          <div className="px-3">
              { loading ? (
                <div className="d-flex justify-content-center align-items-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : error ? (
                <div className="d-flex justify-content-center align-items-center">
                  <Alert variant="danger" className="m-3">
                    {error}
                  </Alert>
                </div>
              ) : (
                  <DataTable
                      title="Stock Historical Data"
                      columns={stockColumns}
                      data={historicalData}
                      pagination
                      paginationPerPage={10}
                  />
              )}
          </div>
        </div>
    </div>
  );
};

export default SearchStock;
