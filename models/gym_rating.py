from init import db
from sqlalchemy import CheckConstraint

class GymRating(db.Model):
    """Represents a user posted rating for a gym directly related to user, gym and skill level entitites"""
    __tablename__ = "gym_ratings"

    id: int = db.Column(db.Integer, primary_key=True)
    user_id: int = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    gym_id: int = db.Column(db.Integer, db.ForeignKey("gyms.id"), nullable=False)
    difficulty_rating: int = db.Column(db.Integer, nullable=False)
    skill_level_id: int = db.Column(db.Integer, db.ForeignKey("skill_levels.id"), nullable=False)
    review: str = db.Column(db.String(500))

    # Add unique user + review constraints, and CHECK constraint for difficulty rating
    __table_args__ = (
        db.UniqueConstraint('user_id', 'gym_id', name='_user_gym_uc'),
        CheckConstraint('difficulty_rating >= 1 AND difficulty_rating <= 10', name='check_rating_range'))

    # Set relationships and back population
    gym = db.relationship("Gym", back_populates="gym_rating")
    user = db.relationship("User", back_populates="gym_rating")
    recommended_skill_level = db.relationship("SkillLevel", back_populates="gym_rating")