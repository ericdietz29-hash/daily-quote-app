import React, { useEffect, useMemo, useState } from "react";
import {
  Heart,
  ThumbsDown,
  RefreshCw,
  CalendarDays,
  Sparkles,
  Star,
  Search,
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
  if (last10.includes(quote.id)) {
    score -= 25;
  }

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

  if (!pool.length) {
    return quotes[0];
  }

  const scored = pool.map((quote) => ({
    ...quote,
    adaptiveScore: scoreQuote(quote, preferences, reactions, history),
  }));

  scored.sort((a, b) => {
    if (b.adaptiveScore !== a.adaptiveScore) {
      return b.adaptiveScore - a.adaptiveScore;
    }
    return (
      ((a.id * 9301 + seed) % 233280) - ((b.id * 9301 + seed) % 233280)
    );
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
  const [manualMode, setManualMode] = useState(false);
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
  const [syncStatus, setSyncStatus] = useState("Local only");

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
    if (!USE_SUPABASE || !supabase) {
      return;
    }
    syncAllToSupabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences, history, favorites, reactions]);

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

  const currentQuote = useMemo(() => {
    return QUOTES.find((quote) => quote.id === currentQuoteId) || QUOTES[0];
  }, [currentQuoteId]);

  const favoriteQuotes = useMemo(() => {
    return QUOTES.filter((quote) => favorites.includes(quote.id));
  }, [favorites]);

  const preferenceSummary = useMemo(() => {
    const topCategories = Object.entries(preferences.categories || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .filter(([, value]) => value > 0);

    const topTags = Object.entries(preferences.tags || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .filter(([, value]) => value > 0);

    const topAuthors = Object.entries(reactions.likesByAuthor || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .filter(([, value]) => value > 0);

    return { topCategories, topTags, topAuthors };
  }, [preferences, reactions]);

  function updatePreferences(quote, delta) {
    setPreferences((prev) => {
      const next = {
        categories: { ...(prev.categories || {}) },
        tags: { ...(prev.tags || {}) },
      };

      next.categories[quote.category] = (next.categories[quote.category] || 0) + delta;

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
    if (!currentQuote) {
      return;
    }

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
    setManualMode(true);
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
    setManualMode(true);
    localStorage.setItem(STORAGE_KEYS.currentQuoteId, String(nextQuote.id));
  }

  function toggleFavorite(id) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function syncAllToSupabase() {
    if (!USE_SUPABASE || !supabase) {
      return;
    }

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

      if (error) {
        throw error;
      }

      setSyncStatus("Synced to Supabase");
    } catch (error) {
      console.error(error);
      setSyncStatus("Sync failed");
    }
  }

  function renderQuoteCard(quote, showMakeCurrent = false) {
    return (
      <div key={quote.id} style={styles.quoteCard}>
        <div style={styles.quoteCardHeader}>
          <span style={styles.categoryBadge}>{quote.category}</span>
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

        <div style={styles.quoteTextSmall}>“{quote.text}”</div>
        <div style={styles.authorText}>— {quote.author}</div>

        <div style={styles.tagWrap}>
          {quote.tags.map((tag) => (
            <span key={tag} style={styles.tagBadge}>
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
            Make Current Quote
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topCard}>
          <div>
            <div style={styles.smallLabel}>
              <Sparkles size={16} />
              <span>Adaptive Quote Engine</span>
            </div>
            <h1 style={styles.mainTitle}>Daily Quote App</h1>

            <div style={styles.dateRow}>
              <CalendarDays size={16} />
              <span>{todayKey}</span>
              {manualMode && <span style={styles.softBadge}>Refreshed today</span>}
              <span style={styles.outlineBadge}>{syncStatus}</span>
            </div>
          </div>

          <div style={styles.tabRow}>
            <button
              onClick={() => setActiveTab("daily")}
              style={activeTab === "daily" ? styles.primaryButton : styles.tabButton}
            >
              Daily Quote
            </button>
            <button
              onClick={() => setActiveTab("browse")}
              style={activeTab === "browse" ? styles.primaryButton : styles.tabButton}
            >
              Browse Library
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              style={
                activeTab === "favorites" ? styles.primaryButton : styles.tabButton
              }
            >
              Favorites ({favorites.length})
            </button>
          </div>
        </div>

        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            {activeTab === "daily" && (
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <div style={styles.smallLabel}>
                      <Sparkles size={16} />
                      <span>Personalized daily selection</span>
                    </div>
                    <h2 style={styles.sectionTitle}>Quote of the Day</h2>
                  </div>
                  <span style={styles.categoryBadge}>{currentQuote?.category}</span>
                </div>

                <div style={styles.featuredQuoteBox}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => toggleFavorite(currentQuote?.id)}
                      style={styles.iconButton}
                      title="Toggle favorite"
                    >
                      <Star
                        size={20}
                        fill={
                          favorites.includes(currentQuote?.id) ? "currentColor" : "none"
                        }
                      />
                    </button>
                  </div>

                  <div style={styles.featuredQuoteText}>“{currentQuote?.text}”</div>
                  <div style={styles.featuredAuthor}>— {currentQuote?.author}</div>

                  <div style={styles.tagWrap}>
                    {currentQuote?.tags.map((tag) => (
                      <span key={tag} style={styles.tagBadge}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={styles.actionGrid}>
                  <button onClick={handleLike} style={styles.primaryButtonLarge}>
                    <Heart size={18} />
                    <span>Like</span>
                  </button>

                  <button onClick={handleDislike} style={styles.secondaryButtonLarge}>
                    <ThumbsDown size={18} />
                    <span>Dislike</span>
                  </button>

                  <button
                    onClick={() => toggleFavorite(currentQuote?.id)}
                    style={styles.outlineButtonLarge}
                  >
                    <Star size={18} />
                    <span>Favorite</span>
                  </button>

                  <button onClick={refreshQuote} style={styles.outlineButtonLarge}>
                    <RefreshCw size={18} />
                    <span>Show Another</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "browse" && (
              <div style={styles.card}>
                <div style={styles.cardHeaderSimple}>
                  <h2 style={styles.sectionTitle}>Browse Quote Library</h2>
                </div>

                <div style={styles.filterGrid}>
                  <div>
                    <div style={styles.inputLabel}>Category</div>
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
                  </div>

                  <div>
                    <div style={styles.inputLabel}>Author</div>
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
                  </div>

                  <div>
                    <div style={styles.inputLabel}>Search</div>
                    <div style={styles.searchWrap}>
                      <Search size={16} />
                      <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search quote text, author, tag..."
                        style={styles.searchInput}
                      />
                    </div>
                  </div>
                </div>

                <div style={styles.helperText}>
                  Showing {filteredQuotes.length} quotes
                </div>

                <div style={styles.quoteList}>
                  {filteredQuotes.map((quote) => renderQuoteCard(quote))}
                </div>
              </div>
            )}

            {activeTab === "favorites" && (
              <div style={styles.card}>
                <div style={styles.cardHeaderSimple}>
                  <h2 style={styles.sectionTitle}>Favorite Quotes</h2>
                </div>

                {favoriteQuotes.length ? (
                  <div style={styles.quoteList}>
                    {favoriteQuotes.map((quote) => renderQuoteCard(quote, true))}
                  </div>
                ) : (
                  <div style={styles.emptyBox}>
                    No favorites yet. Click the star on quotes you want to keep.
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.card}>
              <h3 style={styles.sideTitle}>Your Preference Profile</h3>

              <div style={styles.profileBlock}>
                <div style={styles.inputLabel}>Top Categories</div>
                <div style={styles.badgeWrap}>
                  {preferenceSummary.topCategories.length ? (
                    preferenceSummary.topCategories.map(([name, score]) => (
                      <span key={name} style={styles.categoryBadge}>
                        {name} ({score})
                      </span>
                    ))
                  ) : (
                    <div style={styles.helperText}>
                      Start rating quotes to train your feed.
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.profileBlock}>
                <div style={styles.inputLabel}>Top Themes</div>
                <div style={styles.badgeWrap}>
                  {preferenceSummary.topTags.length ? (
                    preferenceSummary.topTags.map(([name, score]) => (
                      <span key={name} style={styles.tagBadge}>
                        #{name} ({score})
                      </span>
                    ))
                  ) : (
                    <div style={styles.helperText}>
                      Likes and dislikes will shape future recommendations.
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.profileBlock}>
                <div style={styles.inputLabel}>Favorite Authors</div>
                <div style={styles.badgeWrap}>
                  {preferenceSummary.topAuthors.length ? (
                    preferenceSummary.topAuthors.map(([name, score]) => (
                      <span key={name} style={styles.outlineBadge}>
                        {name} ({score})
                      </span>
                    ))
                  ) : (
                    <div style={styles.helperText}>
                      Author preferences will appear here after likes.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.sideTitle}>Supabase Table Setup</h3>
              <div style={styles.helperText}>Create this table in Supabase:</div>
              <pre style={styles.codeBlock}>{`create table quote_user_profiles (
  profile_key text primary key,
  preferences jsonb,
  history jsonb,
  favorites jsonb,
  reactions jsonb,
  updated_at timestamptz default now()
);`}</pre>
              <div style={styles.helperText}>
                Then switch <strong>USE_SUPABASE</strong> to true and add your
                `supabase.js` file.
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.sideTitle}>What Changed</h3>
              <div style={styles.listText}>• Larger quote library</div>
              <div style={styles.listText}>• Category, author, and search filters</div>
              <div style={styles.listText}>• Favorites tab</div>
              <div style={styles.listText}>• Supabase sync structure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "20px",
  },
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
  },
  topCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  smallLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "8px",
  },
  mainTitle: {
    margin: 0,
    fontSize: "36px",
    color: "#0f172a",
  },
  dateRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
    color: "#64748b",
    fontSize: "14px",
    marginTop: "10px",
  },
  tabRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  cardHeaderSimple: {
    marginBottom: "18px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "30px",
    color: "#0f172a",
  },
  sideTitle: {
    margin: "0 0 16px 0",
    fontSize: "22px",
    color: "#0f172a",
  },
  featuredQuoteBox: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
  },
  featuredQuoteText: {
    fontSize: "34px",
    lineHeight: 1.5,
    color: "#1e293b",
    marginTop: "10px",
  },
  featuredAuthor: {
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#475569",
  },
  quoteCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
  },
  quoteCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    alignItems: "center",
  },
  quoteTextSmall: {
    marginTop: "14px",
    fontSize: "20px",
    lineHeight: 1.6,
    color: "#1e293b",
  },
  authorText: {
    marginTop: "14px",
    fontWeight: 700,
    color: "#475569",
  },
  tagWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "14px",
  },
  badgeWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  categoryBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 600,
  },
  tagBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#e2e8f0",
    color: "#334155",
    fontSize: "13px",
    fontWeight: 600,
  },
  softBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: "13px",
    fontWeight: 600,
  },
  outlineBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: "999px",
    border: "1px solid #cbd5e1",
    color: "#475569",
    fontSize: "13px",
    fontWeight: 600,
    background: "#ffffff",
  },
  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "12px",
    marginTop: "18px",
  },
  primaryButton: {
    height: "42px",
    padding: "0 16px",
    border: "none",
    borderRadius: "14px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },
  tabButton: {
    height: "42px",
    padding: "0 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "14px",
    background: "#ffffff",
    color: "#0f172a",
    fontWeight: 700,
    cursor: "pointer",
  },
  primaryButtonLarge: {
    height: "54px",
    padding: "0 16px",
    border: "none",
    borderRadius: "16px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    gap: "8px",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    marginTop: "14px",
    height: "42px",
    padding: "0 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "14px",
    background: "#ffffff",
    color: "#0f172a",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButtonLarge: {
    height: "54px",
    padding: "0 16px",
    border: "none",
    borderRadius: "16px",
    background: "#e2e8f0",
    color: "#0f172a",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    gap: "8px",
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButtonLarge: {
    height: "54px",
    padding: "0 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "16px",
    background: "#ffffff",
    color: "#0f172a",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    gap: "8px",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    width: "40px",
    height: "40px",
    border: "1px solid #cbd5e1",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
    marginBottom: "14px",
  },
  inputLabel: {
    marginBottom: "8px",
    fontSize: "14px",
    color: "#64748b",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    height: "44px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    padding: "0 12px",
    fontSize: "14px",
    color: "#0f172a",
  },
  searchWrap: {
    height: "44px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 12px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "14px",
    color: "#0f172a",
    background: "transparent",
  },
  helperText: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: 1.6,
  },
  quoteList: {
    display: "grid",
    gap: "14px",
  },
  profileBlock: {
    marginBottom: "18px",
  },
  codeBlock: {
    background: "#0f172a",
    color: "#e2e8f0",
    padding: "16px",
    borderRadius: "14px",
    overflowX: "auto",
    fontSize: "12px",
    lineHeight: 1.6,
  },
  listText: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: 1.8,
  },
  emptyBox: {
    border: "1px dashed #cbd5e1",
    borderRadius: "18px",
    background: "#ffffff",
    padding: "32px",
    textAlign: "center",
    color: "#64748b",
  },
};

export default App;