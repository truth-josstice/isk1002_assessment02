from flask import Blueprint, jsonify, request
from sqlalchemy import func, select
from flask_jwt_extended import jwt_required, current_user

from collections import Counter, defaultdict

from init import db

from models import GymRating, Gym
from schemas import (
    gym_rating_summaries_schema,
    gym_rating_output_schema,
    gym_ratings_output_schema,
    gym_rating_input_schema,
    skill_level_schema
)
from utils import admin_required

gym_rating_bp = Blueprint("gym_rating", __name__, url_prefix="/gym-ratings")


@gym_rating_bp.route('/')
def get_gym_info():
    """
    Complex query function to return aggregated gym ratings with:
    Average difficulty rating, review counts and msot common recommended skill level for each gym
    """
    # Query to get average rations and review counts
    stmt = (
        select(
            GymRating.gym_id,
            func.avg(GymRating.difficulty_rating).label("average_rating"),
            func.count(GymRating.id).label("review_count"),  # Count by ID
        )
        .group_by(GymRating.gym_id)
        .order_by(GymRating.gym_id)
    )
    results = db.session.execute(stmt).all() 

    # Check to see gyms have been reviewed
    if not results:
        return {"message": "No gyms have been reviewed yet!"},404
    
    # Get all gyms with their relationships loaded, filter for unique entries (joins may cause duplicate data)
    gyms = db.session.scalars(
        select(Gym).options(
            db.joinedload(Gym.company),
            db.joinedload(Gym.climbs),
            db.joinedload(Gym.gym_rating)
        )
    ).unique().all()
    
    # Create a custom dictionary of gyms for quick lookup by gym_id
    gym_dict = {gym.id: gym for gym in gyms}

     # Get all ratings with skill level relationships loaded
    all_ratings = db.session.scalars(
        select(GymRating).options(db.joinedload(GymRating.recommended_skill_level))
    ).all()

    # Group by gym and find collect recommended skill level
    gym_skill_levels = defaultdict(list)
    for rating in all_ratings:
        gym_id = rating.gym_id
        
        # Add recommended skill level to dictionary
        serialized_skill = skill_level_schema.dump(rating.recommended_skill_level)
        gym_skill_levels[gym_id].append(serialized_skill)
    
    # Build customised response data with all aggregate information
    response_data = []
    for result in results:
        gym_id = result.gym_id
        gym = gym_dict.get(gym_id)
        
        # IF gym is not found skip and continue to next entry (unlikely edge case)
        if not gym:
            continue 
        
        # Search gym skill levels list for most frequent skill level recommended
        skill_levels = gym_skill_levels.get(gym_id, [])
        
        # Find most frequent recommended skill level for this gym
        if skill_levels:
            # Count occurences of each skill level id to fomr the most common
            level_counts = Counter(sl['id'] for sl in skill_levels)
            # Get the ID with the highest count using most_common function
            most_common_id = level_counts.most_common(1)[0][0]

            # Find the full skill level object mathching the most common ID
            recommended_skill = next(sl for sl in skill_levels if sl['id'] == most_common_id)
        
        else:
            # If no skill level recommendations exist for the gym (unlikely edge case)
            recommended_skill = None 
        
        # Pass the full gym object - schema will handle serialization
        response_data.append({
            "gym": gym,  
            "average_difficulty_rating": float(result.average_rating),
            "total_reviews": result.review_count,
            "recommended_skill_level": recommended_skill
        })
    
    # Serialize and return using schema
    return jsonify(gym_rating_summaries_schema.dump(response_data))

@gym_rating_bp.route('/all/')
def get_gym_ratings():
    '''Function to GET all individual gym_ratings from the database'''
    # GET statement: SELECT * FROM gym_ratings; --> shows all details of every review
    stmt = db.select(GymRating)
    gym_ratings = db.session.scalars(stmt).all()

    # Check gym ratings exist
    if not gym_ratings:
        return {"message": "No gyms have been rated yet!"}, 404
    
    # Return all gym ratings in JSON format
    return jsonify(gym_ratings_output_schema.dump(gym_ratings))

@gym_rating_bp.route('/by-gym/<int:gym_id>/')
def get_a_gyms_reviews(gym_id):
    """
    Retrieves a single gym's reviews and returns results in JSON format
    """
    # GET statement: SELECT * FROM gym_ratings WHERE GymRating.gym_id = gym_id;
    stmt = db.select(GymRating).where(GymRating.gym_id == gym_id)
    ratings = db.session.scalars(stmt)

    # Check ratings exist
    if not ratings:
        return {"message": "This gym has no ratings yet!"}, 404
    
    # Return all ratings for the gym in JSON format
    return jsonify(gym_ratings_output_schema.dump(ratings))
    

@gym_rating_bp.route('/by-user/<int:user_id>/')
def get_a_users_reviews(user_id):
    """
    Retrieves a single user's reviews and returns results in JSON format
    """
    # GET statement: SELECT * FROM gym_ratings WHERE GymRating.user_id = user_id;
    stmt = db.select(GymRating).where(GymRating.user_id == user_id)
    ratings = db.session.scalars(stmt)

    # Check ratings exist
    if not ratings:
        return {"message": "This user has not rated any gyms yet!"}, 404

    # Return all ratings by the user in JSON format
    return jsonify(gym_ratings_output_schema.dump(ratings))

