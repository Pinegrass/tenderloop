"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Eye,
  HandHeart,
  KeyRound,
  LockKeyhole,
  MessageCircleHeart,
  MoreHorizontal,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
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

const roles: Array<{ id: Role; label: string; person: string }> = [
  { id: "student", label: "Student", person: "Maya" },
  { id: "parent", label: "Parent", person: "Daniel" },
  { id: "caregiver", label: "Caregiver", person: "Alex" },
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

function StudentView({ onShare }: { onShare: () => void }) {
  const [studyComfort, setStudyComfort] = useState<"regular" | "low-energy" | "screen-light">("regular");
  const comfortCopy = {
    regular: "Keep the 20-minute plan with the usual break pattern.",
    "low-energy": "Use 10-minute blocks, add a longer break, and move optional work.",
    "screen-light": "Prefer audio or paper steps and reduce visually dense prompts.",
  }[studyComfort];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_.85fr]">
      <div className="space-y-5">
        <Card className="paper-shadow overflow-hidden border-0 bg-[#fffdf8] py-0">
          <div className="border-b border-[#e9e3d9] bg-[#f8f3e9] px-5 py-4 sm:px-6">
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
          <CardContent className="space-y-5 px-5 py-5 sm:px-6">
            <div className="rounded-2xl border border-[#d9e3dc] bg-[#f2f7f3] p-4">
              <div className="flex gap-3">
                <Sparkles className="mt-0.5 size-5 shrink-0 text-[#3a745d]" aria-hidden="true" />
                <div>
                  <p className="font-semibold">What feels hardest right now?</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">Starting, understanding the research, or finding time?</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" className="rounded-full">Starting</Button>
                    <Button size="sm" variant="outline" className="rounded-full bg-white">Research</Button>
                    <Button size="sm" variant="outline" className="rounded-full bg-white">Finding time</Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">A small plan for today</p>
                  <p className="text-sm text-muted-foreground">You can change any step before it is saved.</p>
                </div>
                <span className="text-xs font-semibold text-[#3a745d]">20 min total</span>
              </div>
              <div className="space-y-2">
                {[
                  ["1", "Choose one local water source", "5 min"],
                  ["2", "Find two trustworthy sources", "10 min"],
                  ["3", "Write three questions to investigate", "5 min"],
                ].map(([number, task, time], index) => (
                  <div key={number} className={`flex items-center gap-3 rounded-xl border p-3 ${index === 0 ? "border-[#a9c4b5] bg-[#f7fbf8]" : "bg-white"}`}>
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#e6eee9] text-xs font-bold text-[#265d49]">{number}</span>
                    <span className="min-w-0 flex-1 text-sm font-medium">{task}</span>
                    <span className="text-xs text-muted-foreground">{time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <AudienceChip>Private until you share</AudienceChip>
                <Button className="rounded-full">Start the first step <ArrowRight className="size-4" aria-hidden="true" /></Button>
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
            <Button variant="ghost" className="mt-1 w-full justify-between px-0 text-[#265d49]">Review privacy <ChevronRight className="size-4" aria-hidden="true" /></Button>
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

function ParentView() {
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
            <Button className="rounded-full"><Check className="size-4" aria-hidden="true" /> I can help</Button>
            <Button variant="outline" className="rounded-full">Suggest 8:00</Button>
            <Button variant="ghost" className="rounded-full">Not tonight</Button>
          </div>
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

function HelpCardDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
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
              <Button onClick={() => setSent(true)} className="rounded-full">Share this Help Card <ArrowRight className="size-4" /></Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function TenderLoopDemo() {
  const [role, setRole] = useState<Role>("student");
  const [helpOpen, setHelpOpen] = useState(false);
  const copy = roleCopy[role];

  return (
    <main className="min-h-screen">
      <header className="border-b border-black/5 bg-[#f9f6f0]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-[#265d49] text-white"><HandHeart className="size-5" aria-hidden="true" /></div>
            <div><p className="text-base font-bold tracking-tight">TenderLoop</p><p className="text-xs text-muted-foreground">from nagging to navigating</p></div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border bg-white/70 px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex"><ShieldCheck className="size-4 text-[#347259]" aria-hidden="true" /> Student-first privacy</div>
          <Button variant="ghost" size="icon" aria-label="More options"><MoreHorizontal className="size-5" /></Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
        <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#527365]">{copy.eyebrow}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{copy.title}</h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">{copy.description}</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Demo perspective</p>
            <Tabs value={role} onValueChange={(value) => setRole(value as Role)}>
              <TabsList className="h-auto rounded-full bg-[#e6e2d9] p-1">
                {roles.map((item) => <TabsTrigger key={item.id} value={item.id} className="min-h-10 rounded-full px-4"><span className="hidden sm:inline">{item.label} · </span>{item.person}</TabsTrigger>)}
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#d5ded8] bg-[#f7faf8] px-4 py-3 text-sm">
          <Sparkles className="size-4 shrink-0 text-[#347259]" aria-hidden="true" />
          <p><span className="font-semibold">Agent activity:</span> Drafted a plan from Maya’s assignment and family calendar. No action taken without approval.</p>
        </div>

        {role === "student" ? <StudentView onShare={() => setHelpOpen(true)} /> : role === "parent" ? <ParentView /> : <CaregiverView />}

        <footer className="mt-8 flex flex-col justify-between gap-3 border-t pt-5 text-xs text-muted-foreground sm:flex-row">
          <p>TenderLoop is an AI tool, not a parent, tutor, therapist, or person.</p>
          <div className="flex gap-4"><button className="min-h-11 hover:text-foreground">Privacy agreement</button><button className="min-h-11 hover:text-foreground">Activity log</button><button className="min-h-11 hover:text-foreground">Get human help</button></div>
        </footer>
      </div>
      <HelpCardDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </main>
  );
}
