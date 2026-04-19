import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Gamepad2, Star, Volume2, Check, X, Trophy, RotateCcw,
  Timer, Zap, ArrowRight, Sparkles, Loader2, Eye,
} from "lucide-react";

const AMIRI = "'Amiri', serif";

const audioCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;

async function playTTS(text: string): Promise<HTMLAudioElement> {
  if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
  const cached = audioCache.get(text);
  if (cached) {
    const audio = new Audio(cached);
    currentAudio = audio;
    await audio.play();
    return audio;
  }
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error("TTS failed");
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  audioCache.set(text, url);
  const audio = new Audio(url);
  currentAudio = audio;
  await audio.play();
  return audio;
}

interface LetterPair {
  letter: string;
  name: string;
  nameAr: string;
}

const ALL_LETTERS: LetterPair[] = [
  { letter: "ا", name: "Alif", nameAr: "أَلِف" },
  { letter: "ب", name: "Ba", nameAr: "بَاء" },
  { letter: "ت", name: "Ta", nameAr: "تَاء" },
  { letter: "ث", name: "Tha", nameAr: "ثَاء" },
  { letter: "ج", name: "Jim", nameAr: "جِيم" },
  { letter: "ح", name: "Ha", nameAr: "حَاء" },
  { letter: "خ", name: "Kha", nameAr: "خَاء" },
  { letter: "د", name: "Dal", nameAr: "دَال" },
  { letter: "ذ", name: "Dhal", nameAr: "ذَال" },
  { letter: "ر", name: "Ra", nameAr: "رَاء" },
  { letter: "ز", name: "Zay", nameAr: "زَاي" },
  { letter: "س", name: "Sin", nameAr: "سِين" },
  { letter: "ش", name: "Shin", nameAr: "شِين" },
  { letter: "ص", name: "Sad", nameAr: "صَاد" },
  { letter: "ض", name: "Dad", nameAr: "ضَاد" },
  { letter: "ط", name: "Taa", nameAr: "طَاء" },
  { letter: "ظ", name: "Dhaa", nameAr: "ظَاء" },
  { letter: "ع", name: "Ayn", nameAr: "عَين" },
  { letter: "غ", name: "Ghayn", nameAr: "غَين" },
  { letter: "ف", name: "Fa", nameAr: "فَاء" },
  { letter: "ق", name: "Qaf", nameAr: "قَاف" },
  { letter: "ك", name: "Kaf", nameAr: "كَاف" },
  { letter: "ل", name: "Lam", nameAr: "لَام" },
  { letter: "م", name: "Mim", nameAr: "مِيم" },
  { letter: "ن", name: "Nun", nameAr: "نُون" },
  { letter: "ه", name: "Ha", nameAr: "هَاء" },
  { letter: "و", name: "Waw", nameAr: "وَاو" },
  { letter: "ي", name: "Ya", nameAr: "يَاء" },
];

interface RootWord {
  root: string;
  rootLetters: string;
  words: { word: string; meaning: string }[];
}

