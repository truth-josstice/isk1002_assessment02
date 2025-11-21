# Feedback Log

**Feedback From:** Jordan Leal-Walker
**When:** 14/08/2025
**What docs checked:** ERD table and chosen database explanation & comparison

>## Feedback on ERD
>
>**Suggestions:**
>
>- Since you're using a physical ERD, add not null values to columns where required
>- You've put default current date for date in attempts, could do the same for climbs (unless that's for future climbs?)
>- 32 characters seems too short for name values based on some preliminary research
>- It's not immediately obvious what attempts and climbs mean and how they interact, i'd need an explanation to provide feedback
>- Gym ratings could benefit from a review date
>- Since gym ratings has a many to one relationship with gym and users it could use both FK's as a composite primary key, unless you have a specific reason for using a separate serial PK
>- Technically one gym could be owned by many companies but for the purpose of this its fine to leave as one to many
>- I'm not sure what difficulty grade you're using but check if it needs a length of 32 characters
>- Upon further review of climbs and attempts, there seems to be no reason for climbs to have user id and be linked directly to users table, as I understand it attempts should be a junction table between users and climbs. One climb can be attempted by many users, one user can attempt many climbs, and again climb_id and user_id could be composite primary key for attempts table
>
>## Feedback on database comparison
>
>**What I like:**
>
>- You mention the data integrity benifits of using SQL
>- You point out the need for validation checks in your API and link that to SQL natively enforcing that
>- You touch on atomicity being important
>- You talk about the inclusion of username and password access and the advantages of SQL for security
>- The lack of need for horizontal scaling is covered and how that relates to NoSQL usage
>- You include a brief section on future considerations
>- You compare the strengths and weaknesses of 3 SQL database systems
>
>**Suggestions:**
>
>- You already cover how atomicity and consistency is relevant to your project, I would enjoy seeing you expand on that by very briefly covering each point in ACID and BASE and comparing which of the 2 sets of properties is more relevant to your API
>- You do a great job comparing 3 SQL database systems, and mentioning why you chose those three to compare would give me greater context
>- Expanding on those comparisons, your strengths and weaknesses are very detailed and I would like to hear why they're a strength or weakness for your project, as well as mention of your familiarity with different systems and how that influenced your choice
>- If you choose too, references to support some of the points you make would increase academic integrity, but it doesn't seem to be a requirement.

## Reflections

- ERD needs further clarity including not null constraints, as these were not complete across the diagram
- Consider using a composite key for gym_ratings, as a unique primary key may be redundant
- Some columns makes sense for users familiar with climbing but not for beginner user, needs clarity in purpose and usage statements
- Some varchar statements are too limited or not appropriate
- Including a brief point covering ACID v BASE would provide further clarity on choosing Relational Database
- Comparing the three database management systems could again be more contextual and nuanced
- Difficulty_grade examples should be included in the readme Usage Instructions

## Action Plan

1. Add NOT NULL constraints to all required columns
2. Change Primary Key of gym_ratings to a composite key
3. Research suggested lenghts of varchar data types and change as required
4. Change purpose of app to include a little more about climbing and how this app is intended to work, as well as future development goals
5. Add ACID and BASE comparison to plan
6. Include further detail and context on the decisions made between the three SQL DBMS

## Implementation

1. NOT NULL constraints added to ERD
2. Changed to a composite key for GymRatings!
    - Had to abandon this composite key, later on during schemas and models as it would not allow for cascading of records when user with matching user_id was deleted
3. VARCHAR changes:
    - Changed name variables from 32 to 100 which should cover most extreme edge cases of name lengths for individuals or corporations and added to validators on DB and Schema level
    - Changed website URL length to 1000 to ensure edge cases are still allowed and added to validators on DB and Schema level
    - Email lenght of 255 is standard due to constraints on email addresses as part of standard formatting
    - As at this stage the scope of the project is only Australia, 255 length is appropriate in almost all but the most extreme edge cases including rural addresses and company titles. However due to the relationship between companies and gyms this should not be required as companies are already listed
4. Updated README with clearer description of purpose and user stories
5. Added comparison of ACID v BASE to README file to further detail the benefits of my chosen database management system
6. Added details about why I chose the particular DBMS and why I chose the comparative systems

---

**Feedback From:** Nhi Huynh
**When:** 15/08/2025
**What docs checked:** ERD table

>## ERD Feedback
>
>
>- **Core Entities/Relationships:**
>    - Great use of purposeful and clear core entities with clean separations designed for ERD.
>    - `Users` - `Attempts` - `Climbs` relationships aligns to support your README description regarding the purpose for users to be able to log their climb progress.
>    - Clear relationship between `Company` and `Gym` reflecting the idea that companies can operate multiple gyms.
>    - `Gym_Ratings` has been well designed with thoughtful consideration of the field values you have used to capture difficulty_rating + recommended_skill_level + reviews. Provides really purposeful insights to give users a quick overview to compare gyms and get a sense which gyms would be appropriate for them.
>
>- **Suggestion:**
>    - In `Gym_Ratings` for the Reviews - as user reviews can be a powerful tool to influence the reflection of a gym, it could be worth considering enforcing a UNIQUE rule on (user_id, gym_id) to only allow for 'one review rating per user per gym' (users could still be allowed to edit/update their reviews).
>
>- **Suggestion Outcome:**
>    - The unique constraint helps prevent users from being able to add duplicate reviews and therefore supports the data integrity of user's reviews to reflect a more fair and credible approach on a gym's rating.
>    - Also helps maintain potential risks of moderation in the case if a user who has a bad experience from spamming reviews on a gym and skewing their gym reputation (ethical consideration). Otherwise if there's a future potential for admin moderation, then I guess these can be excluded but just means risk of higher moderation activity.
>
>- **'Completed' and 'Comments' columns in `Attempts` table:**
>    - Great use of bool to make it quick and straightforward for users to log.
>    - In your README file you noted that users can log comments on their progress, which aligns with your ERD. I personally really like the example of comments inputted by user as makes it very personable like a reflective journal entry (only thing to consider is if the 128 varchar would be sufficient).
>
>- **Suggestion:**
>    - Could consider keeping the 'Comments' column and also add an optional 'Attempt_Outcome' column to support beginner-friendly users get familiar with climbing terms and practice logging their outcomes.
>    - Could use an ENUMs list with optional detailed descriptions for the 'Attempt_Outcome' column. I just had a quick look online and these were some examples of outcome values that could be considered if you were to have them in a list:
>        - 'attempted' = tried it, not sent (generic try)
>        - 'project' = actively working this climb across sessions
>        - 'flash' = sent on the first try of the first session
>        - 'redpoint' = sent after one or more prior attempts (most common non-flash send)
>        - 'repeat' = sent again (after an earlier send)
>        - 'abandoned' = decided to stop working it (moved on)

