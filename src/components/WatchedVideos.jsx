import React from "react";
import ShellLayout from "./ShellLayout.jsx";
import { useNotTube } from "../state/NotTubeState.jsx";
import { VIDEOS } from "../data/videos.js";

export default function WatchedVideos() {
  const { watchedIds } = useNotTube();
  const items = VIDEOS.filter(v => watchedIds.includes(v.id));

  return (
    <ShellLayout active="watched">
      <style>{`
        .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:16px; }
        .card { text-decoration:none; color:inherit; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; background:#fff; }
        .thumb { aspect-ratio:16/9; background:#d1d5db; }
        .title { padding:10px; font-weight:700; font-size:14px; }
        .empty { color:#6b7280; }
      `}</style>

      <h2 style={{margin:"0 0 12px"}}>Watched videos</h2>
      {items.length === 0 ? (
        <div className="empty">No watched videos yet.</div>
      ) : (
        <div className="grid">
          {items.map(v=>(
            <a key={v.id} href={`#/video/${v.id}`} className="card">
              <div className="thumb" />
              <div className="title">{v.title}</div>
            </a>
          ))}
        </div>
      )}
    </ShellLayout>
  );
}
