import React from "react";
import { useNotTube } from "../state/NotTubeState.jsx";
import { VIDEOS } from "../data/videos.js";

export default function SubscribedShelf() {
  const { subs } = useNotTube();
  if (!subs || subs.length === 0) return null;

  // collect 1 poster and counts for each subscribed channel
  const byChannel = subs.map((name) => {
    const vids = VIDEOS.filter(v => v.channel === name);
    return {
      name,
      count: vids.length,
      sample: vids[0],
      slug: toSlug(name),
    };
  });

  return (
    <section className="subShelf">
      <style>{`
        .subShelf {
          margin: 8px 0 18px;
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:14px;
          padding:12px;
        }
        .subHeader {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:10px; font-weight:800;
        }
        .rail {
          display:grid; grid-auto-flow:column; grid-auto-columns: minmax(220px, 1fr);
          gap:12px; overflow:auto; padding-bottom:4px;
          scrollbar-width: thin;
        }
        .chanCard {
          display:grid; grid-template-columns: 72px 1fr; gap:10px;
          border:1px solid #e5e7eb; border-radius:12px; padding:10px; text-decoration:none; color:inherit;
          background:#fafafa;
        }
        .avatar { width:72px; height:72px; border-radius:999px; background:#0f172a; }
        .cName { font-weight:800; }
        .cMeta { color:#6b7280; font-size:12px; margin-top:2px; }
        .thumb { margin-top:8px; aspect-ratio:16/9; background:#d1d5db; border-radius:8px; }
        .cta { font-size:12px; margin-top:6px; color:#0f172a; font-weight:600; }
      `}</style>

      <div className="subHeader">Subscribed channels</div>
      <div className="rail">
        {byChannel.map((c) => (
          <a key={c.name} className="chanCard" href={`#/channel/${c.slug}`}>
            <div className="avatar" />
            <div>
              <div className="cName">{c.name}</div>
              <div className="cMeta">{c.count} videos</div>
              <div className="thumb" />
              <div className="cta">View channel →</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function toSlug(s){ return encodeURIComponent(s.replace(/\s+/g,'-').toLowerCase()); }
