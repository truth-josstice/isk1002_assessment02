from init import db

class SkillLevel(db.Model):
    """Represents a list of all skill levels available to the user."""
    __tablename__ = "skill_levels"

    id: int = db.Column(db.Integer, primary_key=True)
    level: str = db.Column(db.String(32), unique=True, nullable=False)
    description: str = db.Column(db.String(255), unique=True, nullable=False)

    # Set relationships and back population
    user = db.relationship("User", back_populates="user_skill_level")
    gym_rating = db.relationship("GymRating", back_populates="recommended_skill_level")