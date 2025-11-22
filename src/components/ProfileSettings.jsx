import React from "react";
import ShellLayout from "./ShellLayout.jsx";

const STORAGE_KEY = "nt_profile";

function readProfile() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {
    displayName: "NotTuber",
    username: "user123",
    email: "you@example.com",
    phone: "",
    bio: "",
  }; } catch { return { displayName:"", username:"", email:"", phone:"", bio:"" }; }
}
function writeProfile(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}

export default function ProfileSettings() {
  const [profile, setProfile] = React.useState(readProfile());
  const [showPw, setShowPw] = React.useState(false);
  const [pwd, setPwd] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState(null);

  function change(k, v){ setProfile(p => ({ ...p, [k]: v })); }
  function canSave(){
    return profile.displayName.trim() && profile.username.trim() && profile.email.trim();
  }

  async function handleSave(e){
    e.preventDefault();
    if (!canSave()) return;
    setSaving(true);
    // pretend to call backend, then persist locally
    await new Promise(r => setTimeout(r, 300));
    writeProfile(profile);
    setSaving(false);
    setSavedAt(new Date());
  }

  return (
    <ShellLayout active="profile">
      <style>{`
        .card { background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:16px; }
        .grid { display:grid; grid-template-columns: 1fr 320px; gap:18px; align-items:start; }
        .field { display:flex; flex-direction:column; gap:6px; }
        .label { font-size:13px; font-weight:600; color:#374151; }
        .input, .textarea {
          width:100%; height:44px; border:1px solid #d1d5db; border-radius:10px; padding:0 12px; font-size:14px; outline:none;
        }
        .textarea { height:auto; min-height:88px; padding:10px 12px; resize:vertical; }
        .btn { height:44px; border-radius:12px; border:1px solid transparent; background:#111827; color:#fff; font-weight:700; cursor:pointer; }
        .btn[disabled]{ background:#cbd5e1; cursor:not-allowed; }
        .muted { color:#6b7280; font-size:12px; }
        .row { display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
        .avatar { width:88px; height:88px; border-radius:999px; background:#e5e7eb; border:1px solid #e5e7eb; }
        .stack { display:flex; gap:12px; align-items:center; }
        @media (max-width: 900px){ .grid{ grid-template-columns: 1fr; } }
      `}</style>

      <h2 style={{margin:"0 0 12px"}}>Profile settings</h2>

      <form className="grid" onSubmit={handleSave}>
        {/* left column */}
        <section className="card">
          <div className="stack" style={{marginBottom:14}}>
            <div className="avatar" />
            <div>
              <div style={{fontWeight:700}}>Profile photo</div>
              <div className="muted">(Mock) Avatar preview only</div>
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label className="label" htmlFor="displayName">Display name</label>
              <input id="displayName" className="input" value={profile.displayName}
                     onChange={(e)=>change("displayName", e.target.value)} placeholder="Your name"/>
            </div>
            <div className="field">
              <label className="label" htmlFor="username">Username</label>
              <input id="username" className="input" value={profile.username}
                     onChange={(e)=>change("username", e.target.value)} placeholder="yourname"/>
            </div>
          </div>

          <div className="row" style={{marginTop:12}}>
            <div className="field">
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" className="input" value={profile.email}
                     onChange={(e)=>change("email", e.target.value)} placeholder="you@example.com"/>
            </div>
            <div className="field">
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" className="input" value={profile.phone}
                     onChange={(e)=>change("phone", e.target.value)} placeholder="(555) 555-5555"/>
            </div>
          </div>

          <div className="field" style={{marginTop:12}}>
            <label className="label" htmlFor="bio">Bio</label>
            <textarea id="bio" className="textarea" value={profile.bio}
                      onChange={(e)=>change("bio", e.target.value)} placeholder="Tell people about yourself"/>
          </div>
        </section>

        {/* right column */}
        <aside className="card">
          <div className="field">
            <label className="label" htmlFor="pwd">Change password</label>
            <div style={{display:"flex", gap:8}}>
              <input id="pwd" className="input" type={showPw ? "text":"password"} value={pwd}
                     onChange={(e)=>setPwd(e.target.value)} placeholder="New password"/>
              <button type="button" className="btn" onClick={()=>setShowPw(s=>!s)} style={{width:120, background:"#f3f4f6", color:"#111827"}}>
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            <div className="muted">This demo doesn’t send to a server—password isn’t persisted.</div>
          </div>

          <div style={{height:12}} />

          <button className="btn" type="submit" disabled={!canSave() || saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          {savedAt && (
            <div className="muted" style={{marginTop:8}}>
              Saved at {savedAt.toLocaleTimeString()}
            </div>
          )}
        </aside>
      </form>
    </ShellLayout>
  );
}
