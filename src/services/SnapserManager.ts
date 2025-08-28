
// SnapserManager.ts - Backend integration stubs
// TODO: Implement actual backend connections

export interface User {
  id: string;
  username: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  lapsCompleted: number;
}

export interface UserData {
  fastestThreeLapTime?: number;
}

export class SnapserManager {
  // User authentication
  static async login(username: string, password: string): Promise<User | null> {
    // TODO: Implement user login with backend authentication
    // Should validate credentials and return user object or null
    console.log('TODO: Implement login for', username);

    // Temporary stub - return a mock user for demo purposes
    return {
      id: `user_${Date.now()}`,
      username: username
    };
  }

  // Get leaderboard scores
  static async getLeaderboard(): Promise<LeaderboardEntry[]> {
    // TODO: Implement fetching leaderboard from backend
    // Should return array of users with their lap counts
    console.log('TODO: Implement getLeaderboard');

    // Temporary stub - return mock data
    return [
      { userId: 'user1', username: 'SpeedRacer', lapsCompleted: 15 },
      { userId: 'user2', username: 'TurboDriver', lapsCompleted: 12 },
      { userId: 'user3', username: 'RaceChamp', lapsCompleted: 8 }
    ];
  }

  // Save number of laps completed to global leaderboard
  static async saveLapsCompleted(userId: string, lapsCompleted: number): Promise<void> {
    // TODO: Implement saving lap count to global leaderboard backend
    // Should update or create entry for user with their total laps
    console.log('TODO: Implement saveLapsCompleted for user', userId, 'with', lapsCompleted, 'laps');
  }

  // Save fastest time for three laps to user's personal data
  static async saveFastestTime(userId: string, timeInSeconds: number): Promise<void> {
    // TODO: Implement saving fastest time to user_data storage backend
    // Should store personal best time for the logged in user
    console.log('TODO: Implement saveFastestTime for user', userId, 'with time', timeInSeconds, 'seconds');
  }

  // Get user's personal data including fastest time
  static async getUserData(userId: string): Promise<UserData> {
    // TODO: Implement fetching user's personal data from backend
    // Should return user's stored data including fastest time
    console.log('TODO: Implement getUserData for user', userId);

    // Temporary stub - return empty data
    return {};
  }
}