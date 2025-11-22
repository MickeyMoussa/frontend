import React from "react";
import ShellLayout from "./ShellLayout.jsx";
import { VIDEOS } from "../data/videos.js";
import { useNotTube } from "../state/NotTubeState.jsx";

export default function ChannelPage({ slug }) {
  const { subs, toggleSubscribe } = useNotTube();

  // keep slug for routing, but resolve to the true channel name from data
  const nameFromSlug = decodeURIComponent(slug).replace(/-/g, " ");
  const items = VIDEOS.filter(
    (v) => v.channel.toLowerCase() === nameFromSlug.toLowerCase()
  );

  if (items.length === 0) {
    return (
      <ShellLayout>
        <div style={{ padding: 16 }}>
          <a href="#/home">← Back</a>
          <h2 style={{ marginTop: 8 }}>Video not found.</h2>
        </div>
      </ShellLayout>
    );
  }

  // Use canonical casing from the data so "subs.includes" matches everywhere
  const channelName = items[0].channel;
  const isSubd = subs.includes(channelName);

  return (
    <ShellLayout>
      <style>{`
        .banner { height:160px; border-radius:14px; background:#e5e7eb; }
        .head { display:flex; align-items:flex-end; gap:14px; margin-top:-28px; }
        .avatar { width:84px; height:84px; border-radius:999px; background:#0f172a; border:4px solid #fff; }
        .cName { font-weight:900; font-size:24px; letter-spacing:-.01em; }
        .cMeta { color:#6b7280; font-size:13px; margin-top:2px; }
        .subBtn { margin-left:auto; height:40px; padding:0 14px; border-radius:999px; border:1px solid #d1d5db; background:#fff; font-weight:700; cursor:pointer; }
        .subBtn.subd { background:#111827; color:#fff; border-color:#111827; }
        .grid { margin-top:16px; display:grid; gap:14px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
        .card { text-decoration:none; color:inherit; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; background:#fff; }
        .thumb { aspect-ratio:16/9; background:#d1d5db; }
        .title { padding:10px; font-weight:700; font-size:14px; }
        .by { padding:0 10px 12px; color:#6b7280; font-size:12.5px; }
      `}</style>

      <div className="banner" />
      <div className="head">
        <div className="avatar" />
        <div>
          <div className="cName">{channelName}</div>
          <div className="cMeta">{items.length} videos</div>
        </div>
        <button
          className={`subBtn ${isSubd ? "subd" : ""}`}
          onClick={() => toggleSubscribe(channelName)}
        >
          {isSubd ? "Subscribed ✓" : "Subscribe"}
        </button>
      </div>

      <div className="grid">
        {items.map((v) => (
          <a key={v.id} href={`#/video/${v.id}`} className="card">
            <div className="thumb" />
            <div className="title">{v.title}</div>
            <div className="by">
              {v.views} views • {v.when}
            </div>
          </a>
        ))}
      </div>
    </ShellLayout>
  );
}
