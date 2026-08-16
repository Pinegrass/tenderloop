# TenderLoop manifesto

## From nagging to navigating

TenderLoop is a family coordination agent that helps a student make a plan, ask for the right kind of help, and lets caring adults show up without turning support into surveillance.

It does not define what a family should look like. It lets each family describe its circle of care, then gives every person only the context and authority they need—while preserving the student’s growing autonomy, privacy, and safety.

## The problem

Homework friction is rarely just a knowledge problem. A student can be overwhelmed by where to begin. A parent can see a deadline but not know what kind of support would help. A temporary caregiver can need today’s logistics without needing access to school history. Ordinary family coordination gets scattered across messages, calendars, school notices, and repeated reminders.

Most products choose one of two unhelpful extremes: a generic tutor that ignores the family around the learner, or a parent dashboard that turns care into monitoring. TenderLoop creates a third path: private student support connected to explicit, consent-mediated family coordination.

## The promise

TenderLoop will:

- strengthen human relationships rather than imitate or replace them;
- treat the student as an active participant, not an object being managed;
- distinguish legal authority, day-to-day caregiving, and data visibility;
- keep private conversations private by default;
- make every shared object previewable, attributable, time-bounded, and revocable;
- teach with questions, hints, and analogous examples rather than produce submit-ready schoolwork;
- make plans smaller, recover from disruption without blame, and surface only real decisions;
- show what the agent is doing, why it is doing it, and who must approve it;
- use configurable family context instead of assuming a nuclear family or one “Western” norm;
- defer safety-critical judgment to trusted humans and jurisdiction-appropriate support.

TenderLoop will not:

- behave as an AI parent, friend, therapist, disciplinarian, or secret confidant;
- expose raw student chats, inferred moods, behavior scores, or engagement rankings;
- infer a diagnosis, family role, custody arrangement, or cultural norm;
- contact a school, alter a consequential schedule, or share student information without required approval;
- grant a babysitter or temporary caregiver general account access;
- reward dependence, maximize screen time, or use shame to drive compliance.

## One product, three bounded experiences

### Student Coach

The student owns the study interaction. The coach asks what is hard—starting, understanding, or finding time—then proposes a short plan. Tutoring is Socratic. The student approves plans, reminders, saved preferences, and Help Cards before they become shared family objects.

The student may also choose functional wellbeing accommodations such as low-energy pacing, screen-light work, longer transitions, movement breaks, reduced sensory load, or a pause-and-contact-human action. TenderLoop adapts the plan to the requested accommodation without inferring or requiring a diagnosis.

### Parent Guide

The parent receives exception-only decision cards and help requests written and approved by the student. The guide suggests a warm, autonomy-supportive response and one practical action. It does not provide a transcript, emotional assessment, or surveillance feed.

### Caregiver Pass

A babysitter, relative, or trusted adult receives a narrow, expiring view of today’s authorized logistics. They can acknowledge a handoff, report an exception, or request a parent decision. They cannot browse academic history, private conversations, grades, or future schedules.

## The shared-object boundary

Agents do not talk across roles behind the family’s back. Coordination happens through explicit objects: study plans, approved calendar blocks and reminders, Help Cards, parent decision cards, Caregiver Passes, explicitly saved preference cards, and consent receipts and audit events.

Every shared object answers six questions: who can see it, what they see, why it is needed, how long access lasts, who approved it, and how it can be changed or withdrawn.

## Family context engine

The engine models a configurable circle of care rather than a presumed household structure. Its context includes jurisdiction and locale, student age band and preferences, people and user-defined relationships, separate households, residence schedules, operational roles, verified or claimed legal authority, scoped care grants, education context, sharing policy, a co-created family working agreement, and provenance and retention metadata.

Hard constraints stay distinct from negotiable preferences such as session length or reminder tone. Conflicts trigger a human decision; the agent never mediates custody or silently chooses an adult’s account over the student’s voice.

## Safety and privacy architecture

Authorization is deterministic and outside the language model. A verified identity, family membership, server-resolved role, object scope, consent artifact, current version, and idempotency key gate every consequential tool call. The model may propose; policy decides who may approve; typed tools enforce the result.

Student chats use short-term session memory only. Durable memory is limited to explicit, editable preference cards. Raw prompt bodies and private chats do not enter shared audit logs. Caregiver invites use opaque, single-use, expiring tokens and never expand automatically.

Safety combines deterministic policy, content guardrails, academic-integrity checks, PII controls, typed validation, human handoff, and specialist-reviewed escalation rules. The product never promises secrecy in a crisis and never assumes that the registered guardian is always the safe adult.

## Health and wellbeing boundary

TenderLoop supports health concerns only where they affect safe participation in study and family coordination. It is an accommodation and human-handoff layer, not a medical or mental-health product.

The agent may:

- let a student privately select functional needs such as shorter sessions, screen-light work, reduced reminders, movement breaks, rest, or contacting a trusted person;
- adapt a study plan around a student-entered appointment or unavailable period without asking for a diagnosis;
- help the student compose a minimal disclosure such as “I need a lighter plan tonight” or “Please help me contact the school nurse”;
- surface established emergency instructions created by the family and reviewed by an appropriate professional;
- provide a prominent route to a trusted adult, school counselor, clinician, emergency service, or jurisdiction-appropriate helpline.

The agent may not:

- diagnose, triage, interpret symptoms, recommend medication, change treatment, or provide reassurance that a condition is harmless;
- infer depression, anxiety, ADHD, eating disorders, substance use, disability, pain, fatigue, or risk from conversation patterns;
- create health or mood scores, predict compliance, or use health information to rank a student;
- disclose a diagnosis or health narrative when a functional accommodation is sufficient;
- automatically notify the registered parent when that person may be unsafe;
- substitute engagement with the agent for professional or human support.

Health-related content is sensitive by default, separately consented, minimized, encrypted, access-logged, and retained for the shortest useful period. A student-facing preview must show the exact functional information being shared and must distinguish ordinary accommodation sharing from disclosed safety exceptions.

## Success

TenderLoop measures less repeated prompting, shorter time from overwhelm to starting, more student-initiated requests for specific help, more plans recovered after disruption, fewer unnecessary parent alerts, strong comprehension of who can see what, and zero unauthorized disclosure in testing.

We will not optimize for conversation length, daily streaks, dependency, or screen time.

## Hackathon focus

The first demonstration follows Maya, 14, through one after-school science project: TenderLoop turns an assignment into a child-approved 20-minute plan, refuses to do graded work, replans around soccer without blame, sends Dad an exact Help Card chosen by Maya, gives Alex a time-limited Caregiver Pass, and proves that neither adult can see Maya’s private study conversation.

That journey is the product in miniature: useful agency, real-world action, visible consent, bounded memory, and human care strengthened rather than automated away.
