from flask import Blueprint
from datetime import date

from init import db

from models import (
    Attempt,
    Climb,
    Company,
    GymRating,
    Gym,
    SkillLevel,
    Style,
    User
)



db_commands = Blueprint("db", __name__)

@db_commands .cli.command("create")
def create_tables():
    """Creates all tabels from models."""
    db.create_all()
    print("Tables created...")

@db_commands .cli.command("drop")
def drop_tables():
    """Drops all tables from the database."""
    db.drop_all()
    print("Tables dropped...")

@db_commands .cli.command("seed")
def seed_tables():
    """Create seed data for all database tables"""
    skill_levels = [
        SkillLevel(
            level = "Beginner",
            description = "Just starting your climbing journey, you might know a few terms and styles. Climbing the lowest few difficulty grades."
        ),
        SkillLevel(
            level = "Intermediate",
            description = "You've learned most of the terms, you've climbed a lot! Climbing the middle difficulty grades, maybe hitting the plateau!"
        ),
        SkillLevel(
            level = "Advanced",
            description = "You climb regularly, you know how to visualise your beta, you know that everyone loves slopers and the moonboard is the G.O.A.T! Climbing the advanced grades!"
        )
    ]
    db.session.add_all(skill_levels)

    styles = [
        Style(
            name = "Slab",
            description = "A style of climb usually on a flat vertical wall, focussing on balance, footwork and precision."
        ), 
        Style(
            name = "Dyno",
            description = "A style of climb focussing on powerful dynamic movement, often including jumping or running actions."
        ), 
        Style(
            name = "Overhang",
            description = "A style of climb where the wall is angled towards the climber, focusses on technique and stamina."
        ), 
        Style(
            name = "Vertical",
            description = "A style of climb at a variety of angles, where the majority of moves take the climber directly upward."
        ), 
        Style(
            name = "Crimp",
            description = "A style of climb which has holds only wide enough for the climbers fingertips."
        ), 
        Style(
            name = "Traverse",
            description = "A style of climb at a variety of angles, where the majority of moves are made laterally not upward."
        ),
        Style(
            name= "Coordination",
            description = "A style of climb requiring precice timing and syncronized movements, usually involving all four limbs at the same time."
        )
    ]
    db.session.add_all(styles)

    companies = [
        Company(
            name = "Company 1",
            website = "https://example.com"
        ),
        Company(
            name = "Company 2",
            website = "https://test.com"
        )
    ]
    db.session.add_all(companies)
    db.session.commit()

    gyms = [
        Gym(
            city = "Melbourne",
            company_id = companies[0].id,
            street_address = "123 Fake Street",
            name = "The Gym"
        ),
        Gym(
            city = "Melbourne",
            company_id = companies[0].id,
            street_address = "456 New Fake Street",
            name = "The Gym 2"
        ),
        Gym(
            city="Sydney",
            company_id = companies[1].id,
            street_address = "789 Fake Street",
            name = "The Other Gym"
        ),
        Gym(
            city="Melbourne",
            company_id = companies[1].id,
            street_address = "1011 Fake Street",
            name = "The Other Gym But In Melbourne"
        )
    ]
    db.session.add_all(gyms)

    users = [
        User(
            username = "adminuser",
            password="Secureadminpassword123!",
            email="email@email.com",
            first_name="First",
            last_name="Last",
            skill_level_id=1,
            is_admin=True
        ), 
        User(
            username = "username2",
            password="Securepassword1234@",
            email="email1@email.com",
            first_name="First",
            last_name="Last",
            skill_level_id=2
        ),
        User(
            username = "username4",
            password="Securepassword12345#",
            email="email2@email.com",
            first_name="First",
            last_name="Last",
            skill_level_id=3
        ),
        User(
            username = "username5",
            password="Securepassword123456%",
            email="email3@email.com",
            first_name="First",
            last_name="Last",
            skill_level_id=2
        ),
        User(
            username = "username6",
            password="Securepassword1234567^",
            email="email4@email.com",
            first_name="First",
            last_name="Last",
            skill_level_id=2
        ),
        User(
            username = "username7",
            password="Securepassword12345678*",
            email="email5@email.com",
            first_name="First",
            last_name="Last",
            skill_level_id=1
        ),
    ]

    db.session.add_all(users)
    db.session.commit()

    climbs = [
        Climb(
            user_id = users[0].id,
            gym_id = gyms[0].id,
            style_id=styles[0].id,
            difficulty_grade = "Purple",
            set_date = date(2025, 1, 1)
        ), 
        Climb(
            user_id = users[0].id,
            gym_id = gyms[0].id,
            style_id = styles[1].id,
            difficulty_grade = "Blue",
            set_date = date(2025, 1, 1)
        ), 
        Climb(
            user_id = users[1].id,
            gym_id = gyms[1].id,
            style_id = styles[0].id,
            difficulty_grade = "4",
            set_date = date(2025, 1, 3)
        ), 
        Climb(
            user_id = users[1].id,
            gym_id = gyms[1].id,
            style_id = styles[2].id,
            difficulty_grade = "6",
            set_date = date(2025, 1, 3)
        ),
        Climb(
            user_id = users[0].id,
            gym_id = gyms[2].id,
            style_id = styles[1].id,
            difficulty_grade = "v1",
            set_date = date(2025, 1, 3)
        ),
        Climb(
            user_id = users[1].id,
            gym_id = gyms[2].id,
            style_id = styles[0].id,
            difficulty_grade = "v2",
            set_date = date(2025, 1, 3)
        )
    ]

    db.session.add_all(climbs)
    db.session.commit()

    attempts = [
        Attempt(
            user_id = users[0].id,
            climb_id = climbs[0].id,
            fun_rating = "4",
            comments = "This was hard, almost have it"
        ), 
        Attempt(
            user_id = users[0].id,
            climb_id = climbs[0].id,
            fun_rating = "4",
            comments = "This was fun! Got it on my second visit",
            completed = True
        ), 
        Attempt(
            user_id = users[1].id,
            climb_id = climbs[2].id,
            fun_rating = "4",
            comments = "Almost there! just need to try again"
        ), 
        Attempt(
            user_id = users[1].id,
            climb_id = climbs[2].id,
            fun_rating = 5,
            comments = "Sent it weeeheew",
            completed = True
        ),
        Attempt(
            user_id = users[1].id,
            climb_id = climbs[3].id,
            fun_rating = 5,
            comments = "Flashed it!",
            completed = True
        ),
        Attempt(
            user_id = users[0].id,
            climb_id = climbs[4].id,
            fun_rating = 5,
            comments = "I usually don't like dynamic climbs but this was heaps of fun!",
            completed = True
        )
    ]
    
    db.session.add_all(attempts)
    
    gym_ratings = [
        GymRating(
            gym_id = 1,
            user_id = 1,
            difficulty_rating = 7,
            skill_level_id = 1,
            review = "This gym is great for all skill levels, it's beginner friendly"
        ),
        GymRating(
            gym_id = 2,
            user_id = 2,
            difficulty_rating = 10,
            skill_level_id = 2,
            review = "This gym has some tough climbs, even the easiest are intermediate level"
        ),
        GymRating(
            gym_id = 1,
            user_id = 2,
            difficulty_rating = 6,
            skill_level_id = 1,
            review = "Lots of climbs in the lower grades, even in the overhang section!"
        ),
        GymRating(
            gym_id = 2,
            user_id = 1,
            difficulty_rating = 9,
            skill_level_id = 2,
            review = "This gym tested my patience"
        ),
        GymRating(
            gym_id = 3,
            user_id = 1,
            difficulty_rating = 10,
            skill_level_id = 3,
            review = "This gym really tests you"
        ),        
        GymRating(
            gym_id = 3,
            user_id = 2,
            difficulty_rating = 10,
            skill_level_id = 2,
            review = "Test review string"
        ),
        GymRating(
            gym_id = 1,
            user_id = 3,
            difficulty_rating = 6,
            skill_level_id = 2,
            review = "I'll review the test"
        ),
        GymRating(
            gym_id = 1,
            user_id = 4,
            difficulty_rating = 8,
            skill_level_id = 3,
            review = "I test really poorly"
        ),
        GymRating(
            gym_id = 2,
            user_id = 5,
            difficulty_rating = 8,
            skill_level_id = 3,
            review = "I test really well"
        ),
        GymRating(
            gym_id = 2,
            user_id = 6,
            difficulty_rating = 4,
            skill_level_id = 1,
            review = "Testing is easy"
        ),
        GymRating(
            gym_id = 2,
            user_id = 3,
            difficulty_rating = 10,
            skill_level_id = 1,
            review = "Everyone loves a test"
        ),
        GymRating(
            gym_id = 3,
            user_id = 4,
            difficulty_rating = 1,
            skill_level_id = 1,
            review = "Tests are for babies"
        )
    ]
    
    db.session.add_all(gym_ratings)
    db.session.commit()
    print("Tables seeded...")