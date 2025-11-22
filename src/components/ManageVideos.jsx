import React from "react";
import ShellLayout from "./ShellLayout.jsx";
import { getUploads, updateUploadedVideo, deleteUploadedVideo } from "../data/videos.js";

export default function ManageVideos() {
  const [items, setItems] = React.useState(getUploads());
  const [filter, setFilter] = React.useState("");

  React.useEffect(() => {
    // refresh when coming back
    setItems(getUploads());
  }, []);

  const list = React.useMemo(() => {
    const t = filter.trim().toLowerCase();
    if (!t) return items;
    return items.filter(v =>
      (v.title||"").toLowerCase().includes(t) ||
      (v.description||"").toLowerCase().includes(t)
    );
  }, [items, filter]);

  function saveOne(id, fields){
    if (updateUploadedVideo(id, fields)) {
      setItems(getUploads());
    }
  }
  function removeOne(id){
    if (confirm("Delete this video? This also removes its comments.")) {
      deleteUploadedVideo(id);
      setItems(getUploads());
    }
  }

  return (
    <ShellLayout active="manage">
      <style>{`
        .wrap { max-width: 980px; margin: 0 auto; }
        .h { font-size:28px; font-weight:900; letter-spacing:-.01em; margin-bottom:14px; }
        .bar { display:flex; gap:8px; margin-bottom:12px; }
        .inp { height:40px; border:1px solid #d1d5db; border-radius:10px; padding:0 12px; flex:1; }
        .card { border:1px solid #e5e7eb; background:#fff; border-radius:12px; padding:12px; margin-bottom:12px; }
        .row { display:grid; grid-template-columns: 160px 1fr; gap:10px; align-items:start; margin:6px 0; }
        .lab { font-weight:700; color:#111827; }
        .text { width:100%; height:40px; border:1px solid #d1d5db; border-radius:10px; padding:0 10px; }
        .area { width:100%; min-height:90px; border:1px solid #d1d5db; border-radius:10px; padding:10px; resize:vertical; }
        .btns { display:flex; gap:8px; margin-top:10px; }
    
                .btn {
                height:36px;
                padding:0 14px;
                border-radius:10px;
                border:1px solid #111827;
                background:#111827;
                color:#fff;
                font-weight:700;
                cursor:pointer;
                display:inline-flex;
                align-items:center;
                justify-content:center;
                text-decoration:none;
                }

        .danger { background:#fee2e2; border-color:#fecaca; color:#991b1b; }
        .pill { font-size:12px; color:#6b7280; }
        .comments { margin-top:10px; border-top:1px dashed #e5e7eb; padding-top:10px; }
        .crow { display:flex; gap:8px; align-items:center; justify-content:space-between; padding:6px 0; }
        .cdel { font-size:12px; border:1px solid #e5e7eb; border-radius:8px; background:#fff; padding:4px 8px; cursor:pointer; }
      `}</style>

      <div className="wrap">
        <div className="h">Manage my videos</div>
        <div className="bar">
          <input className="inp" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search my uploads…" />
          <a className="btn" href="#/upload">＋ Upload new</a>
        </div>

        {list.length === 0 && <div className="card">No uploads yet.</div>}

        {list.map(v => (
          <VideoManageCard key={v.id} v={v} onSave={saveOne} onDelete={removeOne} />
        ))}
      </div>
    </ShellLayout>
  );
}

function VideoManageCard({ v, onSave, onDelete }) {
  const [title, setTitle] = React.useState(v.title);
  const [desc, setDesc]   = React.useState(v.description || "");
  const [len, setLen]     = React.useState(v.length || "");
  const [url, setUrl]     = React.useState(v.src || "");

  const [comments, setComments] = React.useState(()=>loadComments(v.id));

  function save(){
    onSave(v.id, { title, description:desc, length:len, src:url });
  }
  function deleteComment(idx){
    const next = comments.slice();
    next.splice(idx,1);
    setComments(next);
    try { localStorage.setItem(`comments:${v.id}`, JSON.stringify(next)); } catch {}
  }

  return (
    <div className="card">
      <div className="row"><div className="lab">Video ID</div><div className="pill">{v.id}</div></div>
      <div className="row"><div className="lab">Title</div><input className="text" value={title} onChange={e=>setTitle(e.target.value)} /></div>
      <div className="row"><div className="lab">Description</div><textarea className="area" value={desc} onChange={e=>setDesc(e.target.value)} /></div>
      <div className="row"><div className="lab">Length</div><input className="text" value={len} onChange={e=>setLen(e.target.value)} placeholder="e.g. 12:34" /></div>
      <div className="row"><div className="lab">Video URL</div><input className="text" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://…" /></div>

      <div className="btns">
        <button className="btn" onClick={save}>Save changes</button>
        <button className="btn danger" onClick={()=>onDelete(v.id)}>Delete video</button>
        <a className="btn" href={`#/video/${v.id}`}>Open</a>
      </div>

      <div className="comments">
        <div className="lab">Comments ({comments.length})</div>
        {comments.length === 0 && <div className="pill">No comments yet.</div>}
        {comments.map((c, i) => (
          <div key={i} className="crow">
            <div><strong>{c.user}</strong> — {c.text}</div>
            <button className="cdel" onClick={()=>deleteComment(i)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function loadComments(id){
  try {
    const s = localStorage.getItem(`comments:${id}`);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}
