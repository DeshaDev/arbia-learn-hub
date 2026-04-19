import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye, ArrowRight, ArrowLeft, Lightbulb, Layers, Sun, Moon,
  Volume2, ChevronLeft, ChevronRight, VolumeX, Check, Loader2,
  Pen, BookOpen, MessageCircle, Utensils, HelpCircle, GraduationCap,
  Eraser, Send, Mic, MicOff, Square, Star, AlertCircle, RotateCcw,
} from "lucide-react";

import sceneCalligraphy from "../assets/images/scene-calligraphy.png";
import sceneMarketplace from "../assets/images/scene-marketplace.png";
import sceneCoffee from "../assets/images/scene-coffee.png";
import sceneMosque from "../assets/images/scene-mosque.png";
import teacherGuide from "../assets/images/teacher-guide.png";

const AMIRI = "'Amiri', serif";

const audioCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;

async function playArabicTTS(text: string): Promise<HTMLAudioElement> {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

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

  if (!response.ok) throw new Error("TTS request failed");

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  audioCache.set(text, url);

  const audio = new Audio(url);
  currentAudio = audio;
  await audio.play();
  return audio;
}

function speakArabic(text: string) {
  playArabicTTS(text).catch(() => {});
}

function AudioBtn({ text, size = "sm", className = "" }: { text: string; size?: "sm" | "icon"; className?: string }) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing || loading) return;

    setLoading(true);
    try {
      const audio = await playArabicTTS(text);
      setLoading(false);
      setPlaying(true);
      audio.onended = () => setPlaying(false);
      audio.onerror = () => { setPlaying(false); setLoading(false); };
    } catch {
      setLoading(false);
      setPlaying(false);
    }
  }, [text, playing, loading]);

  if (size === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className={`rounded-full ${playing ? "bg-primary text-primary-foreground" : ""} ${className}`}
        data-testid="button-audio"
        disabled={loading}
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} className={className} data-testid="button-audio" disabled={loading}>
      {loading ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Volume2 className={`w-3.5 h-3.5 mr-1 ${playing ? "text-primary" : ""}`} />}
      <span className="text-xs">{loading ? "Loading..." : playing ? "Playing..." : "Listen"}</span>
    </Button>
  );
}