>- **Suggestion Outcome:**
>    - It's not as personable as logging their own user input as a comment.
>    - Would be good for a more analytical style approach as it would allow easier and cleaner filtering with queries to get a clear separation of these outcome values or even use aggregate functions to get the overall SUM/COUNT of the different outcome values without having to parse through values of a user's comments.
>
>
>- **'Attempt_date' column in `Attempts` table:**
>    - Great for users to log when they attempted their climbs
>
>- **Suggestion:**
>    - If you wanted to support recording multiple attempts on the same day, could consider replacing with 'Attempted_at': TIMESTAMP DEFAULT now(), instead of DATE (similar to how you would log gym reps).
>
>- **Suggestion Outcome:**
>    - Support tracking multiple attempts within same day to make each attempts distinct and to give user "activity feed" ordering and time of day insights (eg. most successful attempts logged at 6-7pm).
>
>
>- **Constraints and ENUMS:**
>    - Good use of constraints (FKs and CHECKS) and like that you've used ENUMs for 'recommended_skill_level', 'climbing_ability' and 'style', to keep values simple and consistent.
>    - This works great if you intend for the values of the lists to remain fixed, but could also add complexity if you wanted to add/rename them later.
>
>- **Suggestion:**
>    - For the ENUMs lists of values, if you want a flexible option to be able to add/change later, you could consider using a lookup table. For example, for the 'styles' list - having it in a lookup table would allow you to store something like:
>        - Style_ID: (serial PK)
>        - Style_Name: "Dyno"
>        - Style_Description/Definition: "A dynamic move where the climber jumps to a distant hold, leaving the wall with all or most of their limbs."
>
>- **Suggestion Outcome:**
>    - Lookup table would support flexibility to easily add/update values if wanting to change later.
>    - Supports beginner-friendly users to understand how to categorise the styles of their climbs (would have to consider if adding this would benefit with enough value as again not sure as this might be basic common terms for a climber to know or might be detailed on the gym's climb activity).
>
>
> I wrote this suggestion re skill levels prior to fully reading your README, so makes sense how you've got it initially set up!
>
>- For 'recommended_skill_levels' in `Gym` table, it includes a list for beginner/intermediate/advanced. I had a quick look at this online about the ["Ewbank system"](https://www.climbfit.com.au/teaching-your-friends-to-indoor-rock-climb/) (not sure if this is related, sorry don't know too much about climbing!) but if you plan to support different grading systems to add more meaning/descriptive values, then this can also be separated and stored into its own lookup table. However, I like what you've got so far beacuse it's pretty simple to understand, this suggestion is just dependant on how descriptive you want to get and also how you would like to filter your queries to a granular level.
>
>

## Reflections

- Adding constraints to ensure users only rate a gym once is a really great suggestion, I had not really considered review bombing either in the context of the app, so great to have a simple way to ensure this doesn't occur, should be easy enough to implement into the project as well
- I had initially considered making the "completed" column more of a "status" column with some constraints, so this is a good idea definitely for a future update. I think the comments section if used correctly would be more appropriate for climbers, as it accounts for varying levels of complexity. A beginner user might just comment "it was fun" or "it was really hard", whereas an intermediate or advanced might include "double kneebar at the start of the climb was really difficult to get set in, but I figured it out and worked on the second half. I have done all the moves in sequence now!"
- The VARCHAR limit is definitely not large enough, even my example above was too long, will change that to 500.
- Absolutely great suggestion in regards to the default for attempt_date, this is an easy implementation in to the project as well!
- Addition of a Lookup table for style of climb is great, I will look into how to enact this into the database! I will also add another lookup for skill_level as it is used in multiple tables and can be further normalised, as well as enacting database level validation automatically through a primary key. This definitely makes a lot of the constraints much easier to enact, as looking up id from a table eliminates the need for ENUM constraints.

## Action Plans

1. Add unique constraint to allow users only one review per gym
2. Change limit of text input for comments in attempts table to allow for appropriate length and reflection
3. Add to future plans and development in README considerations about addition of "status" v "completed"
4. Change the attempt_date column to attempted_at and change the default value to current date+time
5. Create lookup table for styles and skill level

## Implementation

1. Added table_args constraint to the gym_ratings table after re-instating the primary key for correct CASCADE functionality
    - "_ _ table_args _ _" in gym_rating model
2. VARCHAR changes:
    - Changed the limit of comments and reviews to 500 to allow for detailed information and added to all validation on DB and Schema level
3. Appended readme with future considerations for design choices
4. Implemented the change above and added to validation on DB and schema level
5. Implemented and added both a styles and skill level table and created relationships across all entities