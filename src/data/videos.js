// ---- Built-in seed videos ---------------------------------------------------
export const VIDEOS = [
  { id:1, title:"Smartphone Awards 2022!", channel:"Marques", views:"4.7M", when:"2 months ago", length:"23:59",
    src:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:2, title:"[Playlist] Soothing 24-hour jazz for work", channel:"In The Rain", views:"2M", when:"3 months ago", length:"23:59:40",
    src:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:3, title:"ABANDONED 1600’s Mansion With Everything Left Inside", channel:"Jeremy Xplores", views:"663K", when:"5 months ago", length:"36:15",
    src:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:4, title:"YOUR QUESTIONS answered! March edition", channel:"The Villages 365", views:"687", when:"9 hours ago", length:"27:45",
    src:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:5, title:"A shocking find in an oak tree", channel:"Belko Wood", views:"52M", when:"6 months ago", length:"20:18",
    src:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:6, title:"1 in a Million MLB Moments", channel:"blitz", views:"2.1M", when:"1 month ago", length:"10:39",
    src:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:7, title:"Ed Sheeran – Eyes Closed [Official Video]", channel:"Ed Sheeran", views:"–", when:"", length:"3:35",
    src:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:8, title:"Lana Del Rey – Candy Necklace (feat. Jon Batiste) [Audio]", channel:"Lana Del Rey", views:"–", when:"", length:"5:15",
    src:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { id:9, title:"Another featured track", channel:"Various", views:"–", when:"", length:"4:21",
    src:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
];

// ---- Local uploads in localStorage ------------------------------------------
const KEY = "nt_uploads";

function readUploads(){ try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } }
function writeUploads(list){ try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {} }

export function getUploads(){ return readUploads(); }

export function addUploadedVideo({ title, description="", channel="You", length="3:00", src }) {
  const uploads = readUploads();
  const id = Date.now(); // simple unique id
  uploads.unshift({ id, title, description, channel, length, src, views:"–", when:"just now" });
  writeUploads(uploads);
  return id;
}

export function updateUploadedVideo(id, patch){
  const uploads = readUploads();
  const i = uploads.findIndex(v => String(v.id) === String(id));
  if (i >= 0) {
    uploads[i] = { ...uploads[i], ...patch };
    writeUploads(uploads);
    return true;
  }
  return false;
}

export function deleteUploadedVideo(id){
  const uploads = readUploads().filter(v => String(v.id) !== String(id));
  writeUploads(uploads);
  // also delete comments stored under comments:<id>
  try { localStorage.removeItem(`comments:${id}`); } catch {}
}

export function getAllVideos() {
  return [...getUploads(), ...VIDEOS];
}

export function getVideo(id) {
  const all = getAllVideos();
  return all.find(v => String(v.id) === String(id));
}
