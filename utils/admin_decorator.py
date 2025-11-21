from functools import wraps
from flask_jwt_extended import current_user

def admin_required(fn):
    """
    Creates an admin required wrapper for higher level functions and routes. 
    jwt_required is already called by the majority of user validated routes so is not needed in this function
    """
    @wraps(fn)
    def decorator(*args, **kwargs):
        """
        Actual decorator created here
        
        @wraps will preserve the function name for debugging, and allows for expansion of decorators at a later date.

        args: primary keys and/or foreign keys in the database for finding specific records
        kwargs: unused in all cases so far, however can be used for query parameters for large pages

        only checks for admin status using user.is_admin column
        """
        
        # Checks if current user is admin
        if not current_user or not current_user.is_admin:
            return {"error": "Admin access required"}, 403
        return fn(*args, **kwargs)
    return decorator