/*
Today's Date Format Helper Function
Purpose: Provides today's date in YYYY-MM-DD format for API compatibility
Features:
- Returns ISO 8601 date string without time component
- Ensures two digit months and days
- Prevents Unix Epoch (1970-01-01) default when dates are omitted
- Compatible with backend SQL Date fields and Marshmallow schemas
- Uses local system time for user-friendly dates

Usage: Default value for optional "Set Date" field in AddClimb function
*/

/**
 * @getMonth returns index of month (0-11), so +1 for correct month (1-12)
 * @padStart ensures no single digit months (adds a 0 to any single digit months)
 * @returns Today's date in ISO 8601 Format without current time: YYYY-MM-DD
 * 
 * Example usage:  
 * const today = getTodayDate(); // "2025-12-06"
 */
export const getTodayDate = () => {
  const today = new Date();
  
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;
};
