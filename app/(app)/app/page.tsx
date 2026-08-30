import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { STAGES, averageScore } from "@/lib/domain";
import { advanceAction, rejectAction } from "@/features/work/actions";
import { Button } from "@/components/ui/button";

export default async function PipelinePage() {
  const user = await requireUser();
  const db = await getDb();
  const people = await db.query<{ id: string; name: string; role_title: string; stage: string }>(
    "select id, name, role_title, stage from candidates where organization_id = $1",
    [user.organizationId],
  );
  const scores = await db.query<{ candidate_id: string; value: number }>("select candidate_id, value from scores");
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Pipeline</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {STAGES.filter((s) => s !== "rejected").map((stage) => (
          <section key={stage} className="rounded-xl border border-border bg-card p-3">
            <h2 className="text-sm font-semibold capitalize">{stage}</h2>
            <ul className="mt-3 space-y-2">
              {people.rows.filter((row) => row.stage === stage).map((row) => {
                const avg = averageScore(scores.rows.filter((s) => s.candidate_id === row.id).map((s) => s.value));
                return (
                  <li key={row.id} className="rounded-md border border-border p-2 text-sm">
                    <p>{row.name}</p>
                    <p className="text-muted-foreground">{row.role_title} · avg {avg.toFixed(1)}</p>
                    <div className="mt-2 flex gap-1">
                      <form action={advanceAction.bind(null, row.id)}><Button size="sm">Advance</Button></form>
                      <form action={rejectAction.bind(null, row.id)}><Button size="sm" variant="outline">Reject</Button></form>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
