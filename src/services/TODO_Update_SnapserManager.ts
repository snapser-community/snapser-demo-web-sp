// import {
//   AuthServiceApi,
//   LeaderboardsServiceApi,
//   StorageServiceApi,
//   AuthUserUsernamePasswordLoginRequest,
//   LeaderboardsUserGetScoresRequest,
//   LeaderboardsUserIncrementScoreRequest,
//   StorageUserGetJsonBlobRequest,
//   StorageUserReplaceJsonBlobRequest
// } from '@/snapser-sdk/apis';

// import {
//   AuthUsernamePasswordLoginRequest,
//   AuthUsernamePasswordLoginResponse,
//   LeaderboardsGetScoresResponse,
//   IncrementScoreRequest,
//   StorageGetJsonBlobResponse,
//   LeaderboardsGetScoresRequestRangeEnum,
//   StorageGetJsonBlobRequestAccessTypeEnum,
//   StorageReplaceJsonBlobRequestAccessTypeEnum,
//   ReplaceJsonBlobRequest,
// } from '@/snapser-sdk/models';

// export interface User {
//   id: string;
//   username: string;
// }

// export interface LeaderboardEntry {
//   userId: string;
//   username: string;
//   lapsCompleted: number;
// }

// export interface UserData {
//   fastestThreeLapTime?: number;
// }

// export class SnapserManager {
//   private static authApi = new AuthServiceApi();
//   private static leaderboardsApi = new LeaderboardsServiceApi();
//   private static storageApi = new StorageServiceApi();
//   private static sessionToken: string | null = null;

//   // User authentication
//   static async login(username: string, password: string): Promise<User | null> {
//     try {
//       const loginBody: AuthUsernamePasswordLoginRequest = {
//         username: username,
//         password: password,
//         createUser: true
//       };

//       const request: AuthUserUsernamePasswordLoginRequest = {
//         body: loginBody
//       };

//       const response: AuthUsernamePasswordLoginResponse = await this.authApi.authUserUsernamePasswordLogin(request);

//       if (response.user) {
//         this.sessionToken = response.user.sessionToken || null;
//         return {
//           id: response.user.id || '',
//           username: username
//         };
//       }

//       return null;
//     } catch (error) {
//       console.error('Login failed:', error);
//       return null;
//     }
//   }

//   // Get leaderboard scores
//   static async getLeaderboard(): Promise<LeaderboardEntry[]> {
//     if (!this.sessionToken) {
//       console.error('No session token available');
//       return [];
//     }

//     try {
//       const request: LeaderboardsUserGetScoresRequest = {
//         leaderboardName: 'laps_completed',
//         range: LeaderboardsGetScoresRequestRangeEnum.Top,
//         count: 100,
//         token: this.sessionToken
//       };

//       const response: LeaderboardsGetScoresResponse = await this.leaderboardsApi.leaderboardsUserGetScores(request);

//       return response.userScores?.map(score => ({
//         userId: score.userId || '',
//         username: score.userId || 'Unknown', // Would need to fetch usernames separately
//         lapsCompleted: score.score || 0
//       })) || [];
//     } catch (error) {
//       console.error('Failed to get leaderboard:', error);
//       return [];
//     }
//   }

//   // Save number of laps completed to global leaderboard
//   static async saveLapsCompleted(userId: string, lapsCompleted: number): Promise<void> {
//     if (!this.sessionToken) {
//       console.error('No session token available');
//       return;
//     }

//     try {
//       const incrementBody: IncrementScoreRequest = {
//         delta: lapsCompleted
//       };

//       const request: LeaderboardsUserIncrementScoreRequest = {
//         leaderboardName: 'laps_completed',
//         userId: userId,
//         token: this.sessionToken,
//         body: incrementBody
//       };

//       await this.leaderboardsApi.leaderboardsUserIncrementScore(request);
//     } catch (error) {
//       console.error('Failed to save laps completed:', error);
//     }
//   }

//   // Save fastest time for three laps to user's personal data
//   static async saveFastestTime(userId: string, timeInSeconds: number): Promise<void> {
//     if (!this.sessionToken) {
//       console.error('No session token available');
//       return;
//     }

//     try {
//       const userData = { fastestThreeLapTime: timeInSeconds };

//       const replaceBody: ReplaceJsonBlobRequest = {
//         value: userData,
//         create: true
//       };

//       const request: StorageUserReplaceJsonBlobRequest = {
//         ownerId: userId,
//         accessType: StorageReplaceJsonBlobRequestAccessTypeEnum.Protected,
//         jsonBlobKey: 'user_data',
//         token: this.sessionToken,
//         body: replaceBody
//       };

//       await this.storageApi.storageUserReplaceJsonBlob(request);
//     } catch (error) {
//       console.error('Failed to save fastest time:', error);
//     }
//   }

//   // Get user's personal data including fastest time
//   static async getUserData(userId: string): Promise<UserData> {
//     if (!this.sessionToken) {
//       console.error('No session token available');
//       return {};
//     }

//     try {
//       const request: StorageUserGetJsonBlobRequest = {
//         ownerId: userId,
//         accessType: StorageGetJsonBlobRequestAccessTypeEnum.Protected,
//         jsonBlobKey: 'user_data',
//         token: this.sessionToken
//       };

//       const response: StorageGetJsonBlobResponse = await this.storageApi.storageUserGetJsonBlob(request);

//       return (response.value as UserData) || {};
//     } catch (error) {
//       console.error('Failed to get user data:', error);
//       return {};
//     }
//   }
// }
