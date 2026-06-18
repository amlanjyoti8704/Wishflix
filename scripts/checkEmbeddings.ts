import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // 1. Total media count
  const { count: totalCount } = await supabase
    .from("media")
    .select("*", { count: "exact", head: true });

  console.log("Total media rows:", totalCount);

  // 2. Fetch a few rows and check embedding column
  const { data, error } = await supabase
    .from("media")
    .select("id, title, embedding")
    .limit(3);

  if (error) {
    console.error("Query error:", error);
    return;
  }

  for (const row of data ?? []) {
    const emb = row.embedding;
    console.log(`\n--- ${row.title} (${row.id}) ---`);
    console.log("  embedding is null?", emb === null);
    if (emb) {
      console.log("  embedding type:", typeof emb);
      console.log("  is array?", Array.isArray(emb));
      console.log("  length:", Array.isArray(emb) ? emb.length : "N/A");
    }
  }
}

main();
