import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint, subscription");

    if (error) {
      throw error;
    }

    const payload = JSON.stringify({
      title: "Your daily quote is ready",
      body: "Open QuoteFlow for today’s inspiration.",
      url: "/",
    });

    for (const row of data || []) {
      try {
        await webpush.sendNotification(row.subscription, payload);
      } catch (err) {
        console.error("Push failed for subscription", row.id, err?.statusCode || err);

        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("id", row.id);
        }
      }
    }

    return res.status(200).json({ ok: true, sent: (data || []).length });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to send push notifications" });
  }
}