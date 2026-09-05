"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Database,
  Eye,
  HandHeart,
  Home,
  KeyRound,
  LockKeyhole,
  MessageCircleHeart,
  RefreshCcw,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Role = "student" | "parent" | "caregiver";
type AppSection = "today" | "family" | "activity" | "settings";
type Difficulty = "starting" | "understanding" | "finding-time";
type HelpCardStatus = "private" | "sent" | "accepted";
type CoachEngine = "preview" | "strands";

type CoachPlan = {
  acknowledgement: string;
  steps: Array<{ label: string; minutes: number }>;
  checkInQuestion: string;
  parentHelpSuggestion: string | null;
};

const roles: Array<{ id: Role; label: string; person: string }> = [
  { id: "student", label: "Student", person: "Maya" },
  { id: "parent", label: "Parent", person: "Daniel" },
  { id: "caregiver", label: "Caregiver", person: "Alex" },
];

const navigation: Array<{
  id: AppSection;
  label: string;
  icon: typeof Home;
}> = [
  { id: "today", label: "Today", icon: Home },
  { id: "family", label: "Family", icon: Users },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
];

const roleCopy: Record<Role, { eyebrow: string; title: string; description: string }> = {
  student: {
    eyebrow: "Tuesday · your plan",
    title: "Good afternoon, Maya",
    description: "One science step, then soccer. We can make this feel smaller.",
  },
  parent: {
    eyebrow: "Family today · two decisions",
    title: "Good afternoon, Daniel",
    description: "Maya asked for one specific kind of help. The rest of her study space stays private.",
  },
  caregiver: {
    eyebrow: "Caregiver pass · ends at 9:00 PM",
    title: "Welcome, Alex",
    description: "You can support today’s handoff and report an exception. Nothing else is visible.",
  },
};

const sectionCopy: Record<Exclude<AppSection, "today">, { eyebrow: string; title: string; description: string }> = {
  family: {
    eyebrow: "Family control center",
    title: "Clear access, without surveillance",
    description: "See who can access what, when permissions expire, and which decisions crossed a boundary.",
  },
  activity: {
    eyebrow: "Explainable by default",
    title: "A quiet agent with a visible trail",
    description: "TenderLoop records meaningful actions and approvals—not the private conversation behind them.",
  },
  settings: {
    eyebrow: "Privacy & safety",
    title: "Boundaries you can understand",
    description: "Review the agent runtime, data behavior, sharing defaults, and routes to human support.",
  },
};

const roleScope: Record<Role, { label: string; detail: string; tone: "private" | "shared" | "limited" }> = {
  student: {
    label: "Private workspace",
    detail: "The agent may draft. Maya approves anything shared.",
    tone: "private",
  },
  parent: {
    label: "Approved requests only",
    detail: "Daniel sees decisions and Help Cards—not Maya’s private chat.",
    tone: "shared",
  },
  caregiver: {
    label: "Time-limited access",
    detail: "Alex receives today’s logistics only, with a visible expiry.",
    tone: "limited",
  },
};

function AudienceChip({ children, tone = "private" }: { children: React.ReactNode; tone?: "private" | "shared" | "limited" }) {
  const styles = {
    private: "border-[#cbd9d1] bg-[#edf4ef] text-[#265d49]",
    shared: "border-[#d9c0af] bg-[#f7e9df] text-[#754a36]",
    limited: "border-[#cdd9df] bg-[#edf3f6] text-[#385d6c]",
  };

  return (
    <span className={`inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[tone]}`}>
      {tone === "private" ? <LockKeyhole className="size-3.5" aria-hidden="true" /> : <Eye className="size-3.5" aria-hidden="true" />}
      {children}
    </span>
  );
}

