import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, RotateCcw, Sparkles, Brain, Zap, Trophy, Lightbulb, BookOpen, GraduationCap, ChevronDown, ChevronUp, Clock, Eye, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Exercise, ReviewItem } from "@shared/schema";

interface PracticeSession {
  exercises: Exercise[];
  currentIndex: number;
  results: { exerciseId: string; correct: boolean; xp: number }[];
}

function ExerciseContextBlock({ exercise }: { exercise: Exercise }) {
  const context = (exercise as any).context;
  const contextAr = (exercise as any).contextAr;

  if (!context) return null;

  return (
    <div className="bg-muted/50 rounded-md p-4 mb-4" data-testid="block-context">
      <div className="flex items-start gap-2">
        <BookOpen className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{context}</p>
          {contextAr && (
            <p className="text-sm text-muted-foreground" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
              {contextAr}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function HintButton({ exercise }: { exercise: Exercise }) {
  const [showHint, setShowHint] = useState(false);
  const hint = (exercise as any).hint;
  const hintAr = (exercise as any).hintAr;

  if (!hint) return null;

  return (
    <div className="text-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowHint(!showHint)}
        className="text-muted-foreground gap-1.5"
        data-testid="button-show-hint"
      >
        <Lightbulb className="w-4 h-4" />
        {showHint ? "Hide Hint" : "Need a Hint?"}
      </Button>
      {showHint && (
        <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-md border border-amber-200 dark:border-amber-800/30 max-w-md mx-auto" data-testid="block-hint">
          <p className="text-sm text-amber-800 dark:text-amber-200">{hint}</p>
          {hintAr && (
            <p className="text-sm text-amber-800 dark:text-amber-200 mt-1" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
              {hintAr}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function GrammarNoteBlock({ exercise, show }: { exercise: Exercise; show: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const grammarNote = (exercise as any).grammarNote;
  const grammarNoteAr = (exercise as any).grammarNoteAr;

  if (!grammarNote || !show) return null;

  return (
    <div className="mt-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="text-muted-foreground gap-1.5 w-full justify-center"
        data-testid="button-grammar-note"
      >
        <GraduationCap className="w-4 h-4" />
        {expanded ? "Hide Grammar Note" : "Grammar Note"}
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </Button>
      {expanded && (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-md border border-blue-200 dark:border-blue-800/30" data-testid="block-grammar-note">
          <p className="text-sm text-blue-800 dark:text-blue-200">{grammarNote}</p>
          {grammarNoteAr && (
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
              {grammarNoteAr}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ExplanationBlock({ exercise, isCorrect }: { exercise: Exercise; isCorrect: boolean }) {
  return (
    <Card className="max-w-lg mx-auto">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {isCorrect ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
          )}
          <span className="font-medium text-sm">{isCorrect ? "Correct!" : "Not quite..."}</span>
        </div>
        {exercise.explanation && (
          <p className="text-sm text-muted-foreground">{exercise.explanation}</p>
        )}
        {exercise.explanationAr && (
          <p className="text-sm text-muted-foreground mt-1" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
            {exercise.explanationAr}
          </p>
        )}
        <GrammarNoteBlock exercise={exercise} show={true} />
      </CardContent>
    </Card>
  );
}

function MultipleChoiceExercise({
  exercise,
  onAnswer,
}: {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const options = (exercise.options as string[]) || [];
  const isCorrect = selected === exercise.correctAnswer;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-5">
      <ExerciseContextBlock exercise={exercise} />

      <div className="text-center space-y-3">
        <p className="text-lg font-medium">{exercise.question}</p>
        {exercise.questionAr && (
          <p className="text-2xl" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
            {exercise.questionAr}
          </p>
        )}
      </div>

      {!submitted && <HintButton exercise={exercise} />}

      <div className="grid gap-3 max-w-lg mx-auto">
        {options.map((option, i) => {
          const isThisCorrect = option === exercise.correctAnswer;
          const isSelected = option === selected;
          let extraClass = "";

          if (submitted) {
            if (isThisCorrect) extraClass = "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
            else if (isSelected && !isThisCorrect) extraClass = "ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20";
          }

          return (
            <Button
              key={i}
              variant={isSelected && !submitted ? "default" : "outline"}
              className={`justify-start text-left h-auto py-3 px-4 ${extraClass}`}
              onClick={() => !submitted && setSelected(option)}
              disabled={submitted}
              data-testid={`button-option-${i}`}
            >
              <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium mr-3 shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm">{option}</span>
              {submitted && isThisCorrect && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />}
              {submitted && isSelected && !isThisCorrect && <XCircle className="w-4 h-4 text-red-500 ml-auto shrink-0" />}
            </Button>
          );
        })}
      </div>

      {!submitted ? (
        <div className="text-center">
          <Button onClick={handleSubmit} disabled={!selected} data-testid="button-submit-answer">
            Check Answer
          </Button>
        </div>
      ) : (
        <>
          <ExplanationBlock exercise={exercise} isCorrect={isCorrect} />
          <div className="text-center pt-2">
            <Button onClick={() => onAnswer(selected!)} data-testid="button-next-exercise">
              Continue
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function FillBlankExercise({
  exercise,
  onAnswer,
}: {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = answer.trim().toLowerCase() === exercise.correctAnswer.toLowerCase();

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-5">
      <ExerciseContextBlock exercise={exercise} />

      <div className="text-center space-y-3">
        <p className="text-lg font-medium">{exercise.question}</p>
        {exercise.questionAr && (
          <p className="text-2xl" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
            {exercise.questionAr}
          </p>
        )}
      </div>

      {!submitted && <HintButton exercise={exercise} />}

      <div className="max-w-md mx-auto space-y-4">
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          dir="auto"
          style={{ fontFamily: "'Amiri', serif" }}
          className="text-lg text-center"
          disabled={submitted}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          data-testid="input-answer"
        />

        {!submitted ? (
          <div className="text-center">
            <Button onClick={handleSubmit} disabled={!answer.trim()} data-testid="button-submit-answer">
              Check Answer
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {isCorrect ? (
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Correct!</span>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Not quite</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Correct answer: <strong dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>{exercise.correctAnswer}</strong>
                </p>
              </div>
            )}
            {exercise.explanation && (
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">{exercise.explanation}</p>
                {exercise.explanationAr && (
                  <p className="text-sm text-muted-foreground mt-1" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                    {exercise.explanationAr}
                  </p>
                )}
              </div>
            )}
            <GrammarNoteBlock exercise={exercise} show={true} />
            <div className="text-center pt-2">
              <Button onClick={() => onAnswer(answer.trim())} data-testid="button-next-exercise">
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SentenceOrderExercise({
  exercise,
  onAnswer,
}: {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
}) {
  const words = (exercise.options as string[]) || [];
  const [selected, setSelected] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([...words].sort(() => Math.random() - 0.5));
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = selected.join(" ") === exercise.correctAnswer;

  const addWord = (word: string, idx: number) => {
    setSelected([...selected, word]);
    setAvailable(available.filter((_, i) => i !== idx));
  };

  const removeWord = (idx: number) => {
    const word = selected[idx];
    setAvailable([...available, word]);
    setSelected(selected.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-5">
      <ExerciseContextBlock exercise={exercise} />

      <div className="text-center space-y-3">
        <p className="text-lg font-medium">{exercise.question}</p>
        {exercise.questionAr && (
          <p className="text-2xl" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
            {exercise.questionAr}
          </p>
        )}
      </div>

      {!submitted && <HintButton exercise={exercise} />}

      <div className="max-w-lg mx-auto space-y-4">
        <div className="min-h-[60px] p-3 rounded-md border-2 border-dashed flex flex-wrap gap-2" dir="rtl" data-testid="area-sentence">
          {selected.length === 0 ? (
            <p className="text-sm text-muted-foreground w-full text-center py-2">Tap words to build the sentence</p>
          ) : (
            selected.map((word, i) => (
              <Button
                key={i}
                variant="secondary"
                size="sm"
                onClick={() => !submitted && removeWord(i)}
                disabled={submitted}
                className={submitted ? (isCorrect ? "ring-1 ring-emerald-500" : "ring-1 ring-red-500") : ""}
                data-testid={`button-selected-word-${i}`}
              >
                {word}
              </Button>
            ))
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-center" dir="rtl">
          {available.map((word, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => addWord(word, i)}
              disabled={submitted}
              data-testid={`button-available-word-${i}`}
            >
              {word}
            </Button>
          ))}
        </div>

        {!submitted && (
          <div className="text-center">
            <Button onClick={handleSubmit} disabled={selected.length === 0} data-testid="button-submit-answer">
              Check Answer
            </Button>
          </div>
        )}

        {submitted && (
          <div className="space-y-3">
            {isCorrect ? (
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Perfect!</span>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Not quite</span>
                </div>
                <p className="text-sm text-muted-foreground" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                  Correct: {exercise.correctAnswer}
                </p>
              </div>
            )}
            {exercise.explanation && (
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">{exercise.explanation}</p>
                {exercise.explanationAr && (
                  <p className="text-sm text-muted-foreground mt-1" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                    {exercise.explanationAr}
                  </p>
                )}
              </div>
            )}
            <GrammarNoteBlock exercise={exercise} show={true} />
            <div className="text-center pt-2">
              <Button onClick={() => onAnswer(selected.join(" "))} data-testid="button-next-exercise">
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FreeWritingExercise({
  exercise,
  onAnswer,
}: {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-5">
      <ExerciseContextBlock exercise={exercise} />

      <div className="text-center space-y-3">
        <p className="text-lg font-medium">{exercise.question}</p>
        {exercise.questionAr && (
          <p className="text-2xl" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
            {exercise.questionAr}
          </p>
        )}
      </div>

      {!submitted && <HintButton exercise={exercise} />}

      <div className="max-w-lg mx-auto space-y-4">
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer in Arabic..."
          dir="rtl"
          style={{ fontFamily: "'Amiri', serif" }}
          className="text-lg min-h-[120px]"
          disabled={submitted}
          data-testid="textarea-answer"
        />

        {!submitted ? (
          <div className="text-center">
            <Button onClick={handleSubmit} disabled={!answer.trim()} data-testid="button-submit-answer">
              Submit Writing
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Great effort!</span>
            </div>
            {exercise.explanation && (
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">{exercise.explanation}</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
              Example: {exercise.correctAnswer}
            </p>
            <GrammarNoteBlock exercise={exercise} show={true} />
            <div className="text-center pt-2">
              <Button onClick={() => onAnswer(answer.trim())} data-testid="button-next-exercise">
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewQueue() {
  const { data: queue, isLoading } = useQuery<ReviewItem[]>({
    queryKey: ["/api/review/queue"],
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const answerMutation = useMutation({
    mutationFn: async (data: { itemId: string; quality: number }) => {
      const res = await apiRequest("POST", "/api/review/answer", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/review/queue"] });
    },
  });

  const speakArabic = async (text: string) => {
    try {
      const res = await apiRequest("POST", "/api/tts", { text, voice: "alloy" });
      const data = await res.json();
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.play();
      }
    } catch {}
  };

  if (isLoading) return null;
  if (!queue || queue.length === 0) return null;

  const item = queue[currentIdx];
  if (!item) return null;

  const handleRate = (quality: number) => {
    if (answerMutation.isPending) return;
    answerMutation.mutate({ itemId: item.id, quality });
    setShowAnswer(false);
    if (currentIdx < queue.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  return (
    <Card className="border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-900/10" data-testid="card-review-queue">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Review Due</span>
            <Badge variant="outline" className="text-xs">{queue.length} items</Badge>
          </div>
          <span className="text-xs text-muted-foreground">{currentIdx + 1} / {queue.length}</span>
        </div>

        <div className="text-center py-4 space-y-2">
          <Badge variant="secondary" className="text-[10px]">{item.itemType}</Badge>
          <p className="text-2xl font-bold" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
            {item.itemTextAr}
          </p>
          <Button variant="ghost" size="sm" onClick={() => speakArabic(item.itemTextAr)} data-testid="button-review-speak">
            <Volume2 className="w-4 h-4" />
          </Button>

          {showAnswer ? (
            <div className="space-y-2 animate-in fade-in">
              <p className="text-base font-medium">{item.itemText}</p>
              {item.meaning && <p className="text-sm text-muted-foreground">{item.meaning}</p>}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Button size="sm" variant="destructive" onClick={() => handleRate(1)} disabled={answerMutation.isPending} data-testid="button-review-again" className="text-xs">
                  Again
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleRate(3)} disabled={answerMutation.isPending} data-testid="button-review-hard" className="text-xs">
                  Hard
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleRate(4)} disabled={answerMutation.isPending} data-testid="button-review-good" className="text-xs border-emerald-300">
                  Good
                </Button>
                <Button size="sm" variant="default" onClick={() => handleRate(5)} disabled={answerMutation.isPending} data-testid="button-review-easy" className="text-xs">
                  Easy
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setShowAnswer(true)} className="gap-1.5" data-testid="button-review-show">
              <Eye className="w-4 h-4" /> Show Answer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PracticePage() {
  const { toast } = useToast();
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);

  const { data: exercises, isLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/practice/adaptive"],
  });

  useEffect(() => {
    if (exercises && exercises.length > 0 && !session) {
      setSession({
        exercises,
        currentIndex: 0,
        results: [],
      });
    }
  }, [exercises, session]);

  const submitAttempt = useMutation({
    mutationFn: async (data: { exerciseId: string; answer: string }) => {
      const res = await apiRequest("POST", "/api/practice/submit", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/badges"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
    },
  });

  const handleAnswer = useCallback(
    (answer: string) => {
      if (!session) return;
      const exercise = session.exercises[session.currentIndex];
      let isCorrect = false;
      if (exercise.type === "free_writing") {
        isCorrect = answer.trim().length >= 3;
      } else if (exercise.type === "sentence_order") {
        isCorrect = answer.trim() === exercise.correctAnswer;
      } else {
        isCorrect = answer.trim().toLowerCase() === exercise.correctAnswer.toLowerCase();
      }

      submitAttempt.mutate({ exerciseId: exercise.id, answer });

      const newResults = [
        ...session.results,
        { exerciseId: exercise.id, correct: isCorrect, xp: isCorrect ? (exercise.xpReward || 10) : 0 },
      ];

      if (session.currentIndex < session.exercises.length - 1) {
        setSession({
          ...session,
          currentIndex: session.currentIndex + 1,
          results: newResults,
        });
      } else {
        setSession({ ...session, results: newResults });
        setSessionComplete(true);
      }
    },
    [session, submitAttempt],
  );

  const restartSession = () => {
    setSession(null);
    setSessionComplete(false);
    queryClient.invalidateQueries({ queryKey: ["/api/practice/adaptive"] });
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center py-20">
        <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
        <h2 className="text-xl font-bold mb-2">No exercises available</h2>
        <p className="text-muted-foreground">Start by completing some lessons first</p>
      </div>
    );
  }

  if (sessionComplete && session) {
    const totalCorrect = session.results.filter((r) => r.correct).length;
    const totalXp = session.results.reduce((acc, r) => acc + r.xp, 0);
    const accuracy = Math.round((totalCorrect / session.results.length) * 100);

    return (
      <div className="p-6 max-w-xl mx-auto text-center space-y-6 py-12">
        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
          <Trophy className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-2xl font-bold" data-testid="text-session-complete">Practice Complete!</h2>
        <p className="text-4xl" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>أحسنت</p>
        <p className="text-muted-foreground">Well done!</p>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-500" data-testid="text-correct-count">{totalCorrect}/{session.results.length}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary" data-testid="text-accuracy">{accuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-accent" data-testid="text-xp-earned">+{totalXp}</p>
              <p className="text-xs text-muted-foreground">XP Earned</p>
            </CardContent>
          </Card>
        </div>

        <Button onClick={restartSession} data-testid="button-practice-again">
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Practice Again
        </Button>
      </div>
    );
  }

  if (!session) return null;

  const currentExercise = session.exercises[session.currentIndex];
  const progress = ((session.currentIndex) / session.exercises.length) * 100;

  const exerciseTypeLabel: Record<string, string> = {
    multiple_choice: "Multiple Choice",
    fill_blank: "Fill in the Blank",
    sentence_order: "Sentence Order",
    free_writing: "Free Writing",
    matching: "Matching",
  };

  const skillTypeLabel: Record<string, string> = {
    reading: "Reading",
    writing: "Writing",
    speaking: "Speaking",
    listening: "Listening",
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <ReviewQueue />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <h2 className="font-bold" data-testid="text-practice-title">Adaptive Practice</h2>
          </div>
          <span className="text-sm text-muted-foreground" data-testid="text-exercise-counter">
            {session.currentIndex + 1} / {session.exercises.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs" data-testid="badge-exercise-type">{exerciseTypeLabel[currentExercise.type] || currentExercise.type}</Badge>
          <Badge variant="secondary" className="text-xs" data-testid="badge-skill-type">{skillTypeLabel[currentExercise.skillType] || currentExercise.skillType}</Badge>
          <Badge variant="outline" className="text-xs">+{currentExercise.xpReward} XP</Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {currentExercise.type === "multiple_choice" && (
            <MultipleChoiceExercise
              key={currentExercise.id}
              exercise={currentExercise}
              onAnswer={handleAnswer}
            />
          )}
          {currentExercise.type === "fill_blank" && (
            <FillBlankExercise
              key={currentExercise.id}
              exercise={currentExercise}
              onAnswer={handleAnswer}
            />
          )}
          {currentExercise.type === "sentence_order" && (
            <SentenceOrderExercise
              key={currentExercise.id}
              exercise={currentExercise}
              onAnswer={handleAnswer}
            />
          )}
          {currentExercise.type === "free_writing" && (
            <FreeWritingExercise
              key={currentExercise.id}
              exercise={currentExercise}
              onAnswer={handleAnswer}
            />
          )}
          {currentExercise.type === "matching" && (
            <MultipleChoiceExercise
              key={currentExercise.id}
              exercise={currentExercise}
              onAnswer={handleAnswer}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