const ROOT_WORDS: RootWord[] = [
  { root: "ك-ت-ب", rootLetters: "k-t-b", words: [
    { word: "كِتَاب", meaning: "book" },
    { word: "كَاتِب", meaning: "writer" },
    { word: "مَكْتَبَة", meaning: "library" },
    { word: "كَتَبَ", meaning: "he wrote" },
  ]},
  { root: "د-ر-س", rootLetters: "d-r-s", words: [
    { word: "دَرْس", meaning: "lesson" },
    { word: "مُدَرِّس", meaning: "teacher" },
    { word: "مَدْرَسَة", meaning: "school" },
    { word: "دَرَسَ", meaning: "he studied" },
  ]},
  { root: "ع-ل-م", rootLetters: "ʿ-l-m", words: [
    { word: "عِلْم", meaning: "knowledge" },
    { word: "مُعَلِّم", meaning: "teacher" },
    { word: "عَالَم", meaning: "world" },
    { word: "عَلِمَ", meaning: "he knew" },
  ]},
  { root: "ف-ت-ح", rootLetters: "f-t-ḥ", words: [
    { word: "فَتْح", meaning: "opening" },
    { word: "مِفْتَاح", meaning: "key" },
    { word: "فَتَحَ", meaning: "he opened" },
    { word: "فَاتِحَة", meaning: "the opening (surah)" },
  ]},
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function LetterMatchGame() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; answer: string } | null>(null);
  const [gameLetters, setGameLetters] = useState(() => shuffle(ALL_LETTERS).slice(0, 10));
  const [options, setOptions] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (round < gameLetters.length) {
      const correct = gameLetters[round].name;
      const others = shuffle(ALL_LETTERS.filter(l => l.name !== correct)).slice(0, 3).map(l => l.name);
      setOptions(shuffle([correct, ...others]));
      setFeedback(null);
    } else if (round > 0) {
      setGameOver(true);
    }
  }, [round, gameLetters]);

  function handleAnswer(answer: string) {
    const correct = gameLetters[round].name;
    const isCorrect = answer === correct;
    setFeedback({ correct: isCorrect, answer: correct });
    setTotal(t => t + 1);
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => setRound(r => r + 1), 1200);
  }

  function restart() {
    setGameLetters(shuffle(ALL_LETTERS).slice(0, 10));
    setRound(0);
    setScore(0);
    setTotal(0);
    setFeedback(null);
    setGameOver(false);
  }

  if (gameOver) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="text-center space-y-4 py-8" data-testid="game-match-result">
        <Trophy className={`w-16 h-16 mx-auto ${pct >= 70 ? "text-amber-500" : "text-muted-foreground"}`} />
        <h3 className="text-xl font-bold">{pct >= 70 ? "Excellent!" : "Keep Practicing!"}</h3>
        <p className="text-3xl font-bold text-primary">{score}/{total}</p>
        <p className="text-sm text-muted-foreground">{pct}% accuracy</p>
        <Button onClick={restart} className="gap-2" data-testid="button-restart-match">
          <RotateCcw className="w-4 h-4" /> Play Again
        </Button>
      </div>
    );
  }

  if (round >= gameLetters.length) return null;
  const current = gameLetters[round];

  return (
    <div className="space-y-6" data-testid="game-letter-match">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">{round + 1}/{gameLetters.length}</Badge>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-sm font-medium">{score}</span>
        </div>
      </div>
      <Progress value={(round / gameLetters.length) * 100} className="h-1.5" />

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">What letter is this?</p>
        <button
          onClick={() => playTTS(current.nameAr).catch(() => {})}
          className="w-28 h-28 rounded-lg bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto hover:bg-primary/15 transition-colors"
          data-testid="button-letter-display"
        >
          <span className="text-7xl" style={{ fontFamily: AMIRI }} dir="rtl">{current.letter}</span>
        </button>
        <p className="text-xs text-muted-foreground">Tap the letter to hear it</p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {options.map((opt, i) => {
          let classes = "";
          if (feedback) {
            if (opt === feedback.answer) classes = "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
            else if (opt !== feedback.answer && feedback.correct === false) classes = "opacity-50";
          }
          return (
            <Button
              key={i}
              variant="outline"
              className={`h-12 text-sm font-medium ${classes}`}
              onClick={() => !feedback && handleAnswer(opt)}
              disabled={!!feedback}
              data-testid={`button-match-option-${i}`}
            >
              {opt}
              {feedback && opt === feedback.answer && <Check className="w-4 h-4 ml-2 text-emerald-500" />}
            </Button>
          );
        })}
      </div>

      {feedback && (
        <div className={`text-center text-sm font-medium ${feedback.correct ? "text-emerald-600" : "text-red-600"}`}>
          {feedback.correct ? "Correct! ✓" : `It's ${feedback.answer}`}
        </div>
      )}
    </div>
  );
}

