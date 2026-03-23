import React, { useEffect, useMemo, useState } from "react";
import {
  Heart,
  ThumbsDown,
  RefreshCw,
  CalendarDays,
  Sparkles,
  Star,
  Search,
  Home,
  BookOpen,
  Bookmark,
} from "lucide-react";
import { supabase } from "./supabase";

const USE_SUPABASE = true;

const QUOTES = [
  {
    id: 1,
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "History",
    tags: ["perseverance", "courage", "resilience"],
  },
  {
    id: 2,
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "History",
    tags: ["perseverance", "consistency", "discipline"],
  },
  {
    id: 3,
    text: "I've failed over and over and over again in my life. And that is why I succeed.",
    author: "Michael Jordan",
    category: "Athletics",
    tags: ["failure", "perseverance", "excellence"],
  },
  {
    id: 4,
    text: "Hard days are the best because that's when champions are made.",
    author: "Gabby Douglas",
    category: "Athletics",
    tags: ["grit", "hard work", "champions"],
  },
  {
    id: 5,
    text: "Whether you think you can, or you think you can't—you're right.",
    author: "Henry Ford",
    category: "Business",
    tags: ["mindset", "belief", "execution"],
  },
  {
    id: 6,
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "Entrepreneurship",
    tags: ["action", "execution", "focus"],
  },
  {
    id: 7,
    text: "Do not be embarrassed by your failures, learn from them and start again.",
    author: "Richard Branson",
    category: "Entrepreneurship",
    tags: ["failure", "learning", "resilience"],
  },
  {
    id: 8,
    text: "You may encounter many defeats, but you must not be defeated.",
    author: "Maya Angelou",
    category: "Motivational",
    tags: ["perseverance", "strength", "resilience"],
  },
  {
    id: 9,
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    category: "History",
    tags: ["determination", "possibility", "progress"],
  },
  {
    id: 10,
    text: "Fall seven times and stand up eight.",
    author: "Japanese Proverb",
    category: "Motivational",
    tags: ["perseverance", "resilience", "grit"],
  },
  {
    id: 11,
    text: "Pressure is a privilege.",
    author: "Billie Jean King",
    category: "Athletics",
    tags: ["pressure", "mindset", "competition"],
  },
  {
    id: 12,
    text: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    category: "Business",
    tags: ["purpose", "focus", "authenticity"],
  },
  {
    id: 13,
    text: "Energy and persistence conquer all things.",
    author: "Benjamin Franklin",
    category: "History",
    tags: ["persistence", "effort", "achievement"],
  },
  {
    id: 14,
    text: "A champion is defined not by their wins but by how they can recover when they fall.",
    author: "Serena Williams",
    category: "Athletics",
    tags: ["comeback", "resilience", "champions"],
  },
  {
    id: 15,
    text: "Dream big. Start small. But most of all, start.",
    author: "Simon Sinek",
    category: "Motivational",
    tags: ["action", "growth", "entrepreneurship"],
  },
  {
    id: 16,
    text: "I never dreamed about success. I worked for it.",
    author: "Estée Lauder",
    category: "Business",
    tags: ["work ethic", "success", "discipline"],
  },
  {
    id: 17,
    text: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    category: "Athletics",
    tags: ["action", "risk", "confidence"],
  },
  {
    id: 18,
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
    category: "History",
    tags: ["action", "discipline", "future"],
  },
  {
    id: 19,
    text: "Don’t count the days, make the days count.",
    author: "Muhammad Ali",
    category: "Athletics",
    tags: ["urgency", "focus", "greatness"],
  },
  {
    id: 20,
    text: "If you really look closely, most overnight successes took a long time.",
    author: "Steve Jobs",
    category: "Entrepreneurship",
    tags: ["patience", "success", "consistency"],
  },
  {
    id: 21,
    text: "I am not a product of my circumstances. I am a product of my decisions.",
    author: "Stephen Covey",
    category: "Business",
    tags: ["ownership", "discipline", "mindset"],
  },
  {
    id: 22,
    text: "The harder the battle, the sweeter the victory.",
    author: "Les Brown",
    category: "Motivational",
    tags: ["perseverance", "victory", "grit"],
  },
  {
    id: 23,
    text: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.",
    author: "John C. Maxwell",
    category: "Leadership",
    tags: ["discipline", "consistency", "growth"],
  },
  {
    id: 24,
    text: "Champions keep playing until they get it right.",
    author: "Billie Jean King",
    category: "Athletics",
    tags: ["perseverance", "practice", "champions"],
  },
  {
    id: 25,
    text: "Act as if what you do makes a difference. It does.",
    author: "William James",
    category: "Motivational",
    tags: ["purpose", "action", "impact"],
  },
  {
    id: 26,
    text: "The only place where success comes before work is in the dictionary.",
    author: "Vidal Sassoon",
    category: "Business",
    tags: ["work ethic", "success", "discipline"],
  },
  {
    id: 27,
    text: "If you are going through hell, keep going.",
    author: "Winston Churchill",
    category: "History",
    tags: ["perseverance", "courage", "grit"],
  },
  {
    id: 28,
    text: "It’s not whether you get knocked down, it’s whether you get up.",
    author: "Vince Lombardi",
    category: "Athletics",
    tags: ["resilience", "comeback", "perseverance"],
  },
  {
    id: 29,
    text: "Done is better than perfect.",
    author: "Sheryl Sandberg",
    category: "Business",
    tags: ["action", "execution", "simplicity"],
  },
  {
    id: 30,
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
    category: "Leadership",
    tags: ["discipline", "focus", "priorities"],
  },
  {
    id: 31,
    text: "Great things are done by a series of small things brought together.",
    author: "Vincent van Gogh",
    category: "History",
    tags: ["consistency", "process", "growth"],
  },
  {
    id: 32,
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill",
    category: "History",
    tags: ["failure", "resilience", "mindset"],
  },
  {
    id: 33,
    text: "You have to expect things of yourself before you can do them.",
    author: "Michael Jordan",
    category: "Athletics",
    tags: ["belief", "confidence", "mindset"],
  },
  {
    id: 34,
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "Motivational",
    tags: ["action", "momentum", "focus"],
  },
  {
    id: 35,
    text: "A year from now you may wish you had started today.",
    author: "Karen Lamb",
    category: "Motivational",
    tags: ["action", "urgency", "growth"],
  },
  {
    id: 36,
    text: "Make each day your masterpiece.",
    author: "John Wooden",
    category: "Athletics",
    tags: ["daily habits", "discipline", "greatness"],
  },
  {
    id: 37,
    text: "One day or day one. You decide.",
    author: "Paulo Coelho",
    category: "Motivational",
    tags: ["action", "decision", "ownership"],
  },
  {
    id: 38,
    text: "The successful warrior is the average man, with laser-like focus.",
    author: "Bruce Lee",
    category: "Athletics",
    tags: ["focus", "discipline", "execution"],
  },
  {
    id: 39,
    text: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    category: "Leadership",
    tags: ["resourcefulness", "action", "ownership"],
  },
  {
    id: 40,
    text: "Opportunities don't happen. You create them.",
    author: "Chris Grosser",
    category: "Entrepreneurship",
    tags: ["action", "initiative", "growth"],
  },
  {
    id: 41,
    text: "It’s hard to beat a person who never gives up.",
    author: "Babe Ruth",
    category: "Athletics",
    tags: ["perseverance", "grit", "competition"],
  },
  {
    id: 42,
    text: "Courage doesn’t always roar. Sometimes courage is the quiet voice at the end of the day saying, ‘I will try again tomorrow.’",
    author: "Mary Anne Radmacher",
    category: "Motivational",
    tags: ["courage", "perseverance", "hope"],
  },
  {
    id: 43,
    text: "Build your own dreams, or someone else will hire you to build theirs.",
    author: "Farrah Gray",
    category: "Entrepreneurship",
    tags: ["ownership", "entrepreneurship", "purpose"],
  },
  {
    id: 44,
    text: "Excellence is not a singular act but a habit. You are what you repeatedly do.",
    author: "Will Durant",
    category: "Leadership",
    tags: ["habits", "discipline", "excellence"],
  },
  {
    id: 45,
    text: "To improve is to change; to be perfect is to change often.",
    author: "Winston Churchill",
    category: "History",
    tags: ["adaptation", "growth", "improvement"],
  },
];

