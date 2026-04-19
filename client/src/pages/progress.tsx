import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Target, BookOpen, Flame, Star, Award, BarChart3, Calendar } from "lucide-react";
import type { UserProfile, Badge as BadgeType, UserBadge } from "@shared/schema";

function SkillRadar({ profile }: { profile: UserProfile }) {
  const skills = [
    { name: "Reading", nameAr: "القراءة", value: profile.readingScore || 0, color: "hsl(195, 65%, 35%)" },
    { name: "Writing", nameAr: "الكتابة", value: profile.writingScore || 0, color: "hsl(42, 85%, 55%)" },
    { name: "Listening", nameAr: "الاستماع", value: profile.listeningScore || 0, color: "hsl(160, 55%, 42%)" },
    { name: "Speaking", nameAr: "المحادثة", value: profile.speakingScore || 0, color: "hsl(280, 50%, 50%)" },
  ];

  const maxValue = 100;

  return (
    <div className="space-y-4">
      {skills.map((skill) => (
        <div key={skill.name} className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: skill.color }} />
              <span className="text-sm font-medium">{skill.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                {skill.nameAr}
              </span>
              <span className="text-sm font-bold">{Math.round(skill.value)}%</span>
            </div>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min((skill.value / maxValue) * 100, 100)}%`,
                backgroundColor: skill.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProgressPage() {
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
  });

  const { data: userBadges } = useQuery<(UserBadge & { badge: BadgeType })[]>({
    queryKey: ["/api/user/badges"],
  });

  const { data: allBadges } = useQuery<BadgeType[]>({
    queryKey: ["/api/badges"],
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  const level = profile?.currentLevel || 1;
  const xp = profile?.totalXp || 0;
  const xpForNextLevel = level * 200;
  const xpProgress = (xp % xpForNextLevel) / xpForNextLevel * 100;
  const earnedBadgeIds = new Set(userBadges?.map((ub) => ub.badgeId) || []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-progress-title">Your Progress</h1>
        <p className="text-muted-foreground mt-1">Track your Arabic learning journey</p>
        <p className="text-lg mt-1" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>تقدمك الدراسي</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="card-stat-xp">
          <CardContent className="p-5 text-center">
            <Star className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-3xl font-bold">{xp.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Total XP</p>
            <Progress value={xpProgress} className="mt-2 h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">Level {level}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-streak">
          <CardContent className="p-5 text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{profile?.streakDays || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Day Streak</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-lessons">
          <CardContent className="p-5 text-center">
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold">{profile?.lessonsCompleted || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Lessons Done</p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-accuracy">
          <CardContent className="p-5 text-center">
            <Target className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{Math.round(profile?.accuracy || 0)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Accuracy</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card data-testid="card-skills-detail">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Skills Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile && <SkillRadar profile={profile} />}
          </CardContent>
        </Card>

        <Card data-testid="card-learning-path">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Learning Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile && (
              <>
                {(profile.readingScore || 0) < 30 && (
                  <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Focus on Reading</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Complete more reading exercises to build vocabulary</p>
                  </div>
                )}
                {(profile.writingScore || 0) < 30 && (
                  <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-900/20">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Practice Writing</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Try free writing exercises to improve your script</p>
                  </div>
                )}
                {(profile.listeningScore || 0) < 30 && (
                  <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-900/20">
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Improve Listening</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Complete listening comprehension exercises</p>
                  </div>
                )}
                {(profile.speakingScore || 0) < 30 && (
                  <div className="p-3 rounded-md bg-violet-50 dark:bg-violet-900/20">
                    <p className="text-sm font-medium text-violet-700 dark:text-violet-300">Develop Speaking</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Practice sentence construction and pronunciation</p>
                  </div>
                )}
                {(profile.readingScore || 0) >= 30 && (profile.writingScore || 0) >= 30 && (profile.listeningScore || 0) >= 30 && (profile.speakingScore || 0) >= 30 && (
                  <div className="p-3 rounded-md bg-primary/5">
                    <p className="text-sm font-medium">Great progress!</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Keep practicing to maintain and improve all skills</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-all-badges">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            Badges & Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allBadges?.map((badge) => {
              const earned = earnedBadgeIds.has(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`flex items-center gap-3 p-3 rounded-md ${
                    earned ? "bg-accent/10" : "bg-muted/30 opacity-50"
                  }`}
                  data-testid={`badge-item-${badge.id}`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{badge.name}</p>
                    <p className="text-xs text-muted-foreground" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                      {badge.nameAr}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>
                  </div>
                  {earned && <Badge variant="outline" className="text-xs text-emerald-600 shrink-0">Earned</Badge>}
                </div>
              );
            })}
            {(!allBadges || allBadges.length === 0) && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Badges will appear here as you progress</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
