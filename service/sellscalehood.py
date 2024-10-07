from flask import Flask, request, jsonify
import yfinance as y
from database import db

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///portfolio.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Creaete DB, Add table
with app.app_context():
    db.init_app(app)

    from db_models import Portfolio

    # For testing purpose, clear DB after restart
    db.drop_all()
    db.create_all()
    db.session.commit()

# Look up stock historical data by company ticker
@app.route("/v1/stock/<ticker>", methods=["GET"])
def lookup_stock(ticker):
    stock = y.Ticker(ticker)
    data = stock.history(period="1mo")
    if not data.empty:
        return (
            jsonify(
                [
                    {
                        "date": index.strftime("%Y-%m-%d"),
                        "open": round(row["Open"], 2),
                        "high": round(row["High"], 2),
                        "low": round(row["Low"], 2),
                        "close": round(row["Close"], 2),
                        "volume": row["Volume"],
                        "dividends": row["Dividends"],
                        "stock_splits": row["Stock Splits"],
                    }
                    for index, row in data.iterrows()
                ]
            ),
            200,
        )
    else:
        message = "No ticker found, symbol may be delisted"
        return jsonify({"error": message}), 500

# Buy stock 
@app.route("/v1/stock/buy", methods=["POST"])
def buy_stock():
    data = request.json
    stock = y.Ticker(data["ticker"])
    valid_ticker = stock.history(period="5d")
    if not valid_ticker.empty and data["quantity"] > 0:
        stock = Portfolio.query.filter_by(ticker=data["ticker"]).first()
        if stock:
            stock.quantity += data["quantity"]
        else:
            stock = Portfolio(ticker=data["ticker"], quantity=data["quantity"])
            db.session.add(stock)
        db.session.commit()
        message = "Purchased %s unit of %s successfully!" % (
            data["quantity"],
            data["ticker"],
        )
        return jsonify({"messsage": message}), 200

    message = "Cannot buy due to no ticker found or invalid units."
    return jsonify({"error": message}), 500

# Sell stock
@app.route("/v1/stock/sell", methods=["POST"])
def sell_stock():
    data = request.json
    stock = Portfolio.query.filter_by(ticker=data["ticker"]).first()
    if stock and data["quantity"] > 0 and stock.quantity >= data["quantity"]:
        stock.quantity -= data["quantity"]
        if stock.quantity == 0:
            db.session.delete(stock)
        db.session.commit()
        message = "Sold %s units of %s successfully!" % (
            data["quantity"],
            data["ticker"],
        )
        return jsonify({"messsage": message}), 200

    message = "Cannot sell due to no ticker found or invalid units."
    return jsonify({"messsage": message}), 500

# View bought stock
@app.route("/v1/portfolio", methods=["GET"])
def view_portfolio():
    stocks = Portfolio.query.all()
    return jsonify([{"ticker": s.ticker, "quantity": s.quantity} for s in stocks]), 200


if __name__ == "__main__":
    app.run(debug=True)
