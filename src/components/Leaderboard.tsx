
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SnapserManager, LeaderboardEntry } from '@/services/SnapserManager';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await SnapserManager.getLeaderboard();
      setLeaderboard(data.sort((a, b) => b.lapsCompleted - a.lapsCompleted));
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Global Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-400">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          🏆 Global Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center text-gray-400">No players yet</div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.userId}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index < 3
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                    : 'bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white min-w-[40px]">
                    {getRankIcon(index + 1)}
                  </span>
                  <div>
                    <p className="text-white font-medium">{entry.username}</p>
                    <p className="text-xs text-gray-400">User ID: {entry.userId.slice(0, 8)}...</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{entry.lapsCompleted}</p>
                  <p className="text-xs text-gray-400">laps</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
