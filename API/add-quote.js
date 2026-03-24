import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, author, adminPassword } = req.body;

    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Quote text is required" });
    }

    const { data, error } = await supabase
      .from("quotes")
      .insert([
        {
          text: text.trim(),
          author: author?.trim() || "Unknown",
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ok: true, quote: data });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
}