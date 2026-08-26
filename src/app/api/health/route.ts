import { getPostgresPool } from "@/shared/server/postgres";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  try {
    await getPostgresPool().query("SELECT 1");
    return Response.json(
      { status: "ok" },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
