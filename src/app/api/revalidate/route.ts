import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const ALLOWED_PATHS = ["/", "/projects", "/blog", "/certificates", "/achievements"];

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const secret = process.env.REVALIDATION_SECRET;

    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { path } = body as { path?: string };

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    if (!ALLOWED_PATHS.includes(path) && !path.startsWith("/projects/") && !path.startsWith("/blog/")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    revalidatePath(path);

    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }
}
