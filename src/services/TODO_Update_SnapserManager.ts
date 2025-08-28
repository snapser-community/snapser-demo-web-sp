// import {
//   AuthServiceApi,
//   LeaderboardsServiceApi,
//   StorageServiceApi,
//   UsernamePasswordLoginRequest,
//   GetScoresRequest,
//   IncrementScoreOperationRequest,
//   GetJsonBlobRequest,
//   ReplaceJsonBlobRequest
// } from '@/snapser-sdk/apis';

// import {
//   AuthUsernamePasswordLoginRequest,
//   AuthUsernamePasswordLoginResponse,
//   LeaderboardsGetScoresResponse,
//   LeaderboardsIncrementScoreResponse,
//   IncrementScoreRequest,
//   StorageGetJsonBlobResponse,
//   StorageReplaceJsonBlobResponse,
//   StorageServiceReplaceJsonBlobBody,
//   LeaderboardsGetScoresRequestRangeEnum,
//   StorageGetJsonBlobRequestAccessTypeEnum,
//   StorageReplaceJsonBlobRequestAccessTypeEnum
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

//       const request: UsernamePasswordLoginRequest = {
//         body: loginBody
//       };

//       const response: AuthUsernamePasswordLoginResponse = await this.authApi.usernamePasswordLogin(request);

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
//       const request: GetScoresRequest = {
//         leaderboardName: 'laps_completed',
//         range: LeaderboardsGetScoresRequestRangeEnum.Top,
//         count: 100,
//         token: this.sessionToken
//       };

//       const response: LeaderboardsGetScoresResponse = await this.leaderboardsApi.getScores(request);

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

//       const request: IncrementScoreOperationRequest = {
//         leaderboardName: 'laps_completed',
//         userId: userId,
//         token: this.sessionToken,
//         body: incrementBody
//       };

//       await this.leaderboardsApi.incrementScore(request);
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

//       const replaceBody: StorageServiceReplaceJsonBlobBody = {
//         value: userData,
//         create: true
//       };

//       const request: ReplaceJsonBlobRequest = {
//         ownerId: userId,
//         accessType: StorageReplaceJsonBlobRequestAccessTypeEnum.Private,
//         jsonBlobKey: 'user_data',
//         token: this.sessionToken,
//         body: replaceBody
//       };

//       await this.storageApi.replaceJsonBlob(request);
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
//       const request: GetJsonBlobRequest = {
//         ownerId: userId,
//         accessType: StorageGetJsonBlobRequestAccessTypeEnum.Private,
//         jsonBlobKey: 'user_data',
//         token: this.sessionToken
//       };

//       const response: StorageGetJsonBlobResponse = await this.storageApi.getJsonBlob(request);

//       return (response.value as UserData) || {};
//     } catch (error) {
//       console.error('Failed to get user data:', error);
//       return {};
//     }
//   }
// }
