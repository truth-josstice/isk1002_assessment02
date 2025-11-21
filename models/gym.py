from init import db

class Gym(db.Model):
    """Represents a gym and its location, directly related to company entity"""
    __tablename__ = "gyms"

    id: int = db.Column(db.Integer, primary_key=True)
    company_id: int = db.Column(db.Integer, db.ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    city: str = db.Column(db.String(100), nullable=False)
    street_address: str = db.Column(db.String(255), unique=True)
    name: str = db.Column(db.String(100), nullable=False)

    # Set relationships, back population and cascade rules
    company = db.relationship("Company", back_populates="gym")
    climbs = db.relationship("Climb", back_populates="gym", cascade="all, delete-orphan")
    gym_rating = db.relationship("GymRating", back_populates="gym", cascade="all, delete-orphan")