import { createClient } from "@supabase/supabase-js";

async function main() {
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY envs");
    process.exit(1);
  }

  const client = createClient(supabaseUrl, supabaseKey);

  // Lightweight HEAD request to touch the DB without transferring rows
  const { error } = await client
    .from("reservations")
    .select("*", { head: true, count: "exact" });

  if (error) {
    console.error("Keep-alive failed:", error);
    process.exit(1);
  }

  console.log("Supabase keep-alive ping OK");
}

main();


