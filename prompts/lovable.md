# Simple Car Racing Game

Make a simple car racing game. The race should be for 3 laps. A simple circular lap is good. Users can move with WASD keys.

## What I Want:
- Users enter username and password to play
- Show the fastest time to complete three laps by the logged in user on the home screen
- Show a leaderboard of all players and the number of laps they have completed
- I want to connect this to my own backend later

## Backend File:
Create a file called `SnapserManager.ts` that has empty functions for:
- User login
- Getting leaderboard scores showing user Id and laps completed from the leaderboard backend
- Saving number of laps completed back to the global leaderboard backend
- Saving fastest time to complete three laps in the logged in users user_data storage backend.

Make all these functions empty stubs - I'll add my own database code later. Just put TODO comments in each function.