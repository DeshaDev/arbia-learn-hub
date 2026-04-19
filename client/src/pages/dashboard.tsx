import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Flame, Star, Trophy, Target, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { UserProfile, Lesson, Badge as BadgeType, UserBadge } from "@shared/schema";

function SkillBar({ label, labelAr, value, color }: { label: string; labelAr: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground" style={{ fontFamily: "'Amiri', serif" }} dir="rtl">
          {labelAr}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-right">{Math.round(value)}%</p>
    </div>
  );
}

export default function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
  });

  const { data: userBadges } = useQuery<(UserBadge & { badge: BadgeType })[]>({
    queryKey: ["/api/user/badges"],
  });

  const level = profile?.currentLevel || 1;
  const xp = profile?.totalXp || 0;
  const xpForNextLevel = level * 200;
  const xpProgress = (xp % xpForNextLevel) / xpForNextLevel * 100;

  if (profileLoading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-20" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-welcome">
            Welcome, Learner
          </h1>
          <p className="text-muted-foreground mt-1" data-testid="text-welcome-arabic" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
            أهلاً وسهلاً
          </p>
        </div>
        <Link href="/practice">
          <Button data-testid="button-start-practice">
            Start Practice <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="card-level">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <Badge variant="secondary">Level {level}</Badge>
            </div>
            <p className="text-2xl font-bold">{xp.toLocaleString()} XP</p>
            <Progress value={xpProgress} className="mt-2 h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">{xpForNextLevel - (xp % xpForNextLevel)} XP to next level</p>
          </CardContent>
        </Card>

        <Card data-testid="card-streak">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-md bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <Badge variant="secondary">{profile?.streakDays || 0} days</Badge>
            </div>
            <p className="text-2xl font-bold">{profile?.streakDays || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Day streak</p>
          </CardContent>
        </Card>

        <Card data-testid="card-lessons-completed">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">{profile?.lessonsCompleted || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Lessons completed</p>
          </CardContent>
        </Card>

        <Card data-testid="card-accuracy">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-md bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <Target className="w-5 h-5 text-violet-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">{Math.round(profile?.accuracy || 0)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Accuracy rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card data-testid="card-continue-learning">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
              <CardTitle className="text-lg">Continue Learning</CardTitle>
              <Link href="/lessons">
                <Button variant="ghost" size="sm" data-testid="button-view-all-lessons">
                  View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {lessonsLoading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)
              ) : lessons && lessons.length > 0 ? (
                lessons.slice(0, 4).map((lesson) => (
                  <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                    <div className="flex items-center gap-4 p-3 rounded-md hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-lesson-${lesson.id}`}>
                      <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xl" style={{ fontFamily: "'Amiri', serif" }}>
                          {lesson.titleAr?.charAt(0) || "ع"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                          {lesson.titleAr}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className="text-xs">Level {lesson.level}</Badge>
                        <Badge variant="outline" className="text-xs">{lesson.xpReward} XP</Badge>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>Lessons are loading...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {userBadges && userBadges.length > 0 && (
            <Card data-testid="card-badges">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Recent Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {userBadges.slice(0, 6).map((ub) => (
                    <div
                      key={ub.id}
                      className="flex items-center gap-2 p-2 rounded-md bg-accent/20"
                      data-testid={`badge-${ub.badgeId}`}
                    >
                      <span className="text-xl">{ub.badge?.icon}</span>
                      <div>
                        <p className="text-xs font-medium">{ub.badge?.name}</p>
                        <p className="text-xs text-muted-foreground" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                          {ub.badge?.nameAr}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card data-testid="card-skills">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SkillBar label="Reading" labelAr="القراءة" value={profile?.readingScore || 0} color="hsl(195, 65%, 35%)" />
              <SkillBar label="Writing" labelAr="الكتابة" value={profile?.writingScore || 0} color="hsl(42, 85%, 55%)" />
              <SkillBar label="Listening" labelAr="الاستماع" value={profile?.listeningScore || 0} color="hsl(160, 55%, 42%)" />
              <SkillBar label="Speaking" labelAr="المحادثة" value={profile?.speakingScore || 0} color="hsl(280, 50%, 50%)" />
            </CardContent>
          </Card>

          <Card data-testid="card-daily-tip">
            <CardContent className="p-5">
              <p className="text-sm font-medium mb-2">Daily Arabic Tip</p>
              <div className="p-3 rounded-md bg-accent/10" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                <p className="text-lg text-center">مَنْ جَدَّ وَجَدَ</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center italic">
                "Whoever strives, finds." - Arabic Proverb
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
