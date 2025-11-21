from init import db

from datetime import datetime
from sqlalchemy import text, CheckConstraint

class Attempt(db.Model):
    """Represents a user attempt at a climb with ratings and completion status."""
    __tablename__ = "attempts"

    id: int = db.Column(db.Integer, primary_key=True)
    user_id: int = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    climb_id: int = db.Column(db.Integer, db.ForeignKey("climbs.id"))
    fun_rating: int = db.Column(db.Integer, nullable=False)
    comments: str | None = db.Column(db.String(500))
    completed: bool = db.Column(db.Boolean, default=False, nullable=False)
    attempted_at: datetime = db.Column(db.DateTime, server_default=text("CURRENT_TIMESTAMP"))

    # Add CHECK constraint for fun_rating
    __table_args__ = (CheckConstraint('fun_rating >= 1 AND fun_rating <= 5', name="check_fun_rating_range"),)

    # Set relationships and back population
    climb = db.relationship("Climb", back_populates="attempt")
    user = db.relationship("User", back_populates="attempt")