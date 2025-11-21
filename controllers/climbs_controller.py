from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required

from init import db
from models import Climb
from schemas import (
    climb_input_schema,
    climb_output_schema,
    climbs_output_schema
    )

climb_bp = Blueprint("climb", __name__, url_prefix="/climbs")

@climb_bp.route('/')
def get_climbs():
    '''Function to GET multiple climbs from the database. 
    All visitors to site can use this function.'''
    # GET statement: SELECT * FROM climbs;
    stmt = db.select(Climb)
    climbs = db.session.scalars(stmt).all()

    # Check a climb exists
    if not climbs:
        return {"message": "No climb records found."}, 404
    
    # Return all climb data in JSON format
    return jsonify(climbs_output_schema.dump(climbs))

@climb_bp.route('/', methods=["POST"])
@jwt_required()
def new_climb():
    """Function to add a climb to the database using current user."""
    # Get data from the REQUEST body
    body_data = request.get_json()

    # Create new climb using climb_input_schema
    new_climb = climb_input_schema.load(body_data, session=db.session)

    # Assign current user to new climb
    new_climb.user = current_user
    
    # Add new climb to session and commit
    db.session.add(new_climb)
    db.session.commit()
    
    # Return the new climb in JSON format
    return jsonify(climb_output_schema.dump(new_climb)), 201

@climb_bp.route('/batch/', methods=["POST"])
@jwt_required()
def new_climbs():
    """Function to add multiple climbs using current user"""
    # Get data from the REQUEST body
    body_data = request.get_json()

    # Create empty batch list for new climbs
    new_climbs = []

    # For loop to loop through batch data
    for data in body_data:
        new_climb = climb_input_schema.load(data, session=db.session) # loads the climb
        new_climb.user = current_user # attaches current user as user relationship
        new_climbs.append(new_climb) # appends schema output to batch list
    
    # Add all new climbs and commit to the database
    db.session.add_all(new_climbs)
    db.session.commit()
    
    # Return the new climbs data in JSON format
    return jsonify(climbs_output_schema.dump(new_climbs)), 201

@climb_bp.route('/<int:climb_id>/', methods=["DELETE"])
@jwt_required()
def remove_a_climb(climb_id):
    """Function to DELETE a single climb belonging to the user"""
    #GET statement: SELECT * FROM climbs WHERE Climb.id == climb_id;
    stmt = db.select(Climb).where(Climb.id == climb_id)
    climb = db.session.scalar(stmt)
  
    # Check that the climb exists
    if not climb:
        return {"message": f"No climb was found with id {climb_id}."}, 404
    
    # Check that the current user owns the climb
    if climb.user_id != current_user.id:
        return {"message": f"{current_user.username}, you are not authorised to delete this climb."}, 403

    # If both checks pass delete the climb and commit
    db.session.delete(climb)
    db.session.commit()

    # Custom confirmation message
    return {"message": f"Climb with id {climb_id} has been removed successfully."},200

@climb_bp.route('/<int:climb_id>/', methods=["PUT", "PATCH"])
@jwt_required()
def update_a_climb_record(climb_id):
    """Function to UPDATE a single climb belonging to the user"""
    # GET statement: SELECT * FROM climbs WHERE Climb.id = climb_id
    stmt = db.select(Climb).where(Climb.id==climb_id)
    climb = db.session.scalar(stmt)

    # Check that the climb exists
    if not climb:
        return {"message": f"Climb with id {climb_id} does not exist."}, 404
    
    # Check that the current user owns the climb
    if climb.user_id != current_user.id:
        return {"message": f"{current_user.username}, you are not authorised to update this climb."}, 403
    
    # GET JSON body data
    body_data = request.get_json()

    # Load data into climb through climb_input_schema
    updated_climb = climb_input_schema.load(
        body_data,
        instance = climb,
        session = db.session,
        partial = True
    )

    # Add updated climb and commit changes to the database
    db.session.add(updated_climb)
    db.session.commit()

    # Custom confirmation and updated climb data in JSON format
    return {
        "message": "Climb updated successfully",
        "details": jsonify(climb_output_schema.dump(updated_climb))
        }, 200