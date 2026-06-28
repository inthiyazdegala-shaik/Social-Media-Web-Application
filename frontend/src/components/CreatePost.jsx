import { useState } from "react";
import { apiRequest } from "../api";

function CreatePost({ onCreated }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [busy, setBusy] = useState(false);

  function chooseImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  async function submit(event) {
    event.preventDefault();
    if (!caption.trim() && !image) return;
    setBusy(true);
    await apiRequest("/posts", {
      method: "POST",
      body: JSON.stringify({ caption, image })
    });
    setCaption("");
    setImage("");
    setBusy(false);
    onCreated();
  }

  return (
    <form className="composer" onSubmit={submit}>
      <div className="mini-avatar">C</div>
      <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Share news, a thought, or a moment" maxLength="180" />
      <label className="upload-btn">
        Photo
        <input className="file-input" type="file" accept="image/*" onChange={chooseImage} />
      </label>
      <button disabled={busy} type="submit">Post</button>
      {image && (
        <div className="preview-strip open">
          <img src={image} alt="Selected post preview" />
          <p className="muted">Photo selected</p>
        </div>
      )}
    </form>
  );
}

export default CreatePost;