const STORAGE_KEYS = {
  preferences: "quote-app-preferences",
  history: "quote-app-history",
  lastQuoteDate: "quote-app-last-date",
  currentQuoteId: "quote-app-current-id",
  favorites: "quote-app-favorites",
  reactions: "quote-app-reactions",
};

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;
}

function dateSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function scoreQuote(quote, preferences, reactions, history) {
  let score = 0;

  score += (preferences.categories?.[quote.category] || 0) * 3;
  score += (reactions.likesByCategory?.[quote.category] || 0) * 2;
  score -= (reactions.dislikesByCategory?.[quote.category] || 0) * 3;

  quote.tags.forEach((tag) => {
    score += (preferences.tags?.[tag] || 0) * 2;
    score += (reactions.likesByTag?.[tag] || 0) * 1.5;
    score -= (reactions.dislikesByTag?.[tag] || 0) * 2;
  });

  score += (reactions.likesByAuthor?.[quote.author] || 0) * 2;
  score -= (reactions.dislikesByAuthor?.[quote.author] || 0) * 2.5;

  const last10 = history.slice(-10);
  if (last10.includes(quote.id)) score -= 25;

  return score;
}

function pickDailyQuote(
  quotes,
  preferences,
  reactions,
  history,
  todayKey,
  filters = {}
) {
  const seed = dateSeed(todayKey);
  let pool = [...quotes];

  if (filters.category && filters.category !== "All") {
    pool = pool.filter((quote) => quote.category === filters.category);
  }

  if (filters.author && filters.author !== "All") {
    pool = pool.filter((quote) => quote.author === filters.author);
  }

  if (filters.search) {
    const query = filters.search.toLowerCase();
    pool = pool.filter(
      (quote) =>
        quote.text.toLowerCase().includes(query) ||
        quote.author.toLowerCase().includes(query) ||
        quote.category.toLowerCase().includes(query) ||
        quote.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  if (!pool.length) return quotes[0];

  const scored = pool.map((quote) => ({
    ...quote,
    adaptiveScore: scoreQuote(quote, preferences, reactions, history),
  }));

  scored.sort((a, b) => {
    if (b.adaptiveScore !== a.adaptiveScore) {
      return b.adaptiveScore - a.adaptiveScore;
    }
    return ((a.id * 9301 + seed) % 233280) - ((b.id * 9301 + seed) % 233280);
  });

  const recentIds = history.slice(-7);
  const unseenPreferred = scored.filter((quote) => !recentIds.includes(quote.id));

  return unseenPreferred[0] || scored[0] || quotes[0];
}

function App() {
  const [preferences, setPreferences] = useState({ categories: {}, tags: {} });
  const [history, setHistory] = useState([]);
  const [todayKey, setTodayKey] = useState(getTodayKey());
  const [currentQuoteId, setCurrentQuoteId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [reactions, setReactions] = useState({
    likesByAuthor: {},
    dislikesByAuthor: {},
    likesByCategory: {},
    dislikesByCategory: {},
    likesByTag: {},
    dislikesByTag: {},
  });
  const [activeTab, setActiveTab] = useState("daily");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [authorFilter, setAuthorFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [syncStatus, setSyncStatus] = useState("Syncing off");

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [pushEnabled, setPushEnabled] = useState(false);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(QUOTES.map((q) => q.category))).sort()],
    []
  );

  const authors = useMemo(
    () => ["All", ...Array.from(new Set(QUOTES.map((q) => q.author))).sort()],
    []
  );

  useEffect(() => {
    const savedPrefs = safeRead(STORAGE_KEYS.preferences, {
      categories: {},
      tags: {},
    });
    const savedHistory = safeRead(STORAGE_KEYS.history, []);
    const savedFavorites = safeRead(STORAGE_KEYS.favorites, []);
    const savedReactions = safeRead(STORAGE_KEYS.reactions, {
      likesByAuthor: {},
      dislikesByAuthor: {},
      likesByCategory: {},
      dislikesByCategory: {},
      likesByTag: {},
      dislikesByTag: {},
    });

    const savedDate = localStorage.getItem(STORAGE_KEYS.lastQuoteDate);
    const savedQuoteId = Number(localStorage.getItem(STORAGE_KEYS.currentQuoteId));
    const liveTodayKey = getTodayKey();

    setPreferences(savedPrefs);
    setHistory(savedHistory);
    setFavorites(savedFavorites);
    setReactions(savedReactions);
    setTodayKey(liveTodayKey);

    if (savedDate === liveTodayKey && savedQuoteId) {
      setCurrentQuoteId(savedQuoteId);
    } else {
      const nextQuote = pickDailyQuote(
        QUOTES,
        savedPrefs,
        savedReactions,
        savedHistory,
        liveTodayKey
      );
      setCurrentQuoteId(nextQuote.id);
      localStorage.setItem(STORAGE_KEYS.lastQuoteDate, liveTodayKey);
      localStorage.setItem(STORAGE_KEYS.currentQuoteId, String(nextQuote.id));
    }
  }, []);

  useEffect(() => {
    const savedEnabled = localStorage.getItem("reminder-enabled");
    const savedTime = localStorage.getItem("reminder-time");

    if (savedEnabled !== null) {
      setReminderEnabled(savedEnabled === "true");
    }

    if (savedTime) {
      setReminderTime(savedTime);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.reactions, JSON.stringify(reactions));
  }, [reactions]);

  useEffect(() => {
    localStorage.setItem("reminder-enabled", reminderEnabled);
    localStorage.setItem("reminder-time", reminderTime);
  }, [reminderEnabled, reminderTime]);

  useEffect(() => {
    if (!reminderEnabled) return undefined;

    const interval = setInterval(() => {
      const now = new Date();
      const [hours, minutes] = reminderTime.split(":");

      if (
        now.getHours() === parseInt(hours, 10) &&
        now.getMinutes() === parseInt(minutes, 10)
      ) {
        alert("Your daily quote is ready 🔥");
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [reminderEnabled, reminderTime]);

  useEffect(() => {
    if (!USE_SUPABASE || !supabase) return;
    syncAllToSupabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences, history, favorites, reactions]);

  useEffect(() => {
    async function checkPushStatus() {
      if (!("serviceWorker" in navigator)) return;

      try {
        const registration = await navigator.serviceWorker.getRegistration("/sw.js");
        if (!registration) return;

        const subscription = await registration.pushManager.getSubscription();
        setPushEnabled(!!subscription);
      } catch (error) {
        console.error(error);
      }
    }

    checkPushStatus();
  }, []);

  const currentQuote = useMemo(() => {
    return QUOTES.find((quote) => quote.id === currentQuoteId) || QUOTES[0];
  }, [currentQuoteId]);

  const filteredQuotes = useMemo(() => {
    return QUOTES.filter((quote) => {
      const categoryMatch =
        categoryFilter === "All" || quote.category === categoryFilter;
      const authorMatch = authorFilter === "All" || quote.author === authorFilter;

      const query = searchText.trim().toLowerCase();
      const searchMatch =
        !query ||
        quote.text.toLowerCase().includes(query) ||
        quote.author.toLowerCase().includes(query) ||
        quote.category.toLowerCase().includes(query) ||
        quote.tags.some((tag) => tag.toLowerCase().includes(query));

      return categoryMatch && authorMatch && searchMatch;
    });
  }, [categoryFilter, authorFilter, searchText]);

  const favoriteQuotes = useMemo(() => {
    return QUOTES.filter((quote) => favorites.includes(quote.id));
  }, [favorites]);

  const preferenceSummary = useMemo(() => {
    const topCategories = Object.entries(preferences.categories || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .filter(([, value]) => value > 0);

    const topTags = Object.entries(preferences.tags || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .filter(([, value]) => value > 0);

    return { topCategories, topTags };
  }, [preferences]);

  function updatePreferences(quote, delta) {
    setPreferences((prev) => {
      const next = {
        categories: { ...(prev.categories || {}) },
        tags: { ...(prev.tags || {}) },
      };

      next.categories[quote.category] =
        (next.categories[quote.category] || 0) + delta;

      quote.tags.forEach((tag) => {
        next.tags[tag] = (next.tags[tag] || 0) + delta;
      });

      return next;
    });
  }

  function updateReactionBuckets(quote, type) {
    const isLike = type === "like";

    setReactions((prev) => {
      const next = {
        likesByAuthor: { ...(prev.likesByAuthor || {}) },
        dislikesByAuthor: { ...(prev.dislikesByAuthor || {}) },
        likesByCategory: { ...(prev.likesByCategory || {}) },
        dislikesByCategory: { ...(prev.dislikesByCategory || {}) },
        likesByTag: { ...(prev.likesByTag || {}) },
        dislikesByTag: { ...(prev.dislikesByTag || {}) },
      };

      if (isLike) {
        next.likesByAuthor[quote.author] =
          (next.likesByAuthor[quote.author] || 0) + 1;
        next.likesByCategory[quote.category] =
          (next.likesByCategory[quote.category] || 0) + 1;
        quote.tags.forEach((tag) => {
          next.likesByTag[tag] = (next.likesByTag[tag] || 0) + 1;
        });
      } else {
        next.dislikesByAuthor[quote.author] =
          (next.dislikesByAuthor[quote.author] || 0) + 1;
        next.dislikesByCategory[quote.category] =
          (next.dislikesByCategory[quote.category] || 0) + 1;
        quote.tags.forEach((tag) => {
          next.dislikesByTag[tag] = (next.dislikesByTag[tag] || 0) + 1;
        });
      }

      return next;
    });
  }

  function recordReaction(type) {
    if (!currentQuote) return;

    const delta = type === "like" ? 1 : -1;
    updatePreferences(currentQuote, delta);
    updateReactionBuckets(currentQuote, type);
    setHistory((prev) => [...prev, currentQuote.id]);
  }

  function handleLike() {
    recordReaction("like");
  }

  function handleDislike() {
    recordReaction("dislike");

    const nextQuote = pickDailyQuote(
      QUOTES.filter((quote) => quote.id !== currentQuote.id),
      preferences,
      reactions,
      [...history, currentQuote.id],
      `${todayKey}-alt-${Date.now()}`,
      {
        category: categoryFilter,
        author: authorFilter,
        search: searchText,
      }
    );

    setCurrentQuoteId(nextQuote.id);
    localStorage.setItem(STORAGE_KEYS.currentQuoteId, String(nextQuote.id));
  }

  function refreshQuote() {
    const nextQuote = pickDailyQuote(
      QUOTES.filter((quote) => quote.id !== currentQuote.id),
      preferences,
      reactions,
      [...history, currentQuote.id],
      `${todayKey}-${Date.now()}`,
      {
        category: categoryFilter,
        author: authorFilter,
        search: searchText,
      }
    );

    setCurrentQuoteId(nextQuote.id);
    localStorage.setItem(STORAGE_KEYS.currentQuoteId, String(nextQuote.id));
  }

  function toggleFavorite(id) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i += 1) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  async function enablePushNotifications() {
    try {
      if (!("serviceWorker" in navigator)) {
        alert("Service workers are not supported on this device/browser.");
        return;
      }

      if (!("PushManager" in window)) {
        alert("Push notifications are not supported on this device/browser.");
        return;
      }

      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        alert("Missing VITE_VAPID_PUBLIC_KEY in your environment variables.");
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        alert("Notification permission was not granted.");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");

      const existingSubscription = await registration.pushManager.getSubscription();

      let subscription = existingSubscription;

      if (!subscription) {
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

      if (!response.ok) {
        throw new Error("Failed to save subscription");
      }

      setPushEnabled(true);
      alert("Push notifications are enabled.");
    } catch (error) {
      console.error(error);
      alert("Could not enable push notifications.");
    }
  }

  async function syncAllToSupabase() {
    if (!USE_SUPABASE || !supabase) return;

    try {
      setSyncStatus("Syncing...");
      const payload = {
        profile_key: "default-user",
        preferences,
        history,
        favorites,
        reactions,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("quote_user_profiles")
        .upsert(payload, { onConflict: "profile_key" });

      if (error) throw error;
      setSyncStatus("Synced");
    } catch (error) {
      console.error(error);
      setSyncStatus("Sync failed");
    }
  }

  function QuoteCard({ quote, showMakeCurrent = false }) {
    return (
      <div style={styles.listCard}>
        <div style={styles.listCardTop}>
          <span style={styles.miniBadge}>{quote.category}</span>
          <button
            onClick={() => toggleFavorite(quote.id)}
            style={styles.iconButton}
            title="Toggle favorite"
          >
            <Star
              size={18}
              fill={favorites.includes(quote.id) ? "currentColor" : "none"}
            />
          </button>
        </div>

        <div style={styles.listQuote}>“{quote.text}”</div>
        <div style={styles.listAuthor}>— {quote.author}</div>

        <div style={styles.tagRow}>
          {quote.tags.map((tag) => (
            <span key={tag} style={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>

        {showMakeCurrent && (
          <button
            onClick={() => {
              setCurrentQuoteId(quote.id);
              setActiveTab("daily");
            }}
            style={styles.secondaryButton}
          >
            Make current quote
          </button>
        )}
      </div>
    );
  }

  function renderContent() {
    if (activeTab === "daily") {
      return (
        <>
          <div style={styles.heroCard}>
            <div style={styles.heroTopRow}>
              <div>
                <div style={styles.eyebrow}>Quote of the day</div>
                <div style={styles.dateText}>
                  <CalendarDays size={15} />
                  <span>{todayKey}</span>
                </div>
              </div>

              <button
                onClick={() => toggleFavorite(currentQuote?.id)}
                style={styles.heroStarButton}
                title="Toggle favorite"
              >
                <Star
                  size={20}
                  fill={favorites.includes(currentQuote?.id) ? "currentColor" : "none"}
                />
              </button>
            </div>

            <div style={styles.heroCategory}>{currentQuote?.category}</div>
            <div style={styles.heroQuote}>“{currentQuote?.text}”</div>
            <div style={styles.heroAuthor}>— {currentQuote?.author}</div>

            <div style={styles.tagRow}>
              {currentQuote?.tags.map((tag) => (
                <span key={tag} style={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div style={styles.actionPanel}>
            <button onClick={handleLike} style={styles.primaryAction}>
              <Heart size={18} />
              <span>Like</span>
            </button>

            <button onClick={handleDislike} style={styles.softAction}>
              <ThumbsDown size={18} />
              <span>Dislike</span>
            </button>

            <button
              onClick={() => toggleFavorite(currentQuote?.id)}
              style={styles.softAction}
            >
              <Star size={18} />
              <span>Favorite</span>
            </button>

            <button onClick={refreshQuote} style={styles.softAction}>
              <RefreshCw size={18} />
              <span>Another</span>
            </button>
          </div>

          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>Daily Reminder</div>

            <div style={styles.settingsRow}>
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
              />
              <span style={styles.resultsText}>Enable daily reminder</span>
            </div>

            {reminderEnabled && (
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                style={{ ...styles.input, marginTop: "10px" }}
              />
            )}
          </div>

          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>Push Notifications</div>

            <div style={styles.resultsText}>
              {pushEnabled
                ? "Push notifications are enabled."
                : "Enable a real daily notification."}
            </div>

            {!pushEnabled && (
              <button
                onClick={enablePushNotifications}
                style={{ ...styles.primaryAction, marginTop: "12px", width: "100%" }}
              >
                Enable Push Notifications
              </button>
            )}
          </div>

          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>Your taste is adapting</div>

            <div style={styles.profileSection}>
              <div style={styles.profileLabel}>Top categories</div>
              <div style={styles.badgeWrap}>
                {preferenceSummary.topCategories.length ? (
                  preferenceSummary.topCategories.map(([name, score]) => (
                    <span key={name} style={styles.profileBadge}>
                      {name} ({score})
                    </span>
                  ))
                ) : (
                  <span style={styles.mutedText}>Rate quotes to personalize your feed.</span>
                )}
              </div>
            </div>

            <div style={styles.profileSection}>
              <div style={styles.profileLabel}>Top themes</div>
              <div style={styles.badgeWrap}>
                {preferenceSummary.topTags.length ? (
                  preferenceSummary.topTags.map(([name, score]) => (
                    <span key={name} style={styles.tag}>
                      #{name} ({score})
                    </span>
                  ))
                ) : (
                  <span style={styles.mutedText}>
                    Likes and dislikes will shape future recommendations.
                  </span>
                )}
              </div>
            </div>

            <div style={styles.syncRow}>
              <Sparkles size={15} />
              <span>{syncStatus}</span>
            </div>
          </div>
        </>
      );
    }

    if (activeTab === "browse") {
      return (
        <>
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>Browse quotes</div>

            <div style={styles.filtersStack}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={styles.input}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                style={styles.input}
              >
                {authors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>

              <div style={styles.searchWrap}>
                <Search size={16} />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search quotes, authors, tags..."
                  style={styles.searchInput}
                />
              </div>
            </div>

            <div style={styles.resultsText}>{filteredQuotes.length} quotes found</div>
          </div>

          <div style={styles.listStack}>
            {filteredQuotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>Favorites</div>
          <div style={styles.resultsText}>{favoriteQuotes.length} saved quotes</div>
        </div>

        {favoriteQuotes.length ? (
          <div style={styles.listStack}>
            {favoriteQuotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} showMakeCurrent />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <Bookmark size={26} />
            <div style={styles.emptyTitle}>No favorites yet</div>
            <div style={styles.emptyText}>
              Tap the star on any quote you want to save.
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div style={styles.appShell}>
      <div style={styles.phoneFrame}>
        <div style={styles.topArea}>
          <div>
            <div style={styles.appOverline}>Daily inspiration</div>
            <h1 style={styles.appTitle}>QuoteFlow</h1>
          </div>
        </div>

        <div style={styles.contentArea}>{renderContent()}</div>

        <div style={styles.bottomNav}>
          <button
            onClick={() => setActiveTab("daily")}
            style={activeTab === "daily" ? styles.navButtonActive : styles.navButton}
          >
            <Home size={18} />
            <span>Today</span>
          </button>

          <button
            onClick={() => setActiveTab("browse")}
            style={activeTab === "browse" ? styles.navButtonActive : styles.navButton}
          >
            <BookOpen size={18} />
            <span>Browse</span>
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            style={activeTab === "favorites" ? styles.navButtonActive : styles.navButton}
          >
            <Bookmark size={18} />
            <span>Saved</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  appShell: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #0f172a 0%, #172554 35%, #eff6ff 35%, #f8fafc 100%)",
    display: "flex",
    justifyContent: "center",
    padding: "16px",
  },
  phoneFrame: {
    width: "100%",
    maxWidth: "480px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  topArea: {
    padding: "8px 4px 18px 4px",
    color: "#ffffff",
  },
  appOverline: {
    fontSize: "13px",
    opacity: 0.8,
    marginBottom: "6px",
  },
  appTitle: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  contentArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    paddingBottom: "96px",
  },
  heroCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: "28px",
    padding: "22px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
    border: "1px solid rgba(255,255,255,0.8)",
  },
  heroTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  eyebrow: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#6366f1",
    marginBottom: "6px",
  },
  dateText: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#64748b",
    fontSize: "13px",
  },
  heroStarButton: {
    width: "44px",
    height: "44px",
    borderRadius: "999px",
    border: "none",
    background: "#eef2ff",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  heroCategory: {
    marginTop: "18px",
    display: "inline-flex",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#e0e7ff",
    color: "#3730a3",
    fontSize: "13px",
    fontWeight: 700,
  },
  heroQuote: {
    marginTop: "20px",
    fontSize: "30px",
    lineHeight: 1.45,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.02em",
    wordBreak: "break-word",
  },
  heroAuthor: {
    marginTop: "18px",
    fontSize: "17px",
    fontWeight: 700,
    color: "#475569",
  },
  tagRow: {
    marginTop: "16px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#e2e8f0",
    color: "#334155",
    fontSize: "12px",
    fontWeight: 700,
  },
  actionPanel: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  primaryAction: {
    height: "54px",
    borderRadius: "18px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 800,
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(37, 99, 235, 0.25)",
  },
  softAction: {
    height: "54px",
    borderRadius: "18px",
    border: "1px solid #dbeafe",
    background: "#ffffff",
    color: "#0f172a",
    fontWeight: 700,
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
  },
  sectionCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "18px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  },
  sectionHeader: {
    fontSize: "20px",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "14px",
  },
  settingsRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  profileSection: {
    marginBottom: "14px",
  },
  profileLabel: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#64748b",
    marginBottom: "10px",
  },
  badgeWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  profileBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: 800,
  },
  mutedText: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: 1.5,
  },
  syncRow: {
    marginTop: "4px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 600,
  },
  filtersStack: {
    display: "grid",
    gap: "10px",
  },
  input: {
    width: "100%",
    height: "48px",
    borderRadius: "16px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    padding: "0 14px",
    fontSize: "15px",
    color: "#0f172a",
  },
  searchWrap: {
    height: "48px",
    borderRadius: "16px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 14px",
    color: "#64748b",
  },
  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "15px",
    color: "#0f172a",
  },
  resultsText: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: 600,
  },
  listStack: {
    display: "grid",
    gap: "12px",
  },
  listCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "18px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  },
  listCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },
  miniBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 11px",
    borderRadius: "999px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: 800,
  },
  iconButton: {
    width: "40px",
    height: "40px",
    borderRadius: "999px",
    border: "none",
    background: "#f1f5f9",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  listQuote: {
    marginTop: "14px",
    fontSize: "21px",
    lineHeight: 1.55,
    color: "#0f172a",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  listAuthor: {
    marginTop: "14px",
    fontSize: "15px",
    fontWeight: 700,
    color: "#475569",
  },
  secondaryButton: {
    marginTop: "14px",
    height: "46px",
    width: "100%",
    borderRadius: "16px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    fontWeight: 700,
    cursor: "pointer",
  },
  emptyState: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    color: "#64748b",
    gap: "10px",
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: 800,
    color: "#0f172a",
  },
  emptyText: {
    fontSize: "14px",
    lineHeight: 1.5,
  },
  bottomNav: {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: "14px",
    width: "calc(100% - 24px)",
    maxWidth: "452px",
    background: "rgba(15, 23, 42, 0.92)",
    backdropFilter: "blur(14px)",
    borderRadius: "22px",
    padding: "10px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "8px",
    boxShadow: "0 20px 30px rgba(15, 23, 42, 0.25)",
  },
  navButton: {
    height: "54px",
    borderRadius: "16px",
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.72)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },
  navButtonActive: {
    height: "54px",
    borderRadius: "16px",
    border: "none",
    background: "#ffffff",
    color: "#0f172a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    fontSize: "12px",
    fontWeight: 800,
    cursor: "pointer",
  },
};

export default App;