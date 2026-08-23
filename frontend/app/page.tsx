"use client";

import { useState } from "react";

type View = "home" | "found-form" | "lost-form" | "results";

interface FoundReport {
  description: string;
  dateFound: string;
  locationFound: string; // <-- Added to interface
  method: "desk" | "holding";
  location: string;
  contactEmail: string;
}

interface LostQuery {
  description: string;
  dateLastSeen: string;
  locationLost: string;
}

interface MatchCard {
  id: string;
  description: string;
  dateFound: string;
  confidence: "high" | "possible";
  score: number;
  method: "desk" | "holding";
  location?: string;
  contactEmail?: string;
}

const DROP_LOCATIONS = [
  "Main Library Desk",
  "Student Union Info Desk",
  "Engineering Hub Front Office",
  "Recreation Center Lost & Found",
  "Campus Security Office",
  "Science Building Reception",
  "Arts & Humanities Hall",
  "Administration Building",
];

function NavBar({ onNav }: { onNav: (v: View) => void }) {
  return (
    <header className="w-full bg-white border-b border-[var(--border)] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <button onClick={() => onNav("home")} className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white">
              <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-[var(--foreground)] tracking-tight group-hover:text-[var(--accent)] transition-colors">
            Campus Locator
          </span>
        </button>
        <nav className="flex items-center gap-1">
          <button onClick={() => onNav("lost-form")} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-3 py-1.5 rounded-md hover:bg-[var(--muted)] transition-all">
            Report Lost Item
          </button>
          <button onClick={() => onNav("found-form")} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-3 py-1.5 rounded-md hover:bg-[var(--muted)] transition-all">
            Report Found Item
          </button>
        </nav>
      </div>
    </header>
  );
}

function LandingPage({ onNav }: { onNav: (v: View) => void }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[var(--secondary)] text-[var(--primary)] text-xs font-mono font-medium px-3 py-1.5 rounded-full mb-6 border border-[var(--primary)]/10">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          University Lost &amp; Found Network
        </div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] leading-tight tracking-tight mb-4">
          Did you lose something,<br />
          or find something?
        </h1>
        <p className="text-[var(--muted-foreground)] text-base leading-relaxed">
          Our matching system connects found items with their owners using semantic
          search. Reports are reviewed daily.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        <button onClick={() => onNav("lost-form")} className="group relative bg-white border border-[var(--border)] rounded-xl p-8 text-left hover:border-[var(--accent)] hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2">
          <div className="w-12 h-12 rounded-lg bg-[var(--secondary)] flex items-center justify-center mb-5 group-hover:bg-[var(--accent)]/10 transition-colors">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-[var(--primary)]">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.75" />
              <path d="M15.5 15.5L19.5 19.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              <path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">I Lost Something</h2>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">Describe what you lost and we'll search our database for potential matches.</p>
        </button>

        <button onClick={() => onNav("found-form")} className="group relative bg-white border border-[var(--border)] rounded-xl p-8 text-left hover:border-[var(--accent)] hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2">
          <div className="w-12 h-12 rounded-lg bg-[var(--secondary)] flex items-center justify-center mb-5 group-hover:bg-[var(--accent)]/10 transition-colors">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-[var(--primary)]">
              <rect x="4" y="8" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
              <path d="M8 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              <circle cx="11" cy="13.5" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">I Found Something</h2>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">Report an item you've found so we can reunite it with its owner quickly.</p>
        </button>
      </div>
    </main>
  );
}

