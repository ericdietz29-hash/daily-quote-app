import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

export default async function handler(req, res) {
  try {
    if (!process.env.SUPABASE_URL) {
      return res.status(500).json({ error: "Missing SUPABASE_URL" });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" });
    }

    if (!process.env.VAPID_PUBLIC_KEY) {
      return res.status(500).json({ error: "Missing VAPID_PUBLIC_KEY" });
    }

    if (!process.env.VAPID_PRIVATE_KEY) {
      return res.status(500).json({ error: "Missing VAPID_PRIVATE_KEY" });
    }

    if (!process.env.VAPID_SUBJECT) {
      return res.status(500).json({ error: "Missing VAPID_SUBJECT" });
    }

    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint, subscription");

    if (error) {
      return res.status(500).json({ error: `Supabase select failed: ${error.message}` });
    }

    const payload = JSON.stringify({
      title: "Your daily quote is ready",
      body: "Open QuoteFlow for today’s inspiration.",
      url: "/",
    });

    let sent = 0;

    for (const row of data || []) {
      try {
        await webpush.sendNotification(row.subscription, payload);
        sent += 1;
      } catch (err) {
        console.error("Push failed for subscription", row.id, err);

        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("id", row.id);
        }
      }
    }

    return res.status(200).json({
      ok: true,
      totalSubscriptions: (data || []).length,
      sent,
    });
  } catch (error) {
    console.error("send-daily-push error:", error);
    return res.status(500).json({
      error: error.message || "Failed to send push notifications",
    });
  }
}