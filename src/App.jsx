import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const fallbackQuotes = [
  {
    id: "fallback-1",
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    id: "fallback-2",
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
  },
  {
    id: "fallback-3",
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
  },
  {
    id: "fallback-4",
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
  },
  {
    id: "fallback-5",
    text: "Do not wait to strike till the iron is hot, but make it hot by striking.",
    author: "William Butler Yeats",
  },
];

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export default function App() {
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [quoteMessage, setQuoteMessage] = useState("");

  const [pushLoading, setPushLoading] = useState(false);
  const [pushMessage, setPushMessage] = useState("");

  const [showAdmin, setShowAdmin] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState("");
  const [newQuoteAuthor, setNewQuoteAuthor] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");

  useEffect(() => {
    loadQuotes();
  }, []);

  async function loadQuotes() {
    setLoadingQuotes(true);
    setQuoteMessage("");

    try {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Supabase quote load error:", error);
        setQuotes(fallbackQuotes);
        setCurrentQuote(getRandomQuote(fallbackQuotes));
        setQuoteMessage("Using fallback quotes.");
        return;
      }

      if (!data || data.length === 0) {
        setQuotes(fallbackQuotes);
        setCurrentQuote(getRandomQuote(fallbackQuotes));
        setQuoteMessage("No database quotes found. Using fallback quotes.");
        return;
      }

      setQuotes(data);
      setCurrentQuote(getRandomQuote(data));
    } catch (error) {
      console.error("Quote load error:", error);
      setQuotes(fallbackQuotes);
      setCurrentQuote(getRandomQuote(fallbackQuotes));
      setQuoteMessage("Could not load database quotes. Using fallback quotes.");
    } finally {
      setLoadingQuotes(false);
    }
  }

  function getRandomQuote(quoteList) {
    if (!quoteList || quoteList.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * quoteList.length);
    return quoteList[randomIndex];
  }

  function showAnotherQuote() {
    if (!quotes || quotes.length === 0) return;

    if (quotes.length === 1) {
      setCurrentQuote(quotes[0]);
      return;
    }

    let nextQuote = getRandomQuote(quotes);

    while (nextQuote?.id === currentQuote?.id) {
      nextQuote = getRandomQuote(quotes);
    }

    setCurrentQuote(nextQuote);
  }

  async function enablePushNotifications() {
    setPushLoading(true);
    setPushMessage("");

    try {
      if (!("serviceWorker" in navigator)) {
        setPushMessage("This browser does not support service workers.");
        return;
      }

      if (!("PushManager" in window)) {
        setPushMessage("This browser does not support push notifications.");
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setPushMessage("Notification permission was not granted.");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const existingSubscription = await registration.pushManager.getSubscription();

      let subscription = existingSubscription;

      if (!subscription) {
        const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

        if (!vapidPublicKey) {
          setPushMessage("Missing VAPID public key.");
          return;
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      }

      const response = await fetch("/api/save-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      const result = await response.json();

      if (!response.ok) {
        setPushMessage(result.error || "Failed to save subscription.");
        return;
      }

      setPushMessage("Push notifications enabled.");
    } catch (error) {
      console.error("enablePushNotifications error:", error);
      setPushMessage("Something went wrong while enabling notifications.");
    } finally {
      setPushLoading(false);
    }
  }

  async function handleAddQuote() {
    setAdminMessage("");

    if (!newQuoteText.trim()) {
      setAdminMessage("Please enter a quote.");
      return;
    }

    if (!adminPassword.trim()) {
      setAdminMessage("Please enter the admin password.");
      return;
    }

    try {
      setAdminLoading(true);

      const response = await fetch("/api/add-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newQuoteText,
          author: newQuoteAuthor,
          adminPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setAdminMessage(result.error || "Failed to add quote.");
        return;
      }

      setAdminMessage("Quote added successfully.");

      const addedQuote = result.quote;

      if (addedQuote) {
        const updatedQuotes = [...quotes, addedQuote];
        setQuotes(updatedQuotes);
        setCurrentQuote(addedQuote);
      }

      setNewQuoteText("");
      setNewQuoteAuthor("");
    } catch (error) {
      console.error("Add quote error:", error);
      setAdminMessage("Something went wrong while adding the quote.");
    } finally {
      setAdminLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "20px 16px 40px",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px 20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "28px",
                lineHeight: 1.2,
              }}
            >
              QuoteFlow
            </h1>
            <p
              style={{
                margin: "8px 0 0",
                color: "#6b7280",
                fontSize: "15px",
              }}
            >
              Daily motivation, mobile-first.
            </p>
          </div>

          {loadingQuotes ? (
            <div
              style={{
                padding: "30px 16px",
                textAlign: "center",
                fontSize: "16px",
              }}
            >
              Loading quote...
            </div>
          ) : (
            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "24px 18px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  lineHeight: 1.5,
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                “{currentQuote?.text || "No quote available."}”
              </div>

              <div
                style={{
                  fontSize: "16px",
                  color: "#4b5563",
                }}
              >
                — {currentQuote?.author || "Unknown"}
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <button
              onClick={showAnotherQuote}
              disabled={loadingQuotes || !quotes.length}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "12px",
                background: "#111827",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                opacity: loadingQuotes ? 0.7 : 1,
              }}
            >
              Show Another Quote
            </button>

            <button
              onClick={enablePushNotifications}
              disabled={pushLoading}
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                background: "#ffffff",
                color: "#111827",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                opacity: pushLoading ? 0.7 : 1,
              }}
            >
              {pushLoading ? "Enabling..." : "Enable Push Notifications"}
            </button>
          </div>

          {(quoteMessage || pushMessage) && (
            <div
              style={{
                marginTop: "16px",
                fontSize: "14px",
                color: "#374151",
                textAlign: "center",
              }}
            >
              {quoteMessage && <div>{quoteMessage}</div>}
              {pushMessage && <div style={{ marginTop: quoteMessage ? "6px" : 0 }}>{pushMessage}</div>}
            </div>
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
            }}
          >
            {showAdmin ? "Hide Admin" : "Show Admin"}
          </button>

          {showAdmin && (
            <div
              style={{
                marginTop: "14px",
                padding: "18px",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                background: "#ffffff",
                boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "20px" }}>Admin Quote Entry</h3>

              <textarea
                value={newQuoteText}
                onChange={(e) => setNewQuoteText(e.target.value)}
                placeholder="Enter quote text"
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />

              <input
                type="text"
                value={newQuoteAuthor}
                onChange={(e) => setNewQuoteAuthor(e.target.value)}
                placeholder="Enter author name"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />

              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />

              <button
                onClick={handleAddQuote}
                disabled={adminLoading}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#111827",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  opacity: adminLoading ? 0.7 : 1,
                }}
              >
                {adminLoading ? "Saving..." : "Add Quote"}
              </button>

              {adminMessage && (
                <div
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                  }}
                >
                  {adminMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}