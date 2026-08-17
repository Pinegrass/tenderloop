import { CoachRequestSchema, runStudentCoach } from "@/lib/tenderloop-agent";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (contentLength > 8_192) {
    return Response.json({ error: "Request is too large." }, { status: 413 });
  }

  try {
    const payload = CoachRequestSchema.safeParse(await request.json());

    if (!payload.success) {
      return Response.json(
        { error: "Choose one difficulty and a supported study-comfort setting." },
        { status: 400 },
      );
    }

    return Response.json(await runStudentCoach(payload.data));
  } catch {
    return Response.json(
      { error: "The coach could not create a plan. Your input was not saved." },
      { status: 500 },
    );
  }
}
