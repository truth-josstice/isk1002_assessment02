from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required


from init import db
from models import Gym, Company
from utils import admin_required

from schemas import (
    gym_schema, 
    gyms_schema
)

gym_bp = Blueprint("gym", __name__, url_prefix="/gyms")

@gym_bp.route('/')
def get_gyms():
    '''Function to GET multiple gyms from the database'''
    # GET statement: SELECT * FROM gyms;
    stmt = db.select(Gym)
    gyms = db.session.scalars(stmt).all()

    # Check that gyms exist
    if not gyms:
        return {"message": "No gym records found."}, 404
    
    # Returns gym data in JSON format
    return jsonify(gyms_schema.dump(gyms))

@gym_bp.route('/<int:gym_id>/')
def get_a_gym(gym_id):
    '''Function to get a single gym record from the database'''
    # GET statements: SELECT * FROM gyms WHERE Gym.id == gym_id;
    stmt = db.select(Gym).where(Gym.id==gym_id)
    gym = db.session.scalar(stmt)

    # Check gym exists
    if not gym:
        return {"message": f"No gym with id {gym_id} exists."},404
    
    # Return gym data in JSON format
    return jsonify(gym_schema.dump(gym))

@gym_bp.route('/', methods=["POST"])
@jwt_required()
@admin_required
def add_a_gym():
    """A function to POST a gym for admins"""
    # GET JSON body data
    body_data = request.get_json()

    # Get company_id from body data
    company_id = body_data.get('company_id')

    # Check if company exists
    stmt = db.select(Company).where(Company.id==company_id)
    company = db.session.scalar(stmt)

    # If company doesn't exist
    if not company:
        return jsonify({"error": f"Company with id {company_id} does not exist"}), 400

    # Create gym from body_data using gym_schema
    new_gym = gym_schema.load(body_data, session=db.session)

    # Add and commit new gym to the database
    db.session.add(new_gym)
    db.session.commit()

    # Return new gym data in JSON format and 201 Created status
    return jsonify(gym_schema.dump(new_gym)), 201

@gym_bp.route('/<int:gym_id>/', methods=["DELETE"])
@jwt_required()
@admin_required
def remove_a_gym(gym_id):
    # GET statement: SELECT * FROM gyms WHERE Gym.id = gym_id;
    stmt = db.select(Gym).where(Gym.id==gym_id)
    gym = db.session.scalar(stmt)

    # Check gym exists
    if not gym:
        return {"message": f"Gym with id {gym_id} does not exist."}, 404
    
    # Delete and commit
    db.session.delete(gym)
    db.session.commit()

    # Custom confirmation message
    return {"message": f"Gym with id {gym_id} deleted successfully."}, 200

@gym_bp.route('/<int:gym_id>/', methods=["PUT", "PATCH"])
@jwt_required()
@admin_required
def update_a_gym_record(gym_id):
    """Function to UPDATE a single gym from the database for admins"""
    # GET statement: SELECT * FROM gyms WHERE Gym.id = gym_id
    stmt = db.select(Gym).where(Gym.id==gym_id)
    gym = db.session.scalar(stmt)

    # Check that the gym exists
    if not gym:
        return {"message": f"Gym with id {gym_id} does not exist."}, 404
    
    # GET JSON body data
    body_data = request.get_json()

    # Load data into gym through gym_schema
    updated_gym = gym_schema.load(
        body_data,
        instance = gym,
        session = db.session,
        partial = True
    )

    # Add updated gym and commit changes to the database
    db.session.add(updated_gym)
    db.session.commit()

    # Custom confirmation message
    return {
        "message": "Gym updated successfully.",
        "details": jsonify(gym_schema.dump(updated_gym))
    }, 200