function StudentView({
  onShare,
  onOpenSettings,
  coachEngine,
  onCoachEngineChange,
}: {
  onShare: () => void;
  onOpenSettings: () => void;
  coachEngine: CoachEngine;
  onCoachEngineChange: (engine: CoachEngine) => void;
}) {
  const [studyComfort, setStudyComfort] = useState<"regular" | "low-energy" | "screen-light">("regular");
  const [difficulty, setDifficulty] = useState<Difficulty>("starting");
  const [coachPlan, setCoachPlan] = useState<CoachPlan>({
    acknowledgement: "Starting can feel like the biggest step. Let’s make the first move very small.",
    steps: [
      { label: "Choose one local water source", minutes: 5 },
      { label: "Find two trustworthy sources", minutes: 10 },
      { label: "Write three questions to investigate", minutes: 5 },
    ],
    checkInQuestion: "Which step would make the rest feel easier once it is done?",
    parentHelpSuggestion: null,
  });
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);
  const comfortCopy = {
    regular: "Keep the 20-minute plan with the usual break pattern.",
    "low-energy": "Use 10-minute blocks, add a longer break, and move optional work.",
    "screen-light": "Prefer audio or paper steps and reduce visually dense prompts.",
  }[studyComfort];
  const totalMinutes = coachPlan.steps.reduce((sum, step) => sum + step.minutes, 0);

  async function createPlan() {
    setCoachLoading(true);
    setCoachError(null);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignment: "Local water quality science project due Friday",
          difficulty,
          comfort: studyComfort,
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error ?? "The coach could not create a plan.");

      setCoachPlan(data.plan);
      onCoachEngineChange(data.engine === "strands" ? "strands" : "preview");
    } catch (error) {
      setCoachError(error instanceof Error ? error.message : "The coach could not create a plan.");
    } finally {
      setCoachLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_.85fr]">
      <div className="space-y-5">
        <Card className="paper-shadow overflow-hidden border-0 bg-[#fffdf8] py-0">
          <div className="border-b border-[#e9e3d9] bg-[#f8f3e9] px-4 py-3.5 sm:px-6 sm:py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#dbe8df] text-[#265d49]">
                  <BookOpen className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Science project</p>
                  <h2 className="text-lg font-semibold">Local water quality</h2>
                </div>
              </div>
              <Badge variant="outline" className="rounded-full bg-white px-3 py-1 text-muted-foreground">Due Friday</Badge>
            </div>
          </div>
          <CardContent className="space-y-5 px-4 py-4 sm:px-6 sm:py-5">
            <div className="rounded-2xl border border-[#d9e3dc] bg-[#f2f7f3] p-4">
              <div className="flex gap-3">
                <Sparkles className="mt-0.5 size-5 shrink-0 text-[#3a745d]" aria-hidden="true" />
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">What feels hardest right now?</p>
                    <Badge variant="outline" className="rounded-full bg-white text-[11px]">
                      {coachEngine === "strands" ? "Strands agent" : "Safe preview"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">Starting, understanding the research, or finding time?</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      ["starting", "Starting"],
                      ["understanding", "Understanding"],
                      ["finding-time", "Finding time"],
                    ].map(([value, label]) => (
                      <Button
                        key={value}
                        size="sm"
                        variant={difficulty === value ? "default" : "outline"}
                        className="rounded-full bg-white data-[active=true]:bg-[#265d49]"
                        data-active={difficulty === value}
                        onClick={() => setDifficulty(value as Difficulty)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#315f4d]" aria-live="polite">{coachPlan.acknowledgement}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">A small plan for today</p>
                  <p className="text-sm text-muted-foreground">You can change any step before it is saved.</p>
                </div>
                <span className="text-xs font-semibold text-[#3a745d]">{totalMinutes} min total</span>
              </div>
              <div className="space-y-2">
                {coachPlan.steps.map((step, index) => (
                  <div key={`${step.label}-${index}`} className={`flex items-center gap-3 rounded-xl border p-3 ${index === 0 ? "border-[#a9c4b5] bg-[#f7fbf8]" : "bg-white"}`}>
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#e6eee9] text-xs font-bold text-[#265d49]">{index + 1}</span>
                    <span className="min-w-0 flex-1 text-sm font-medium">{step.label}</span>
                    <span className="text-xs text-muted-foreground">{step.minutes} min</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{coachPlan.checkInQuestion}</p>
              {coachError ? <p className="mt-3 text-sm font-medium text-red-700" role="alert">{coachError}</p> : null}
              <div className="mt-4 grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
                <AudienceChip>Private until you share</AudienceChip>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  <Button variant="outline" className="rounded-full bg-white px-3" onClick={createPlan} disabled={coachLoading}>
                    {coachLoading ? "Planning…" : "Create my plan"}
                  </Button>
                  <Button className="rounded-full px-3">Start first step <ArrowRight className="size-4" aria-hidden="true" /></Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e2d5ca] bg-[#fffaf5]">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f1ddd0] text-[#7b4e39]">
                <MessageCircleHeart className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold">Want a grown-up to unblock this?</h3>
                <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">Send a Help Card—not your chat. You approve the exact words first.</p>
              </div>
            </div>
            <Button variant="outline" onClick={onShare} className="shrink-0 rounded-full bg-white">Make a Help Card</Button>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-5">
        <Card className="bg-[#2b5f4d] text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Today’s rhythm</CardTitle>
              <CalendarDays className="size-5 text-white/70" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="w-14 text-xs font-semibold text-white/65">4:10</span>
                <div><p className="text-sm font-semibold">Science · first step</p><p className="text-xs text-white/65">20 minutes</p></div>
              </div>
              <div className="flex gap-3">
                <span className="w-14 text-xs font-semibold text-white/65">5:00</span>
                <div><p className="text-sm font-semibold">Soccer practice</p><p className="text-xs text-white/65">Alex drives today</p></div>
              </div>
              <div className="flex gap-3">
                <span className="w-14 text-xs font-semibold text-white/65">7:30</span>
                <div><p className="text-sm font-semibold">Open space</p><p className="text-xs text-white/65">Possible help from Dad</p></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Your sharing map</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-3 text-sm"><span>Study conversation</span><AudienceChip>Only you</AudienceChip></div>
            <div className="flex items-center justify-between gap-3 text-sm"><span>Today’s schedule</span><AudienceChip tone="shared">Family</AudienceChip></div>
            <div className="flex items-center justify-between gap-3 text-sm"><span>Soccer handoff</span><AudienceChip tone="limited">Alex until 9</AudienceChip></div>
            <Button variant="ghost" className="mt-1 w-full justify-between px-0 text-[#265d49]" onClick={onOpenSettings}>Review privacy <ChevronRight className="size-4" aria-hidden="true" /></Button>
          </CardContent>
        </Card>

        <Card className="border-[#d8d3e1] bg-[#fbf9fd]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Study comfort</CardTitle>
              <AudienceChip>Private</AudienceChip>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">Adjust the work—not diagnose the reason. You can change this any time.</p>
            <div className="mt-3 grid gap-2">
              {[
                ["regular", "Regular pace"],
                ["low-energy", "Low-energy pace"],
                ["screen-light", "Screen-light pace"],
              ].map(([value, label]) => (
                <Button
                  key={value}
                  size="sm"
                  variant={studyComfort === value ? "secondary" : "outline"}
                  className="min-h-10 justify-start rounded-xl bg-white"
                  onClick={() => setStudyComfort(value as typeof studyComfort)}
                >
                  {studyComfort === value ? <Check className="size-4" aria-hidden="true" /> : null}
                  {label}
                </Button>
              ))}
            </div>
            <p className="mt-3 rounded-xl bg-white p-3 text-sm leading-6">{comfortCopy}</p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">TenderLoop cannot assess symptoms or give medical advice. If something feels medically wrong, pause and contact a trusted adult or health professional.</p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function ParentView({ helpCardStatus, onAccept }: { helpCardStatus: HelpCardStatus; onAccept: () => void }) {
  if (helpCardStatus === "private") {
    return (
      <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <Card className="paper-shadow border-0">
          <CardContent className="grid min-h-52 place-items-center p-6 text-center sm:min-h-72 sm:p-8">
            <div className="max-w-md">
              <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#edf4ef] text-[#265d49]"><LockKeyhole className="size-5" /></div>
              <h2 className="mt-4 text-xl font-semibold">No help request has been shared</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Maya’s study space remains private. A bounded Help Card will appear here only after she approves its exact wording.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">What you can see</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="flex items-center gap-2"><Check className="size-4 text-[#347259]" /> Agreed task status</p>
            <p className="flex items-center gap-2"><Check className="size-4 text-[#347259]" /> Help Cards Maya sends</p>
            <p className="flex items-center gap-2"><Check className="size-4 text-[#347259]" /> Shared schedule</p>
            <p className="flex items-center gap-2 text-muted-foreground"><LockKeyhole className="size-4" /> No raw chats or mood scores</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
      <Card className="paper-shadow border-0">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a5a42]">Maya chose to share</p><CardTitle className="mt-1 text-xl">A ten-minute research assist</CardTitle></div>
            <AudienceChip tone="shared">Shared with you</AudienceChip>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <blockquote className="rounded-2xl border border-[#ead9cd] bg-[#fff8f2] p-5 text-lg leading-8">“Could you help me find two trustworthy sources for my water project at 7:30? I want hints, not answers.”</blockquote>
          <div className="rounded-xl bg-[#edf4ef] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#3d715d]">TenderLoop suggests</p>
            <p className="mt-2 text-sm leading-6">Keep the answer warm and concrete: confirm the time, bring your laptop, and let Maya lead the questions.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button className="rounded-full" onClick={onAccept} disabled={helpCardStatus === "accepted"}><Check className="size-4" aria-hidden="true" /> {helpCardStatus === "accepted" ? "Help confirmed" : "I can help"}</Button>
            <Button variant="outline" className="rounded-full">Suggest 8:00</Button>
            <Button variant="ghost" className="rounded-full">Not tonight</Button>
          </div>
          {helpCardStatus === "accepted" ? <p className="rounded-xl bg-[#edf4ef] p-3 text-sm font-medium text-[#265d49]" aria-live="polite">Daniel confirmed 7:30 PM. This decision—not Maya’s private chat—was added to the family activity log.</p> : null}
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-3.5" aria-hidden="true" /> Maya’s conversation, drafts, and feelings were not shared.</p>
        </CardContent>
      </Card>
      <div className="space-y-5">
        <Card>
          <CardHeader><CardTitle className="text-base">Family today</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-[#e6eee9]"><Clock3 className="size-4 text-[#265d49]" /></div><div className="flex-1"><p className="text-sm font-semibold">Science support</p><p className="text-xs text-muted-foreground">Decision needed · 7:30 PM</p></div></div>
            <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-[#edf3f6]"><Users className="size-4 text-[#385d6c]" /></div><div className="flex-1"><p className="text-sm font-semibold">Alex’s caregiver pass</p><p className="text-xs text-muted-foreground">Active until 9:00 PM</p></div></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">What you can see</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="flex items-center gap-2"><Check className="size-4 text-[#347259]" /> Agreed task status</p>
            <p className="flex items-center gap-2"><Check className="size-4 text-[#347259]" /> Help Cards Maya sends</p>
            <p className="flex items-center gap-2"><Check className="size-4 text-[#347259]" /> Shared schedule</p>
            <p className="flex items-center gap-2 text-muted-foreground"><LockKeyhole className="size-4" /> No raw chats or mood scores</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CaregiverView() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
      <Card className="paper-shadow border-0">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3"><CardTitle className="text-xl">Today’s handoff</CardTitle><AudienceChip tone="limited">Expires at 9:00 PM</AudienceChip></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative space-y-5 border-l-2 border-[#cfddd5] pl-6">
            <div className="relative"><span className="absolute -left-[31px] top-1 size-3 rounded-full bg-[#438067] ring-4 ring-[#edf4ef]" /><p className="text-xs font-semibold text-muted-foreground">4:40 PM</p><h3 className="mt-1 font-semibold">Pick up Maya at home</h3><p className="mt-1 text-sm text-muted-foreground">Use the usual front-door handoff. Address is hidden in this demo.</p></div>
            <div className="relative"><span className="absolute -left-[31px] top-1 size-3 rounded-full bg-[#438067] ring-4 ring-[#edf4ef]" /><p className="text-xs font-semibold text-muted-foreground">5:00–6:30 PM</p><h3 className="mt-1 font-semibold">Soccer practice</h3><p className="mt-1 text-sm text-muted-foreground">Bring water bottle and blue kit.</p></div>
            <div className="relative"><span className="absolute -left-[31px] top-1 size-3 rounded-full bg-[#438067] ring-4 ring-[#edf4ef]" /><p className="text-xs font-semibold text-muted-foreground">6:45 PM</p><h3 className="mt-1 font-semibold">Return home</h3><p className="mt-1 text-sm text-muted-foreground">Daniel takes over after handoff.</p></div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2"><Button className="rounded-full"><Check className="size-4" /> Acknowledge</Button><Button variant="outline" className="rounded-full"><RefreshCcw className="size-4" /> Report a change</Button></div>
        </CardContent>
      </Card>
      <div className="space-y-5">
        <Card className="border-[#cbd9df] bg-[#f5fafc]">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><KeyRound className="size-4 text-[#385d6c]" /> Your access</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm"><p>Today’s pickup and activity schedule</p><p>Parent contact for exceptions</p><p className="text-muted-foreground">No grades, study history, private chats, or future schedule.</p></CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Need a decision?</p>
            <h3 className="mt-2 font-semibold">Ask Daniel, don’t guess</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">A change request goes to the parent. TenderLoop never expands your access automatically.</p>
            <Button variant="outline" className="mt-4 w-full rounded-full">Request parent decision</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AppNavigation({
  activeSection,
  onNavigate,
  mobile = false,
}: {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
  mobile?: boolean;
}) {
  return (
    <nav aria-label="Primary navigation" className={mobile ? "grid grid-cols-4" : "flex items-center gap-1 rounded-full border border-black/5 bg-white/65 p-1 shadow-sm"}>
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = activeSection === item.id;

        return (
          <button
            key={item.id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onNavigate(item.id)}
            className={mobile
              ? `flex min-h-15 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition-colors ${active ? "bg-[#e5eee8] text-[#265d49]" : "text-muted-foreground hover:text-foreground"}`
              : `inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${active ? "bg-[#265d49] text-white shadow-sm" : "text-muted-foreground hover:bg-[#edf2ee] hover:text-foreground"}`}
          >
            <Icon className={mobile ? "size-5" : "size-4"} aria-hidden="true" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function FamilyView({
  helpCardStatus,
  onOpenRole,
}: {
  helpCardStatus: HelpCardStatus;
  onOpenRole: (role: Role) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <Card className="paper-shadow overflow-hidden border-0">
          <CardHeader className="border-b bg-[#f8f3e9]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#527365]">Household access</p>
                <CardTitle className="mt-1 text-xl">One family, three clear boundaries</CardTitle>
              </div>
              <AudienceChip>Student-controlled</AudienceChip>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 p-4 sm:grid-cols-3 sm:p-6">
            {roles.map((item) => {
              const scope = roleScope[item.id];
              const Icon = item.id === "student" ? UserRound : item.id === "parent" ? HandHeart : KeyRound;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenRole(item.id)}
                  className="group rounded-2xl border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#abc2b6] hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid size-10 place-items-center rounded-xl bg-[#e8efea] text-[#265d49]"><Icon className="size-5" aria-hidden="true" /></span>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
                  <h3 className="mt-0.5 font-semibold">{item.person}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{scope.detail}</p>
                  <div className="mt-3"><AudienceChip tone={scope.tone}>{scope.label}</AudienceChip></div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-[#cbd9df] bg-[#f5fafc]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><KeyRound className="size-4 text-[#385d6c]" /> Alex’s caregiver pass</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3"><span>Status</span><AudienceChip tone="limited">Active until 9:00 PM</AudienceChip></div>
            <div className="rounded-xl bg-white p-4 leading-6">
              <p className="font-semibold">Visible today</p>
              <p className="mt-1 text-muted-foreground">Pickup, soccer logistics, and Daniel’s contact for exceptions.</p>
            </div>
            <p className="flex gap-2 text-muted-foreground"><LockKeyhole className="mt-0.5 size-4 shrink-0" /> Grades, private chat, mood, and future schedules remain hidden.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a5a42]">Current family decision</p>
            <p className="mt-1 font-semibold">{helpCardStatus === "accepted" ? "Daniel confirmed Maya’s 7:30 PM help request." : helpCardStatus === "sent" ? "Maya’s approved Help Card is waiting for Daniel." : "Maya has not shared a Help Card."}</p>
            <p className="mt-1 text-sm text-muted-foreground">Only the approved decision crosses between private workspaces.</p>
          </div>
          <Button variant="outline" className="rounded-full bg-white" onClick={() => onOpenRole(helpCardStatus === "private" ? "student" : "parent")}>Open relevant view <ArrowRight className="size-4" /></Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityView({ helpCardStatus }: { helpCardStatus: HelpCardStatus }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <Card className="paper-shadow border-0">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#527365]">Today · audit trail</p><CardTitle className="mt-1 text-xl">Actions, approvals, and boundaries</CardTitle></div>
            <AudienceChip tone="shared">Shared decisions only</AudienceChip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-4 border-l-2 border-[#cfddd5] pl-6">
            <div className="relative rounded-2xl border bg-white p-4"><span className="absolute -left-[31px] top-5 size-3 rounded-full bg-[#438067] ring-4 ring-[#edf4ef]" /><p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">4:02 PM · Student Coach</p><p className="mt-1 text-sm leading-6">Drafted a three-step science plan for Maya. No external action taken.</p></div>
            {helpCardStatus !== "private" ? <div className="relative rounded-2xl border border-[#ead9cd] bg-[#fff8f2] p-4"><span className="absolute -left-[31px] top-5 size-3 rounded-full bg-[#b47759] ring-4 ring-[#faeee5]" /><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#81533d]">4:06 PM · Maya approved</p><p className="mt-1 text-sm leading-6">Shared one Help Card with Daniel. Raw chat and comfort preference remained private.</p></div> : null}
            {helpCardStatus === "accepted" ? <div className="relative rounded-2xl border border-[#d9e3dc] bg-[#f2f7f3] p-4"><span className="absolute -left-[31px] top-5 size-3 rounded-full bg-[#438067] ring-4 ring-[#edf4ef]" /><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#3d715d]">4:08 PM · Daniel confirmed</p><p className="mt-1 text-sm leading-6">Accepted a ten-minute source-finding assist at 7:30 PM.</p></div> : null}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card className="border-[#d9e3dc] bg-[#f4f8f5]">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="size-5 text-[#347259]" /> Privacy proof</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="flex gap-2"><Check className="size-4 shrink-0 text-[#347259]" /> Agent drafts are labeled before action</p>
            <p className="flex gap-2"><Check className="size-4 shrink-0 text-[#347259]" /> Student approval is recorded</p>
            <p className="flex gap-2"><Check className="size-4 shrink-0 text-[#347259]" /> Parent response is attributable</p>
            <p className="flex gap-2 text-muted-foreground"><LockKeyhole className="size-4 shrink-0" /> Private conversation content is excluded</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Data retention</p>
            <p className="mt-2 font-semibold">Session-only demonstration</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">This competition build uses synthetic family data and does not persist activity after the demo resets.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsView({ coachEngine, onReset }: { coachEngine: CoachEngine; onReset: () => void }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
      <div className="space-y-5">
        <Card className="paper-shadow border-0">
          <CardHeader><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#527365]">Safety defaults</p><CardTitle className="mt-1 text-xl">Privacy is part of the workflow</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-2xl border bg-white p-4"><div><p className="font-semibold">Ask before sharing</p><p className="mt-1 text-sm text-muted-foreground">Maya approves the exact words and recipient.</p></div><span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-[#dcebe2] px-3 text-xs font-bold text-[#265d49]"><Check className="size-4" /> Always on</span></div>
            <div className="flex items-center justify-between gap-4 rounded-2xl border bg-white p-4"><div><p className="font-semibold">Minimum necessary access</p><p className="mt-1 text-sm text-muted-foreground">Each person sees only what their role requires.</p></div><span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-[#dcebe2] px-3 text-xs font-bold text-[#265d49]"><Check className="size-4" /> Enforced</span></div>
            <div className="flex items-center justify-between gap-4 rounded-2xl border bg-white p-4"><div><p className="font-semibold">Medical and crisis boundary</p><p className="mt-1 text-sm text-muted-foreground">TenderLoop pauses and routes people to trusted human support.</p></div><span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-[#f3e8df] px-3 text-xs font-bold text-[#754a36]">Human first</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Get human help</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-[#f7f5f0] p-4"><p className="font-semibold">Talk to a trusted adult</p><p className="mt-1 text-sm leading-6 text-muted-foreground">For emotional, health, safety, or family concerns, stop the agent flow and contact a person you trust.</p></div>
            <div className="rounded-xl bg-[#f7f5f0] p-4"><p className="font-semibold">Emergency support</p><p className="mt-1 text-sm leading-6 text-muted-foreground">If someone may be in immediate danger, contact local emergency services now.</p></div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="border-[#cbd9df] bg-[#f5fafc]">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bot className="size-5 text-[#385d6c]" /> Agent runtime</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3"><span>Last plan engine</span><Badge variant="outline" className="rounded-full bg-white">{coachEngine === "strands" ? "Strands agent" : "Safe preview"}</Badge></div>
            <p className="leading-6 text-muted-foreground">The local demo uses the Strands Agents SDK with Amazon Nova Lite when AWS credentials are available. Safe Preview keeps the public experience reliable.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Database className="size-5 text-[#347259]" /> Demo data</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm"><p><span className="font-semibold">Mode:</span> Synthetic family scenario</p><p><span className="font-semibold">Retention:</span> Session only</p><p className="text-muted-foreground">No account, background tracking, or persistent family record is created in this competition build.</p><Button variant="outline" className="mt-2 w-full rounded-full bg-white" onClick={onReset}><RotateCcw className="size-4" /> Reset demonstration</Button></CardContent>
        </Card>
      </div>
    </div>
  );
}

function HelpCardDialog({ open, onOpenChange, onSend }: { open: boolean; onOpenChange: (open: boolean) => void; onSend: () => void }) {
  const [sent, setSent] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) setSent(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl bg-[#fffdf8] sm:max-w-2xl">
        {sent ? (
          <div className="py-8 text-center" aria-live="polite">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#dcebe2] text-[#265d49]"><Check className="size-7" /></div>
            <DialogTitle className="mt-5 text-2xl">Help Card sent to Dad</DialogTitle>
            <DialogDescription className="mx-auto mt-2 max-w-md leading-6">Only the message you approved was shared. Your study conversation is still private.</DialogDescription>
            <Button className="mt-6 rounded-full" onClick={() => handleOpenChange(false)}>Back to my plan</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Check before sharing</DialogTitle>
              <DialogDescription>You control the message. Keeping it private is always an option.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#d8c4b7] bg-[#fff7f1] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#81533d]">Dad will see</p>
                <p className="mt-3 text-sm leading-6">“Could you help me find two trustworthy sources for my water project at 7:30? I want hints, not answers.”</p>
                <button className="mt-3 min-h-11 text-sm font-semibold text-[#754a36] underline underline-offset-4">Edit these words</button>
              </div>
              <div className="rounded-2xl border bg-[#f7f5f0] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Dad will not see</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground"><li>• Your private conversation</li><li>• How you described feeling</li><li>• Drafts or hint history</li></ul>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <Button variant="ghost" onClick={() => handleOpenChange(false)} className="rounded-full">Keep private</Button>
              <Button onClick={() => { onSend(); setSent(true); }} className="rounded-full">Share this Help Card <ArrowRight className="size-4" /></Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function TenderLoopDemo() {
  const [activeSection, setActiveSection] = useState<AppSection>("today");
  const [role, setRole] = useState<Role>("student");
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpCardStatus, setHelpCardStatus] = useState<HelpCardStatus>("private");
  const [coachEngine, setCoachEngine] = useState<CoachEngine>("preview");
  const copy = roleCopy[role];
  const activityCopy = helpCardStatus === "accepted"
    ? "Daniel confirmed Maya’s approved Help Card for 7:30 PM. No private chat was shared."
    : helpCardStatus === "sent"
      ? "Maya shared one approved Help Card with Daniel. Her study conversation remains private."
      : "Drafted a plan from Maya’s assignment and family calendar. No action taken without approval.";
  const scope = roleScope[role];

  function navigate(section: AppSection) {
    setActiveSection(section);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  }

  function changeRole(nextRole: Role) {
    setRole(nextRole);
    setActiveSection("today");
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  }

  function resetDemo() {
    setRole("student");
    setHelpCardStatus("private");
    setCoachEngine("preview");
    setActiveSection("today");
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  }

  const heading = activeSection === "today" ? copy : sectionCopy[activeSection];

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <header className="app-safe-top sticky top-0 z-40 border-b border-black/5 bg-[#f9f6f0]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-[#265d49] text-white sm:size-10 sm:rounded-2xl"><HandHeart className="size-5" aria-hidden="true" /></div>
            <div><p className="text-base font-bold tracking-tight">TenderLoop</p><p className="text-xs text-muted-foreground">from nagging to navigating</p></div>
          </div>
          <div className="hidden md:block"><AppNavigation activeSection={activeSection} onNavigate={navigate} /></div>
          <div className="inline-flex min-h-9 items-center gap-1.5 rounded-full border bg-white/70 px-2.5 text-[11px] font-semibold text-[#315f4d] md:hidden"><ShieldCheck className="size-4 text-[#347259]" aria-hidden="true" /> Private by design</div>
        </div>
      </header>

      <div className="app-safe-bottom mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-9">
        <div className="mb-4 flex flex-col justify-between gap-4 md:mb-6 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#527365] sm:text-xs">{heading.eyebrow}</p>
            <h1 className="mt-1.5 text-[1.75rem] font-semibold leading-tight tracking-[-0.035em] sm:mt-2 sm:text-4xl">{heading.title}</h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:mt-2 sm:text-base sm:leading-7">{heading.description}</p>
          </div>
          {activeSection === "today" ? <div className="w-full md:w-auto">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Choose a perspective</p>
            <Tabs value={role} onValueChange={(value) => changeRole(value as Role)}>
              <TabsList className="grid h-auto w-full grid-cols-3 rounded-2xl bg-[#e6e2d9] p-1 md:w-auto md:rounded-full">
                {roles.map((item) => <TabsTrigger key={item.id} value={item.id} className="min-h-12 flex-col gap-0 rounded-xl px-2 leading-tight md:min-h-10 md:flex-row md:gap-1 md:rounded-full md:px-4"><span className="text-[9px] font-bold uppercase tracking-[0.1em] text-current/60 md:text-xs md:normal-case md:tracking-normal">{item.label}</span><span className="text-sm">{item.person}</span></TabsTrigger>)}
              </TabsList>
            </Tabs>
          </div> : null}
        </div>

        {activeSection === "today" ? <div className="mb-5 grid gap-3 rounded-2xl border border-[#d5ded8] bg-[#f7faf8] px-4 py-3 sm:flex sm:items-center sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-[#347259]" aria-hidden="true" />
            <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#527365]">Auditable agent state</p><p className="mt-0.5 text-sm leading-5"><span className="font-semibold">Current:</span> {activityCopy}</p></div>
          </div>
          <div className="flex items-center gap-2 border-t border-[#dce5df] pt-2 sm:max-w-xs sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
            <AudienceChip tone={scope.tone}>{scope.label}</AudienceChip>
            <p className="hidden text-xs leading-5 text-muted-foreground lg:block">{scope.detail}</p>
          </div>
        </div> : null}

        {activeSection === "today" ? (
          role === "student"
            ? <StudentView onShare={() => setHelpOpen(true)} onOpenSettings={() => navigate("settings")} coachEngine={coachEngine} onCoachEngineChange={setCoachEngine} />
            : role === "parent"
              ? <ParentView helpCardStatus={helpCardStatus} onAccept={() => setHelpCardStatus("accepted")} />
              : <CaregiverView />
        ) : activeSection === "family" ? (
          <FamilyView helpCardStatus={helpCardStatus} onOpenRole={changeRole} />
        ) : activeSection === "activity" ? (
          <ActivityView helpCardStatus={helpCardStatus} />
        ) : (
          <SettingsView coachEngine={coachEngine} onReset={resetDemo} />
        )}

        <footer className="mt-8 flex flex-col justify-between gap-3 border-t pt-5 text-xs text-muted-foreground sm:flex-row">
          <p>TenderLoop is an AI tool, not a parent, tutor, therapist, or person.</p>
          <div className="flex flex-wrap gap-x-4"><button className="min-h-11 hover:text-foreground" onClick={() => navigate("settings")}>Privacy & safety</button><button className="min-h-11 hover:text-foreground" onClick={() => navigate("activity")}>Activity log</button><button className="min-h-11 hover:text-foreground" onClick={() => navigate("settings")}>Get human help</button></div>
        </footer>
      </div>
      <div className="app-safe-nav fixed inset-x-0 bottom-0 z-50 border-t border-black/8 bg-[#fffdf8]/95 px-2 pt-1 shadow-[0_-12px_30px_rgb(40_57_49_/_0.10)] backdrop-blur-xl md:hidden">
        <AppNavigation activeSection={activeSection} onNavigate={navigate} mobile />
      </div>
      <HelpCardDialog open={helpOpen} onOpenChange={setHelpOpen} onSend={() => setHelpCardStatus("sent")} />
    </main>
  );
}