function SceneHeader({ image, title, subtitle, icon: Icon }: { image: string; title: string; subtitle: string; icon?: any }) {
  return (
    <div className="relative rounded-md overflow-hidden mb-4">
      <img src={image} alt="" className="w-full h-32 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <p className="text-xs text-white/70 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function TeacherTip({ tip }: { tip: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-md bg-primary/5 border border-primary/10">
      <img src={teacherGuide} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-primary/20" />
      <div>
        <p className="text-xs font-medium text-primary mb-0.5">Teacher Tip</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
      </div>
    </div>
  );
}

function PronunciationGuide({ letter, ipa, description, mouthPosition }: { letter: string; ipa: string; description: string; mouthPosition: string }) {
  return (
    <div className="p-3 rounded-md bg-muted/50 border border-border space-y-2">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-2xl" style={{ fontFamily: AMIRI }} dir="rtl">{letter}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono">{ipa}</Badge>
            <AudioBtn text={letter} size="icon" className="scale-75" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex items-start gap-1.5">
        <MessageCircle className="w-3 h-3 mt-0.5 text-primary/60 shrink-0" />
        <p className="text-[10px] text-muted-foreground">{mouthPosition}</p>
      </div>
    </div>
  );
}

function LetterWritingGuide({ letter, strokes }: { letter: string; strokes: string[] }) {
  const [step, setStep] = useState(0);
  return (
    <div className="space-y-3">
      <p className="text-xs text-center font-medium text-muted-foreground">Writing Guide</p>
      <div className="flex items-center justify-center gap-6">
        <div className="w-24 h-24 rounded-md bg-muted/30 border-2 border-dashed border-muted-foreground/20 flex items-center justify-center relative">
          <span className="text-6xl text-muted-foreground/20" style={{ fontFamily: AMIRI }} dir="rtl">{letter}</span>
          <span className="text-6xl absolute" style={{ fontFamily: AMIRI, color: `hsl(var(--primary) / ${(step + 1) / strokes.length})` }} dir="rtl">{letter}</span>
        </div>
        <div className="space-y-1.5">
          {strokes.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-xs px-2 py-1 rounded-md cursor-pointer transition-colors ${i === step ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
              onClick={() => setStep(i)}
              data-testid={`stroke-step-${i}`}
            >
              <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px] shrink-0">{i + 1}</span>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface AIFeedback {
  score: number;
  feedback: string;
  feedbackAr?: string;
  tips: string[];
  transcript?: string;
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" :
    score >= 50 ? "text-amber-600 bg-amber-100 dark:bg-amber-900/30" :
    "text-red-600 bg-red-100 dark:bg-red-900/30";
  const stars = score >= 80 ? 3 : score >= 50 ? 2 : 1;
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${color}`} data-testid="badge-ai-score">
      {Array.from({ length: stars }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-current" />
      ))}
      <span>{score}%</span>
    </div>
  );
}

function AIFeedbackPanel({ result, onRetry }: { result: AIFeedback; onRetry: () => void }) {
  return (
    <div className="space-y-2 p-3 rounded-md bg-muted/50 border" data-testid="panel-ai-feedback">
      <div className="flex items-center justify-between">
        <ScoreBadge score={result.score} />
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onRetry} data-testid="button-retry">
          <RotateCcw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      </div>
      <p className="text-xs">{result.feedback}</p>
      {result.feedbackAr && (
        <p className="text-xs text-muted-foreground" dir="rtl" style={{ fontFamily: AMIRI }}>{result.feedbackAr}</p>
      )}
      {result.tips.length > 0 && (
        <div className="space-y-0.5">
          {result.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
              <Lightbulb className="w-2.5 h-2.5 mt-0.5 text-amber-500 shrink-0" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DrawingCanvas({ letter, letterName }: { letter: string; letterName: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<AIFeedback | null>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "hsl(var(--foreground))";
    drawGuide(ctx, canvas, letter);
  }, [letter]);

  function drawGuide(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, l: string) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.font = `120px ${AMIRI}`;
    ctx.fillStyle = "hsl(var(--muted-foreground) / 0.12)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.direction = "rtl";
    ctx.fillText(l, canvas.offsetWidth / 2, canvas.offsetHeight / 2);
    ctx.restore();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "hsl(var(--foreground))";
  }

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const touch = "touches" in e ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    lastPoint.current = getPos(e);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !lastPoint.current) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPoint.current = pos;
  }

  function stopDraw() {
    setIsDrawing(false);
    lastPoint.current = null;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawGuide(ctx, canvas, letter);
    setHasDrawn(false);
    setResult(null);
  }

  async function evaluate() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setEvaluating(true);
    try {
      const imageData = canvas.toDataURL("image/png");
      const res = await fetch("/api/ai/evaluate-handwriting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData, targetLetter: letter, targetName: letterName }),
      });
      if (!res.ok) throw new Error("Evaluation failed");
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ score: 0, feedback: "Could not evaluate. Please try again.", tips: [] });
    }
    setEvaluating(false);
  }

  return (
    <div className="space-y-2" data-testid="drawing-canvas-container">
      <canvas
        ref={canvasRef}
        className="w-full h-40 rounded-md border-2 border-dashed border-primary/20 bg-background cursor-crosshair touch-none"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
        data-testid="canvas-drawing"
      />
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          {!hasDrawn && !result ? "Draw the letter using your finger or mouse" : ""}
        </p>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={clearCanvas} data-testid="button-clear-canvas">
            <Eraser className="w-3 h-3" />
            Clear
          </Button>
          <Button variant="default" size="sm" className="h-7 text-xs gap-1" onClick={evaluate} disabled={!hasDrawn || evaluating} data-testid="button-evaluate-drawing">
            {evaluating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
            {evaluating ? "Checking..." : "Check"}
          </Button>
        </div>
      </div>
      {result && <AIFeedbackPanel result={result} onRetry={clearCanvas} />}
    </div>
  );
}

function MicRecorder({ expectedText, transliteration, label }: { expectedText: string; transliteration?: string; label?: string }) {
  const [recording, setRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<AIFeedback | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [permissionDenied, setPermissionDenied] = useState(false);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionDenied(false);
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        await evaluateAudio(blob);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
          setRecording(false);
        }
      }, 8000);
    } catch {
      setPermissionDenied(true);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  }

  async function evaluateAudio(blob: Blob) {
    setEvaluating(true);
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
      const res = await fetch("/api/ai/evaluate-pronunciation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio: base64,
          expectedText,
          expectedTransliteration: transliteration,
        }),
      });
      if (!res.ok) throw new Error("Evaluation failed");
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ score: 0, feedback: "Could not evaluate. Please try again.", tips: [] });
    }
    setEvaluating(false);
  }

  function retry() {
    setResult(null);
  }

  if (permissionDenied) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30" data-testid="mic-permission-denied">
        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
        <p className="text-xs text-red-700 dark:text-red-300">Microphone access denied. Please allow microphone access in your browser settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="mic-recorder-container">
      <div className="flex flex-col items-center gap-3">
        <div className="text-center">
          <p className="text-2xl" style={{ fontFamily: AMIRI }} dir="rtl">{expectedText}</p>
          {transliteration && <p className="text-xs text-muted-foreground mt-1">{transliteration}</p>}
        </div>
        <div className="flex flex-col items-center gap-1.5">
          {recording ? (
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full w-14 h-14 animate-pulse"
              onClick={stopRecording}
              data-testid="button-stop-recording"
            >
              <Square className="w-5 h-5" />
            </Button>
          ) : evaluating ? (
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={startRecording}
              disabled={evaluating}
              data-testid="button-start-recording"
            >
              <Mic className="w-6 h-6" />
            </Button>
          )}
          <p className="text-xs text-muted-foreground">
            {recording ? "Recording... tap to stop" : evaluating ? "Analyzing..." : "Tap to speak"}
          </p>
        </div>
      </div>
      {result && <AIFeedbackPanel result={result} onRetry={retry} />}
    </div>
  );
}

function StepCarousel({ steps, testIdPrefix = "step" }: { steps: React.ReactNode[]; testIdPrefix?: string }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = steps.length;

  const goTo = useCallback((idx: number, dir: "next" | "prev") => {
    if (animating || idx === current) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  }, [animating, current]);

  const next = useCallback(() => { if (current < total - 1) goTo(current + 1, "next"); }, [current, total, goTo]);
  const prev = useCallback(() => { if (current > 0) goTo(current - 1, "prev"); }, [current, goTo]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { next(); e.preventDefault(); }
    if (e.key === "ArrowLeft") { prev(); e.preventDefault(); }
  }, [next, prev]);

  return (
    <div className="space-y-4 outline-none" tabIndex={0} onKeyDown={handleKeyDown} data-testid={`${testIdPrefix}-carousel`}>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-muted-foreground/20 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground tabular-nums shrink-0" data-testid={`${testIdPrefix}-progress`}>{current + 1}/{total}</span>
      </div>

      <div ref={containerRef} className="relative overflow-hidden min-h-[200px]">
        <div
          className={`transition-all duration-200 ease-out ${
            animating
              ? direction === "next"
                ? "opacity-0 translate-x-4"
                : "opacity-0 -translate-x-4"
              : "opacity-100 translate-x-0"
          }`}
        >
          {steps[current]}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={prev}
          disabled={current === 0}
          data-testid="button-prev-step"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <div className="flex gap-1">
          {current < total - 1 ? (
            <Button size="sm" onClick={next} data-testid="button-next-step">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Badge variant="default" className="bg-emerald-600 text-white px-3 py-1.5">
              <Check className="w-3 h-3 mr-1" />
              Complete
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

interface LetterForm {
  letter: string;
  name: string;
  nameAr: string;
  isolated: string;
  initial: string;
  medial: string;
  final: string;
  dots: string;
  sound: string;
  ipa: string;
  mouthTip: string;
  writingSteps: string[];
  tashkeel?: { fatha: string; damma: string; kasra: string; sukun: string };
}

interface LetterFamily {
  name: string;
  nameAr: string;
  description: string;
  letters: LetterForm[];
}

const ALL_LETTER_FAMILIES: LetterFamily[] = [
  {
    name: "The Standalone", nameAr: "الألف", description: "The foundation — Arabic's simplest letter",
    letters: [
      { letter: "أ", name: "Alif", nameAr: "أَلِف", isolated: "ا", initial: "ا", medial: "ـا", final: "ـا", dots: "None", sound: "Glottal stop / long 'aa'", ipa: "/ʔ/, /aː/", mouthTip: "Open your mouth wide. For the glottal stop, briefly close the back of your throat (like the pause in 'uh-oh').", writingSteps: ["Start from top", "Draw a straight vertical line downward", "That's it! Alif is the simplest letter"], tashkeel: { fatha: "أَ", damma: "أُ", kasra: "إِ", sukun: "أْ" } },
    ],
  },
  {
    name: "The Tooth Family", nameAr: "عائلة السِّن", description: "Same boat shape, different dots",
    letters: [
      { letter: "ب", name: "Ba", nameAr: "بَاء", isolated: "ب", initial: "بـ", medial: "ـبـ", final: "ـب", dots: "1 below", sound: "b (as in 'boy')", ipa: "/b/", mouthTip: "Press both lips together, then release with a small puff of air. Same as English 'b'.", writingSteps: ["Start from the right", "Draw a curved boat shape", "Add one dot below the center"], tashkeel: { fatha: "بَ", damma: "بُ", kasra: "بِ", sukun: "بْ" } },
      { letter: "ت", name: "Ta", nameAr: "تَاء", isolated: "ت", initial: "تـ", medial: "ـتـ", final: "ـت", dots: "2 above", sound: "t (as in 'top')", ipa: "/t/", mouthTip: "Touch the tip of your tongue to the roof of your mouth behind your top teeth. Same as English 't'.", writingSteps: ["Start from the right", "Draw the same boat shape as Ba", "Add two dots above"], tashkeel: { fatha: "تَ", damma: "تُ", kasra: "تِ", sukun: "تْ" } },
      { letter: "ث", name: "Tha", nameAr: "ثَاء", isolated: "ث", initial: "ثـ", medial: "ـثـ", final: "ـث", dots: "3 above", sound: "th (as in 'think')", ipa: "/θ/", mouthTip: "Place the tip of your tongue between your teeth and blow air gently. Like English 'th' in 'three' (NOT 'the').", writingSteps: ["Start from the right", "Draw the same boat shape", "Add three dots above in a triangle"], tashkeel: { fatha: "ثَ", damma: "ثُ", kasra: "ثِ", sukun: "ثْ" } },
      { letter: "ن", name: "Nun", nameAr: "نُون", isolated: "ن", initial: "نـ", medial: "ـنـ", final: "ـن", dots: "1 above", sound: "n (as in 'no')", ipa: "/n/", mouthTip: "Touch the tip of your tongue to the ridge behind your upper teeth. Same as English 'n'.", writingSteps: ["Start from the right", "Draw the boat shape", "Add one dot above"], tashkeel: { fatha: "نَ", damma: "نُ", kasra: "نِ", sukun: "نْ" } },
      { letter: "ي", name: "Ya", nameAr: "يَاء", isolated: "ي", initial: "يـ", medial: "ـيـ", final: "ـي", dots: "2 below", sound: "y (as in 'yes') / ee", ipa: "/j/, /iː/", mouthTip: "Raise the middle of your tongue toward the roof. Like English 'y' in 'yes' or 'ee' in 'see'.", writingSteps: ["Start from the right", "Draw the tooth shape", "Extend tail below in isolated/final", "Add two dots below"], tashkeel: { fatha: "يَ", damma: "يُ", kasra: "يِ", sukun: "يْ" } },
    ],
  },
  {
    name: "The Cup Family", nameAr: "عائلة الكأس", description: "Cup shape with a tail below — dots change the sound",
    letters: [
      { letter: "ج", name: "Jim", nameAr: "جِيم", isolated: "ج", initial: "جـ", medial: "ـجـ", final: "ـج", dots: "1 below", sound: "j (as in 'jump')", ipa: "/d͡ʒ/", mouthTip: "Touch the middle of your tongue to the roof of your mouth, then release. Like English 'j' in 'jump'.", writingSteps: ["Start from the right", "Draw a curved cup shape", "Add a tail that drops below the line", "Add one dot inside the cup"], tashkeel: { fatha: "جَ", damma: "جُ", kasra: "جِ", sukun: "جْ" } },
      { letter: "ح", name: "Ha", nameAr: "حَاء", isolated: "ح", initial: "حـ", medial: "ـحـ", final: "ـح", dots: "None", sound: "Breathy h (deep in throat)", ipa: "/ħ/", mouthTip: "Breathe out from deep in your throat, as if fogging a mirror but stronger. There is no English equivalent.", writingSteps: ["Start from the right", "Draw the same cup shape as Jim", "Add a tail that drops below", "No dots needed"], tashkeel: { fatha: "حَ", damma: "حُ", kasra: "حِ", sukun: "حْ" } },
      { letter: "خ", name: "Kha", nameAr: "خَاء", isolated: "خ", initial: "خـ", medial: "ـخـ", final: "ـخ", dots: "1 above", sound: "kh (like Scottish 'loch')", ipa: "/x/", mouthTip: "Raise the back of your tongue near the soft palate and push air through. Like clearing your throat gently.", writingSteps: ["Start from the right", "Draw the same cup shape", "Add a tail below the line", "Add one dot above the cup"], tashkeel: { fatha: "خَ", damma: "خُ", kasra: "خِ", sukun: "خْ" } },
    ],
  },
  {
    name: "The Dal Family", nameAr: "عائلة الدال", description: "Simple right-angle shape — non-connecting letters",
    letters: [
      { letter: "د", name: "Dal", nameAr: "دَال", isolated: "د", initial: "د", medial: "ـد", final: "ـد", dots: "None", sound: "d (as in 'dog')", ipa: "/d/", mouthTip: "Touch the tip of your tongue to the ridge behind your upper teeth. Same as English 'd'.", writingSteps: ["Start from upper right", "Draw a small right-angle or curved triangle", "No dots needed"], tashkeel: { fatha: "دَ", damma: "دُ", kasra: "دِ", sukun: "دْ" } },
      { letter: "ذ", name: "Dhal", nameAr: "ذَال", isolated: "ذ", initial: "ذ", medial: "ـذ", final: "ـذ", dots: "1 above", sound: "th (as in 'the')", ipa: "/ð/", mouthTip: "Place tongue between teeth like Tha, but vibrate your voice. Like 'th' in 'the' (NOT 'think').", writingSteps: ["Draw the same shape as Dal", "Add one dot above"], tashkeel: { fatha: "ذَ", damma: "ذُ", kasra: "ذِ", sukun: "ذْ" } },
    ],
  },
  {
    name: "The Ra Family", nameAr: "عائلة الراء", description: "Curved tail — non-connecting letters",
    letters: [
      { letter: "ر", name: "Ra", nameAr: "رَاء", isolated: "ر", initial: "ر", medial: "ـر", final: "ـر", dots: "None", sound: "r (rolled/tapped)", ipa: "/r/", mouthTip: "Tap the tip of your tongue once against the ridge behind your upper teeth. Like a quick Spanish 'r'.", writingSteps: ["Start from upper right", "Draw a gentle curved stroke going below the line", "No dots needed"], tashkeel: { fatha: "رَ", damma: "رُ", kasra: "رِ", sukun: "رْ" } },
      { letter: "ز", name: "Zay", nameAr: "زَاي", isolated: "ز", initial: "ز", medial: "ـز", final: "ـز", dots: "1 above", sound: "z (as in 'zoo')", ipa: "/z/", mouthTip: "Place tongue behind upper teeth and vibrate. Same as English 'z'.", writingSteps: ["Draw the same shape as Ra", "Add one dot above"], tashkeel: { fatha: "زَ", damma: "زُ", kasra: "زِ", sukun: "زْ" } },
    ],
  },
  {
    name: "The Seen Family", nameAr: "عائلة السين", description: "Three-tooth comb shape",
    letters: [
      { letter: "س", name: "Sin", nameAr: "سِين", isolated: "س", initial: "سـ", medial: "ـسـ", final: "ـس", dots: "None", sound: "s (as in 'sun')", ipa: "/s/", mouthTip: "Place your tongue behind your lower teeth and push air through. Same as English 's'.", writingSteps: ["Start from the right", "Draw three small teeth (zigzag)", "End with a tail curving below the line"], tashkeel: { fatha: "سَ", damma: "سُ", kasra: "سِ", sukun: "سْ" } },
      { letter: "ش", name: "Shin", nameAr: "شِين", isolated: "ش", initial: "شـ", medial: "ـشـ", final: "ـش", dots: "3 above", sound: "sh (as in 'she')", ipa: "/ʃ/", mouthTip: "Push air through with your tongue slightly behind the 's' position. Same as English 'sh'.", writingSteps: ["Draw the same three-tooth shape as Sin", "Add three dots above in a triangle"], tashkeel: { fatha: "شَ", damma: "شُ", kasra: "شِ", sukun: "شْ" } },
    ],
  },
  {
    name: "The Sad Family", nameAr: "عائلة الصاد", description: "Emphatic letters — heavier sounds unique to Arabic",
    letters: [
      { letter: "ص", name: "Sad", nameAr: "صَاد", isolated: "ص", initial: "صـ", medial: "ـصـ", final: "ـص", dots: "None", sound: "Heavy 's' (emphatic)", ipa: "/sˤ/", mouthTip: "Say 's' but press the back of your tongue down and make it deeper/heavier. Unique to Arabic.", writingSteps: ["Start from the right", "Draw a rounded loop", "Extend a flat line to the left"], tashkeel: { fatha: "صَ", damma: "صُ", kasra: "صِ", sukun: "صْ" } },
      { letter: "ض", name: "Dad", nameAr: "ضَاد", isolated: "ض", initial: "ضـ", medial: "ـضـ", final: "ـض", dots: "1 above", sound: "Heavy 'd' (emphatic)", ipa: "/dˤ/", mouthTip: "Say 'd' but press the back of your tongue down and make it deeper. Arabic is called 'the language of Dad' (لغة الضاد).", writingSteps: ["Draw the same shape as Sad", "Add one dot above"], tashkeel: { fatha: "ضَ", damma: "ضُ", kasra: "ضِ", sukun: "ضْ" } },
    ],
  },
  {
    name: "The Ta-emphatic Family", nameAr: "عائلة الطاء", description: "Tall loop shape — emphatic pair",
    letters: [
      { letter: "ط", name: "Taa", nameAr: "طَاء", isolated: "ط", initial: "طـ", medial: "ـطـ", final: "ـط", dots: "None", sound: "Heavy 't' (emphatic)", ipa: "/tˤ/", mouthTip: "Say 't' but press the back of your tongue down. Darker and heavier than regular Ta.", writingSteps: ["Draw an upright loop/egg shape", "Add a vertical stroke going up from the top"], tashkeel: { fatha: "طَ", damma: "طُ", kasra: "طِ", sukun: "طْ" } },
      { letter: "ظ", name: "Dhaa", nameAr: "ظَاء", isolated: "ظ", initial: "ظـ", medial: "ـظـ", final: "ـظ", dots: "1 above", sound: "Heavy 'th' (emphatic)", ipa: "/ðˤ/", mouthTip: "Like Dhal but emphatic — tongue between teeth with a heavier, deeper sound.", writingSteps: ["Draw the same shape as Taa", "Add one dot above"], tashkeel: { fatha: "ظَ", damma: "ظُ", kasra: "ظِ", sukun: "ظْ" } },
    ],
  },
  {
    name: "The Ain Family", nameAr: "عائلة العين", description: "Eye-shaped loop — unique Arabic sounds",
    letters: [
      { letter: "ع", name: "Ain", nameAr: "عَيْن", isolated: "ع", initial: "عـ", medial: "ـعـ", final: "ـع", dots: "None", sound: "Voiced pharyngeal", ipa: "/ʕ/", mouthTip: "Squeeze the muscles deep in your throat as if swallowing. No English equivalent — unique to Arabic and Semitic languages.", writingSteps: ["Start with a small loop/hook at the top", "Draw a curved body", "Add a tail going below"], tashkeel: { fatha: "عَ", damma: "عُ", kasra: "عِ", sukun: "عْ" } },
      { letter: "غ", name: "Ghain", nameAr: "غَيْن", isolated: "غ", initial: "غـ", medial: "ـغـ", final: "ـغ", dots: "1 above", sound: "Gargling 'r' (like French r)", ipa: "/ɣ/", mouthTip: "Raise the back of your tongue near the soft palate and vibrate. Similar to French 'r' in 'Paris'.", writingSteps: ["Draw the same shape as Ain", "Add one dot above"], tashkeel: { fatha: "غَ", damma: "غُ", kasra: "غِ", sukun: "غْ" } },
    ],
  },
  {
    name: "The Fa Family", nameAr: "عائلة الفاء", description: "Loop on a stick — look-alike pair",
    letters: [
      { letter: "ف", name: "Fa", nameAr: "فَاء", isolated: "ف", initial: "فـ", medial: "ـفـ", final: "ـف", dots: "1 above", sound: "f (as in 'fun')", ipa: "/f/", mouthTip: "Touch your lower lip to your upper teeth and push air through. Same as English 'f'.", writingSteps: ["Start from the right", "Draw a small loop at the top", "Extend a curved tail", "Add one dot above the loop"], tashkeel: { fatha: "فَ", damma: "فُ", kasra: "فِ", sukun: "فْ" } },
      { letter: "ق", name: "Qaf", nameAr: "قَاف", isolated: "ق", initial: "قـ", medial: "ـقـ", final: "ـق", dots: "2 above", sound: "Deep 'k' (from back of throat)", ipa: "/q/", mouthTip: "Like 'k' but much deeper — press the very back of your tongue against your uvula.", writingSteps: ["Draw a similar loop shape to Fa", "Add a deep tail below the line", "Add two dots above"], tashkeel: { fatha: "قَ", damma: "قُ", kasra: "قِ", sukun: "قْ" } },
    ],
  },
  {
    name: "The Kaf-Lam Pair", nameAr: "الكاف واللام", description: "Tall letters with unique shapes",
    letters: [
      { letter: "ك", name: "Kaf", nameAr: "كَاف", isolated: "ك", initial: "كـ", medial: "ـكـ", final: "ـك", dots: "None", sound: "k (as in 'king')", ipa: "/k/", mouthTip: "Press the back of your tongue against the soft palate. Same as English 'k'.", writingSteps: ["Start from the right", "Draw an upright shape with inner stroke", "The inner hamza-like mark is distinctive"], tashkeel: { fatha: "كَ", damma: "كُ", kasra: "كِ", sukun: "كْ" } },
      { letter: "ل", name: "Lam", nameAr: "لاَم", isolated: "ل", initial: "لـ", medial: "ـلـ", final: "ـل", dots: "None", sound: "l (as in 'lamp')", ipa: "/l/", mouthTip: "Touch the tip of your tongue to the ridge behind your upper teeth. Same as English 'l'.", writingSteps: ["Draw a vertical stroke going up", "Add a small hook at the bottom"], tashkeel: { fatha: "لَ", damma: "لُ", kasra: "لِ", sukun: "لْ" } },
    ],
  },
  {
    name: "The Mim", nameAr: "الميم", description: "Round loop letter",
    letters: [
      { letter: "م", name: "Mim", nameAr: "مِيم", isolated: "م", initial: "مـ", medial: "ـمـ", final: "ـم", dots: "None", sound: "m (as in 'moon')", ipa: "/m/", mouthTip: "Press both lips together and hum. Same as English 'm'.", writingSteps: ["Draw a small round circle", "Add a tail dropping below the line"], tashkeel: { fatha: "مَ", damma: "مُ", kasra: "مِ", sukun: "مْ" } },
    ],
  },
  {
    name: "The Ha-Waw-Ya", nameAr: "الهاء والواو", description: "Remaining essential letters",
    letters: [
      { letter: "ه", name: "Ha (light)", nameAr: "هَاء", isolated: "ه", initial: "هـ", medial: "ـهـ", final: "ـه", dots: "None", sound: "h (as in 'hello')", ipa: "/h/", mouthTip: "A gentle breath out, like English 'h'. Much lighter than Ha (ح).", writingSteps: ["Draw a small oval or figure-eight shape", "Shape changes significantly by position"], tashkeel: { fatha: "هَ", damma: "هُ", kasra: "هِ", sukun: "هْ" } },
      { letter: "و", name: "Waw", nameAr: "وَاو", isolated: "و", initial: "و", medial: "ـو", final: "ـو", dots: "None", sound: "w (as in 'water') / oo", ipa: "/w/, /uː/", mouthTip: "Round your lips into a small circle. Like English 'w' or 'oo' in 'pool'.", writingSteps: ["Draw a small round head", "Add a tail curving down", "Non-connecting: only joins from the right"], tashkeel: { fatha: "وَ", damma: "وُ", kasra: "وِ", sukun: "وْ" } },
    ],
  },
];

const NON_CONNECTORS = ["ا", "د", "ذ", "ر", "ز", "و"];

interface WordBreakdown {
  word: string;
  meaning: string;
  letters: { char: string; name: string; position: "isolated" | "initial" | "medial" | "final"; }[];
}

const SAMPLE_WORDS: WordBreakdown[] = [
  {
    word: "بَاب",
    meaning: "door",
    letters: [
      { char: "بـ", name: "Ba", position: "initial" },
      { char: "ـا", name: "Alif", position: "medial" },
      { char: "ـب", name: "Ba", position: "final" },
    ],
  },
  {
    word: "بِنْت",
    meaning: "girl",
    letters: [
      { char: "بـ", name: "Ba", position: "initial" },
      { char: "ـنـ", name: "Nun", position: "medial" },
      { char: "ـت", name: "Ta", position: "final" },
    ],
  },
  {
    word: "كِتَاب",
    meaning: "book",
    letters: [
      { char: "كـ", name: "Kaf", position: "initial" },
      { char: "ـتـ", name: "Ta", position: "medial" },
      { char: "ـا", name: "Alif", position: "medial" },
      { char: "ـب", name: "Ba", position: "final" },
    ],
  },
  {
    word: "دَرْس",
    meaning: "lesson",
    letters: [
      { char: "د", name: "Dal", position: "isolated" },
      { char: "ر", name: "Ra", position: "isolated" },
      { char: "سـ", name: "Sin", position: "initial" },
    ],
  },
];

const POSITION_COLORS: Record<string, string> = {
  isolated: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700",
  initial: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700",
  medial: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700",
  final: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700",
};

const POSITION_LABELS: Record<string, { en: string; ar: string }> = {
  isolated: { en: "Isolated", ar: "مُنفَرِد" },
  initial: { en: "Initial", ar: "بِدَايَة" },
  medial: { en: "Medial", ar: "وَسَط" },
  final: { en: "Final", ar: "نِهَايَة" },
};

function FamilyIntroCard({ family }: { family: LetterFamily }) {
  return (
    <div className="space-y-4" data-testid={`family-intro-${family.name}`}>
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold">{family.name}</p>
        <p className="text-base" dir="rtl" style={{ fontFamily: AMIRI }}>{family.nameAr}</p>
        <p className="text-xs text-muted-foreground">{family.description}</p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {family.letters.map((l) => (
          <Button key={l.name} variant="outline" className="w-16 h-16 flex-col gap-0 p-0" onClick={() => speakArabic(l.nameAr)} data-testid={`family-letter-${l.name}`}>
            <span className="text-2xl" style={{ fontFamily: AMIRI }} dir="rtl">{l.letter}</span>
            <span className="text-[10px] text-muted-foreground font-normal">{l.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

function LetterCard({ letter }: { letter: LetterForm }) {
  const [activeTab, setActiveTab] = useState<"learn" | "write" | "speak">("learn");
  const isNonConnector = NON_CONNECTORS.includes(letter.isolated);
  const positions = [
    { key: "isolated", form: letter.isolated },
    { key: "initial", form: letter.initial },
    { key: "medial", form: isNonConnector ? null : letter.medial },
    { key: "final", form: letter.final },
  ];

  const tabs = [
    { id: "learn" as const, label: "Learn", icon: Eye },
    { id: "write" as const, label: "Write", icon: Pen },
    { id: "speak" as const, label: "Speak", icon: Mic },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-md bg-primary/10 flex items-center justify-center">
          <span className="text-5xl" style={{ fontFamily: AMIRI }} dir="rtl">{letter.letter}</span>
        </div>
        <div>
          <p className="text-lg font-semibold">{letter.name}</p>
          <p className="text-sm" style={{ fontFamily: AMIRI }} dir="rtl">{letter.nameAr}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-[10px] font-mono">{letter.ipa}</Badge>
            <AudioBtn text={letter.nameAr} size="icon" className="scale-75" />
          </div>
        </div>
      </div>

      <div className="flex gap-1 p-1 rounded-md bg-muted/50" data-testid="letter-card-tabs">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            className="flex-1 gap-1.5 text-xs"
            onClick={() => setActiveTab(tab.id)}
            data-testid={`tab-letter-${tab.id}`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "learn" && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2">
            {positions.map((p) => (
              <div key={p.key} className="text-center">
                <p className="text-[10px] font-medium text-muted-foreground mb-1">{POSITION_LABELS[p.key].en}</p>
                <div className={`h-14 rounded-md border-2 flex items-center justify-center ${p.form ? POSITION_COLORS[p.key] : "bg-muted/30 border-dashed border-muted-foreground/30"}`}>
                  {p.form ? (
                    <span className="text-2xl" style={{ fontFamily: AMIRI }} dir="rtl">{p.form}</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground leading-tight">Does not connect</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {letter.tashkeel && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-center text-muted-foreground uppercase tracking-wider">Tashkeel — Vowel Sounds</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Fatha", labelAr: "فَتْحَة", form: letter.tashkeel.fatha, transliteration: `${letter.name.toLowerCase().replace(/\s.*/, "")}a`, color: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30 text-amber-900 dark:text-amber-100" },
                  { label: "Damma", labelAr: "ضَمَّة", form: letter.tashkeel.damma, transliteration: `${letter.name.toLowerCase().replace(/\s.*/, "")}u`, color: "bg-teal-50 dark:bg-teal-900/10 border-teal-200 dark:border-teal-800/30 text-teal-900 dark:text-teal-100" },
                  { label: "Kasra", labelAr: "كَسْرَة", form: letter.tashkeel.kasra, transliteration: `${letter.name.toLowerCase().replace(/\s.*/, "")}i`, color: "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/30 text-purple-900 dark:text-purple-100" },
                  { label: "Sukun", labelAr: "سُكُون", form: letter.tashkeel.sukun, transliteration: `${letter.name.toLowerCase().replace(/\s.*/, "")}`, color: "bg-slate-50 dark:bg-slate-900/10 border-slate-200 dark:border-slate-800/30 text-slate-900 dark:text-slate-100" },
                ].map((v) => (
                  <button
                    key={v.label}
                    onClick={() => speakArabic(v.form)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border cursor-pointer hover-elevate transition-shadow ${v.color}`}
                    data-testid={`tashkeel-${letter.name}-${v.label.toLowerCase()}`}
                  >
                    <span className="text-3xl leading-none" style={{ fontFamily: AMIRI }} dir="rtl">{v.form}</span>
                    <span className="text-[10px] font-medium">{v.transliteration}</span>
                    <span className="text-[9px] text-muted-foreground">{v.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <PronunciationGuide
            letter={letter.letter}
            ipa={letter.ipa}
            description={letter.sound}
            mouthPosition={letter.mouthTip}
          />
          <p className="text-xs text-muted-foreground text-center">
            Dots: {letter.dots} {isNonConnector && " | Non-connecting letter"}
          </p>
        </div>
      )}

      {activeTab === "write" && (
        <div className="space-y-3">
          <LetterWritingGuide letter={letter.letter} strokes={letter.writingSteps} />
          <DrawingCanvas letter={letter.isolated} letterName={letter.name} />
        </div>
      )}

      {activeTab === "speak" && (
        <div className="space-y-3">
          <MicRecorder expectedText={letter.nameAr} transliteration={letter.name} label={`Say: ${letter.nameAr}`} />
        </div>
      )}
    </div>
  );
}

interface VocabItem {
  arabic: string;
  transliteration: string;
  meaning: string;
  ipa?: string;
  writingTip?: string;
}

function VocabCard({ item }: { item: VocabItem }) {
  const [activeTab, setActiveTab] = useState<"learn" | "write" | "speak">("learn");
  const tabs = [
    { id: "learn" as const, label: "Learn", icon: Eye },
    { id: "write" as const, label: "Write", icon: Pen },
    { id: "speak" as const, label: "Speak", icon: Mic },
  ];

  return (
    <div className="space-y-4" data-testid={`vocab-card-${item.transliteration}`}>
      <div className="flex items-center justify-center gap-4">
        <div className="w-auto min-w-[5rem] h-20 px-3 rounded-md bg-primary/10 flex items-center justify-center">
          <span className="text-4xl" style={{ fontFamily: AMIRI }} dir="rtl">{item.arabic}</span>
        </div>
        <div>
          <p className="text-lg font-semibold">{item.meaning}</p>
          <p className="text-sm text-muted-foreground">{item.transliteration}</p>
          <div className="flex items-center gap-2 mt-1">
            {item.ipa && <Badge variant="outline" className="text-[10px] font-mono">{item.ipa}</Badge>}
            <AudioBtn text={item.arabic} size="icon" className="scale-75" />
          </div>
        </div>
      </div>

      <div className="flex gap-1 p-1 rounded-md bg-muted/50" data-testid="vocab-card-tabs">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            className="flex-1 gap-1.5 text-xs"
            onClick={() => setActiveTab(tab.id)}
            data-testid={`tab-vocab-${tab.id}`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "learn" && (
        <div className="space-y-3">
          <div className="p-3 rounded-md bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-2xl" style={{ fontFamily: AMIRI }} dir="rtl">{item.arabic}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {item.ipa && <Badge variant="outline" className="text-[10px] font-mono">{item.ipa}</Badge>}
                  <AudioBtn text={item.arabic} size="icon" className="scale-75" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.meaning}</p>
              </div>
            </div>
            {item.writingTip && (
              <div className="flex items-start gap-1.5 mt-2">
                <Lightbulb className="w-3 h-3 mt-0.5 text-amber-500 shrink-0" />
                <p className="text-[10px] text-muted-foreground">{item.writingTip}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "write" && (
        <div className="space-y-3">
          <DrawingCanvas letter={item.arabic} letterName={item.meaning} />
        </div>
      )}

      {activeTab === "speak" && (
        <div className="space-y-3">
          <MicRecorder expectedText={item.arabic} transliteration={item.transliteration} label={`Say: ${item.arabic}`} />
        </div>
      )}
    </div>
  );
}

function DotFamilyCard({ title, titleAr, letters }: { title: string; titleAr: string; letters: { char: string; name: string; dots: string }[] }) {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground" dir="rtl" style={{ fontFamily: AMIRI }}>{titleAr}</p>
      </div>
      <div className="flex justify-center gap-4">
        {letters.map((l) => (
          <div key={l.name} className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => speakArabic(l.char)}
              className="w-16 h-16 rounded-md bg-muted/70 border border-border flex items-center justify-center hover-elevate cursor-pointer group"
            >
              <span className="text-4xl" style={{ fontFamily: AMIRI }} dir="rtl">{l.char}</span>
            </button>
            <span className="text-xs font-medium">{l.name}</span>
            <span className="text-[10px] text-muted-foreground">{l.dots}</span>
            <AudioBtn text={l.char} size="icon" />
          </div>
        ))}
      </div>
      <p className="text-xs text-center text-muted-foreground">Same base shape, different dots tell you which letter it is</p>
    </div>
  );
}

function WordBreakdownStep({ word }: { word: WordBreakdown }) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <p className="text-5xl" style={{ fontFamily: AMIRI }} dir="rtl" data-testid="text-active-word">{word.word}</p>
          <AudioBtn text={word.word} size="icon" />
        </div>
        <p className="text-muted-foreground">{word.meaning}</p>
      </div>

      <div className="flex items-center justify-center gap-2 flex-wrap" dir="rtl">
        {word.letters.map((l, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <button
              onClick={() => speakArabic(l.char)}
              className={`w-16 h-16 rounded-md border-2 flex items-center justify-center cursor-pointer hover-elevate ${POSITION_COLORS[l.position]}`}
            >
              <span className="text-3xl" style={{ fontFamily: AMIRI }}>{l.char}</span>
            </button>
            <span className="text-xs font-medium">{l.name}</span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {POSITION_LABELS[l.position].en}
            </Badge>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 justify-center text-xs text-muted-foreground" dir="rtl">
        <ArrowLeft className="w-3 h-3" />
        <span>Reading direction</span>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(POSITION_LABELS).map(([key, label]) => (
          <div key={key} className={`px-3 py-1 rounded-md text-xs font-medium border ${POSITION_COLORS[key]}`}>
            {label.en}
          </div>
        ))}
      </div>
    </div>
  );
}

interface SunMoonLetter {
  letter: string;
  name: string;
  type: "sun" | "moon";
  example: string;
  exampleMeaning: string;
  pronunciation: string;
}

const SUN_MOON_DATA: SunMoonLetter[] = [
  { letter: "ش", name: "Shin", type: "sun", example: "الشَّمْس", exampleMeaning: "the sun", pronunciation: "ash-shams" },
  { letter: "ت", name: "Ta", type: "sun", example: "التَّمْر", exampleMeaning: "the dates", pronunciation: "at-tamr" },
  { letter: "ن", name: "Nun", type: "sun", example: "النَّار", exampleMeaning: "the fire", pronunciation: "an-nār" },
  { letter: "ر", name: "Ra", type: "sun", example: "الرَّجُل", exampleMeaning: "the man", pronunciation: "ar-rajul" },
  { letter: "ل", name: "Lam", type: "sun", example: "اللَّيْل", exampleMeaning: "the night", pronunciation: "al-layl" },
  { letter: "س", name: "Sin", type: "sun", example: "السَّمَاء", exampleMeaning: "the sky", pronunciation: "as-samāʾ" },
  { letter: "ق", name: "Qaf", type: "moon", example: "القَمَر", exampleMeaning: "the moon", pronunciation: "al-qamar" },
  { letter: "ب", name: "Ba", type: "moon", example: "البَاب", exampleMeaning: "the door", pronunciation: "al-bāb" },
  { letter: "ك", name: "Kaf", type: "moon", example: "الكِتَاب", exampleMeaning: "the book", pronunciation: "al-kitāb" },
  { letter: "ع", name: "Ayn", type: "moon", example: "العِلْم", exampleMeaning: "knowledge", pronunciation: "al-ʿilm" },
  { letter: "م", name: "Mim", type: "moon", example: "المَدْرَسَة", exampleMeaning: "the school", pronunciation: "al-madrasa" },
  { letter: "ج", name: "Jim", type: "moon", example: "الجَبَل", exampleMeaning: "the mountain", pronunciation: "al-jabal" },
];

function SunMoonExampleCard({ item, type }: { item: SunMoonLetter; type: "sun" | "moon" }) {
  const isSun = type === "sun";
  return (
    <div className={`flex items-center gap-3 p-3 rounded-md ${
      isSun
        ? "bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30"
        : "bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30"
    }`}>
      <div className="w-12 h-12 rounded-md bg-background flex items-center justify-center shrink-0">
        <span className="text-2xl" style={{ fontFamily: AMIRI }} dir="rtl">{item.letter}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-lg" dir="rtl" style={{ fontFamily: AMIRI }}>{item.example}</p>
          <AudioBtn text={item.example} size="icon" />
        </div>
        <p className="text-xs text-muted-foreground">{item.pronunciation} = {item.exampleMeaning}</p>
      </div>
    </div>
  );
}

interface RootWord {
  root: string;
  rootLetters: string;
  meaning: string;
  words: { word: string; transliteration: string; meaning: string; pattern: string }[];
}

const ROOT_EXAMPLES: RootWord[] = [
  {
    root: "ك-ت-ب",
    rootLetters: "k-t-b",
    meaning: "writing",
    words: [
      { word: "كَتَبَ", transliteration: "kataba", meaning: "he wrote", pattern: "فَعَلَ" },
      { word: "كِتَاب", transliteration: "kitāb", meaning: "book", pattern: "فِعَال" },
      { word: "كَاتِب", transliteration: "kātib", meaning: "writer", pattern: "فَاعِل" },
      { word: "مَكْتَبَة", transliteration: "maktabah", meaning: "library", pattern: "مَفْعَلَة" },
      { word: "مَكْتُوب", transliteration: "maktūb", meaning: "written / letter", pattern: "مَفْعُول" },
    ],
  },
  {
    root: "د-ر-س",
    rootLetters: "d-r-s",
    meaning: "studying",
    words: [
      { word: "دَرَسَ", transliteration: "darasa", meaning: "he studied", pattern: "فَعَلَ" },
      { word: "دَرْس", transliteration: "dars", meaning: "lesson", pattern: "فَعْل" },
      { word: "مُدَرِّس", transliteration: "mudarris", meaning: "teacher", pattern: "مُفَعِّل" },
      { word: "مَدْرَسَة", transliteration: "madrasa", meaning: "school", pattern: "مَفْعَلَة" },
    ],
  },
  {
    root: "ع-ل-م",
    rootLetters: "ʿ-l-m",
    meaning: "knowing",
    words: [
      { word: "عَلِمَ", transliteration: "ʿalima", meaning: "he knew", pattern: "فَعِلَ" },
      { word: "عِلْم", transliteration: "ʿilm", meaning: "knowledge / science", pattern: "فِعْل" },
      { word: "عَالَم", transliteration: "ʿālam", meaning: "world", pattern: "فَاعَل" },
      { word: "مُعَلِّم", transliteration: "muʿallim", meaning: "teacher", pattern: "مُفَعِّل" },
      { word: "عَلَّمَ", transliteration: "ʿallama", meaning: "he taught", pattern: "فَعَّلَ" },
    ],
  },
];

interface ConjugationRow {
  pronoun: string;
  pronounAr: string;
  past: string;
  present: string;
}

const CONJUGATION_DATA: ConjugationRow[] = [
  { pronoun: "I", pronounAr: "أنا", past: "كَتَبْتُ", present: "أَكْتُبُ" },
  { pronoun: "You (m)", pronounAr: "أنتَ", past: "كَتَبْتَ", present: "تَكْتُبُ" },
  { pronoun: "You (f)", pronounAr: "أنتِ", past: "كَتَبْتِ", present: "تَكْتُبِينَ" },
  { pronoun: "He", pronounAr: "هُو", past: "كَتَبَ", present: "يَكْتُبُ" },
  { pronoun: "She", pronounAr: "هِيَ", past: "كَتَبَتْ", present: "تَكْتُبُ" },
  { pronoun: "We", pronounAr: "نَحْنُ", past: "كَتَبْنا", present: "نَكْتُبُ" },
];

interface GreetingPair {
  greeting: string;
  greetingAr: string;
  greetingTranslit: string;
  response: string;
  responseAr: string;
  responseTranslit: string;
  context: string;
  keyWord: string;
  keyWordAr: string;
  keyWordMeaning: string;
}

const GREETING_PAIRS: GreetingPair[] = [
  { greeting: "Peace be upon you", greetingAr: "السَّلامُ عَلَيْكُم", greetingTranslit: "as-salāmu ʿalaykum", response: "And upon you peace", responseAr: "وَعَلَيْكُم السَّلام", responseTranslit: "wa-ʿalaykum as-salām", context: "The most universal Arabic greeting, used by everyone", keyWord: "سَلام", keyWordAr: "salām", keyWordMeaning: "peace" },
  { greeting: "Good morning", greetingAr: "صَباحُ الخَيْر", greetingTranslit: "ṣabāḥ al-khayr", response: "Morning of light", responseAr: "صَباحُ النُّور", responseTranslit: "ṣabāḥ an-nūr", context: "Used until around noon", keyWord: "صَبَاح", keyWordAr: "ṣabāḥ", keyWordMeaning: "morning" },
  { greeting: "Good evening", greetingAr: "مَسَاءُ الخَيْر", greetingTranslit: "masāʾ al-khayr", response: "Evening of light", responseAr: "مَسَاءُ النُّور", responseTranslit: "masāʾ an-nūr", context: "Used after noon", keyWord: "مَسَاء", keyWordAr: "masāʾ", keyWordMeaning: "evening" },
  { greeting: "Welcome", greetingAr: "أهْلاً وَسَهْلاً", greetingTranslit: "ahlan wa-sahlan", response: "Welcome to you", responseAr: "أهْلاً بِك", responseTranslit: "ahlan bik", context: "Used to welcome someone arriving", keyWord: "أهْلاً", keyWordAr: "ahlan", keyWordMeaning: "welcome / hello" },
  { greeting: "How are you?", greetingAr: "كَيْفَ حالُك؟", greetingTranslit: "kayfa ḥāluk?", response: "Fine, praise God", responseAr: "بِخَيْر، الحَمْدُ لِلَّه", responseTranslit: "bi-khayr, al-ḥamdu li-llāh", context: "The response always includes 'praise God'", keyWord: "الحَمْدُ لِلَّه", keyWordAr: "al-ḥamdu li-llāh", keyWordMeaning: "praise be to God" },
  { greeting: "Goodbye", greetingAr: "مَعَ السَّلامَة", greetingTranslit: "maʿ as-salāma", response: "Goodbye (in safety)", responseAr: "فِي أَمانِ اللَّه", responseTranslit: "fī amāni llāh", context: "Literally 'with safety' and 'in God's protection'", keyWord: "سَلامَة", keyWordAr: "salāma", keyWordMeaning: "safety" },
  { greeting: "Please", greetingAr: "مِن فَضْلِك", greetingTranslit: "min faḍlik", response: "You're welcome", responseAr: "عَفْواً", responseTranslit: "ʿafwan", context: "Essential politeness — used everywhere", keyWord: "عَفْواً", keyWordAr: "ʿafwan", keyWordMeaning: "you're welcome / excuse me" },
  { greeting: "Thank you", greetingAr: "شُكْراً", greetingTranslit: "shukran", response: "No thanks needed", responseAr: "لا شُكْرَ عَلَى واجِب", responseTranslit: "lā shukra ʿalā wājib", context: "Response literally means 'no need to thank for a duty'", keyWord: "شُكْراً", keyWordAr: "shukran", keyWordMeaning: "thank you" },
];

function GreetingDialogueStep({ pair }: { pair: GreetingPair }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-center text-muted-foreground">{pair.context}</p>
      <div className="max-w-sm mx-auto space-y-3">
        <div className="flex justify-start">
          <div className="p-4 rounded-md bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 max-w-[85%]">
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1 font-medium">Greeting</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl" style={{ fontFamily: AMIRI }} dir="rtl">{pair.greetingAr}</p>
              <AudioBtn text={pair.greetingAr} size="icon" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{pair.greeting}</p>
            <p className="text-xs text-muted-foreground/70">{pair.greetingTranslit}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 max-w-[85%]">
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-medium flex items-center gap-1">
              <ArrowRight className="w-3 h-3" /> Response
            </p>
            <div className="flex items-center gap-2">
              <p className="text-2xl" style={{ fontFamily: AMIRI }} dir="rtl">{pair.responseAr}</p>
              <AudioBtn text={pair.responseAr} size="icon" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{pair.response}</p>
            <p className="text-xs text-muted-foreground/70">{pair.responseTranslit}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GreetingSpeakStep({ pair }: { pair: GreetingPair }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-center font-medium">Practice saying this greeting pair</p>
      <div className="space-y-3">
        <div className="p-3 rounded-md bg-emerald-50/50 dark:bg-emerald-900/5 border border-emerald-200/50 dark:border-emerald-800/20">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">Say the greeting:</p>
          <MicRecorder expectedText={pair.greetingAr} transliteration={pair.greetingTranslit} label={pair.greetingAr} />
        </div>
        <div className="p-3 rounded-md bg-blue-50/50 dark:bg-blue-900/5 border border-blue-200/50 dark:border-blue-800/20">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">Now say the response:</p>
          <MicRecorder expectedText={pair.responseAr} transliteration={pair.responseTranslit} label={pair.responseAr} />
        </div>
      </div>
    </div>
  );
}

function NumberStep({ numbers }: { numbers: { western: string; arabic: string; name: string; nameAr: string }[] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {numbers.map((n) => (
        <button
          key={n.western}
          onClick={() => speakArabic(n.nameAr)}
          className="p-4 rounded-md bg-muted/50 border border-border text-center hover-elevate cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground">{n.western}</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-3xl font-bold" style={{ fontFamily: AMIRI }}>{n.arabic}</span>
          </div>
          <p className="text-xs text-muted-foreground">{n.name}</p>
          <p className="text-xs" style={{ fontFamily: AMIRI }} dir="rtl">{n.nameAr}</p>
          <div className="flex justify-center mt-1">
            <Volume2 className="w-3 h-3 text-muted-foreground/50" />
          </div>
        </button>
      ))}
    </div>
  );
}

function NominalSentenceStep({ example }: { example: { arabic: string; literal: string; meaning: string; subject: string; predicate: string } }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <p className="text-4xl" style={{ fontFamily: AMIRI }} dir="rtl">{example.arabic}</p>
          <AudioBtn text={example.arabic} size="icon" />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{example.meaning}</p>
      </div>
      <div className="flex items-center justify-center gap-3 flex-wrap" dir="rtl">
        <div className="px-4 py-3 rounded-md bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700 text-center">
          <p className="text-2xl" style={{ fontFamily: AMIRI }}>{example.subject}</p>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium mt-1">Subject</p>
        </div>
        <span className="text-xl text-muted-foreground">+</span>
        <div className="px-4 py-3 rounded-md bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 text-center">
          <p className="text-2xl" style={{ fontFamily: AMIRI }}>{example.predicate}</p>
          <p className="text-[10px] text-blue-700 dark:text-blue-300 font-medium mt-1">Predicate</p>
        </div>
        <span className="text-xl text-muted-foreground">=</span>
        <div className="px-4 py-3 rounded-md bg-muted/70 border border-border text-center">
          <p className="text-sm font-medium">{example.meaning}</p>
        </div>
      </div>
      <p className="text-xs text-center text-muted-foreground">Literally: "{example.literal}" (no "is" needed!)</p>
    </div>
  );
}