@gym_rating_bp.route('/<int:rating_id>/')
def get_a_gym_rating(rating_id):
    """ 
    Retrieves a unique database record and returns results in JSON format
    """
    # SELECT * FROM gym_ratings WHERE gym_rating.id == rating_id;
    stmt = db.select(GymRating).where(GymRating.id == rating_id)
    
    # Execute the query
    rating = db.session.scalar(stmt)

    # Check the rating exists
    if not rating:
        return {"message": "The record you are searching for does not exist."},404
    
    # Return the rating in JSON format
    return jsonify(gym_rating_output_schema.dump(rating))
        
@gym_rating_bp.route('/', methods=["POST"])
@jwt_required()
def add_rating():
    # GET JSON body_data
    body_data = request.get_json()

    # Check for existing reviews
    stmt = db.select(GymRating).where(
        (GymRating.user_id == current_user.id) &
        (GymRating.gym_id == body_data["gym_id"])
    )
    existing_rating = db.session.scalar(stmt)
    
    # IF a review already exists
    if existing_rating:
        return {
            "message": f"{current_user.username}, you've already reviewed this gym. Each user can only review a gym once."
        }, 409

    # IF no review exists, create rating with gym_rating_input_schema
    new_rating = gym_rating_input_schema.load(body_data, session=db.session)
    
    # Assign current user to new_rating
    new_rating.user = current_user

    # Add new rating and commit to the database
    db.session.add(new_rating)
    db.session.commit()

    # Return the data of the new gym in JSON format, 201 Created status code
    return jsonify(gym_rating_output_schema.dump(new_rating)), 201

@gym_rating_bp.route('/<int:gym_rating_id>/', methods=["DELETE"])
@jwt_required()
def remove_a_gym_rating(gym_rating_id):
    """Function to DELETE a single gym rating belonging to the user"""
    #GET statement: SELECT * FROM gym_ratings WHERE GymRating.id == gym_rating_id;
    stmt = db.select(GymRating).where(
        (GymRating.id == gym_rating_id) &
        (GymRating.user_id == current_user.id)
    )
    rating = db.session.scalar(stmt)
  
    # Check that the rating exists
    if not rating:
        return {"message": f"No rating was found with id {gym_rating_id}."}, 404
    
    # Check that the current user owns the rating
    if rating.user_id != current_user.id:
        return {"message": f"{current_user.username}, you are not authorised to delete this rating."}, 403

    # If both checks pass delete the rating
    db.session.delete(rating)
    db.session.commit()

    # Custom confirmation message
    return {"message": f"Climb with id {gym_rating_id} has been removed successfully."}, 200


@gym_rating_bp.route('/admin/<int:gym_rating_id>/', methods=["DELETE"])
@jwt_required()
@admin_required
def remove_any_rating(gym_rating_id):
    """Function to DELETE a single gym rating for admin"""
    #GET statement: SELECT * FROM gym_ratings WHERE GymRating.id == gym_rating_id;
    stmt = db.select(GymRating).where(GymRating.id == gym_rating_id)
    rating = db.session.scalar(stmt)
  
    # Check that the rating exists
    if not rating:
        return {"message": f"No rating was found with id {gym_rating_id}."}, 404

    # If check passes delete the rating
    db.session.delete(rating)
    db.session.commit()

    # Custom confirmation message
    return {"message": f"Climb with id {gym_rating_id} has been removed successfully."}, 200


@gym_rating_bp.route('/<int:gym_rating_id>/', methods=["PUT", "PATCH"])
@jwt_required()
def update_a_gym_rating_record(gym_rating_id):
    """Function to UPDATE a users own gym_rating from the database"""
    # GET statement: SELECT * FROM companies WHERE GymRating.id = gym_rating_id
    stmt = db.select(GymRating).where(
        (GymRating.id==gym_rating_id) &
        (GymRating.user_id==current_user.id)
        )
    gym_rating = db.session.scalar(stmt)

    # Check that the gym rating exists
    if not gym_rating:
        return {"message": f"Rating with id {gym_rating_id} does not exist."}, 404
    
    # Check the current user owns the rating
    if current_user.id != gym_rating.id:
        return {"message": f"{current_user.username}, you are not authorised to update this rating."}, 403
    
    # GET JSON body data
    body_data = request.get_json()

    # Load data into gym_rating through gym_rating_input_schema
    updated_gym_rating = gym_rating_input_schema.load(
        body_data,
        instance = gym_rating,
        session = db.session,
        partial = True
    )

    # Add updated gym rating and commit changes to the database
    db.session.add(updated_gym_rating)
    db.session.commit()

    # Custom confirmation message with updated gym data in JSON format
    return {
        "message": "Rating updated successfully.",
        "details": jsonify(gym_rating_output_schema.dump(updated_gym_rating))
    }, 200