function FoundForm({ onNav }: { onNav: (v: View) => void }) {
  // const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://lost-and-found-57gy.onrender.com";
  const [form, setForm] = useState<FoundReport>({ description: "", dateFound: "", locationFound: "", method: "desk", location: "", contactEmail: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/found/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: form.description,
          date_found: form.dateFound,
          location_found: form.locationFound, // <-- Added field
          holding_status: form.method === 'desk' ? 'AT_DESK' : 'WITH_FINDER',
          location_details: form.location,
          contact_email: form.contactEmail
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit. Please check your data.");
      }
    } catch (error) {
      alert("Network error. Make sure the Django server is running.");
    } finally {
      setSubmitting(false);
    }
  };

  const methodValid = form.method === "desk" ? !!form.location : !!form.contactEmail.trim() && form.contactEmail.includes("@");
  // Updated isValid to ensure locationFound is selected
  const isValid = form.description.trim() && form.dateFound && form.locationFound && methodValid;

  if (submitted) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Report submitted</h2>
          <button onClick={() => onNav("home")} className="text-sm text-[var(--accent)] hover:underline">Back to home</button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-12">
      <div className="max-w-lg mx-auto">
        <button onClick={() => onNav("home")} className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-8 transition-colors">Back</button>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight mb-2">Report a Found Item</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Item Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">When did you find it?</label>
            <input type="date" value={form.dateFound} onChange={(e) => setForm({ ...form, dateFound: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
          </div>

          {/* New Location Found Dropdown */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Where did you find it?</label>
            <select
              value={form.locationFound}
              onChange={(e) => setForm({ ...form, locationFound: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              <option value="">Select a campus location…</option>
              {DROP_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">What did you do with the item?</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--muted)] rounded-lg">
              {(["desk", "holding"] as const).map((opt) => (
                <button key={opt} type="button" onClick={() => setForm({ ...form, method: opt, location: "", contactEmail: "" })} className={`py-2.5 px-3 rounded-md text-sm font-medium transition-all text-center ${form.method === opt ? "bg-white text-[var(--foreground)] shadow-sm" : "text-[var(--muted-foreground)]"}`}>
                  {opt === "desk" ? "Left at a desk" : "Holding onto it"}
                </button>
              ))}
            </div>
            <div className="mt-3">
              {form.method === "desk" && (
                <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]">
                  <option value="">Select a drop-off location…</option>
                  {DROP_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              )}
              {form.method === "holding" && (
                <input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="you@university.edu" className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              )}
            </div>
          </div>
          <button type="submit" disabled={!isValid || submitting} className="w-full bg-[var(--primary)] hover:bg-[var(--accent)] text-white text-sm font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-40">
            {submitting ? "Submitting…" : "Submit Found Item"}
          </button>
        </form>
      </div>
    </main>
  );
}

function LostForm({ onNav, onSearch }: { onNav: (v: View) => void; onSearch: (q: LostQuery, matches: MatchCard[]) => void; }) {
  const [form, setForm] = useState<LostQuery>({ description: "", dateLastSeen: "", locationLost: "" });
  const [searching, setSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    // const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://lost-and-found-57gy.onrender.com";

    try {
      const response = await fetch(`${API_URL}/api/found/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: form.description,
          date_last_seen: form.dateLastSeen,
          location_lost: form.locationLost
        })
      });

      if (response.ok) {
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedMatches = data.matches.map((m: any) => ({
          id: String(m.id),
          description: m.description,
          dateFound: m.date_found,
          score: m.score,
          confidence: m.score >= 75 ? "high" : "possible",
          method: m.holding_status === "AT_DESK" ? "desk" : "holding",
          location: m.location_details,
          contactEmail: m.contact_email
        }));
        onSearch(form, mappedMatches);
      }
    } catch (error) {
      alert("Network error.");
    } finally {
      setSearching(false);
    }
  };

  const isValid = form.description.trim() && form.dateLastSeen && form.locationLost;

  return (
    <main className="flex-1 px-6 py-12">
      <div className="max-w-lg mx-auto">
        <button onClick={() => onNav("home")} className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-8 transition-colors">Back</button>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight mb-2">Search for Your Item</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Item Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">When did you last have this item?</label>
            <input type="date" value={form.dateLastSeen} onChange={(e) => setForm({ ...form, dateLastSeen: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Where did you last have it?</label>
            <select value={form.locationLost} onChange={(e) => setForm({ ...form, locationLost: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]">
              <option value="">Select a campus location…</option>
              {DROP_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          <button type="submit" disabled={!isValid || searching} className="w-full bg-[var(--primary)] hover:bg-[var(--accent)] text-white text-sm font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-40">
            {searching ? "Searching…" : "Search for Matches"}
          </button>
        </form>
      </div>
    </main>
  );
}

function MatchCardItem({ match }: { match: MatchCard }) {
  return (
    <div className={`bg-white rounded-xl border p-5 transition-shadow hover:shadow-md ${match.confidence === "high" ? "border-emerald-200" : "border-[var(--border)]"}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <span className="text-sm font-bold text-emerald-700">{match.confidence === "high" ? "High Confidence" : "Possible Match"}</span>
        <span className="font-mono text-[10px] text-[var(--muted-foreground)] tabular-nums">{match.score}% match</span>
      </div>
      <p className="text-sm text-[var(--card-foreground)] leading-relaxed mb-4">{match.description}</p>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-3">
        <span className="text-xs text-[var(--muted-foreground)]">Found on {match.dateFound}</span>
        {match.method === "desk" && match.location && <span className="font-semibold text-xs text-[var(--foreground)]">Turned in at: {match.location}</span>}
        {match.method === "holding" && match.contactEmail && <a href={`mailto:${match.contactEmail}`} className="text-xs font-medium bg-[var(--secondary)] text-[var(--primary)] px-3 py-1.5 rounded-md">Email Finder</a>}
      </div>
    </div>
  );
}

function ResultsDashboard({ query, matches, onNav }: { query: LostQuery; matches: MatchCard[]; onNav: (v: View) => void; }) {
  const strongMatches = matches.filter((m) => m.confidence === "high");
  const possibleMatches = matches.filter((m) => m.confidence === "possible");

  return (
    <main className="flex-1 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => onNav("lost-form")} className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-8">Refine search</button>
        <div className="mb-8">
          <h1 className="text-xl font-bold text-[var(--foreground)] leading-snug">Showing matches for your item</h1>
        </div>
        {strongMatches.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold mb-4">Strong Matches</h2>
            <div className="space-y-3">{strongMatches.map((m) => <MatchCardItem key={m.id} match={m} />)}</div>
          </section>
        )}
        {possibleMatches.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold mb-4">Potential Matches</h2>
            <div className="space-y-3">{possibleMatches.map((m) => <MatchCardItem key={m.id} match={m} />)}</div>
          </section>
        )}
        {matches.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">No close matches found yet</h3>
          </div>
        )}
      </div>
    </main>
  );
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [lostQuery, setLostQuery] = useState<LostQuery>({ description: "", dateLastSeen: "", locationLost: "" });
  const [searchResults, setSearchResults] = useState<MatchCard[]>([]);

  const handleSearch = (q: LostQuery, matches: MatchCard[]) => {
    setLostQuery(q);
    setSearchResults(matches);
    setView("results");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <NavBar onNav={setView} />
      {view === "home" && <LandingPage onNav={setView} />}
      {view === "found-form" && <FoundForm onNav={setView} />}
      {view === "lost-form" && <LostForm onNav={setView} onSearch={handleSearch} />}
      {view === "results" && <ResultsDashboard query={lostQuery} matches={searchResults} onNav={setView} />}
    </div>
  );
}