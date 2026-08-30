"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { advance, type Stage } from "@/lib/domain";

export async function advanceAction(id: string) {
  const user = await requireUser();
  const db = await getDb();
  const row = await db.query<{ stage: Stage }>("select stage from candidates where id = $1 and organization_id = $2", [id, user.organizationId]);
  const next = row.rows[0] ? advance(row.rows[0].stage) : null;
  if (!next) return;
  await db.query("update candidates set stage = $1 where id = $2", [next, id]);
  revalidatePath("/app");
}

export async function rejectAction(id: string) {
  const user = await requireUser();
  const db = await getDb();
  await db.query("update candidates set stage = 'rejected' where id = $1 and organization_id = $2", [id, user.organizationId]);
  revalidatePath("/app");
}