function ListeningGame() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; answer: string } | null>(null);
  const [gameLetters, setGameLetters] = useState(() => shuffle(ALL_LETTERS).slice(0, 10));
  const [options, setOptions] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (round < gameLetters.length) {
      const correct = gameLetters[round].letter;
      const others = shuffle(ALL_LETTERS.filter(l => l.letter !== correct)).slice(0, 3).map(l => l.letter);
      setOptions(shuffle([correct, ...others]));
      setFeedback(null);
    } else if (round > 0) {
      setGameOver(true);
    }
  }, [round, gameLetters]);

  async function playLetter() {
    setPlaying(true);
    try {
      const audio = await playTTS(gameLetters[round].nameAr);
      audio.onended = () => setPlaying(false);
    } catch {
      setPlaying(false);
    }
  }

  function handleAnswer(answer: string) {
    const correct = gameLetters[round].letter;
    const isCorrect = answer === correct;
    setFeedback({ correct: isCorrect, answer: correct });
    setTotal(t => t + 1);
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => setRound(r => r + 1), 1200);
  }

  function restart() {
    setGameLetters(shuffle(ALL_LETTERS).slice(0, 10));
    setRound(0);
    setScore(0);
    setTotal(0);
    setFeedback(null);
    setGameOver(false);
  }

  if (gameOver) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="text-center space-y-4 py-8" data-testid="game-listening-result">
        <Trophy className={`w-16 h-16 mx-auto ${pct >= 70 ? "text-amber-500" : "text-muted-foreground"}`} />
        <h3 className="text-xl font-bold">{pct >= 70 ? "Great Listening!" : "Keep Practicing!"}</h3>
        <p className="text-3xl font-bold text-primary">{score}/{total}</p>
        <Button onClick={restart} className="gap-2" data-testid="button-restart-listening">
          <RotateCcw className="w-4 h-4" /> Play Again
        </Button>
      </div>
    );
  }

  if (round >= gameLetters.length) return null;

  return (
    <div className="space-y-6" data-testid="game-listening">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">{round + 1}/{gameLetters.length}</Badge>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-sm font-medium">{score}</span>
        </div>
      </div>
      <Progress value={(round / gameLetters.length) * 100} className="h-1.5" />

      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">Listen and pick the right letter</p>
        <Button
          variant="outline"
          size="lg"
          className="h-24 w-24 rounded-full mx-auto"
          onClick={playLetter}
          disabled={playing}
          data-testid="button-play-listening"
        >
          {playing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Volume2 className="w-8 h-8" />}
        </Button>
        <p className="text-xs text-muted-foreground">{playing ? "Playing..." : "Tap to listen"}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {options.map((opt, i) => {
          let classes = "";
          if (feedback) {
            if (opt === feedback.answer) classes = "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
            else if (opt !== feedback.answer && feedback.correct === false) classes = "opacity-50";
          }
          return (
            <Button
              key={i}
              variant="outline"
              className={`h-16 text-3xl ${classes}`}
              style={{ fontFamily: AMIRI }}
              dir="rtl"
              onClick={() => !feedback && handleAnswer(opt)}
              disabled={!!feedback}
              data-testid={`button-listen-option-${i}`}
            >
              {opt}
              {feedback && opt === feedback.answer && <Check className="w-4 h-4 ml-2 text-emerald-500" />}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function RootBuilderGame() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ correct: boolean } | null>(null);
  const [gameRoots] = useState(() => shuffle(ROOT_WORDS).slice(0, 4));
  const [options, setOptions] = useState<{ word: string; meaning: string; isCorrect: boolean }[]>([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (round < gameRoots.length) {
      const correct = gameRoots[round].words;
      const wrongPool = ROOT_WORDS
        .filter(r => r.root !== gameRoots[round].root)
        .flatMap(r => r.words);
      const wrongs = shuffle(wrongPool).slice(0, 2);
      const allOpts = shuffle([
        ...correct.slice(0, 2).map(w => ({ ...w, isCorrect: true })),
        ...wrongs.map(w => ({ ...w, isCorrect: false })),
      ]);
      setOptions(allOpts);
      setSelected([]);
      setFeedback(null);
    } else if (round > 0) {
      setGameOver(true);
    }
  }, [round, gameRoots]);

  function toggleOption(idx: number) {
    if (feedback) return;
    setSelected(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  }

  function checkAnswers() {
    const correct = selected.every(i => options[i]?.isCorrect) &&
      selected.length === options.filter(o => o.isCorrect).length;
    setFeedback({ correct });
    if (correct) setScore(s => s + 1);
    setTimeout(() => setRound(r => r + 1), 1500);
  }

  function restart() {
    setRound(0);
    setScore(0);
    setSelected([]);
    setFeedback(null);
    setGameOver(false);
  }

  if (gameOver) {
    return (
      <div className="text-center space-y-4 py-8" data-testid="game-root-result">
        <Trophy className={`w-16 h-16 mx-auto ${score >= 3 ? "text-amber-500" : "text-muted-foreground"}`} />
        <h3 className="text-xl font-bold">{score >= 3 ? "Root Master!" : "Keep Learning!"}</h3>
        <p className="text-3xl font-bold text-primary">{score}/{gameRoots.length}</p>
        <Button onClick={restart} className="gap-2" data-testid="button-restart-root">
          <RotateCcw className="w-4 h-4" /> Play Again
        </Button>
      </div>
    );
  }

  if (round >= gameRoots.length) return null;
  const current = gameRoots[round];

  return (
    <div className="space-y-6" data-testid="game-root-builder">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">{round + 1}/{gameRoots.length}</Badge>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-sm font-medium">{score}</span>
        </div>
      </div>
      <Progress value={(round / gameRoots.length) * 100} className="h-1.5" />

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">Select all words from this root:</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10">
          <span className="text-2xl font-bold" style={{ fontFamily: AMIRI }} dir="rtl">{current.root}</span>
          <span className="text-xs text-muted-foreground">({current.rootLetters})</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {options.map((opt, i) => {
          const isSel = selected.includes(i);
          let classes = isSel ? "ring-2 ring-primary bg-primary/5" : "";
          if (feedback) {
            if (opt.isCorrect) classes = "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
            else if (isSel && !opt.isCorrect) classes = "ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20";
            else classes = "opacity-50";
          }
          return (
            <Button
              key={i}
              variant="outline"
              className={`h-auto py-3 flex-col gap-1 ${classes}`}
              onClick={() => toggleOption(i)}
              disabled={!!feedback}
              data-testid={`button-root-option-${i}`}
            >
              <span className="text-xl" style={{ fontFamily: AMIRI }} dir="rtl">{opt.word}</span>
              <span className="text-xs text-muted-foreground">{opt.meaning}</span>
            </Button>
          );
        })}
      </div>

      {!feedback && (
        <div className="text-center">
          <Button onClick={checkAnswers} disabled={selected.length === 0} data-testid="button-check-root">
            Check Selection
          </Button>
        </div>
      )}

      {feedback && (
        <p className={`text-center text-sm font-medium ${feedback.correct ? "text-emerald-600" : "text-red-600"}`}>
          {feedback.correct ? "Perfect! All correct!" : "Not quite — the correct words are highlighted"}
        </p>
      )}
    </div>
  );
}

function SpeedRoundGame() {
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [currentLetter, setCurrentLetter] = useState<LetterPair | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function nextQuestion() {
    const letter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
    const others = shuffle(ALL_LETTERS.filter(l => l.name !== letter.name)).slice(0, 3).map(l => l.name);
    setCurrentLetter(letter);
    setOptions(shuffle([letter.name, ...others]));
    setFeedback(null);
  }

  function start() {
    setGameState("playing");
    setScore(0);
    setTimeLeft(30);
    nextQuestion();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setGameState("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function handleAnswer(answer: string) {
    if (!currentLetter || feedback) return;
    const correct = answer === currentLetter.name;
    if (correct) {
      setScore(s => s + 1);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setTimeout(nextQuestion, 400);
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  if (gameState === "ready") {
    return (
      <div className="text-center space-y-6 py-8" data-testid="game-speed-ready">
        <Zap className="w-16 h-16 mx-auto text-amber-500" />
        <h3 className="text-xl font-bold">Speed Round</h3>
        <p className="text-sm text-muted-foreground">Identify as many letters as you can in 30 seconds!</p>
        <Button onClick={start} className="gap-2" data-testid="button-start-speed">
          <Timer className="w-4 h-4" /> Start!
        </Button>
      </div>
    );
  }

  if (gameState === "finished") {
    return (
      <div className="text-center space-y-4 py-8" data-testid="game-speed-result">
        <Trophy className={`w-16 h-16 mx-auto ${score >= 15 ? "text-amber-500" : "text-muted-foreground"}`} />
        <h3 className="text-xl font-bold">{score >= 15 ? "Lightning Fast!" : score >= 8 ? "Good Speed!" : "Keep Practicing!"}</h3>
        <p className="text-4xl font-bold text-primary">{score}</p>
        <p className="text-sm text-muted-foreground">letters in 30 seconds</p>
        <Button onClick={() => { setGameState("ready"); }} className="gap-2" data-testid="button-restart-speed">
          <RotateCcw className="w-4 h-4" /> Try Again
        </Button>
      </div>
    );
  }

  if (!currentLetter) return null;

  return (
    <div className="space-y-4" data-testid="game-speed-playing">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-primary" />
          <span className={`text-lg font-bold tabular-nums ${timeLeft <= 5 ? "text-red-500 animate-pulse" : ""}`}>{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-lg font-bold">{score}</span>
        </div>
      </div>

      <Progress value={(timeLeft / 30) * 100} className="h-2" />

      <div className="flex items-center justify-center py-4">
        <div className={`w-24 h-24 rounded-lg flex items-center justify-center transition-colors ${feedback === "correct" ? "bg-emerald-100 dark:bg-emerald-900/30" : feedback === "wrong" ? "bg-red-100 dark:bg-red-900/30" : "bg-primary/10"}`}>
          <span className="text-6xl" style={{ fontFamily: AMIRI }} dir="rtl">{currentLetter.letter}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
        {options.map((opt, i) => (
          <Button
            key={`${opt}-${i}`}
            variant="outline"
            className="h-11 text-sm"
            onClick={() => handleAnswer(opt)}
            data-testid={`button-speed-option-${i}`}
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
}

type GameType = "match" | "listening" | "root" | "speed";

const GAME_INFO: { id: GameType; title: string; titleAr: string; desc: string; icon: any; color: string }[] = [
  { id: "match", title: "Letter Match", titleAr: "مطابقة الحروف", desc: "See a letter, pick its name", icon: Eye, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600" },
  { id: "listening", title: "Listening Challenge", titleAr: "تحدي الاستماع", desc: "Hear a letter, find it", icon: Volume2, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600" },
  { id: "root", title: "Root Builder", titleAr: "بناء الجذور", desc: "Find words from the same root", icon: Sparkles, color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" },
  { id: "speed", title: "Speed Round", titleAr: "الجولة السريعة", desc: "30 seconds, max letters!", icon: Zap, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600" },
];

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);

  if (activeGame) {
    const info = GAME_INFO.find(g => g.id === activeGame)!;
    return (
      <div className="p-6 max-w-xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <info.icon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">{info.title}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setActiveGame(null)} data-testid="button-back-games">
            <ArrowRight className="w-4 h-4 mr-1" /> All Games
          </Button>
        </div>
        <Card>
          <CardContent className="p-5">
            {activeGame === "match" && <LetterMatchGame />}
            {activeGame === "listening" && <ListeningGame />}
            {activeGame === "root" && <RootBuilderGame />}
            {activeGame === "speed" && <SpeedRoundGame />}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <Gamepad2 className="w-10 h-10 mx-auto text-primary" />
        <h1 className="text-2xl font-bold" data-testid="text-games-title">Arabic Games</h1>
        <p className="text-sm text-muted-foreground" dir="rtl" style={{ fontFamily: AMIRI }}>ألعاب تعليمية تفاعلية</p>
        <p className="text-sm text-muted-foreground">Practice Arabic through fun, interactive games</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {GAME_INFO.map(game => (
          <Card
            key={game.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveGame(game.id)}
            data-testid={`card-game-${game.id}`}
          >
            <CardContent className="p-5 flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${game.color}`}>
                <game.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{game.title}</h3>
                <p className="text-xs text-muted-foreground" dir="rtl" style={{ fontFamily: AMIRI }}>{game.titleAr}</p>
                <p className="text-xs text-muted-foreground mt-1">{game.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
