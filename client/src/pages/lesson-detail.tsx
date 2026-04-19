import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Play, CheckCircle, Trophy, GraduationCap, ListChecks, Target, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LessonVisualContent } from "@/components/lesson-visual-content";
import type { Lesson, Exercise, UserLessonProgress } from "@shared/schema";

export default function LessonDetailPage() {
  const [, params] = useRoute("/lessons/:id");
  const lessonId = params?.id;
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"learn" | "exercises">("learn");

  const { data: lesson, isLoading: lessonLoading } = useQuery<Lesson>({
    queryKey: ["/api/lessons", lessonId],
    enabled: !!lessonId,
  });

  const { data: exercises, isLoading: exercisesLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/lessons", lessonId, "exercises"],
    enabled: !!lessonId,
  });

  const { data: allProgress } = useQuery<UserLessonProgress[]>({
    queryKey: ["/api/user/progress"],
  });

  const isCompleted = allProgress?.some(
    (p) => p.lessonId === lessonId && p.completed
  );

  const completeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/lessons/${lessonId}/complete`, { score: 100 });
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/badges"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      toast({
        title: "Lesson completed!",
        description: `You earned ${data.xpEarned || 50} XP`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete",
        variant: "destructive",
      });
    },
  });

  if (lessonLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Lesson not found</p>
        <Link href="/lessons">
          <Button variant="outline" className="mt-4">Back to Lessons</Button>
        </Link>
      </div>
    );
  }

  const exerciseTypeIcons: Record<string, string> = {
    multiple_choice: "Multiple Choice",
    fill_blank: "Fill in the Blank",
    sentence_order: "Sentence Ordering",
    free_writing: "Free Writing",
    matching: "Matching",
  };

  const objectives = lesson.objectives as string[] | null;
  const canDo = lesson.canDoStatements as string[] | null;
  const estMin = lesson.estimatedMinutes;
  const actflLevel = lesson.actflLevel;
  const cefrLevel = lesson.cefrLevel;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-3">
      <div className="flex items-center gap-3">
        <Link href="/lessons">
          <Button variant="ghost" size="icon" className="shrink-0" data-testid="button-back-lessons">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold truncate" data-testid="text-lesson-title">{lesson.title}</h1>
          <p className="text-sm truncate" dir="rtl" style={{ fontFamily: "'Amiri', serif" }} data-testid="text-lesson-title-ar">
            {lesson.titleAr}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isCompleted && (
            <Badge variant="default" className="bg-emerald-600 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Done
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">Lv {lesson.level}</Badge>
          <Badge variant="outline" className="text-xs">{lesson.xpReward} XP</Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {actflLevel && <Badge variant="outline" className="text-[10px]">ACTFL: {actflLevel}</Badge>}
        {cefrLevel && <Badge variant="outline" className="text-[10px]">CEFR: {cefrLevel}</Badge>}
        {estMin && (
          <Badge variant="outline" className="text-[10px] gap-1">
            <Clock className="w-2.5 h-2.5" /> ~{estMin} min
          </Badge>
        )}
      </div>

      {(objectives || canDo) && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            {objectives && objectives.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <Target className="w-3 h-3" /> Learning Objectives
                </p>
                <ul className="space-y-1">
                  {objectives.map((obj, i) => (
                    <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                      <span className="text-primary mt-0.5 font-bold">{i + 1}.</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {canDo && canDo.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <Star className="w-3 h-3" /> After this lesson, you can:
                </p>
                <ul className="space-y-1">
                  {canDo.map((stmt, i) => (
                    <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      <span>{stmt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-1 p-1 rounded-md bg-muted/50">
        <Button
          variant={activeTab === "learn" ? "default" : "ghost"}
          size="sm"
          className="flex-1"
          onClick={() => setActiveTab("learn")}
          data-testid="tab-learn"
        >
          <GraduationCap className="w-4 h-4 mr-1.5" />
          Learn
        </Button>
        <Button
          variant={activeTab === "exercises" ? "default" : "ghost"}
          size="sm"
          className="flex-1"
          onClick={() => setActiveTab("exercises")}
          data-testid="tab-exercises"
        >
          <ListChecks className="w-4 h-4 mr-1.5" />
          Exercises ({exercises?.length || 0})
        </Button>
      </div>

      {activeTab === "learn" && (
        <div className="space-y-6">
          <LessonVisualContent lessonTitle={lesson.title} lessonCategory={lesson.category} />

          <div className="text-center pt-2">
            <Button size="lg" onClick={() => setActiveTab("exercises")} data-testid="button-go-to-exercises">
              <Play className="w-4 h-4 mr-1.5" />
              Ready? Start Exercises
            </Button>
          </div>
        </div>
      )}

      {activeTab === "exercises" && (
        <>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Exercises ({exercises?.length || 0})
              </h3>

              {exercisesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14" />)}
                </div>
              ) : exercises && exercises.length > 0 ? (
                <div className="space-y-2">
                  {exercises.map((ex, i) => (
                    <div
                      key={ex.id}
                      className="flex items-center gap-3 p-3 rounded-md bg-muted/50"
                      data-testid={`exercise-${ex.id}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-medium">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{ex.question}</p>
                        <p className="text-xs text-muted-foreground">{exerciseTypeIcons[ex.type] || ex.type}</p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">{ex.xpReward} XP</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No exercises available yet</p>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {exercises && exercises.length > 0 && (
              <Link href="/practice">
                <Button size="lg" data-testid="button-start-exercises">
                  <Play className="w-4 h-4 mr-1.5" />
                  Start Exercises
                </Button>
              </Link>
            )}

            {!isCompleted && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => completeMutation.mutate()}
                disabled={completeMutation.isPending}
                data-testid="button-complete-lesson"
              >
                <Trophy className="w-4 h-4 mr-1.5" />
                {completeMutation.isPending ? "Completing..." : "Mark as Complete"}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
