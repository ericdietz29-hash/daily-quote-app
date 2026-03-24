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
    const body = req.body || {};

    const text = typeof body.text === "string" ? body.text.trim() : "";
    const author =
      typeof body.author === "string" && body.author.trim()
        ? body.author.trim()
        : "Unknown";
    const category =
      typeof body.category === "string" && body.category.trim()
        ? body.category.trim()
        : "General";

    const adminPassword = body.adminPassword;

    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!text) {
      return res.status(400).json({ error: "Quote text is required" });
    }

    const rowToInsert = {
      text,
      author,
      category,
      tags: [],
      is_active: true,
    };

    const { data, error } = await supabase
      .from("quotes")
      .insert(rowToInsert)
      .select()
      .single();

    if (error) {
      console.error("add-quote insert error:", error);
      console.error("add-quote rowToInsert:", rowToInsert);

      return res.status(500).json({
        error: error.message,
        rowToInsert,
      });
    }

    return res.status(200).json({
      ok: true,
      quote: data,
    });
  } catch (err) {
    console.error("add-quote handler error:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}