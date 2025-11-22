import React from "react";
import ShellLayout from "./ShellLayout.jsx";
import { addUploadedVideo } from "../data/videos.js";

export default function UploadPage() {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [length, setLength] = React.useState("3:00");
  const [src, setSrc] = React.useState("");         // pasted URL
  const [fileUrl, setFileUrl] = React.useState(""); // blob URL for local file
  const [fileName, setFileName] = React.useState("");

  function onSubmit(e) {
    e.preventDefault();
    const t = title.trim();
    const chosenSrc = (fileUrl || src).trim();
    if (!t || !chosenSrc) {
      alert("Please enter a Title and provide a video (file or URL).");
      return;
    }
    const id = addUploadedVideo({
      title: t,
      description: description.trim(),
      length,
      src: chosenSrc,
    });
    window.location.hash = `#/video/${id}`;
  }

  function handleFile(file) {
    if (!file) return;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    const blobUrl = URL.createObjectURL(file);
    setFileUrl(blobUrl);
    setFileName(file.name);
  }
  function onFileChange(e){ handleFile(e.target.files?.[0]); }
  function onDrop(e){ e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }
  function onDrag(e){ e.preventDefault(); }

  return (
    <ShellLayout>
      <style>{`
        .wrap { max-width: 900px; margin: 0 auto; background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:18px; }
        .h { font-size:28px; font-weight:900; margin-bottom:18px; letter-spacing:-.01em; }
        .row { display:grid; grid-template-columns: 160px 1fr; gap:10px; align-items:start; margin:10px 0; }
        .lab { font-weight:700; color:#111827; }
        .inp { height:44px; border:1px solid #d1d5db; border-radius:10px; padding:0 12px; outline:none; width:100%; font-size:15px; }
        .txt { min-height:110px; border:1px solid #d1d5db; border-radius:10px; padding:10px 12px; outline:none; width:100%; font-size:15px; resize:vertical; }
        .help { color:#6b7280; font-size:13px; margin-top:8px; }
        .btns { display:flex; gap:10px; margin-top:18px; }
        .btn { height:44px; padding:0 16px; border-radius:10px; border:1px solid #d1d5db; background:#fff; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; }
        .primary { background:#111827; color:#fff; border-color:#111827; }
        .drop { border:2px dashed #cbd5e1; border-radius:10px; padding:16px; text-align:center; background:#f8fafc; }
        .pill { display:inline-flex; align-items:center; gap:8px; padding:6px 10px; border:1px solid #d1d5db; border-radius:999px; background:#fff; font-size:13px; margin-top:8px; }
        .preview { margin-top:10px; border-radius:10px; overflow:hidden; }
      `}</style>

      <div className="wrap">
        <div className="h">Upload a video</div>

        <form onSubmit={onSubmit}>
          <div className="row">
            <label className="lab" htmlFor="title">Title</label>
            <input id="title" className="inp" value={title} onChange={e=>setTitle(e.target.value)} placeholder="My new video" />
          </div>

          <div className="row">
            <label className="lab" htmlFor="desc">Description</label>
            <textarea id="desc" className="txt" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Write a short description..." />
          </div>

          <div className="row">
            <label className="lab" htmlFor="length">Length</label>
            <input id="length" className="inp" value={length} onChange={e=>setLength(e.target.value)} placeholder="e.g. 12:34" />
          </div>

          {/* Local file */}
          <div className="row">
            <div className="lab">Local file</div>
            <div className="drop" onDrop={onDrop} onDragOver={onDrag} onDragEnter={onDrag} onDragLeave={onDrag}>
              Drag & drop a video here, or{" "}
              <label style={{ textDecoration: "underline", cursor: "pointer" }}>
                browse
                <input type="file" accept="video/*" style={{ display: "none" }} onChange={onFileChange} />
              </label>
              {fileUrl && (
                <>
                  <div className="pill">Selected: {fileName}</div>
                  <div className="preview">
                    <video controls src={fileUrl} style={{ width: "100%", maxHeight: 240 }} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Or paste a URL */}
          <div className="row">
            <label className="lab" htmlFor="url">Video URL</label>
            <input id="url" className="inp" value={src} onChange={e=>setSrc(e.target.value)} placeholder="https://example.com/video.mp4" />
          </div>

          <div className="help">
            Your account name is used as the channel. Local files use a temporary object URL (works until the tab is closed).
          </div>

          <div className="btns">
            <button type="submit" className="btn primary">Upload</button>
            <button type="button" className="btn" onClick={()=>window.location.hash="#/home"}>Cancel</button>
          </div>
        </form>
      </div>
    </ShellLayout>
  );
}
