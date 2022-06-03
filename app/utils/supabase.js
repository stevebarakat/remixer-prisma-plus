import { createClient } from "@supabase/supabase-js";

// const isServer = typeof window === "undefined";

// const supabaseUrl = isServer
//   ? process.env.SUPABASE_URL
//   : window.env.SUPABASE_URL;
// const supabaseKey = isServer
//   ? process.env.SUPABASE_KEY
//   : window.env.SUPABASE_KEY;

const supabaseUrl = "https://ioxpcmpvgermtfqxwykx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveHBjbXB2Z2VybXRmcXh3eWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTAzMzYzNzgsImV4cCI6MTk2NTkxMjM3OH0.0B-AnGPQZA9rR1JXvNYRy-3l7eeY5FUtszp9-2gl8wI";

export default createClient(supabaseUrl, supabaseKey);
