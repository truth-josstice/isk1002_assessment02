from init import db

class Style(db.Model):
    """Represents a list of all styles available for the user to choose from."""
    __tablename__ = "styles"

    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(32), nullable=False, unique=True)
    description: str = db.Column(db.String(255), nullable=False, unique=True)

    # Set relationship and back population
    climbs = db.relationship("Climb", back_populates="styles")