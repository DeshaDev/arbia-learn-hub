import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Crown } from "lucide-react";

interface LeaderboardEntry {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  totalXp: number;
  currentLevel: number;
  streakDays: number;
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-sm font-bold text-muted-foreground">{rank}</span>;
}

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-10 w-48" />
        {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16" />)}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" data-testid="text-leaderboard-title">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">See how you rank among Arabic learners worldwide</p>
        <p className="text-lg mt-1" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
          لوحة المتصدرين
        </p>
      </div>

      {leaderboard && leaderboard.length > 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 0, 2].map((idx) => {
            const entry = leaderboard[idx];
            if (!entry) return null;
            const rank = idx === 1 ? 2 : idx === 0 ? 1 : 3;
            return (
              <Card
                key={entry.userId}
                className={`text-center ${rank === 1 ? "ring-2 ring-yellow-400 dark:ring-yellow-600" : ""}`}
                data-testid={`card-top-${rank}`}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-center">{getRankIcon(rank)}</div>
                  <Avatar className="w-12 h-12 mx-auto">
                    <AvatarImage src={entry.profileImageUrl || undefined} />
                    <AvatarFallback className="text-sm">
                      {(entry.firstName?.[0] || "?").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {entry.firstName || "Learner"} {entry.lastName?.[0] ? `${entry.lastName[0]}.` : ""}
                    </p>
                    <p className="text-lg font-bold">{entry.totalXp.toLocaleString()} XP</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Level {entry.currentLevel}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            Rankings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {leaderboard && leaderboard.length > 0 ? (
            leaderboard.map((entry, i) => {
              return (
                <div
                  key={entry.userId}
                  className="flex items-center gap-3 p-3 rounded-md"
                  data-testid={`row-leaderboard-${i}`}
                >
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    {getRankIcon(i + 1)}
                  </div>
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarImage src={entry.profileImageUrl || undefined} />
                    <AvatarFallback className="text-xs">
                      {(entry.firstName?.[0] || "?").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {entry.firstName || "Learner"} {entry.lastName || ""}
                    </p>
                    <p className="text-xs text-muted-foreground">Level {entry.currentLevel}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm">{entry.totalXp.toLocaleString()} XP</p>
                    <p className="text-xs text-muted-foreground">{entry.streakDays}d streak</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No learners yet. Be the first!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
