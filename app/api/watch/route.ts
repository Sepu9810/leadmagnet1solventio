import { NextResponse } from "next/server";

// This route has been replaced by a direct Convex mutation from the client.
// The video watch tracking is now handled by convex/videoWatches.ts
// This route is kept for backwards compatibility but returns a deprecation notice.

export async function POST() {
    return NextResponse.json(
        { ok: false, message: "Use the Convex mutation api.videoWatches.upsert instead" },
        { status: 410 }
    );
}