function TaMarbutaStep({ pair }: { pair: { masc: string; fem: string; mascMeaning: string; femMeaning: string } }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="text-center space-y-2">
          <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400">Masculine</p>
          <div className="w-28 h-28 rounded-md bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 flex items-center justify-center">
            <span className="text-4xl" style={{ fontFamily: AMIRI }} dir="rtl">{pair.masc}</span>
          </div>
          <p className="text-sm text-muted-foreground">{pair.mascMeaning}</p>
          <AudioBtn text={pair.masc} size="icon" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <ArrowRight className="w-5 h-5 text-primary" />
          <span className="text-2xl text-primary font-bold" style={{ fontFamily: AMIRI }}>+ ة</span>
        </div>
        <div className="text-center space-y-2">
          <p className="text-[10px] font-medium text-pink-600 dark:text-pink-400">Feminine</p>
          <div className="w-28 h-28 rounded-md bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-800/30 flex items-center justify-center">
            <span className="text-4xl" style={{ fontFamily: AMIRI }} dir="rtl">{pair.fem}</span>
          </div>
          <p className="text-sm text-muted-foreground">{pair.femMeaning}</p>
          <AudioBtn text={pair.fem} size="icon" />
        </div>
      </div>
    </div>
  );
}

function ShoppingDialogueStep({ lines }: { lines: { speaker: string; text: string; translation: string; note: string }[] }) {
  return (
    <div className="space-y-2 max-w-sm mx-auto">
      {lines.map((line, i) => (
        <div key={i} className={`flex ${line.speaker === "customer" ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[85%] p-3 rounded-md ${
            line.speaker === "customer"
              ? "bg-primary/10 border border-primary/20"
              : "bg-muted/70 border border-border"
          }`}>
            <p className="text-xs font-medium mb-1 text-muted-foreground">
              {line.speaker === "customer" ? "You" : "Seller"}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-lg leading-relaxed" style={{ fontFamily: AMIRI }} dir="rtl">{line.text}</p>
              <AudioBtn text={line.text} size="icon" />
            </div>
            <p className="text-sm text-muted-foreground">{line.translation}</p>
            {line.note && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">{line.note}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ConjugationStep({ rows, tense }: { rows: ConjugationRow[]; tense: "past" | "present" }) {
  const isPast = tense === "past";
  return (
    <div className="space-y-3">
      <div className="text-center">
        <Badge variant="outline" className={isPast ? "text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700" : "text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"}>
          {isPast ? "Past Tense (مَاضِي)" : "Present Tense (مُضَارِع)"}
        </Badge>
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-md ${isPast ? "bg-amber-50/50 dark:bg-amber-900/5" : "bg-emerald-50/50 dark:bg-emerald-900/5"} border border-border`}>
            <div className="w-16 text-center shrink-0">
              <p className="text-sm font-medium">{row.pronoun}</p>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: AMIRI }} dir="rtl">{row.pronounAr}</p>
            </div>
            <div className="flex-1 flex items-center justify-center gap-2">
              <p className="text-2xl" style={{ fontFamily: AMIRI }} dir="rtl">{isPast ? row.past : row.present}</p>
              <AudioBtn text={isPast ? row.past : row.present} size="icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RootSystemStep({ root }: { root: RootWord }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-3xl font-bold text-primary" style={{ fontFamily: AMIRI }} dir="rtl" data-testid="text-active-root">{root.root}</p>
        <p className="text-sm text-muted-foreground">Root: {root.rootLetters} = {root.meaning}</p>
        <AudioBtn text={root.root.replace(/-/g, " ")} className="mt-1" />
      </div>
      <div className="space-y-2">
        {root.words.map((w, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-muted/50 border border-border" data-testid={`root-word-${i}`}>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xl" style={{ fontFamily: AMIRI }} dir="rtl">{w.word}</span>
              <AudioBtn text={w.word} size="icon" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{w.meaning}</p>
              <p className="text-xs text-muted-foreground">{w.transliteration}</p>
            </div>
            <Badge variant="outline" className="text-[10px] shrink-0" dir="rtl" style={{ fontFamily: AMIRI }}>{w.pattern}</Badge>
          </div>
        ))}
      </div>
      <div className="p-3 rounded-md bg-muted/50 border border-border">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
          <p className="text-xs text-muted-foreground">
            The root letters <strong dir="rtl" style={{ fontFamily: AMIRI }}>{root.root}</strong> appear in every word. Patterns add vowels and affixes to create different meanings.
          </p>
        </div>
      </div>
    </div>
  );
}

function QuestionWordStep({ word }: { word: { arabic: string; transliteration: string; meaning: string; example: string; exampleMeaning: string } }) {
  return (
    <div className="space-y-4 text-center">
      <div className="w-28 h-28 rounded-md bg-primary/10 flex items-center justify-center mx-auto">
        <span className="text-4xl font-bold" style={{ fontFamily: AMIRI }} dir="rtl">{word.arabic}</span>
      </div>
      <div>
        <p className="text-xl font-semibold">{word.meaning}</p>
        <p className="text-sm text-muted-foreground">({word.transliteration})</p>
        <AudioBtn text={word.arabic} className="mt-1" />
      </div>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-2">Example:</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-2xl" style={{ fontFamily: AMIRI }} dir="rtl">{word.example}</p>
            <AudioBtn text={word.example} size="icon" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{word.exampleMeaning}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AdjectiveStep({ example }: { example: { noun: string; adj: string; full: string; meaning: string; gender: string } }) {
  const isMasc = example.gender === "masculine";
  const color = isMasc
    ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30"
    : "bg-pink-50 dark:bg-pink-900/10 border-pink-200 dark:border-pink-800/30";
  return (
    <div className="space-y-4">
      <div className="text-center">
        <Badge variant="outline" className={`mb-3 ${isMasc ? "text-blue-700 dark:text-blue-300" : "text-pink-700 dark:text-pink-300"}`}>
          {example.gender}
        </Badge>
        <div className="flex items-center justify-center gap-2">
          <p className="text-4xl" style={{ fontFamily: AMIRI }} dir="rtl">{example.full}</p>
          <AudioBtn text={example.full} size="icon" />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{example.meaning}</p>
      </div>
      <div className="flex items-center justify-center gap-3 flex-wrap" dir="rtl">
        <div className={`px-4 py-3 rounded-md border text-center ${color}`}>
          <p className="text-2xl" style={{ fontFamily: AMIRI }}>{example.noun}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Noun</p>
        </div>
        <span className="text-xl text-muted-foreground">+</span>
        <div className={`px-4 py-3 rounded-md border text-center ${color}`}>
          <p className="text-2xl" style={{ fontFamily: AMIRI }}>{example.adj}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Adjective</p>
        </div>
      </div>
      <p className="text-xs text-center text-muted-foreground">
        Adjective comes <strong>after</strong> the noun and matches its gender
      </p>
    </div>
  );
}

function FoodVocabularySteps() {
  const items = [
    { arabic: "حُمُّص", transliteration: "ḥummus", meaning: "Hummus" },
    { arabic: "فَلافِل", transliteration: "fālāfil", meaning: "Falafel" },
    { arabic: "شَاوَرْمَا", transliteration: "shāwarmā", meaning: "Shawarma" },
    { arabic: "كُنَافَة", transliteration: "kunāfah", meaning: "Kunafa" },
    { arabic: "قَهْوَة", transliteration: "qahwah", meaning: "Coffee" },
    { arabic: "شَاي", transliteration: "shāy", meaning: "Tea" },
    { arabic: "خُبْز", transliteration: "khubz", meaning: "Bread" },
    { arabic: "أَرْز", transliteration: "arz", meaning: "Rice" },
  ];

  const phrases = [
    { arabic: "أُرِيدُ... مِن فَضْلِك", meaning: "I want... please" },
    { arabic: "بِدُونِ مِلْح", meaning: "Without salt" },
    { arabic: "الحِسَابُ مِن فَضْلِك", meaning: "The bill, please" },
    { arabic: "كَانَ لَذِيذاً!", meaning: "It was delicious!" },
  ];

  const steps = [
    <div key="vocab" className="space-y-3">
      <p className="text-center text-sm font-medium mb-2">Tap any item to hear it</p>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => speakArabic(item.arabic)}
            className="p-4 rounded-md bg-muted/50 border border-border text-center hover-elevate cursor-pointer"
          >
            <p className="text-2xl mb-1" style={{ fontFamily: AMIRI }} dir="rtl">{item.arabic}</p>
            <p className="text-sm font-medium">{item.meaning}</p>
            <p className="text-xs text-muted-foreground">{item.transliteration}</p>
          </button>
        ))}
      </div>
    </div>,
    <div key="phrases" className="space-y-3">
      <p className="text-center text-sm font-medium mb-2">Essential Restaurant Phrases</p>
      <div className="space-y-2">
        {phrases.map((p, i) => (
          <div key={i} className="flex items-center gap-3 p-4 rounded-md bg-muted/50 border border-border">
            <div className="flex-1">
              <p className="text-xl" style={{ fontFamily: AMIRI }} dir="rtl">{p.arabic}</p>
              <p className="text-sm text-muted-foreground mt-1">{p.meaning}</p>
            </div>
            <AudioBtn text={p.arabic} size="icon" />
          </div>
        ))}
      </div>
    </div>,
  ];

  return <StepCarousel steps={steps} testIdPrefix="food" />;
}

export function LessonVisualContent({ lessonTitle, lessonCategory }: { lessonTitle: string; lessonCategory?: string }) {
  const title = lessonTitle.toLowerCase();

  if (title.includes("letter system") || title.includes("نظام الحروف")) {
    const steps: React.ReactNode[] = [
      <div key="intro" className="space-y-4 text-center" data-testid="visual-position-legend">
        <p className="text-lg font-semibold">28 Letters, Organized by Shape</p>
        <p className="text-sm text-muted-foreground">Letters with the same shape are grouped into families. The dots tell them apart.</p>
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          {Object.entries(POSITION_LABELS).map(([key, label]) => (
            <div key={key} className={`px-3 py-1.5 rounded-md text-xs font-medium border ${POSITION_COLORS[key]}`}>
              {label.en} <span style={{ fontFamily: AMIRI }}>{label.ar}</span>
            </div>
          ))}
        </div>
      </div>,
      ...ALL_LETTER_FAMILIES.flatMap((family) => [
        <FamilyIntroCard key={`fam-${family.name}`} family={family} />,
        ...family.letters.map((l, i) => <LetterCard key={`${family.name}-${i}`} letter={l} />),
      ]),
      ...SAMPLE_WORDS.slice(0, 2).map((w, i) => <WordBreakdownStep key={`wb-${i}`} word={w} />),
    ];

    return (
      <div data-testid="visual-content-letters">
        <Card>
          <CardContent className="p-5">
            <SceneHeader image={sceneCalligraphy} title="The Arabic Letter System" subtitle="All 28 letters — learn, write, and speak each one" icon={Pen} />
            <StepCarousel steps={steps} testIdPrefix="letter" />
            <TeacherTip tip="Arabic has 28 letters organized into shape families. Letters in the same family share the same base shape — only the dots change. Master the shape once, and you learn multiple letters!" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (title.includes("tashkeel") || title.includes("تشكيل") || title.includes("vowel mark") || title.includes("حركات")) {
    const shortVowels: { name: string; nameAr: string; symbol: string; sound: string; ipa: string; position: string; examples: { arabic: string; transliteration: string; meaning: string }[] }[] = [
      {
        name: "Fatha", nameAr: "فَتْحَة", symbol: "ـَ", sound: "Short 'a' (as in 'cat')", ipa: "/a/",
        position: "A small diagonal line above the letter",
        examples: [
          { arabic: "بَ", transliteration: "ba", meaning: "ba sound" },
          { arabic: "كَتَبَ", transliteration: "kataba", meaning: "he wrote" },
          { arabic: "فَتَحَ", transliteration: "fataḥa", meaning: "he opened" },
        ],
      },
      {
        name: "Damma", nameAr: "ضَمَّة", symbol: "ـُ", sound: "Short 'u' (as in 'put')", ipa: "/u/",
        position: "A small loop (like a tiny و) above the letter",
        examples: [
          { arabic: "بُ", transliteration: "bu", meaning: "bu sound" },
          { arabic: "كُتُب", transliteration: "kutub", meaning: "books" },
          { arabic: "يَكْتُبُ", transliteration: "yaktubu", meaning: "he writes" },
        ],
      },
      {
        name: "Kasra", nameAr: "كَسْرَة", symbol: "ـِ", sound: "Short 'i' (as in 'sit')", ipa: "/i/",
        position: "A small diagonal line below the letter",
        examples: [
          { arabic: "بِ", transliteration: "bi", meaning: "bi sound" },
          { arabic: "كِتَاب", transliteration: "kitāb", meaning: "book" },
          { arabic: "بِنْت", transliteration: "bint", meaning: "girl" },
        ],
      },
    ];

    const advancedMarks: { name: string; nameAr: string; symbol: string; description: string; ipa: string; examples: { arabic: string; transliteration: string; meaning: string }[] }[] = [
      {
        name: "Sukun", nameAr: "سُكُون", symbol: "ـْ", ipa: "∅ (no vowel)",
        description: "A small circle above the letter — means the consonant has NO vowel after it. It closes the syllable.",
        examples: [
          { arabic: "بِنْت", transliteration: "bint", meaning: "girl (the ن has sukun)" },
          { arabic: "مَكْتَب", transliteration: "maktab", meaning: "office (the ك has sukun)" },
        ],
      },
      {
        name: "Shadda", nameAr: "شَدَّة", symbol: "ـّ", ipa: "(doubles the consonant)",
        description: "A small 'w' shape above the letter — means the consonant is doubled/emphasized. Say it twice quickly.",
        examples: [
          { arabic: "مُعَلِّم", transliteration: "muʿallim", meaning: "teacher (the ل is doubled)" },
          { arabic: "شَدَّة", transliteration: "shadda", meaning: "shadda itself has one!" },
          { arabic: "مُحَمَّد", transliteration: "Muḥammad", meaning: "the prophet's name (doubled م)" },
        ],
      },
    ];

    const tanweenTypes: { name: string; nameAr: string; symbol: string; sound: string; example: string; transliteration: string; meaning: string }[] = [
      { name: "Fathatan", nameAr: "فَتْحَتَان", symbol: "ـً", sound: "-an", example: "كِتَابًا", transliteration: "kitāban", meaning: "a book (accusative)" },
      { name: "Dammatan", nameAr: "ضَمَّتَان", symbol: "ـٌ", sound: "-un", example: "كِتَابٌ", transliteration: "kitābun", meaning: "a book (nominative)" },
      { name: "Kasratan", nameAr: "كَسْرَتَان", symbol: "ـٍ", sound: "-in", example: "كِتَابٍ", transliteration: "kitābin", meaning: "a book (genitive)" },
    ];

    const longVowels: { arabic: string; transliteration: string; meaning: string; writingTip: string }[] = [
      { arabic: "بَا", transliteration: "bā", meaning: "Long 'a' — Fatha + Alif (ا)", writingTip: "Fatha (ـَ) + Alif (ا) = long 'aa'. Hold the 'a' sound twice as long." },
      { arabic: "بُو", transliteration: "bū", meaning: "Long 'u' — Damma + Waw (و)", writingTip: "Damma (ـُ) + Waw (و) = long 'oo'. Like 'food' in English." },
      { arabic: "بِي", transliteration: "bī", meaning: "Long 'i' — Kasra + Ya (ي)", writingTip: "Kasra (ـِ) + Ya (ي) = long 'ee'. Like 'feet' in English." },
    ];

    const practiceWords: VocabItem[] = [
      { arabic: "فَتَحَ", transliteration: "fataḥa", meaning: "he opened", ipa: "/fa.ta.ħa/", writingTip: "All three letters have Fatha (ـَ). Read: fa-ta-ḥa." },
      { arabic: "كُتُب", transliteration: "kutub", meaning: "books", ipa: "/ku.tub/", writingTip: "Both vowels are Damma (ـُ). Read: ku-tub." },
      { arabic: "جَلَسَ", transliteration: "jalasa", meaning: "he sat", ipa: "/dʒa.la.sa/", writingTip: "Three Fathas in a row. Read: ja-la-sa." },
      { arabic: "عِلْم", transliteration: "ʿilm", meaning: "knowledge", ipa: "/ʕilm/", writingTip: "Kasra under ع, then Sukun on ل. Read: ʿil-m." },
      { arabic: "مَدْرَسَة", transliteration: "madrasa", meaning: "school", ipa: "/mad.ra.sa/", writingTip: "Fatha-Sukun-Fatha-Fatha. Read: mad-ra-sa." },
      { arabic: "مُسْلِم", transliteration: "muslim", meaning: "Muslim", ipa: "/mus.lim/", writingTip: "Damma-Sukun-Kasra. Read: mus-lim." },
    ];

    const steps: React.ReactNode[] = [
      <div key="intro" className="space-y-4 text-center">
        <p className="text-lg font-semibold">التشكيل: Reading Arabic with Vowel Marks</p>
        <p className="text-sm text-muted-foreground">
          Arabic letters are consonants. Without vowel marks (حركات), the word <span style={{ fontFamily: AMIRI }} className="text-lg" dir="rtl">كتب</span> could be "kataba" (he wrote), "kutub" (books), or "kutiba" (it was written). Tashkeel removes all ambiguity!
        </p>
      </div>,

      ...shortVowels.flatMap((v, vi) => [
        <div key={`sv-${vi}`} className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="text-5xl text-primary" style={{ fontFamily: AMIRI }} dir="rtl">{v.symbol}</span>
              <div className="text-left">
                <p className="font-bold text-base">{v.name} <span className="text-muted-foreground font-normal">({v.nameAr})</span></p>
                <p className="text-sm text-muted-foreground">{v.sound}</p>
                <Badge variant="outline" className="text-xs mt-1">IPA: {v.ipa}</Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{v.position}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {v.examples.map((ex, ei) => (
                <button key={ei} onClick={() => speakArabic(ex.arabic)} className="px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 hover-elevate cursor-pointer text-center" data-testid={`tashkeel-${v.name.toLowerCase()}-${ei}`}>
                  <span className="text-2xl block" style={{ fontFamily: AMIRI }} dir="rtl">{ex.arabic}</span>
                  <span className="text-xs text-muted-foreground block">{ex.transliteration}</span>
                  <span className="text-xs text-primary block">{ex.meaning}</span>
                </button>
              ))}
            </div>
          </div>
        </div>,
        <VocabCard key={`sv-vocab-${vi}`} item={{
          arabic: v.examples[1].arabic,
          transliteration: v.examples[1].transliteration,
          meaning: v.examples[1].meaning,
          ipa: v.ipa,
          writingTip: `This word uses ${v.name} (${v.nameAr}). ${v.position}.`,
        }} />,
      ]),

      <div key="sukun-shadda-title" className="space-y-2 text-center">
        <p className="text-lg font-semibold">Advanced Marks: Sukun & Shadda</p>
        <p className="text-sm text-muted-foreground">These marks control consonant behavior — silencing or doubling them.</p>
      </div>,

      ...advancedMarks.flatMap((m, mi) => [
        <div key={`adv-${mi}`} className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="text-5xl text-primary" style={{ fontFamily: AMIRI }} dir="rtl">{m.symbol}</span>
              <div className="text-left">
                <p className="font-bold text-base">{m.name} <span className="text-muted-foreground font-normal">({m.nameAr})</span></p>
                <Badge variant="outline" className="text-xs">{m.ipa}</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{m.description}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {m.examples.map((ex, ei) => (
                <button key={ei} onClick={() => speakArabic(ex.arabic)} className="px-4 py-3 rounded-lg bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800/30 hover-elevate cursor-pointer text-center" data-testid={`tashkeel-${m.name.toLowerCase()}-${ei}`}>
                  <span className="text-2xl block" style={{ fontFamily: AMIRI }} dir="rtl">{ex.arabic}</span>
                  <span className="text-xs text-muted-foreground block">{ex.transliteration}</span>
                  <span className="text-xs text-primary block">{ex.meaning}</span>
                </button>
              ))}
            </div>
          </div>
        </div>,
        <VocabCard key={`adv-vocab-${mi}`} item={{
          arabic: m.examples[0].arabic,
          transliteration: m.examples[0].transliteration,
          meaning: m.examples[0].meaning,
          writingTip: m.description,
        }} />,
      ]),

      <div key="tanween-title" className="space-y-2 text-center">
        <p className="text-lg font-semibold">Tanween (التنوين): The "-n" Endings</p>
        <p className="text-sm text-muted-foreground">Double vowel marks add an "-n" sound at word endings. They indicate the word is indefinite (like "a/an" in English).</p>
      </div>,

      <div key="tanween-all" className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {tanweenTypes.map((t, ti) => (
            <button key={ti} onClick={() => speakArabic(t.example)} className="flex items-center gap-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 hover-elevate cursor-pointer" data-testid={`tashkeel-tanween-${ti}`}>
              <span className="text-4xl text-primary" style={{ fontFamily: AMIRI }} dir="rtl">{t.symbol}</span>
              <div className="text-left flex-1">
                <p className="font-semibold text-sm">{t.name} ({t.nameAr})</p>
                <p className="text-xs text-muted-foreground">Sound: {t.sound}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl block" style={{ fontFamily: AMIRI }} dir="rtl">{t.example}</span>
                <span className="text-xs text-muted-foreground">{t.transliteration} — {t.meaning}</span>
              </div>
            </button>
          ))}
        </div>
      </div>,

      <div key="long-title" className="space-y-2 text-center">
        <p className="text-lg font-semibold">Long Vowels: Extending the Sound</p>
        <p className="text-sm text-muted-foreground">Short vowels become long when followed by their matching letter. Hold the sound twice as long!</p>
      </div>,

      ...longVowels.map((lv, i) => <VocabCard key={`lv-${i}`} item={lv} />),

      <div key="practice-title" className="space-y-2 text-center">
        <p className="text-lg font-semibold">Practice Reading: Sound Out Each Mark</p>
        <p className="text-sm text-muted-foreground">Try reading each word by following the tashkeel marks. Listen, then write and speak!</p>
      </div>,

      ...practiceWords.map((w, i) => <VocabCard key={`pw-${i}`} item={w} />),
    ];

    return (
      <div data-testid="visual-content-tashkeel">
        <Card>
          <CardContent className="p-5">
            <SceneHeader image={sceneCalligraphy} title="التشكيل: Arabic Vowel Marks" subtitle="The key to reading any Arabic word correctly" icon={BookOpen} />
            <StepCarousel steps={steps} testIdPrefix="tashkeel" />
            <TeacherTip tip="Think of tashkeel as Arabic's 'reading glasses'. Without them, experienced readers use context to guess vowels. But as a learner, tashkeel tells you exactly how to pronounce every letter. Children's books and the Quran always include full tashkeel." />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (title.includes("connecting") || title.includes("وصل الحروف") || title.includes("first words")) {
    const connectingWords: VocabItem[] = [
      { arabic: "بَاب", transliteration: "bāb", meaning: "door", writingTip: "Three connected letters: ب + ا + ب. Notice how ب changes shape in each position." },
      { arabic: "بِنْت", transliteration: "bint", meaning: "girl", writingTip: "Letters flow together right-to-left. The ت at the end takes its final form." },
      { arabic: "كِتَاب", transliteration: "kitāb", meaning: "book", writingTip: "Five letters joined together. Each letter takes its positional form." },
      { arabic: "مَدْرَسَة", transliteration: "madrasa", meaning: "school", writingTip: "A longer word with multiple connected groups. The ة (ta marbuta) ends the word." },
    ];

    const steps: React.ReactNode[] = [
      <div key="intro" className="space-y-4 text-center">
        <p className="text-lg font-semibold">Letters connect to form words</p>
        <p className="text-sm text-muted-foreground">Watch how letters change shape when they join together in real words. Practice writing and speaking each word.</p>
      </div>,
      ...SAMPLE_WORDS.map((w, i) => <WordBreakdownStep key={`wb-${i}`} word={w} />),
      ...connectingWords.map((w, i) => <VocabCard key={`cw-${i}`} item={w} />),
      <div key="non-conn" className="space-y-4">
        <p className="font-semibold text-sm text-center">Non-Connecting Letters</p>
        <p className="text-sm text-muted-foreground text-center">These 6 letters only connect from the right. After them, the next letter starts fresh.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {["ا Alif", "د Dal", "ذ Dhal", "ر Ra", "ز Zay", "و Waw"].map((item) => {
            const [char, name] = item.split(" ");
            return (
              <Button key={name} variant="outline" className="w-16 h-16 flex-col gap-0 p-0 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30" onClick={() => speakArabic(char)} data-testid={`non-conn-${name}`}>
                <span className="text-2xl" style={{ fontFamily: AMIRI }} dir="rtl">{char}</span>
                <span className="text-[10px] text-muted-foreground font-normal">{name}</span>
              </Button>
            );
          })}
        </div>
      </div>,
      ...(ALL_LETTER_FAMILIES.find(f => f.nameAr === "عائلة الكأس")?.letters ?? []).map((l, i) => <LetterCard key={`l2-${i}`} letter={l} />),
    ];

    return (
      <div data-testid="visual-content-connecting">
        <Card>
          <CardContent className="p-5">
            <SceneHeader image={sceneCalligraphy} title="Connecting Letters & First Words" subtitle="Write and speak your first connected Arabic words" icon={Pen} />
            <StepCarousel steps={steps} testIdPrefix="connect" />
            <TeacherTip tip="Arabic is always written in connected (cursive) script. Six letters only connect from the right side. After these letters, the next letter starts a new connection." />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (title.includes("sun") || title.includes("moon") || title.includes("شمسية")) {
    const sunLetters = SUN_MOON_DATA.filter((l) => l.type === "sun");
    const moonLetters = SUN_MOON_DATA.filter((l) => l.type === "moon");

    const steps: React.ReactNode[] = [
      <div key="intro" className="space-y-4 text-center" data-testid="visual-sun-moon">
        <p className="text-lg font-semibold">Sun Letters vs Moon Letters</p>
        <p className="text-sm text-muted-foreground">
          When "the" (<span style={{ fontFamily: AMIRI }} dir="rtl">الـ</span>) meets a Sun Letter, the "l" sound disappears. With Moon Letters, the "l" stays. Learn, write, and speak each example.
        </p>
        <div className="flex justify-center gap-8 mt-4">
          <div className="text-center">
            <Sun className="w-10 h-10 mx-auto text-amber-500" />
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mt-1">Sun Letters</p>
            <p className="text-xs text-muted-foreground">"l" disappears</p>
          </div>
          <div className="text-center">
            <Moon className="w-10 h-10 mx-auto text-blue-500" />
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mt-1">Moon Letters</p>
            <p className="text-xs text-muted-foreground">"l" stays</p>
          </div>
        </div>
      </div>,
      ...sunLetters.flatMap((l, i) => [
        <div key={`sun-${i}`} className="space-y-3">
          <div className="flex items-center gap-2 justify-center">
            <Sun className="w-5 h-5 text-amber-500" />
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Sun Letter: {l.name}</p>
          </div>
          <SunMoonExampleCard item={l} type="sun" />
          <p className="text-xs text-center text-muted-foreground">The "l" in "al-" assimilates into {l.name}, so you hear a doubled {l.name} sound</p>
        </div>,
        <VocabCard key={`sun-vocab-${i}`} item={{
          arabic: l.example,
          transliteration: l.pronunciation,
          meaning: l.exampleMeaning,
          writingTip: `${l.letter} (${l.name}) is a Sun Letter. When writing ${l.example}, the ال is always spelled the same — only the pronunciation changes.`,
        }} />,
      ]),
      ...moonLetters.flatMap((l, i) => [
        <div key={`moon-${i}`} className="space-y-3">
          <div className="flex items-center gap-2 justify-center">
            <Moon className="w-5 h-5 text-blue-500" />
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Moon Letter: {l.name}</p>
          </div>
          <SunMoonExampleCard item={l} type="moon" />
          <p className="text-xs text-center text-muted-foreground">The "l" is fully pronounced: al-{l.name.toLowerCase()}...</p>
        </div>,
        <VocabCard key={`moon-vocab-${i}`} item={{
          arabic: l.example,
          transliteration: l.pronunciation,
          meaning: l.exampleMeaning,
          writingTip: `${l.letter} (${l.name}) is a Moon Letter. The "l" in "al-" is clearly heard when you say ${l.pronunciation}.`,
        }} />,
      ]),
      <div key="tip" className="p-4 rounded-md bg-muted/50 border border-border">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong>Memory trick:</strong> Sun Letters are the ones where your tongue touches the roof of your mouth to say them. Moon Letters are everything else.
          </p>
        </div>
      </div>,
    ];

    return (
      <div data-testid="visual-content-sun-moon">
        <Card>
          <CardContent className="p-5">
            <SceneHeader image={sceneMosque} title="Sun & Moon Letters" subtitle="Learn, write, and speak each example word" icon={BookOpen} />
            <StepCarousel steps={steps} testIdPrefix="sunmoon" />
            <TeacherTip tip="This rule only affects pronunciation, not spelling. The 'al' (الـ) is always written the same way. Your tongue position determines if a letter is 'sun' or 'moon'." />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (title.includes("greeting") || title.includes("تحيات")) {
    const steps: React.ReactNode[] = [
      <div key="intro" className="space-y-4 text-center">
        <p className="text-lg font-semibold">Every Greeting Has a Response</p>
        <p className="text-sm text-muted-foreground">In Arabic culture, each greeting has a specific, expected response. Learn all 8 greeting pairs — listen, write, and speak each one.</p>
      </div>,
      ...GREETING_PAIRS.flatMap((pair, i) => [
        <GreetingDialogueStep key={`dialogue-${i}`} pair={pair} />,
        <VocabCard key={`vocab-${i}`} item={{ arabic: pair.keyWord, transliteration: pair.keyWordAr, meaning: pair.keyWordMeaning, writingTip: `Practice writing "${pair.keyWordMeaning}" — a key word from this greeting pair.` }} />,
        <GreetingSpeakStep key={`speak-${i}`} pair={pair} />,
      ]),
    ];

    return (
      <div data-testid="visual-content-greetings">
        <Card>
          <CardContent className="p-5">
            <SceneHeader image={sceneCoffee} title="Arabic Greetings" subtitle="Listen, write, and speak 8 essential greeting pairs" icon={MessageCircle} />
            <StepCarousel steps={steps} testIdPrefix="greeting" />
            <TeacherTip tip="In Arab culture, greetings are very important. Always respond to a greeting with its proper response. The most universal greeting is 'As-salamu alaykum' - used across the entire Arab world." />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (title.includes("number") || title.includes("أرقام")) {
    const allNumbers = [
      { western: "0", arabic: "٠", name: "sifr", nameAr: "صِفْر" },
      { western: "1", arabic: "١", name: "wāḥid", nameAr: "وَاحِد" },
      { western: "2", arabic: "٢", name: "ithnān", nameAr: "اِثْنَان" },
      { western: "3", arabic: "٣", name: "thalāthah", nameAr: "ثَلاثَة" },
      { western: "4", arabic: "٤", name: "arbaʿah", nameAr: "أَرْبَعَة" },
      { western: "5", arabic: "٥", name: "khamsah", nameAr: "خَمْسَة" },
      { western: "6", arabic: "٦", name: "sittah", nameAr: "سِتَّة" },
      { western: "7", arabic: "٧", name: "sabʿah", nameAr: "سَبْعَة" },
      { western: "8", arabic: "٨", name: "thamāniyah", nameAr: "ثَمَانِيَة" },
      { western: "9", arabic: "٩", name: "tisʿah", nameAr: "تِسْعَة" },
      { western: "10", arabic: "١٠", name: "ʿasharah", nameAr: "عَشَرَة" },
    ];

    const steps: React.ReactNode[] = [
      <div key="intro" className="space-y-4 text-center">
        <p className="text-lg font-semibold">Arabic-Indic Numerals</p>
        <p className="text-sm text-muted-foreground">
          The "Arabic numerals" we use in English (0-9) actually originated in India. These are the numerals used in many Arab countries. Learn to read, write, and say each number.
        </p>
      </div>,
      ...allNumbers.map((n, i) => (
        <VocabCard key={`num-${i}`} item={{
          arabic: `${n.arabic} ${n.nameAr}`,
          transliteration: n.name,
          meaning: `${n.western} — ${n.name}`,
          writingTip: `Practice writing the Arabic-Indic digit ${n.arabic} (${n.western}) and the word ${n.nameAr}.`,
        }} />
      )),
      <div key="tip" className="p-4 rounded-md bg-muted/50 border border-border">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
          <p className="text-sm text-muted-foreground">
            Numbers are read left-to-right even though Arabic text goes right-to-left. So ١٢٣ is 123, not 321!
          </p>
        </div>
      </div>,
    ];

    return (
      <div data-testid="visual-content-numbers">
        <Card>
          <CardContent className="p-5">
            <SceneHeader image={sceneMarketplace} title="Numbers & Counting" subtitle="Read, write, and speak Arabic-Indic numerals 0–10" icon={BookOpen} />
            <StepCarousel steps={steps} testIdPrefix="number" />
            <TeacherTip tip="Many Arab countries use both Arabic-Indic (٠١٢) and Western (012) numerals. Phone numbers, prices, and addresses may use either system. Numbers are always read left-to-right!" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (title.includes("root") || title.includes("جذور")) {
    const steps: React.ReactNode[] = [
      <div key="intro" className="space-y-4 text-center" data-testid="visual-root-system">
        <p className="text-lg font-semibold">The Root System: One Root, Many Words</p>
        <p className="text-sm text-muted-foreground">Arabic words grow from 3-letter roots. Learn one root and you can recognize an entire family of related words. Practice writing and speaking each root word.</p>
      </div>,
      ...ROOT_EXAMPLES.flatMap((r, ri) => [
        <RootSystemStep key={`root-${ri}`} root={r} />,
        ...r.words.map((w, wi) => (
          <VocabCard key={`root-${ri}-word-${wi}`} item={{
            arabic: w.word,
            transliteration: w.transliteration,
            meaning: w.meaning,
            writingTip: `This word comes from the root ${r.root} (${r.meaning}). Pattern: ${w.pattern}`,
          }} />
        )),
      ]),
    ];

    return (
      <div data-testid="visual-content-roots">
        <Card>
          <CardContent className="p-5">
            <SceneHeader image={sceneCalligraphy} title="Arabic Root System" subtitle="Write and speak words from each root family" icon={Layers} />
            <StepCarousel steps={steps} testIdPrefix="root" />
            <TeacherTip tip="The root system is Arabic's superpower. Most roots are 3 letters. Once you know a root like ك-ت-ب (writing), you can guess the meaning of words you have never seen before!" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (title.includes("nominal") || title.includes("الجملة الاسمية") || (title.includes("no") && title.includes("needed"))) {
    const examples = [
      { arabic: "أنا طالِب", literal: "I student", meaning: "I am a student", subject: "أنا", predicate: "طالِب" },
      { arabic: "هذا كِتاب", literal: "This book", meaning: "This is a book", subject: "هذا", predicate: "كِتاب" },
      { arabic: "البَيْتُ كَبِير", literal: "The-house big", meaning: "The house is big", subject: "البَيْتُ", predicate: "كَبِير" },
      { arabic: "الطَّقْسُ جَمِيل", literal: "The-weather beautiful", meaning: "The weather is beautiful", subject: "الطَّقْسُ", predicate: "جَمِيل" },
      { arabic: "هِيَ مُعَلِّمَة", literal: "She teacher", meaning: "She is a teacher", subject: "هِيَ", predicate: "مُعَلِّمَة" },
      { arabic: "القَهْوَةُ سَاخِنَة", literal: "The-coffee hot", meaning: "The coffee is hot", subject: "القَهْوَةُ", predicate: "سَاخِنَة" },
    ];

    const steps: React.ReactNode[] = [
      <div key="intro" className="space-y-4 text-center">
        <p className="text-lg font-semibold">The Nominal Sentence: No "Is" Needed!</p>
        <p className="text-sm text-muted-foreground">Arabic skips "is/am/are" entirely. Just put the subject next to the description. Practice writing and speaking each sentence.</p>
      </div>,
      ...examples.flatMap((ex, i) => [
        <NominalSentenceStep key={`nom-${i}`} example={ex} />,
        <VocabCard key={`nom-vocab-${i}`} item={{
          arabic: ex.arabic,
          transliteration: ex.literal.toLowerCase(),
          meaning: ex.meaning,
          writingTip: `Literally "${ex.literal}" — no verb "is" needed. Practice writing the full sentence.`,
        }} />,
      ]),
    ];

    return (
      <div data-testid="visual-content-nominal">
        <Card>
          <CardContent className="p-5">
            <SceneHeader image={sceneMosque} title="The Nominal Sentence" subtitle="Write and speak Arabic sentences without 'is'" icon={GraduationCap} />
            <StepCarousel steps={steps} testIdPrefix="nominal" />
            <TeacherTip tip="This is one of the easiest Arabic grammar rules. Just put two words next to each other and they form a complete sentence. No verb needed!" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (title.includes("souk") || title.includes("shopping") || title.includes("سوق")) {
    const allLines = [
      { speaker: "customer", text: "السَّلامُ عَلَيْكُم", translation: "Peace be upon you", note: "Start with a greeting" },
      { speaker: "seller", text: "وَعَلَيْكُم السَّلام، أهْلاً", translation: "And upon you peace, welcome", note: "" },
      { speaker: "customer", text: "بِكَم هَٰذا؟", translation: "How much is this?", note: "The essential shopping phrase" },
      { speaker: "seller", text: "خَمْسُون دِرْهَم", translation: "Fifty dirhams", note: "" },
      { speaker: "customer", text: "غَالِي! مُمْكِن أَرْخَص؟", translation: "Expensive! Can it be cheaper?", note: "Bargaining is expected!" },
      { speaker: "seller", text: "أَرْبَعُون. آخِر سِعْر", translation: "Forty. Final price", note: "" },
      { speaker: "customer", text: "تَمَام، آخُذ هَٰذا", translation: "OK, I'll take this", note: "" },
      { speaker: "seller", text: "شُكْراً! مَعَ السَّلامَة", translation: "Thanks! Goodbye", note: "" },
    ];

    const soukVocab: VocabItem[] = [
      { arabic: "بِكَم؟", transliteration: "bikam?", meaning: "How much?", writingTip: "The essential shopping phrase — use it everywhere in the souk." },
      { arabic: "غَالِي", transliteration: "ghālī", meaning: "Expensive", writingTip: "Use this to start bargaining. Sellers expect to hear it!" },
      { arabic: "رَخِيص", transliteration: "rakhīṣ", meaning: "Cheap", writingTip: "The opposite of غالي. Useful when comparing prices." },
      { arabic: "مُمْكِن", transliteration: "mumkin", meaning: "Possible / Can I?", writingTip: "Very versatile word. مُمْكِن أَرْخَص؟ = Can it be cheaper?" },
      { arabic: "آخِر سِعْر", transliteration: "ākhir siʿr", meaning: "Final price", writingTip: "The seller says this when they won't go lower." },
      { arabic: "تَمَام", transliteration: "tamām", meaning: "OK / Perfect", writingTip: "Used across the Arab world to express agreement." },
    ];

    const steps: React.ReactNode[] = [
      <div key="intro" className="space-y-4 text-center">
        <p className="text-lg font-semibold">At the Souk: A Real Shopping Dialogue</p>
        <p className="text-sm text-muted-foreground">Follow this typical souk conversation, then practice writing and speaking the key shopping phrases.</p>
      </div>,
      <ShoppingDialogueStep key="part1" lines={allLines.slice(0, 4)} />,
      <ShoppingDialogueStep key="part2" lines={allLines.slice(4)} />,
      ...soukVocab.map((v, i) => <VocabCard key={`souk-${i}`} item={v} />),
    ];

    return (
      <div data-testid="visual-content-shopping">
        <Card>
          <CardContent className="p-5">
            <SceneHeader image={sceneMarketplace} title="At the Souk: Shopping Dialogue" subtitle="Learn, write, and speak essential shopping phrases" icon={MessageCircle} />
            <StepCarousel steps={steps} testIdPrefix="shopping" />
            <TeacherTip tip="Bargaining in Arab souks is a social tradition, not just about price. Start friendly, offer about half the asking price, and enjoy the process. Both sides expect to meet somewhere in the middle." />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (title.includes("ta marbuta") || title.includes("feminine") || title.includes("مؤنث")) {
    const pairs = [
      { masc: "مُعَلِّم", fem: "مُعَلِّمَة", mascMeaning: "teacher (m)", femMeaning: "teacher (f)", mascTranslit: "muʿallim", femTranslit: "muʿallima" },
      { masc: "طالِب", fem: "طالِبَة", mascMeaning: "student (m)", femMeaning: "student (f)", mascTranslit: "ṭālib", femTranslit: "ṭāliba" },
      { masc: "كَبِير", fem: "كَبِيرَة", mascMeaning: "big (m)", femMeaning: "big (f)", mascTranslit: "kabīr", femTranslit: "kabīra" },
      { masc: "جَمِيل", fem: "جَمِيلَة", mascMeaning: "beautiful (m)", femMeaning: "beautiful (f)", mascTranslit: "jamīl", femTranslit: "jamīla" },
      { masc: "طَبِيب", fem: "طَبِيبَة", mascMeaning: "doctor (m)", femMeaning: "doctor (f)", mascTranslit: "ṭabīb", femTranslit: "ṭabība" },
    ];

    const steps: React.ReactNode[] = [
      <div key="intro" className="space-y-4 text-center">
        <p className="text-lg font-semibold">Ta Marbuta (ة): The Feminine Marker</p>
        <p className="text-sm text-muted-foreground">Add ة to the end of most masculine words to make them feminine. This one letter doubles your vocabulary! Practice writing and speaking both forms.</p>
      </div>,
      ...pairs.flatMap((p, i) => [
        <TaMarbutaStep key={`ta-${i}`} pair={p} />,
        <VocabCard key={`ta-masc-${i}`} item={{ arabic: p.masc, transliteration: p.mascTranslit, meaning: p.mascMeaning, writingTip: `Masculine form — no ة at the end.` }} />,
        <VocabCard key={`ta-fem-${i}`} item={{ arabic: p.fem, transliteration: p.femTranslit, meaning: p.femMeaning, writingTip: `Feminine form — add ة (ta marbuta) to make it feminine.` }} />,
      ]),
    ];

    return (
      <div data-testid="visual-content-ta-marbuta">
        <Card>
          <CardContent className="p-5">
            <SceneHeader image={sceneMosque} title="Ta Marbuta: The Feminine Marker" subtitle="Write and speak both masculine and feminine forms" icon={BookOpen} />
            <StepCarousel steps={steps} testIdPrefix="tamarbuta" />
            <TeacherTip tip="Ta marbuta (ة) looks like a ha (ه) with two dots above. It is usually silent at the end of a word (sounds like -a), but becomes a clear 't' when the word is followed by another word in a phrase." />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (title.includes("food") || title.includes("restaurant") || title.includes("طعام")) {
    const foodItems: VocabItem[] = [
      { arabic: "حُمُّص", transliteration: "ḥummuṣ", meaning: "Hummus", writingTip: "One of the most famous Middle Eastern dishes. Notice the doubled م (shaddah)." },
      { arabic: "فَلافِل", transliteration: "falāfil", meaning: "Falafel", writingTip: "Deep-fried chickpea balls. A staple street food across the Arab world." },
      { arabic: "شَاوَرْمَا", transliteration: "shāwarmā", meaning: "Shawarma", writingTip: "Grilled meat served in flatbread. Popular everywhere from Lebanon to the Gulf." },
      { arabic: "كُنَافَة", transliteration: "kunāfah", meaning: "Kunafa (dessert)", writingTip: "A sweet cheese pastry soaked in syrup. A must-try Arabic dessert!" },
      { arabic: "قَهْوَة", transliteration: "qahwah", meaning: "Coffee", writingTip: "Arabic coffee is the origin of the word 'coffee'. Served strong and often with cardamom." },
      { arabic: "خُبْز", transliteration: "khubz", meaning: "Bread", writingTip: "Flatbread served with every meal. Essential to Arabic dining." },
    ];

    const phrases: VocabItem[] = [
      { arabic: "أُرِيدُ... مِن فَضْلِك", transliteration: "urīdu... min faḍlik", meaning: "I want... please", writingTip: "The most essential ordering phrase. Fill in what you want after أريد." },
      { arabic: "بِدُونِ مِلْح", transliteration: "bidūni milḥ", meaning: "Without salt", writingTip: "بدون means 'without'. You can substitute any ingredient after it." },
      { arabic: "الحِسَابُ مِن فَضْلِك", transliteration: "al-ḥisābu min faḍlik", meaning: "The bill, please", writingTip: "How to ask for the check at any restaurant." },
      { arabic: "كَانَ لَذِيذاً!", transliteration: "kāna ladhīdhan!", meaning: "It was delicious!", writingTip: "The best compliment you can give. Waiters love hearing this." },
    ];

    const steps: React.ReactNode[] = [
      <div key="intro" className="space-y-4 text-center">
        <p className="text-lg font-semibold">Food Culture & Restaurant Arabic</p>
        <p className="text-sm text-muted-foreground">Learn the names of popular dishes, essential ordering phrases, and practice writing and speaking each one.</p>
      </div>,
      ...foodItems.map((item, i) => <VocabCard key={`food-${i}`} item={item} />),
      <div key="phrases-intro" className="space-y-2 text-center">
        <p className="text-lg font-semibold">Essential Restaurant Phrases</p>
        <p className="text-sm text-muted-foreground">Master these 4 phrases and you can order food anywhere in the Arab world.</p>
      </div>,
      ...phrases.map((p, i) => <VocabCard key={`phrase-${i}`} item={p} />),
    ];

    return (
      <div data-testid="visual-content-food">
        <Card>
          <CardContent className="p-5">
            <SceneHeader image={sceneCoffee} title="Food Culture & Restaurant Arabic" subtitle="Write and speak food names and ordering phrases" icon={Utensils} />
            <StepCarousel steps={steps} testIdPrefix="food" />
            <TeacherTip tip="Arabic hospitality is legendary. The host will always offer more food than you can eat. Saying 'Alhamdulillah' (praise God) after eating shows gratitude and signals you're full." />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (title.includes("verb") || title.includes("فَعَلَ") || title.includes("يَفْعَلُ") || title.includes("past tense") || title.includes("present tense")) {
    const verbVocab: VocabItem[] = [
      { arabic: "كَتَبَ", transliteration: "kataba", meaning: "he wrote", writingTip: "Root: ك-ت-ب (writing). This is the basic past tense form (فَعَلَ pattern)." },
      { arabic: "ذَهَبَ", transliteration: "dhahaba", meaning: "he went", writingTip: "Root: ذ-ه-ب (going). Notice the 3 root letters stay constant." },
      { arabic: "أَكَلَ", transliteration: "akala", meaning: "he ate", writingTip: "Root: أ-ك-ل (eating). Begins with Hamza (أ)." },
      { arabic: "يَكْتُبُ", transliteration: "yaktubu", meaning: "he writes (present)", writingTip: "Present tense adds prefix يـ. Root ك-ت-ب remains visible inside." },
    ];

    const steps: React.ReactNode[] = [
      <div key="intro" className="space-y-4 text-center">
        <p className="text-lg font-semibold">Verb Conjugation: كَتَبَ (to write)</p>
        <p className="text-sm text-muted-foreground">
          Arabic changes the beginning and ending of verbs to show who is doing the action. Practice writing and speaking each conjugation.
        </p>
      </div>,
      <ConjugationStep key="past" rows={CONJUGATION_DATA} tense="past" />,
      ...CONJUGATION_DATA.slice(0, 3).map((row, i) => (
        <VocabCard key={`past-vocab-${i}`} item={{ arabic: row.past, transliteration: `${row.pronoun}: ${row.past}`, meaning: `${row.pronoun} wrote`, writingTip: `Conjugation for ${row.pronounAr} (${row.pronoun}) in past tense.` }} />
      )),
      <ConjugationStep key="present" rows={CONJUGATION_DATA} tense="present" />,
      ...CONJUGATION_DATA.slice(0, 3).map((row, i) => (
        <VocabCard key={`present-vocab-${i}`} item={{ arabic: row.present, transliteration: `${row.pronoun}: ${row.present}`, meaning: `${row.pronoun} write(s)`, writingTip: `Conjugation for ${row.pronounAr} (${row.pronoun}) in present tense.` }} />
      )),
      ...verbVocab.map((v, i) => <VocabCard key={`verb-vocab-${i}`} item={v} />),
    ];

    return (
      <div data-testid="visual-content-verbs">
        <Card>
          <CardContent className="p-5">
            <SceneHeader image={sceneCalligraphy} title="Verb Conjugation" subtitle="Write and speak Arabic verb forms" icon={GraduationCap} />
            <StepCarousel steps={steps} testIdPrefix="verb" />
            <TeacherTip tip="Arabic verbs are built on a 3-letter root. The root stays the same, while prefixes and suffixes change to show who, when, and how the action happens. Think of it as a formula!" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (title.includes("question") || title.includes("استفهام")) {
    const words = [
      { arabic: "مَن", transliteration: "man", meaning: "who", example: "مَن هَٰذا؟", exampleMeaning: "Who is this?" },
      { arabic: "مَاذَا", transliteration: "mādhā", meaning: "what", example: "مَاذَا تُرِيد؟", exampleMeaning: "What do you want?" },
      { arabic: "أَيْنَ", transliteration: "ayna", meaning: "where", example: "أَيْنَ المَطَار؟", exampleMeaning: "Where is the airport?" },
      { arabic: "مَتَىٰ", transliteration: "matā", meaning: "when", example: "مَتَىٰ السَّفَر؟", exampleMeaning: "When is the trip?" },
      { arabic: "لِمَاذَا", transliteration: "limādhā", meaning: "why", example: "لِمَاذَا أنتَ هُنَا؟", exampleMeaning: "Why are you here?" },
      { arabic: "كَيْفَ", transliteration: "kayfa", meaning: "how", example: "كَيْفَ حالُك؟", exampleMeaning: "How are you?" },
      { arabic: "كَم", transliteration: "kam", meaning: "how many", example: "كَم السَّاعَة؟", exampleMeaning: "What time is it?" },
    ];

    const steps: React.ReactNode[] = [
      <div key="intro" className="space-y-4 text-center">
        <p className="text-lg font-semibold">Question Words: Your Key to Asking Anything</p>
        <p className="text-sm text-muted-foreground">Master these 7 words and practice writing and speaking each question.</p>
      </div>,
      ...words.flatMap((w, i) => [
        <QuestionWordStep key={`q-${i}`} word={w} />,
        <VocabCard key={`q-vocab-${i}`} item={{
          arabic: w.example,
          transliteration: `${w.transliteration} — ${w.exampleMeaning}`,
          meaning: w.exampleMeaning,
          writingTip: `${w.arabic} (${w.meaning}) goes at the start of the question. Practice writing the full question.`,
        }} />,
      ]),
    ];

    return (
      <div data-testid="visual-content-questions">
        <Card>
          <CardContent className="p-5">
            <SceneHeader image={sceneMarketplace} title="Question Words" subtitle="Write and speak 7 essential Arabic questions" icon={HelpCircle} />
            <StepCarousel steps={steps} testIdPrefix="question" />
            <TeacherTip tip="Question words usually come at the beginning of the sentence in Arabic. Unlike English, you do not need to change word order - just add the question word at the start!" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (title.includes("describing") || title.includes("adjective") || title.includes("وصف")) {
    const examples = [
      { noun: "بَيْت", adj: "كَبِير", full: "بَيْتٌ كَبِير", meaning: "a big house", gender: "masculine" },
      { noun: "مَدِينَة", adj: "كَبِيرَة", full: "مَدِينَةٌ كَبِيرَة", meaning: "a big city", gender: "feminine" },
      { noun: "وَلَد", adj: "صَغِير", full: "وَلَدٌ صَغِير", meaning: "a small boy", gender: "masculine" },
      { noun: "بِنْت", adj: "صَغِيرَة", full: "بِنْتٌ صَغِيرَة", meaning: "a small girl", gender: "feminine" },
      { noun: "رَجُل", adj: "طَوِيل", full: "رَجُلٌ طَوِيل", meaning: "a tall man", gender: "masculine" },
      { noun: "اِمْرَأَة", adj: "طَوِيلَة", full: "اِمْرَأَةٌ طَوِيلَة", meaning: "a tall woman", gender: "feminine" },
    ];

    const steps: React.ReactNode[] = [
      <div key="intro" className="space-y-4 text-center">
        <p className="text-lg font-semibold">Adjective Agreement</p>
        <p className="text-sm text-muted-foreground">In Arabic, the adjective comes after the noun and must match its gender. Practice writing and speaking each phrase.</p>
      </div>,
      ...examples.flatMap((ex, i) => [
        <AdjectiveStep key={`adj-${i}`} example={ex} />,
        <VocabCard key={`adj-vocab-${i}`} item={{
          arabic: ex.full,
          transliteration: ex.meaning,
          meaning: ex.meaning,
          writingTip: `${ex.gender === "feminine" ? "Feminine: adjective ends in ة to match the noun." : "Masculine: no ة needed on the adjective."} Noun + Adjective = ${ex.noun} + ${ex.adj}`,
        }} />,
      ]),
    ];

    return (
      <div data-testid="visual-content-adjectives">
        <Card>
          <CardContent className="p-5">
            <SceneHeader image={sceneMosque} title="Describing People & Places" subtitle="Write and speak noun-adjective phrases" icon={BookOpen} />
            <StepCarousel steps={steps} testIdPrefix="adjective" />
            <TeacherTip tip="Arabic adjectives always come AFTER the noun they describe, and must agree in gender. If the noun is feminine (ends in ة), the adjective must also be feminine." />
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
