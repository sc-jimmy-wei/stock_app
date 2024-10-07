from database import db


class Portfolio(db.Model):
    __tablename_ = "portfolio"
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(15), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
