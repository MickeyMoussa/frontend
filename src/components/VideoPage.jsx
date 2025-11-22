import React from "react";
import ShellLayout from "./ShellLayout.jsx";
import { getAllVideos } from "../data/videos.js";
import { useNotTube } from "../state/NotTubeState.jsx";

export default function VideoPage({ id }) {
  const {
    toggleLike,
    toggleSave,
    markWatched,
    likedIds,
    savedIds,
    subs,
    toggleSubscribe,
  } = useNotTube();

  const ALL = getAllVideos();
  const video = ALL.find((v) => String(v.id) === String(id));
  const upNext = ALL.filter((v) => String(v.id) !== String(id)).slice(0, 10);

  React.useEffect(() => { if (video) markWatched(video.id); }, [video, markWatched]);

  // topbar search (no <form>)
  const [q, setQ] = React.useState("");
  const goSearch = () => {
    const t = q.trim();
    window.location.hash = t ? `#/search?q=${encodeURIComponent(t)}` : "#/home";
  };

  // player refs
  const playerRef = React.useRef(null);
  const playerWrapRef = React.useRef(null);

  const enterFullscreen = async () => {
    const wrap = playerWrapRef.current;
    const vid  = playerRef.current;
    if (!wrap || !vid) return;

    // iOS Safari prefers the native video fullscreen
    if (vid.webkitEnterFullscreen) {
      try { vid.webkitEnterFullscreen(); } catch {}
      return;
    }
    if (!document.fullscreenElement) {
      await wrap.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  };

  // comments
  const [comments, setComments] = React.useState([]);
  const [draft, setDraft] = React.useState("");
  React.useEffect(() => {
    if (!video) return;
    const stored = localStorage.getItem(`comments:${video.id}`);
    if (stored) setComments(JSON.parse(stored));
    else setComments([
      { user: "@techfan", text: "love this edit!" },
      { user: "@jordan", text: "timestamps please 🔥" },
      { user: "@nora", text: "subbed, keep it up!" },
    ]);
  }, [video?.id]);

  function addComment(e) {
    e.preventDefault();
    const txt = draft.trim();
    if (!txt) return;
    const next = [...comments, { user: "@you", text: txt }];
    setComments(next);
    localStorage.setItem(`comments:${video.id}`, JSON.stringify(next));
    setDraft("");
  }

  if (!video) {
    return (
      <ShellLayout>
        <div style={{ padding: 16 }}>
          <a href="#/home">← Back</a>
          <h2 style={{ marginTop: 8 }}>Video not found.</h2>
        </div>
      </ShellLayout>
    );
  }

  const isLiked = likedIds.includes(video.id);
  const isSaved = savedIds.includes(video.id);
  const isSubd  = subs.includes(video.channel);
  const channelSlug = slugify(video.channel);

  // description expand/collapse
  const [openDesc, setOpenDesc] = React.useState(false);
  const descText = video.description || "No description provided.";

  // pick source
  const src = video.src || "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

  return (
    <ShellLayout>
      <style>{`
        :root { --bg:#f9fafb; --muted:#6b7280; --line:#e5e7eb; }
        .topbar { position: sticky; top: 0; z-index: 10; display:flex; align-items:center; gap:12px; padding:10px 12px; background: var(--bg); border-bottom:1px solid var(--line); border-radius:12px; margin-bottom:10px; }
        .searchWrap { display:flex; align-items:center; flex:1; background:#fff; border:1px solid #d1d5db; border-radius:999px; height:40px; overflow:hidden; }
        .searchInput { flex:1; height:100%; border:0; outline:none; background:transparent; color:#111; padding:0 14px; font-size:14px; }
        .searchBtn { width:44px; height:40px; border:0; background:#f3f4f6; color:#111; cursor:pointer; }
        .createBtn { height:40px; padding:0 14px; border-radius:999px; border:1px solid #d1d5db; background:#fff; color:#111; font-weight:700; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; }
        .avatarBtn { width:36px; height:36px; border-radius:999px; background:#0f172a; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; }

        .layout { display:grid; grid-template-columns: 1fr 360px; gap:16px; }
        @media (max-width: 1024px){ .layout { grid-template-columns: 1fr; } }

        .playerWrap { position:relative; width:100%; aspect-ratio:16/9; background:#000; border-radius:14px; overflow:hidden; }
        .player { width:100%; height:100%; object-fit:cover; background:#000; display:block; }
        .fsBtn { position:absolute; right:10px; bottom:10px; height:36px; padding:0 12px; border-radius:10px; border:1px solid rgba(255,255,255,.3); background:rgba(17,24,39,.7); color:#fff; font-weight:700; cursor:pointer; }

        .vtitle { font-size:28px; font-weight:900; letter-spacing:-.01em; margin:10px 0; }
        .chRow { display:flex; align-items:center; gap:12px; }
        .ava { width:44px; height:44px; background:#0f172a; border-radius:999px; }
        .chName { font-weight:800; }
        .meta { color:#6b7280; font-size:13px; }
        .actions { margin-left:auto; display:flex; gap:10px; }
        .btn { height:36px; padding:0 14px; border:1px solid #e5e7eb; background:#fff; border-radius:999px; font-weight:700; cursor:pointer; }
        .btn.primary { background:#111827; color:#fff; border-color:#111827; }

        .descBox { margin-top:10px; border:1px solid var(--line); background:#fff; border-radius:12px; padding:12px; }
        .descText { color:#111; font-size:14px; line-height:1.45; white-space:pre-wrap; }
        .descClamp { display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden; }
        .descToggle { margin-top:8px; font-weight:700; cursor:pointer; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:8px; padding:6px 10px; }

        .rail { display:flex; flex-direction:column; gap:12px; }
        .mini { display:grid; grid-template-columns: 160px 1fr; gap:8px; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; background:#fff; text-decoration:none; color:inherit; }
        .mini .thumb { aspect-ratio:16/9; background:#d1d5db; }
        .mini .ttl { font-weight:700; padding:8px 8px 0; }
        .mini .by { padding:0 8px 8px; color:#6b7280; font-size:12.5px; }

        .commentBox { border:1px solid #e5e7eb; border-radius:12px; padding:12px; background:#fff; margin-top:10px; }
        .commentForm { display:flex; gap:10px; margin-bottom:10px; }
        .commentInput { flex:1; height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; outline:none; }
        .commentBtn { height:40px; border-radius:10px; border:0; background:#111827; color:#fff; font-weight:700; padding:0 14px; }
      `}</style>

      {/* TOP BAR */}
      <div className="topbar" role="banner">
        <div className="searchWrap" role="search">
          <input
            className="searchInput"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            aria-label="Search"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                goSearch();
              }
            }}
          />
          <button className="searchBtn" type="button" aria-label="Search" onClick={goSearch}>🔍</button>
        </div>
        <a className="createBtn" href="#/upload" role="button">＋ Create</a>
        <div className="avatarBtn" title="Profile">E</div>
      </div>

      <div className="layout">
        <section>
          {/* real player */}
          <div ref={playerWrapRef} className="playerWrap">
            <video
              ref={playerRef}
              className="player"
              src={src}
              controls
              playsInline
            />
            <button className="fsBtn" type="button" onClick={enterFullscreen}>
              Fullscreen
            </button>
          </div>

          <h1 className="vtitle">{video.title}</h1>

          <div className="chRow">
            <div className="ava" />
            <div>
              <a
                href={`#/channel/${slugify(video.channel)}`}
                className="chName"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {video.channel}
              </a>
              <div className="meta">
                {video.views || "–"} {video.views ? "views" : ""} {video.when ? `• ${video.when}` : ""}
              </div>
            </div>

            <div className="actions">
              <button className={`btn ${isLiked ? "primary" : ""}`} onClick={() => toggleLike(video.id)}>
                {isLiked ? "Liked ✓" : "Like"}
              </button>
              <button className={`btn ${isSubd ? "primary" : ""}`} onClick={() => toggleSubscribe(video.channel)}>
                {isSubd ? "Subscribed ✓" : "Subscribe"}
              </button>
              <button className={`btn ${isSaved ? "primary" : ""}`} onClick={() => toggleSave(video.id)}>
                {isSaved ? "Saved ✓" : "Save"}
              </button>
            </div>
          </div>

          {/* description */}
          <div className="descBox">
            <div className={`descText ${openDesc ? "" : "descClamp"}`}>
              {descText}
            </div>
            {descText && descText.length > 0 && (
              <button className="descToggle" type="button" onClick={()=>setOpenDesc(s=>!s)}>
                {openDesc ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          <div style={{ height: 12 }} />
          <h3 style={{ margin: "8px 0 6px" }}>{comments.length} Comments</h3>

          <form className="commentForm" onSubmit={addComment}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a comment..."
              className="commentInput"
            />
            <button className="commentBtn" disabled={!draft.trim()} type="submit">
              Post
            </button>
          </form>

          <div className="commentBox">
            {comments.map((c, i) => (
              <p key={i}>
                <strong>{c.user}</strong> — {c.text}
              </p>
            ))}
          </div>
        </section>

        <aside className="rail">
          {upNext.map((v) => (
            <a key={v.id} className="mini" href={`#/video/${v.id}`}>
              <div className="thumb" />
              <div>
                <div className="ttl">{v.title}</div>
                <div className="by">
                  {v.channel} • {v.views} • {v.when}
                </div>
              </div>
            </a>
          ))}
        </aside>
      </div>
    </ShellLayout>
  );
}

function slugify(s) {
  return s.toLowerCase().replace(/\s+/g, "-");
}
