import { PGlite } from "@electric-sql/pglite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { SCHEMA_SQL } from "../lib/db/schema-sql";
import { hashPassword } from "../lib/auth/password";

const email = "demo@hirerail.dev";
const orgId = "org_demo";
const userId = "user_demo";

async function main() {
  mkdirSync(path.join(process.cwd(), ".data"), { recursive: true });
  const db = new PGlite(path.join(process.cwd(), ".data", "pglite"));
  await db.waitReady;
  await db.exec(SCHEMA_SQL);
  const passwordHash = await hashPassword("DemoPass123!");
  await db.query("insert into users (id, email, password_hash) values ($1, $2, $3) on conflict (email) do nothing", [userId, email, passwordHash]);
  await db.query("insert into profiles (user_id, display_name) values ($1, $2) on conflict (user_id) do nothing", [userId, "Alex Demo"]);
  await db.query("insert into organizations (id, name, slug) values ($1, $2, $3) on conflict (id) do nothing", [orgId, "Quay Street Platform", "hirerail"]);
  await db.query("insert into organization_members (id, organization_id, user_id, role) values ($1, $2, $3, $4) on conflict do nothing", ["mem_1", orgId, userId, "owner"]);

  await db.query("insert into candidates (id, organization_id, name, role_title, stage) values ($1,$2,$3,$4,$5)", ["c1", orgId, "Maya Chen", "Platform engineer", "interview"]);
  await db.query("insert into candidates (id, organization_id, name, role_title, stage) values ($1,$2,$3,$4,$5)", ["c2", orgId, "Jonah Ibe", "Platform engineer", "screen"]);
  await db.query("insert into scores (id, candidate_id, dimension, value) values ($1,$2,$3,$4)", ["s1", "c1", "systems", 5]);
  await db.query("insert into scores (id, candidate_id, dimension, value) values ($1,$2,$3,$4)", ["s2", "c1", "communication", 4]);
  console.log("Seeded HireRail");
}

main();
