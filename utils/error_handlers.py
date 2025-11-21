from jwt import ExpiredSignatureError, InvalidTokenError
from flask_jwt_extended.exceptions import JWTExtendedException
from marshmallow import ValidationError
from sqlalchemy.exc import DataError, IntegrityError
from psycopg2 import errorcodes
from werkzeug.exceptions import BadRequest, InternalServerError


def register_error_handlers(app):

    @app.errorhandler(BadRequest)
    def handle_bad_request(error):
        return {"error": error.description if hasattr(error, 'description') else str(error)}, 400

    @app.errorhandler(JWTExtendedException)
    def handle_jwt_extended_errors(error):
        return {"error": str(error)}, 401
    
    @app.errorhandler(ExpiredSignatureError)
    def handle_expired_signature(error):
        return {"error": "Token has expired. Please log in again."}, 401
    
    @app.errorhandler(InvalidTokenError)
    def handle_invalid_token(error):
        return {"error": "Invalid token."}, 401
    
    @app.errorhandler(ValidationError)
    def handle_validation_error(err):
        # Checks for manual entry of is_admin in json data for creation of new users
        if "is_admin" in err.messages:
            return {
                "error": "Validation failed",
                "details": {
                    "is_admin": "Users cannot set status to admin. Please contact system administrators."
                }
            }
        return {"error": "Validation failed", "details": err.messages}, 400
    
    @app.errorhandler(IntegrityError)
    def handle_integrity_error(err):
        if hasattr(err, "orig") and err.orig:
            if err.orig.pgcode == errorcodes.NOT_NULL_VIOLATION:
                return {"error": f"Required field {err.orig.diag.column_name} cannot be null."}, 400
        
            if err.orig.pgcode == errorcodes.UNIQUE_VIOLATION:
                # Custom error message for reviews to handle extreme edge cases (2 simultaneous reviews)
                # Note: this is more for high traffic situations, but good just to have in case
                constraint_name = err.orig.diag.constraint_name

                # Check for user_id and gym_id unique table constraint '_user_gym_uc' in gym_ratings table
                if constraint_name == '_user_gym_uc':
                    return{"message": "You've already reviewed this gym. Each user can only review a gym once."}, 409
                
                # Handles all other unique violations
                return {"error": err.orig.diag.message_primary}, 400
            
            if err.orig.pgcode == errorcodes.DIVISION_BY_ZERO:
                return {"error": err.org.diag.message_primary}, 400
            
            if err.orig.pgcode == errorcodes.NUMERIC_VALUE_OUT_OF_RANGE:
                return {"error": err.orig.diag.message_primary}, 400
            
            if err.orig.pgcode == errorcodes.FOREIGN_KEY_VIOLATION:
                return {"error": err.orig.diag.message_primary}, 400
        
        return {"error": "Database Integrity error has occured."}, 400
    
    @app.errorhandler(DataError)
    def handle_data_error(err):
        return {"error": err.orig.diag.message_primary}, 400
    
    @app.errorhandler(TimeoutError)
    def handle_timeout_error(error):
        return {"error": "Operation on database has timed out. Please try again."}, 408
           
    @app.errorhandler(InternalServerError)
    def handle_internal_server_error(err):
        return {"error": "Unknown server error occured."}, 500
    
    @app.errorhandler(404)
    def handle_404_error(err):
        return {"error": "API endpoint not found."}, 404
    
    @app.errorhandler(405)
    def handle_405_error(err):
        return {"error": "Method not allowed for this endpoint."}, 405
    
    @app.errorhandler(422)
    def handle_422_error(err):
        return {"error": "Unprocessable entity - unknown validation error"}, 422
    
    @app.errorhandler(Exception)
    def handle_general_error(error):
        app.logger.error(f'Unhandled exception: {str(error)}')
        return {"error": "An unexpected error has occurred. Please try again later."}, 500
