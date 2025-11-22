import React from "react";

const Ctx = React.createContext(null);

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function write(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export function NotTubeProvider({ children }) {
  const [likedIds, setLikedIds] = React.useState(() => read("nt_like", []));
  const [watchedIds, setWatchedIds] = React.useState(() => read("nt_watch", []));
  const [savedIds, setSavedIds] = React.useState(() => read("nt_saved", []));
  const [subs, setSubs] = React.useState(() => read("nt_subs", ["Belko Wood","Various","blitz","Channel4"]));

  React.useEffect(() => write("nt_like", likedIds), [likedIds]);
  React.useEffect(() => write("nt_watch", watchedIds), [watchedIds]);
  React.useEffect(() => write("nt_saved", savedIds), [savedIds]);
  React.useEffect(() => write("nt_subs", subs), [subs]);

  const toggleLike = React.useCallback((id) => {
    setLikedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const markWatched = React.useCallback((id) => {
    setWatchedIds(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const toggleSave = React.useCallback((id) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const toggleSubscribe = React.useCallback((name) => {
    setSubs(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);
  }, []);

  const value = React.useMemo(() => ({
    likedIds, watchedIds, savedIds, subs,
    toggleLike, markWatched, toggleSave, toggleSubscribe,
  }), [likedIds, watchedIds, savedIds, subs, toggleLike, markWatched, toggleSave, toggleSubscribe]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNotTube() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useNotTube must be used inside <NotTubeProvider>");
  return ctx;
}
