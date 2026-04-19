import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle, ArrowRight, Target,
  Clock, Star, GraduationCap, TrendingUp, ChevronDown, ChevronUp, BookOpen,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import type { Lesson, UserLessonProgress } from "@shared/schema";

const AMIRI = "'Amiri', serif";

const skillColors: Record<string, string> = {
  reading: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  writing: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  listening: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  speaking: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
  general: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
};

const LEVEL_META: Record<number, { title: string; titleAr: string; actfl: string; cefr: string; description: string; color: string; icon: typeof BookOpen }> = {
  1: {
    title: "Foundations",
    titleAr: "الأُسُس",
    actfl: "Novice Low → Mid",
    cefr: "A1",
    description: "Master the Arabic script, sounds, and basic communication. You'll learn to read, write, and pronounce all 28 letters with tashkeel, and hold your first conversations.",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-800/40",
    icon: BookOpen,
  },
  2: {
    title: "Building Blocks",
    titleAr: "اللَّبِنَات",
    actfl: "Novice High → Intermediate Low",
    cefr: "A2",
    description: "Discover Arabic's root system, build sentences, and navigate real-world situations like shopping and dining. Grammar becomes your tool, not your obstacle.",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-800/40",
    icon: TrendingUp,
  },
  3: {
    title: "Expression",
    titleAr: "التَّعبِير",
    actfl: "Intermediate Mid",
    cefr: "B1",
    description: "Master verb conjugation, ask questions fluently, and describe the world around you. You'll move from memorized phrases to creating your own sentences.",
    color: "from-purple-500/10 to-violet-500/10 border-purple-200 dark:border-purple-800/40",
    icon: GraduationCap,
  },
};

function LevelRoadmap({ lessons, progressMap, level }: { lessons: Lesson[]; progressMap: Map<string, UserLessonProgress>; level: number }) {
  const meta = LEVEL_META[level];
  if (!meta) return null;

  const sortedLessons = lessons.filter((l) => l.level === level).sort((a, b) => a.orderIndex - b.orderIndex);
  const completedCount = sortedLessons.filter((l) => progressMap.get(l.id)?.completed).length;
  const progressPct = sortedLessons.length > 0 ? Math.round((completedCount / sortedLessons.length) * 100) : 0;
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="space-y-4" data-testid={`level-roadmap-${level}`}>
      <Card className={`bg-gradient-to-br ${meta.color} border`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-semibold">Level {level}</Badge>
                <Badge variant="outline" className="text-xs">ACTFL: {meta.actfl}</Badge>
                <Badge variant="outline" className="text-xs">CEFR: {meta.cefr}</Badge>
              </div>
              <h2 className="text-xl font-bold flex items-center gap-2" data-testid={`text-level-title-${level}`}>
                <meta.icon className="w-5 h-5" />
                {meta.title}
              </h2>
              <p className="text-base mt-0.5" dir="rtl" style={{ fontFamily: AMIRI }}>{meta.titleAr}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{meta.description}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{completedCount} / {sortedLessons.length} lessons completed</span>
              <span className="font-medium">{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2" data-testid={`progress-level-${level}`} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full gap-1 text-xs"
            onClick={() => setExpanded(!expanded)}
            data-testid={`button-toggle-level-${level}`}
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? "Collapse lessons" : `Show ${sortedLessons.length} lessons`}
          </Button>
        </CardContent>
      </Card>

      {expanded && (
        <div className="relative pl-6 space-y-0">
          <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-border" />

          {sortedLessons.map((lesson, idx) => {
            const prog = progressMap.get(lesson.id);
            const completed = prog?.completed;
            const canDo = lesson.canDoStatements as string[] | null;
            const estMin = lesson.estimatedMinutes;

            return (
              <div key={lesson.id} className="relative" data-testid={`roadmap-lesson-${lesson.id}`}>
                <div className={`absolute -left-6 top-5 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${completed ? "bg-emerald-500 border-emerald-500" : "bg-background border-primary"}`}>
                  {completed ? (
                    <CheckCircle className="w-3 h-3 text-white" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>

                <Link href={`/lessons/${lesson.id}`}>
                  <Card className={`mb-3 hover-elevate active-elevate-2 cursor-pointer ${completed ? "border-emerald-200 dark:border-emerald-800/40" : ""}`} data-testid={`card-lesson-${lesson.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium">Lesson {idx + 1}</span>
                            {completed && <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 px-1.5 py-0">Completed</Badge>}
                          </div>
                          <h3 className="font-semibold mt-0.5" data-testid={`text-lesson-title-${lesson.id}`}>{lesson.title}</h3>
                          <p className="text-sm mt-0.5" dir="rtl" style={{ fontFamily: AMIRI }}>{lesson.titleAr}</p>

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="secondary" className={`text-[10px] ${skillColors[lesson.skillFocus] || ""}`}>
                              {lesson.skillFocus}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] gap-1">
                              <Star className="w-2.5 h-2.5" /> {lesson.xpReward} XP
                            </Badge>
                            {estMin && (
                              <Badge variant="outline" className="text-[10px] gap-1">
                                <Clock className="w-2.5 h-2.5" /> ~{estMin} min
                              </Badge>
                            )}
                          </div>

                          {canDo && canDo.length > 0 && (
                            <div className="mt-3 space-y-1">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                <Target className="w-3 h-3" /> After this lesson, you can:
                              </p>
                              <ul className="space-y-0.5">
                                {canDo.slice(0, 3).map((stmt, si) => (
                                  <li key={si} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                    <span className="text-primary mt-0.5">✓</span>
                                    <span>{stmt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <Button size="icon" variant="ghost" className="shrink-0 mt-1" data-testid={`button-start-lesson-${lesson.id}`}>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function LessonsPage() {
  const { data: lessons, isLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
  });

  const { data: progress } = useQuery<UserLessonProgress[]>({
    queryKey: ["/api/user/progress"],
  });

  const progressMap = new Map(progress?.map((p) => [p.lessonId, p]) || []);

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-10 w-64" />
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
      </div>
    );
  }

  const totalLessons = lessons?.length || 0;
  const completedLessons = lessons?.filter((l) => progressMap.get(l.id)?.completed).length || 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-lessons-title">Arabic Curriculum</h1>
            <p className="text-sm text-muted-foreground">ACTFL-aligned progression from Novice to Intermediate</p>
          </div>
        </div>
        <p className="text-lg mt-2" dir="rtl" style={{ fontFamily: AMIRI }}>
          المنهج الدراسي العربي
        </p>
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-muted-foreground font-medium">Overall Progress</span>
            <span className="font-semibold">{completedLessons} / {totalLessons} lessons</span>
          </div>
          <Progress value={totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0} className="h-2.5" data-testid="progress-overall" />
        </div>
      </div>

      <div className="space-y-8">
        {[1, 2, 3].map((level) => (
          <LevelRoadmap
            key={level}
            lessons={lessons || []}
            progressMap={progressMap}
            level={level}
          />
        ))}
      </div>
    </div>
  );
}
