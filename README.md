# Intro

1. “Query” for specific stock tickers (i.e. search for $AAPL, $TSLA). Powered by [yfinance](https://pypi.org/project/yfinance/) library
2. “Buy” and “Sell” specific stock tickers (i.e. enter ticker, quantity, and save the amount somewhere in a database)
3. “View Portfolio” and see a list of all previously bought stock tickers.

4. A REST API built using Flask Python SDK.
5. A React JS frontend application in TypeScript to interact with application.
6. SQL database to save personal portfolio

## Backend Setup

### `python3 sellscalehood.py`

python - 3.9+

Runs the server in development mode.\

Add `"proxy": "http://localhost:5000"` to package.json in frontend project to make request to server

Note: Restart server will wipe personal portfolio data.

## Frontend Setup

### `npm install`

See `package.json` for versions.

Install required packages and dependencies.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
