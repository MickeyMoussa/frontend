import React from "react";
import ShellLayout from "./ShellLayout.jsx";
import { useNotTube } from "../state/NotTubeState.jsx";
import { getAllVideos } from "../data/videos.js";

export default function SavedVideos() {
  const { savedIds } = useNotTube();
  const items = getAllVideos().filter(v => savedIds.includes(v.id));

  return (
    <ShellLayout active="saved">
      <style>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .card {
          text-decoration: none;
          color: inherit;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.08);
        }
        .thumb {
          aspect-ratio: 16/9;
          background: #d1d5db;
          position: relative;
        }
        .time {
          position: absolute;
          right: 8px;
          bottom: 8px;
          background: rgba(15,23,42,0.9);
          color: #fff;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 6px;
        }
        .meta {
          display: flex;
          gap: 10px;
          padding: 10px;
        }
        .avatar {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: #111827;
          flex: 0 0 auto;
        }
        .title {
          font-weight: 700;
          font-size: 14px;
          line-height: 1.3;
        }
        .byline {
          color: #6b7280;
          font-size: 12px;
          margin-top: 4px;
        }
        .empty {
          color: #6b7280;
          text-align: center;
          margin-top: 40px;
          font-size: 15px;
        }
      `}</style>

      <h2 style={{ margin: "0 0 12px" }}>Saved videos</h2>

      {items.length === 0 ? (
        <div className="empty">No saved videos yet.</div>
      ) : (
        <div className="grid">
          {items.map(v => (
            <a key={v.id} href={`#/video/${v.id}`} className="card">
              <div className="thumb">
                <span className="time">{v.length}</span>
              </div>
              <div className="meta">
                <div className="avatar" />
                <div>
                  <div className="title">{v.title}</div>
                  <div className="byline">
                    {v.channel} • {v.views} views
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </ShellLayout>
  );
}
