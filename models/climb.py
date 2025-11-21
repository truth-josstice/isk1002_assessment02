from datetime import date

from init import db

class Climb(db.Model):
    """Represents a climb posted by a user, with a style, difficulty and the date it was set if known"""
    __tablename__ = "climbs"

    id: int = db.Column(db.Integer, primary_key=True)
    gym_id: int = db.Column(db.Integer, db.ForeignKey("gyms.id", ondelete="CASCADE"), nullable=False)
    user_id: int = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    style_id: int = db.Column(db.Integer, db.ForeignKey("styles.id", ondelete="SET NULL"), nullable=True)
    difficulty_grade: str = db.Column(db.String(32), nullable=False)
    set_date: date = db.Column(db.Date)

    # Set relationships and back population
    gym = db.relationship("Gym", back_populates="climbs") 
    user = db.relationship("User", back_populates="climbs") 
    attempt = db.relationship("Attempt", back_populates="climb")
    styles = db.relationship("Style", back_populates="climbs")