# API Documentation

---

## Table of Contents

1. [API Details](#api-details)
2. [Endpoint List](#endpoint-list)
3. [Endpoint Details](#endpoint-details)
    - [Authentication Routes](#authentication-routes)
    - [Info Routes](#info-routes)
    - [User Routes](#user-routes)
    - [Attempt Routes](#attempt-routes)
    - [Climb Routes](#climb-routes)
    - [Company Routes](#company-routes)
    - [Gym Routes](#gym-routes)
    - [Gym Rating Routes](#gym-ratings-routes)

---

## API Details

### Local URL

`http://localhost:5000`

### Deployment URL

`<paste deployment address here>/`

### Authentication & Encryption

- Most routes require JWT token in Authorization header:
  - 'Authorization: Bearer <your_token>'
- Password hashing is handled with `bcrypt` and stored in database as hashed value

---

## Endpoint List

| Endpoint                               | Methods     | Rule                                     |
|----------------------------------------|-------------|------------------------------------------|
| `attempt.add_an_attempt`               | POST        | `/attempts/`                             |
| `attempt.get_a_single_attempt`         | GET         | `/attempts/<int:attempt_id>/`             |
| `attempt.get_all_attempts`             | GET         | `/attempts/all/`                         |
| `attempt.get_user_attempts`            | GET         | `/attempts/`                             |
| `attempt.remove_an_attempt`            | DELETE      | `/attempts/admin/remove/<int:attempt_id>/`|
| `auth.register_user`                   | POST        | `/register`                              |
| `auth.user_delete_profile`             | DELETE      | `/delete`                                |
| `auth.user_login`                      | POST        | `/login`                                 |
| `auth.user_logout`                     | GET         | `/logout`                                |
| `climb.get_climbs`                     | GET         | `/climbs/`                               |
| `climb.new_climb`                      | POST        | `/climbs/`                               |
| `climb.new_climbs`                     | POST        | `/climbs/batch/`                         |
| `climb.remove_a_climb`                 | DELETE      | `/climbs/<int:climb_id>/`                |
| `climb.update_a_climb_record`          | PATCH, PUT  | `/climbs/<int:climb_id>/`                |
| `company.add_a_company`                | POST        | `/companies/`                            |
| `company.get_a_company`                | GET         | `/companies/<int:company_id>/`            |
| `company.get_companies`                | GET         | `/companies/`                            |
| `company.remove_a_company`             | DELETE      | `/companies/<int:company_id>/`            |
| `company.update_a_company_record`      | PATCH, PUT  | `/companies/<int:company_id>/`           |
| `gym.add_a_gym`                        | POST        | `/gyms/`                                 |
| `gym.get_a_gym`                        | GET         | `/gyms/<int:gym_id>/`                    |
| `gym.get_gyms`                         | GET         | `/gyms/`                                 |
| `gym.remove_a_gym`                     | DELETE      | `/gyms/<int:gym_id>/`                    |
| `gym.update_a_gym_record`              | PATCH, PUT  | `/gyms/<int:gym_id>/`                    |
| `gym_rating.add_rating`                | POST        | `/gym-ratings/`                          |
| `gym_rating.get_a_gym_rating`          | GET         | `/gym-ratings/<int:rating_id>/`          |
| `gym_rating.get_a_gyms_reviews`        | GET         | `/gym-ratings/by-gym/<int:gym_id>/`      |
| `gym_rating.get_a_users_reviews`       | GET         | `/gym-ratings/by-user/<int:user_id>/`    |
| `gym_rating.get_gym_info`              | GET         | `/gym-ratings/`                          |
| `gym_rating.get_gym_ratings`           | GET         | `/gym-ratings/all/`                      |
| `gym_rating.remove_a_gym_rating`       | DELETE      | `/gym-ratings/<int:gym_rating_id>/`      |
| `gym_rating.remove_any_rating`         | DELETE      | `/gym-ratings/admin/<int:gym_rating_id>/`|
| `gym_rating.update_a_gym_rating_record`| PATCH, PUT  | `/gym-ratings/<int:gym_rating_id>/`      |
| `info.add_skill`                       | POST        | `/learn/skills/`                         |
| `info.add_style`                       | POST        | `/learn/styles/`                         |
| `info.api_info`                        | GET         | `/learn/about-api/`                      |
| `info.get_skill_levels`                | GET         | `/learn/skills/`                         |
| `info.get_styles`                      | GET         | `/learn/styles/`                         |
| `info.remove_skill`                    | DELETE      | `/learn/skills/<int:skill_level_id>/`    |
| `info.remove_style`                    | DELETE      | `/learn/styles/<int:style_id>/`          |
| `info.update_skill`                    | PATCH, PUT  | `/learn/skills/<int:skill_level_id>/`    |
| `info.update_style`                    | PATCH, PUT  | `/learn/styles/<int:style_id>/`          |
| `user.add_new_user`                    | POST        | `/users/`                                |
| `user.delete_user`                     | DELETE      | `/users/<int:user_id>/`                  |
| `user.get_user_profile`                | GET         | `/users/profile/`                        |
| `user.get_users`                       | GET         | `/users/`                                |
| `user.make_user_admin`                 | PATCH       | `/users/admin/<int:user_id>/grant/`      |
| `user.revoke_user_admin`               | PATCH       | `/users/admin/<int:user_id>/revoke/`     |
| `user.update_user_profile`             | PATCH, PUT  | `/users/update-profile/`                 |

---

## Endpoint Details

Detailed description of all routes below!

---

## Authentication Routes

### `POST /login`

**Authenticates a user and returns a JWT access token.**

- Content-Type: `application/json`

### Request

```json
{
    "username": "testuser",
    "password": "SecurePassword123!"
}
```

### Responses

**200 OK**  

```json
{
    "token": "<jwt_token_here>"
}
```

**400 Bad Request**  

```json
{
    "message": "Username and password are required",
    "unknown_field": ["Unknown field."]
}
```

**401 Unauthorized**  

```json
{
    "message": "Invalid username or password"
}
```

### `POST /register`

**Registers a new user and returns a JWT access token.**

- Content-Type: `application/json`

### Request Body

```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "first_name": "Test",
    "last_name": "User",
    "skill_level_id": 1
}
```

### Responses

**201 Created**  

```json
{
    "message": "User created successfully.",
    "access_token": "<jwt_token_here>",
    "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "skill_level": {
            "id": 1,
            "name": "Beginner"
        },
        "is_admin": false
    }
}
```

**409 Conflict** (email already exists)

```json
{
    "message": "An account with this email already exists, please login or enter a different email."
}
```

**409 Conflict** (username already exists)

```json
{
    "message": "An account with the username testuser already exists. Please choose a different username."
}
```

**400 Bad Request**  

```json
{
    "unknown_field": ["Unknown field."]
}
```

### `GET /logout`

**Logs out a user (JWT token will expire shortly).**

- Requires: `Authorization: Bearer <token>/`

### Responses

**200 OK**  

```json
{
    "message": "Successfully logged out, access token will expire shortly."
}
```

### `DELETE /delete`

**Deletes the current authenticated user's profile.**

- Requires: `Authorization: Bearer <token>/`

### Responses

**200 OK**  

```json
{
    "message": "Your user account and all associated data has been deleted. Please join us again sometime."
}
```

↑ [Back to Top](#api-documentation)

---

## Info Routes

Information Routes (Lookup Tables)

### `GET /learn/styles/`

Retrieves all climbing style records. Publicly accessible.

### Responses

**200 OK**  

```json
[
  {
    "id": 1,
    "name": "Slab",
    "description": "A style of climb usually on a flat vertical wall, focussing on balance, footwork and precision."
  },
  {
    "id": 2,
    "name": "Dyno",
    "description": "A style of climb focussing on powerful dynamic movement, often including jumping or running actions."
  }
]
```

**404 Not Found**  

```json
{
  "message": "No styles found"
}
```

### `GET /learn/skills/`

Retrieves all skill level records. Publicly accessible.

### Responses

**200 OK**  

```json
[
  {
    "id": 1,
    "level": "Beginner",
    "description": "Just starting your climbing journey, you might know a few terms and styles. Climbing the lowest few difficulty grades."
  },
  {
    "id": 2,
    "level": "Intermediate",
    "description": "You've learned most of the terms, you've climbed a lot! Climbing the middle difficulty grades, maybe hitting the plateau!"
  }
]
```

**404 Not Found**  

```json
{
  "message": "No skills found"
}
```

### `POST /learn/styles/`

Creates a new climbing style. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Content-Type: application/json

### Request Body

```json
{
  "name": "Compression",
  "description": "A style requiring opposing pressure on holds or features."
}
```

### Responses

**201 Created**  

```json
{
  "message": "Style Compression added successfully"
}
```

**400 Bad Request**  

```json
{
  "error": {
    "name": ["Name cannot exceed 32 characters"],
    "description": ["Description cannot exceed 255 characters"],
    "unknown_field": ["Unknown field."]
  }
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

### `POST /learn/skills/`

Creates a new skill level. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Content-Type: application/json

### Request Body

```json
{
  "level": "Elite",
  "description": "Competing at a national or international level, climbing the hardest grades."
}
```

### Responses

**201 Created**  

```json
{
  "message": "Style Elite added successfully"
}
```

**400 Bad Request**

```json
{
  "error": {
    "level": ["Level cannot exceed 32 characters"],
    "description": ["Description cannot exceed 255 characters"],
    "unknown_field": ["Unknown field."]
  }
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

### `DELETE /learn/styles/<style_id>/`

Deletes a specific style. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Path Parameters:
  - style_id (integer, required): The ID of the style to delete.

### Responses

**200 OK**  

```json
{
  "message": "Style with id 3 deleted successfully"
}
```

**404 Not Found**  

```json
{
  "message": "Style with id 999 does not exist"
}
```

**403 Forbidden**

```json
{
  "message": "Administrator access required"
}
```

### `DELETE /learn/skills/<skill_level_id>/`

Deletes a specific skill level. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Path Parameters:
  - skill_level_id (integer, required): The ID of the skill level to delete.

### Responses

**200 OK**  

```json
{
  "message": "Skill level with id 3 deleted successfully"
}
```

**404 Not Found**  

```json
{
  "message": "Skill level with id 999 does not exist"
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

### `PUT/PATCH /learn/styles/<style_id>/`

Updates a specific style. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Content-Type: application/json
- Path Parameters:
  - style_id (integer, required): The ID of the style to update.

### Request Body (Partial accepted)

```json
{
  "description": "Updated description focusing on precise footwork and body tension."
}
```

### Responses

**200 OK**  

```json
{
  "message": "Style with id 1 updated successfully",
  "details": {
    "id": 1,
    "name": "Slab",
    "description": "Updated description focusing on precise footwork and body tension."
  }
}
```

**404 Not Found**  

```json
{
  "message": "Style with id 999 does not exist"
}
```

**400 Bad Request**  

```json
{
  "error": {
    "description": ["Description cannot exceed 255 characters"]
  }
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

### `PUT/PATCH /learn/skills/<skill_level_id>/`

Updates a specific skill level. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Content-Type: application/json
- Path Parameters:
  - skill_level_id (integer, required): The ID of the skill level to update.

### Request Body (Partial accepted)

```json
{
  "description": "Updated description for beginner climbers starting their journey."
}
```

### Responses

**200 OK**  

```json
{
  "message": "Skill level with id 1 updated successfully",
  "details": {
    "id": 1,
    "level": "Beginner",
    "description": "Updated description for beginner climbers starting their journey."
  }
}
```

**404 Not Found**

```json
{
  "message": "Skill level with id 999 does not exist"
}
```

**400 Bad Request**

```json
{
  "error": {
    "description": ["Description cannot exceed 255 characters"]
  }
}
```

**403 Forbidden**

```json
{
  "message": "Administrator access required"
}
```

### `GET /learn/about-api/`

Returns basic information about the API. Publicly accessible.

### Responses

**200 OK**  

```json
{
  "message": "Climbing Tracker API",
  "version": "1.0",
  "assessment": "DEV1002 - Assessment 03",
  "documentation": "See API DOCUMENTATION.md for endpoint details"
}
```

↑ [Back to Top](#api-documentation)

---

## User Routes

### `GET /users/`

Retrieves all user records. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only

### Responses

**200 OK**  

```json
[
  {
    "id": 1,
    "username": "adminuser",
    "email": "email@email.com",
    "first_name": "First",
    "last_name": "Last",
    "user_skill_level": {
      "id": 1,
      "level": "Beginner",
      "description": "Just starting your climbing journey, you might know a few terms and styles. Climbing the lowest few difficulty grades."
    }
  },
  {
    "id": 2,
    "username": "username2",
    "email": "email1@email.com",
    "first_name": "First",
    "last_name": "Last",
    "user_skill_level": {
      "id": 2,
      "level": "Intermediate",
      "description": "You've learned most of the terms, you've climbed a lot! Climbing the middle difficulty grades, maybe hitting the plateau!"
    }
  }
]
```

**404 Not Found**  

```json
{
  "message": "No user records found."
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

### `GET /users/profile/`

Retrieves the profile of the currently authenticated user.

- Authentication: Required (JWT)

### Responses

**200 OK**  

```json
{
  "id": 1,
  "username": "adminuser",
  "email": "email@email.com",
  "first_name": "First",
  "last_name": "Last",
  "user_skill_level": {
    "id": 1,
    "level": "Beginner",
    "description": "Just starting your climbing journey, you might know a few terms and styles. Climbing the lowest few difficulty grades."
  }
}
```

### `PUT/PATCH /users/`

Updates the profile of the currently authenticated user.

- Authentication: Required (JWT)
- Content-Type: application/json

### Request Body (Partial accepted)

```json
{
  "first_name": "Updated",
  "last_name": "Name",
  "skill_level_id": 2
}
```

### Responses

**200 OK**  

```json
{
  "message": "User updated successfully.",
  "details": {
    "id": 1,
    "username": "adminuser",
    "email": "email@email.com",
    "first_name": "Updated",
    "last_name": "Name",
    "user_skill_level": {
      "id": 2,
      "level": "Intermediate",
      "description": "You've learned most of the terms, you've climbed a lot! Climbing the middle difficulty grades, maybe hitting the plateau!"
    }
  }
}
```

**400 Bad Request**  

```json
{
  "error": {
    "first_name": ["First name cannot exceed 100 characters"],
    "email": ["Please enter a valid email address"]
  }
}
```

### `POST /users/`

Creates a new user. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Content-Type: application/json

### Request Body

```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "first_name": "New",
  "last_name": "User",
  "skill_level_id": 1
}
```

### Responses

**201 Created**  

```json
{
  "id": 7,
  "username": "newuser",
  "email": "newuser@example.com",
  "first_name": "New",
  "last_name": "User",
  "user_skill_level": {
    "id": 1,
    "level": "Beginner",
    "description": "Just starting your climbing journey, you might know a few terms and styles. Climbing the lowest few difficulty grades."
  }
}
```

**409 Conflict**  

```json
{
  "message": "An account with this email already exists, please login or enter a different email."
}
```

**409 Conflict**  

```json
{
  "message": "An account with the username newuser already exists. Please choose a different username."
}
```

**400 Bad Request**  

```json
{
  "error": {
    "password": ["Password must be at least 12 characters long and include uppercase, lowercase, numbers, and special characters"],
    "unknown_field": ["Unknown field."]
  }
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

### `DELETE /users/<user_id>/`

Deletes a specific user. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Path Parameters:
  - user_id (integer, required): The ID of the user to delete.

### Responses

**200 OK**  

```json
{
  "message": "User with id 3 deleted successfully."
}
```

**404 Not Found**  

```json
{
  "message": "User with id 999 does not exist."
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

### `PATCH /users/admin/<user_id>/grant/`

Grants admin privileges to a user. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Path Parameters:
  - user_id (integer, required): The ID of the user to grant admin privileges.

### Responses

**200 OK**  

```json
{
  "message": "User username2 has been granted admin privileges.",
  "details": {
    "id": 2,
    "username": "username2",
    "email": "email1@email.com",
    "first_name": "First",
    "last_name": "Last",
    "user_skill_level": {
      "id": 2,
      "level": "Intermediate",
      "description": "You've learned most of the terms, you've climbed a lot! Climbing the middle difficulty grades, maybe hitting the plateau!"
    }
  }
}
```

**404 Not Found**  

```json
{
  "message": "User with id 999 does not exist."
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

### `PATCH /users/admin/<user_id>/revoke/`

Revokes admin privileges from a user. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Path Parameters:
  - user_id (integer, required): The ID of the user to revoke admin privileges.

### Responses

**200 OK**  

```json
{
  "message": "User adminuser's admin privileges have been revoked.",
  "details": {
    "id": 1,
    "username": "adminuser",
    "email": "email@email.com",
    "first_name": "First",
    "last_name": "Last",
    "user_skill_level": {
      "id": 1,
      "level": "Beginner",
      "description": "Just starting your climbing journey, you might know a few terms and styles. Climbing the lowest few difficulty grades."
    }
  }
}
```

**404 Not Found**  

```json
{
  "message": "User with id 999 does not exist."
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

↑ [Back to Top](#api-documentation)

---

## Attempt Routes

### `GET /attempts/`

Retrieves all attempt records for the currently authenticated user.

- Authentication: Required (JWT)
- Authorization: User can only access their own attempts.

### Responses

**200 OK**  

```json
{
  "username": "adminuser",
  "attempts": [
    {
      "id": 1,
      "climb": {
        "id": 1,
        "gym_name": "The Gym",
        "style_name": "Slab"
      },
      "fun_rating": 4,
      "comments": "This was hard, almost have it",
      "completed": false,
      "attempted_at": "2025-01-15T10:30:00"
    }
  ]
}
```

**404 Not Found**  

```json
{
  "message": "No attempt records found."
}
```

### `GET /attempts/<attempt_id>/`

Retrieves a single attempt record by its ID. The user must own the attempt.

- Authentication: Required (JWT)
- Path Parameters:
  - attempt_id (integer, required): The ID of the attempt to retrieve.

### Responses

**200 OK**  

```json
{
  "climb_id": 5,
  "fun_rating": 5,
  "comments": "I usually don't like dynamic climbs but this was heaps of fun!",
  "completed": true
}
```

**404 Not Found**  

```json
{
  "message": "No attempt record found."
}
```

### `POST /attempts/`

Creates a new attempt record for the currently authenticated user.

- Authentication: Required (JWT)
- Content-Type: application/json

**Request Body**  

```json
{
  "climb_id": 5,
  "fun_rating": 5,
  "comments": "I usually don't like dynamic climbs but this was heaps of fun!",
  "completed": true
}
```

### Responses

**200 OK**  

```json
{
  "id": 6,
  "climb": {
    "id": 5,
    "gym_name": "The Other Gym",
    "style_name": "Dyno"
  },
  "fun_rating": 5,
  "comments": "I usually don't like dynamic climbs but this was heaps of fun!",
  "completed": true,
  "attempted_at": "2025-01-20T11:45:00"
}
```

**400 Bad Request**  

```json
{
  "error": {
    "fun_rating": ["Ratings must be between 1-5"],
    "comments": ["Comments cannot exceed 500 characters"],
    "unknown_field": ["Unknown field."]
  }
}
```

### `GET /attempts/all/`

Retrieves all attempt records from all users. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only

### Responses

**200 OK**  

```json[
  {
    "id": 1,
    "climb": {
      "id": 1,
      "user_id": 1,
      "gym_id": 1,
      "style_id": 1,
      "difficulty_grade": "Purple",
      "set_date": "2025-01-01"
    },
    "fun_rating": 4,
    "comments": "This was hard, almost have it",
    "completed": false,
    "attempted_at": "2025-01-15T10:30:00"
  }
]
```

**404 Not Found**  

```json
{ 
    "message": "No attempt records were found." 
}
```

**403 Forbidden**  

```json
{ 
    "message": "Administrator access required"
}
```

### `DELETE /attempts/<attempt_id>/`

Deletes a specific attempt record. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Path Parameters:
  - attempt_id (integer, required): The ID of the attempt to delete.

### Responses

**200 OK**  

```json
{ 
    "message": "Attempt with id 3 deleted successfully." 
}
```

**404 Not Found**  

```json
{ 
    "message": "Attempt with id 999 does not exist." 
}
```

**403 Forbidden**  

```json
{ 
    "message": "Administrator access required" 
}
```

↑ [Back to Top](#api-documentation)

---

## Climb Routes

### `GET /climbs/`

Retrieves all climb records. Publicly accessible.

### Responses

**200 OK**  

```json
[
  {
    "id": 1,
    "gym_name": "The Gym",
    "username": "adminuser",
    "style_name": "Slab",
    "difficulty_grade": "Purple",
    "set_date": "2025-01-01"
  },
  {
    "id": 2,
    "gym_name": "The Gym",
    "username": "adminuser",
    "style_name": "Dyno",
    "difficulty_grade": "Blue",
    "set_date": "2025-01-01"
  }
]
```

**404 Not Found**  

```json
{
  "message": "No climb records found."
}
```

### `POST /climbs/`

Creates a new climb record for the currently authenticated user.

- Authentication: Required (JWT)
- Content-Type: application/json

### Request Body

```json
{
  "gym_id": 1,
  "style_id": 3,
  "difficulty_grade": "v4",
  "set_date": "2025-01-20"
}
```

### Responses

**201 Created**  

```json
{
  "id": 7,
  "gym_name": "The Gym",
  "username": "adminuser",
  "style_name": "Overhang",
  "difficulty_grade": "v4",
  "set_date": "2025-01-20"
}
```

**400 Bad Request**  

```json
{
  "error": {
    "difficulty_grade": ["Difficulty grade cannot exceed 32 characters"],
    "gym_id": ["Missing data for required field."],
    "unknown_field": ["Unknown field."]
  }
}
```

### `POST /climbs/batch/`

Creates multiple new climb records for the currently authenticated user in a single request.

- Authentication: Required (JWT)
- Content-Type: application/json

### Request Body

```json
[
  {
    "gym_id": 2,
    "style_id": 4,
    "difficulty_grade": "5",
    "set_date": "2025-01-21"
  },
  {
    "gym_id": 2,
    "style_id": 2,
    "difficulty_grade": "6a",
    "set_date": "2025-01-21"
  }
]
```

### Responses

**201 Created**  

```json
[
  {
    "id": 8,
    "gym_name": "The Gym 2",
    "username": "adminuser",
    "style_name": "Vertical",
    "difficulty_grade": "5",
    "set_date": "2025-01-21"
  },
  {
    "id": 9,
    "gym_name": "The Gym 2",
    "username": "adminuser",
    "style_name": "Dyno",
    "difficulty_grade": "6a",
    "set_date": "2025-01-21"
  }
]
```

**400 Bad Request**  

```json
{
  "error": {
    "0": {
      "difficulty_grade": ["Difficulty grade cannot exceed 32 characters"],
      "unknown_field": ["Unknown field."]
    }
  }
}
```

### `DELETE /climbs/<climb_id>/`

Deletes a specific climb record. User must own the climb.

- Authentication: Required (JWT)
- Path Parameters:
  - climb_id (integer, required): The ID of the climb to delete.

### Responses

**200 OK**  

```json
{
  "message": "Climb with id 3 has been removed successfully."
}
```

**404 Not Found**  

```json
{
  "message": "No climb was found with id 999."
}
```

**403 Forbidden**  

```json
{
  "message": "adminuser, you are not authorised to delete this climb."
}
```

### `PUT/PATCH /climbs/<climb_id>/`

Updates a specific climb record. User must own the climb.

- Authentication: Required (JWT)
- Content-Type: application/json
- Path Parameters:
  - climb_id (integer, required): The ID of the climb to update.

### Request Body (Partial accepted)

```json
{
  "difficulty_grade": "v5",
  "set_date": "2025-01-22"
}
```

### Responses

**200 OK**  

```json
{
  "message": "Climb updated successfully",
  "details": {
    "id": 4,
    "gym_name": "The Gym 2",
    "username": "username2",
    "style_name": "Slab",
    "difficulty_grade": "v5",
    "set_date": "2025-01-22"
  }
}
```

**404 Not Found**  

```json
{
  "message": "Climb with id 999 does not exist."
}
```

**403 Forbidden**  

```json
{
  "message": "username2, you are not authorised to update this climb."
}
```

**400 Bad Request**  

```json
{
  "error": {
    "difficulty_grade": ["Difficulty grade cannot exceed 32 characters"]
  }
}
```

↑ [Back to Top](#api-documentation)

---

## Company Routes

### `GET /companies/`

Retrieves all company records. Publicly accessible.

### Responses

**200 OK** 

```json
[
  {
    "id": 1,
    "name": "Company 1",
    "website": "https://example.com",
    "gym": [
      {
        "name": "The Gym",
        "street_address": "123 Fake Street"
      },
      {
        "name": "The Gym 2",
        "street_address": "456 New Fake Street"
      }
    ]
  },
  {
    "id": 2,
    "name": "Company 2",
    "website": "https://test.com",
    "gym": [
      {
        "name": "The Other Gym",
        "street_address": "789 Fake Street"
      },
      {
        "name": "The Other Gym But In Melbourne",
        "street_address": "1011 Fake Street"
      }
    ]
  }
]
```

**404 Not Found**  

```json
{
  "message": "No company records found."
}
```

### `GET /companies/<company_id>/`

Retrieves a single company record by its ID. Publicly accessible.

- Path Parameters:
  - company_id (integer, required): The ID of the company to retrieve.

### Responses

**200 OK**  

```json
{
  "id": 1,
  "name": "Company 1",
  "website": "https://example.com",
  "gyms": [
    {
      "name": "The Gym",
      "street_address": "123 Fake Street"
    },
    {
      "name": "The Gym 2",
      "street_address": "456 New Fake Street"
    }
  ]
}
```

**404 Not Found**  

```json
{
  "message": "Company with id 999 not found."
}
```

### `POST /companies/`

Creates a new company record. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Content-Type: application/json

### Request Body

```json
{
  "name": "Climb Co",
  "website": "https://climbco.com"
}
```

### Responses

**200 OK**  

```json
{
  "id": 3,
  "name": "Climb Co",
  "website": "https://climbco.com",
  "gym": []
}
```

**400 Bad Request**  

```json
{
  "error": {
    "name": ["Company name must be under 100 characters"],
    "website": ["Please provide a valid URL"],
    "unknown_field": ["Unknown field."]
  }
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

### `DELETE /companies/<company_id>/`

Deletes a specific company record. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Path Parameters:
  - company_id (integer, required): The ID of the company to delete.

### Responses

**200 OK**  

```json
{
  "message": "Company with id 3 deleted successfully."
}
```

**404 Not Found**  

```json
{
  "message": "Company with id 999 does not exist."
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

### `PUT/PATCH /companies/<company_id>/`

Updates a specific company record. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Content-Type: application/json
- Path Parameters:
  - company_id (integer, required): The ID of the company to update.

### Request Body (Partial accepted)

```json
{
  "website": "https://new-website.example.com"
}
```

### Responses

**200 OK**  

```json
{
  "message": "Company updated successfully.",
  "details": {
    "id": 1,
    "name": "Company 1",
    "website": "https://new-website.example.com",
    "gyms": [
      {
        "name": "The Gym",
        "street_address": "123 Fake Street"
      },
      {
        "name": "The Gym 2",
        "street_address": "456 New Fake Street"
      }
    ]
  }
}
```

**404 Not Found**  

```json
{
  "message": "Company with id 999 does not exist."
}
```

**400 Bad Request**  

```json
{
  "error": {
    "website": ["Please provide a valid URL"]
  }
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

↑ [Back to Top](#api-documentation)

---

## Gym Routes

### `GET /gyms/`

Retrieves all gym records. Publicly accessible.

### Responses

**200 OK**  

```json
[
  {
    "id": 1,
    "company_id": 1,
    "name": "The Gym",
    "city": "Melbourne",
    "street_address": "123 Fake Street"
  },
  {
    "id": 2,
    "company_id": 1,
    "name": "The Gym 2",
    "city": "Melbourne",
    "street_address": "456 New Fake Street"
  },
  {
    "id": 3,
    "company_id": 2,
    "name": "The Other Gym",
    "city": "Sydney",
    "street_address": "789 Fake Street"
  },
  {
    "id": 4,
    "company_id": 2,
    "name": "The Other Gym But In Melbourne",
    "city": "Melbourne",
    "street_address": "1011 Fake Street"
  }
]
```

**404 Not Found**  

```json
{
  "message": "No gym records found."
}
```

### `GET /gyms/<gym_id>/`

Retrieves a single gym record by its ID. Publicly accessible.

- Path Parameters:
  - gym_id (integer, required): The ID of the gym to retrieve.

### Responses

**200 OK**  

```json
{
  "id": 1,
  "company_id": 1,
  "name": "The Gym",
  "city": "Melbourne",
  "street_address": "123 Fake Street"
}
```

**404 Not Found**  

```json
{
  "message": "No gym with id 999 exists."
}
```

### `POST /gyms/`

Creates a new gym record. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Content-Type: application/json

### Request Body

```json
{
  "company_id": 1,
  "city": "Brisbane",
  "street_address": "789 New Street",
  "name": "The Brisbane Gym"
}
```

### Responses

**201 Created**  

```json
{
  "id": 5,
  "company_id": 1,
  "name": "The Brisbane Gym",
  "city": "Brisbane",
  "street_address": "789 New Street"
}
```

**400 Bad Request**  

```json
{
  "error": {
    "city": ["City cannot exceed 100 characters"],
    "street_address": ["Street address cannot exceed 255 characters"],
    "unknown_field": ["Unknown field."]
  }
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

### `DELETE /gyms/<gym_id>/`

Deletes a specific gym record. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Path Parameters:
  - gym_id (integer, required): The ID of the gym to delete.

### Responses

**200 OK**  

```json
{
  "message": "Gym with id 3 deleted successfully."
}
```

**404 Not Found**  

```json
{
  "message": "Gym with id 999 does not exist."
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

### `PUT/PATCH /gyms/<gym_id>/`

Updates a specific gym record. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Content-Type: application/json
- Path Parameters:
  - gym_id (integer, required): The ID of the gym to update.

### Request Body (Partial accepted)

```json
{
  "city": "Sydney",
  "name": "The Sydney Location"
}
```

### Responses

**200 OK**  

```json
{
  "message": "Gym updated successfully.",
  "details": {
    "id": 3,
    "company_id": 2,
    "name": "The Sydney Location",
    "city": "Sydney",
    "street_address": "1011 Fake Street"
  }
}
```

**404 Not Found**  

```json
{
  "message": "Gym with id 999 does not exist."
}
```

**400 Bad Request**  

```json
{
  "error": {
    "name": ["Name cannot exceed 100 characters"]
  }
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

↑ [Back to Top](#api-documentation)

---

## Gym Ratings Routes

### `GET /gym-ratings/`

Retrieves aggregated gym rating information including average difficulty, review count, and recommended skill level for each gym. Publicly accessible.

### Responses

**200 OK**  

```json
[
  {
    "gym": {
      "name": "The Gym",
      "city": "Melbourne"
    },
    "average_difficulty_rating": 6.75,
    "total_reviews": 4,
    "recommended_skill_level": {
      "level": "Beginner",
      "description": "Just starting your climbing journey, you might know a few terms and styles. Climbing the lowest few difficulty grades."
    }
  },
  {
    "gym": {
      "name": "The Gym 2",
      "city": "Melbourne"
    },
    "average_difficulty_rating": 8.5,
    "total_reviews": 5,
    "recommended_skill_level": {
      "level": "Intermediate",
      "description": "You've learned most of the terms, you've climbed a lot! Climbing the middle difficulty grades, maybe hitting the plateau!"
    }
  }
]
```

**404 Not Found**  

```json
{
  "message": "No gyms have been reviewed yet!"
}
```

### `GET /gym-ratings/all/`

Retrieves all individual gym rating records. Publicly accessible.

### Responses

**200 OK**  

```json
[
  {
    "gym": {
      "id": 1,
      "name": "The Gym"
    },
    "user": {
      "id": 1,
      "username": "adminuser",
      "user_skill_level": {
        "level": "Beginner"
      }
    },
    "recommended_skill_level": {
      "level": "Beginner"
    },
    "difficulty_rating": 7,
    "review": "This gym is great for all skill levels, it's beginner friendly"
  },
  {
    "gym": {
      "id": 2,
      "name": "The Gym 2"
    },
    "user": {
      "id": 2,
      "username": "username2",
      "user_skill_level": {
        "level": "Intermediate"
      }
    },
    "recommended_skill_level": {
      "level": "Intermediate"
    },
    "difficulty_rating": 10,
    "review": "This gym has some tough climbs, even the easiest are intermediate level"
  },
  {
    "gym": {
      "id": 1,
      "name": "The Gym"
    },
    "user": {
      "id": 2,
      "username": "username2",
      "user_skill_level": {
        "level": "Intermediate"
      }
    },
    "recommended_skill_level": {
      "level": "Beginner"
    },
    "difficulty_rating": 6,
    "review": "Lots of climbs in the lower grades, even in the overhang section!"
  },
  {
    "gym": {
      "id": 2,
      "name": "The Gym 2"
    },
    "user": {
      "id": 1,
      "username": "adminuser",
      "user_skill_level": {
        "level": "Beginner"
      }
    },
    "recommended_skill_level": {
      "level": "Intermediate"
    },
    "difficulty_rating": 9,
    "review": "This gym tested my patience"
  },
  {
    "gym": {
      "id": 3,
      "name": "The Other Gym"
    },
    "user": {
      "id": 1,
      "username": "adminuser",
      "user_skill_level": {
        "level": "Beginner"
      }
    },
    "recommended_skill_level": {
      "level": "Advanced"
    },
    "difficulty_rating": 10,
    "review": "This gym really tests you"
  },
  {
    "gym": {
      "id": 3,
      "name": "The Other Gym"
    },
    "user": {
      "id": 2,
      "username": "username2",
      "user_skill_level": {
        "level": "Intermediate"
      }
    },
    "recommended_skill_level": {
      "level": "Intermediate"
    },
    "difficulty_rating": 10,
    "review": "Test review string"
  },
  {
    "gym": {
      "id": 1,
      "name": "The Gym"
    },
    "user": {
      "id": 3,
      "username": "username4",
      "user_skill_level": {
        "level": "Advanced"
      }
    },
    "recommended_skill_level": {
      "level": "Intermediate"
    },
    "difficulty_rating": 6,
    "review": "I'll review the test"
  },
  {
    "gym": {
      "id": 1,
      "name": "The Gym"
    },
    "user": {
      "id": 4,
      "username": "username5",
      "user_skill_level": {
        "level": "Intermediate"
      }
    },
    "recommended_skill_level": {
      "level": "Advanced"
    },
    "difficulty_rating": 8,
    "review": "I test really poorly"
  },
  {
    "gym": {
      "id": 2,
      "name": "The Gym 2"
    },
    "user": {
      "id": 5,
      "username": "username6",
      "user_skill_level": {
        "level": "Intermediate"
      }
    },
    "recommended_skill_level": {
      "level": "Advanced"
    },
    "difficulty_rating": 8,
    "review": "I test really well"
  },
  {
    "gym": {
      "id": 2,
      "name": "The Gym 2"
    },
    "user": {
      "id": 6,
      "username": "username7",
      "user_skill_level": {
        "level": "Beginner"
      }
    },
    "recommended_skill_level": {
      "level": "Beginner"
    },
    "difficulty_rating": 4,
    "review": "Testing is easy"
  },
  {
    "gym": {
      "id": 2,
      "name": "The Gym 2"
    },
    "user": {
      "id": 3,
      "username": "username4",
      "user_skill_level": {
        "level": "Advanced"
      }
    },
    "recommended_skill_level": {
      "level": "Beginner"
    },
    "difficulty_rating": 10,
    "review": "Everyone loves a test"
  },
  {
    "gym": {
      "id": 3,
      "name": "The Other Gym"
    },
    "user": {
      "id": 4,
      "username": "username5",
      "user_skill_level": {
        "level": "Intermediate"
      }
    },
    "recommended_skill_level": {
      "level": "Beginner"
    },
    "difficulty_rating": 1,
    "review": "Tests are for babies"
  }
]
```

**404 Not Found**

```json
{
  "message": "No gym_rating records found."
}
```

### `GET /gym-ratings/by-gym/<gym_id>/`

Retrieves all reviews for a specific gym. Publicly accessible.

- Path Parameters:
  - gym_id (integer, required): The ID of the gym to retrieve reviews for.

### Responses

**200 OK**  

```json
[
  {
    "gym": {
      "id": 1,
      "name": "The Gym"
    },
    "user": {
      "id": 1,
      "username": "adminuser",
      "user_skill_level": {
        "level": "Beginner"
      }
    },
    "recommended_skill_level": {
      "level": "Beginner"
    },
    "difficulty_rating": 7,
    "review": "This gym is great for all skill levels, it's beginner friendly"
  },
  {
    "gym": {
      "id": 1,
      "name": "The Gym"
    },
    "user": {
      "id": 2,
      "username": "username2",
      "user_skill_level": {
        "level": "Intermediate"
      }
    },
    "recommended_skill_level": {
      "level": "Beginner"
    },
    "difficulty_rating": 6,
    "review": "Lots of climbs in the lower grades, even in the overhang section!"
  },
  {
    "gym": {
      "id": 1,
      "name": "The Gym"
    },
    "user": {
      "id": 3,
      "username": "username4",
      "user_skill_level": {
        "level": "Advanced"
      }
    },
    "recommended_skill_level": {
      "level": "Intermediate"
    },
    "difficulty_rating": 6,
    "review": "I'll review the test"
  },
  {
    "gym": {
      "id": 1,
      "name": "The Gym"
    },
    "user": {
      "id": 4,
      "username": "username5",
      "user_skill_level": {
        "level": "Intermediate"
      }
    },
    "recommended_skill_level": {
      "level": "Advanced"
    },
    "difficulty_rating": 8,
    "review": "I test really poorly"
  }
]
```

**404 Not Found**  

```json
{
  "message": "Record not found"
}
```

### `GET /gym-ratings/by-user/<user_id>/`

Retrieves all reviews posted by a specific user. Publicly accessible.

- Path Parameters:
  - user_id (integer, required): The ID of the user to retrieve reviews for.

### Responses

**200 OK**  

```json
[
  {
    "gym": {
      "id": 1,
      "name": "The Gym"
    },
    "user": {
      "id": 1,
      "username": "adminuser",
      "user_skill_level": {
        "level": "Beginner"
      }
    },
    "recommended_skill_level": {
      "level": "Beginner"
    },
    "difficulty_rating": 7,
    "review": "This gym is great for all skill levels, it's beginner friendly"
  },
  {
    "gym": {
      "id": 2,
      "name": "The Gym 2"
    },
    "user": {
      "id": 1,
      "username": "adminuser",
      "user_skill_level": {
        "level": "Beginner"
      }
    },
    "recommended_skill_level": {
      "level": "Intermediate"
    },
    "difficulty_rating": 9,
    "review": "This gym tested my patience"
  },
  {
    "gym": {
      "id": 3,
      "name": "The Other Gym"
    },
    "user": {
      "id": 1,
      "username": "adminuser",
      "user_skill_level": {
        "level": "Beginner"
      }
    },
    "recommended_skill_level": {
      "level": "Advanced"
    },
    "difficulty_rating": 10,
    "review": "This gym really tests you"
  }
]
```

**404 Not Found**  

```json
{
  "message": "Records not found"
}
```

### `GET /gym-ratings/<rating_id>/`

Retrieves a specific gym rating record by its ID. Publicly accessible.

- Path Parameters:
  - rating_id (integer, required): The ID of the rating to retrieve.

### Responses

**200 OK**  

```json
{
  "gym": {
    "id": 1,
    "name": "The Gym"
  },
  "user": {
    "id": 1,
    "username": "adminuser",
    "user_skill_level": {
      "level": "Beginner"
    }
  },
  "recommended_skill_level": {
    "level": "Beginner"
  },
  "difficulty_rating": 7,
  "review": "This gym is great for all skill levels, it's beginner friendly"
}
```

**404 Not Found**  

```json
{
  "message": "The record you are searching for does not exist."
}
```

### `POST /gym-ratings/`

Creates a new gym rating. Each user can only rate a gym once.

- Authentication: Required (JWT)
- Content-Type: application/json

### Request Body

```json
{
  "gym_id": 3,
  "difficulty_rating": 8,
  "skill_level_id": 2,
  "review": "Great variety of climbs for intermediate climbers!"
}
```

### Responses

**201 Created**  

```json
{
  "gym": {
    "id": 3,
    "name": "The Other Gym"
  },
  "user": {
    "id": 1,
    "username": "adminuser",
    "user_skill_level": {
      "level": "Beginner"
    }
  },
  "recommended_skill_level": {
    "level": "Intermediate"
  },
  "difficulty_rating": 8,
  "review": "Great variety of climbs for intermediate climbers!"
}
```

**409 Conflict**  

```json
{
  "message": "adminuser, you've already reviewed this gym. Each user can only review a gym once."
}
```

**400 Bad Request**  

```json
{
  "error": {
    "difficulty_rating": ["Ratings must be between 1-10"],
    "review": ["Reviews cannot exceed 500 characters"],
    "unknown_field": ["Unknown field."]
  }
}
```



### `DELETE /gym-ratings/<gym_rating_id>/`

Deletes a specific gym rating. User must own the rating.

- Authentication: Required (JWT)
- Path Parameters:
  - gym_rating_id (integer, required): The ID of the rating to delete.

### Responses

**200 OK**  

```json
{
  "message": "Climb with id 5 has been removed successfully."
}
```

**404 Not Found**  

```json
{
  "message": "No rating was found with id 999."
}
```

**403 Forbidden**  

```json
{
  "message": "adminuser, you are not authorised to delete this rating."
}
```

### `DELETE /gym-ratings/admin/<gym_rating_id>/`

Deletes any gym rating. Admin only.

- Authentication: Required (JWT)
- Authorization: Admin only
- Path Parameters:
  - gym_rating_id (integer, required): The ID of the rating to delete.

### Responses

**200 OK**  

```json
{
  "message": "Climb with id 5 has been removed successfully."
}
```

**404 Not Found**  

```json
{
  "message": "No rating was found with id 999."
}
```

**403 Forbidden**  

```json
{
  "message": "Administrator access required"
}
```

### `PUT/PATCH /gym-ratings/<gym_rating_id>/`

Updates a specific gym rating. User must own the rating.

- Authentication: Required (JWT)
- Content-Type: application/json
- Path Parameters:
  - gym_rating_id (integer, required): The ID of the rating to update.

### Request Body (Partial accepted)

```json
{
  "difficulty_rating": 9,
  "review": "Updated review - even better than I thought!"
}
```

### Responses

**200 OK**  

```json
{
  "message": "Rating updated successfully.",
  "details": {
    "gym": {
      "id": 1,
      "name": "The Gym"
    },
    "user": {
      "id": 1,
      "username": "adminuser",
      "user_skill_level": {
        "level": "Beginner"
      }
    },
    "recommended_skill_level": {
      "level": "Beginner"
    },
    "difficulty_rating": 9,
    "review": "Updated review - even better than I thought!"
  }
}
```

**404 Not Found**  

```json
{
  "message": "Rating with id 999 does not exist."
}
```

**403 Forbidden**  

```json
{
  "message": "adminuser, you are not authorised to update this rating."
}
```

**400 Bad Request**  

```json
{
  "error": {
    "difficulty_rating": ["Ratings must be between 1-10"]
  }
}
```

↑ [Back to Top](#api-documentation)
