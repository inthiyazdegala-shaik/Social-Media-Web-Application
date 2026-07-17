import { useState } from "react";
import { apiRequest } from "../api";

function CreatePost({ onCreated }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

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
    setError("");

    try {
      await apiRequest("/posts", {
        method: "POST",
        body: JSON.stringify({ caption, image })
      });
      setCaption("");
      setImage("");
      setOpen(false);
      onCreated();
    } catch (postError) {
      setError(postError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="composer composer-trigger" role="button" tabIndex="0" onClick={() => setOpen(true)} onKeyDown={(event) => event.key === "Enter" && setOpen(true)}>
        <div className="mini-avatar">C</div>
        <div className="composer-prompt">Share news, a thought, or a moment</div>
        <button className="upload-btn" type="button">Photo</button>
        <button type="button">Create</button>
      </div>

      {open && (
        <div className="modal">
          <form className="modal-card create-modal" onSubmit={submit}>
            <div className="modal-title">
              <div>
                <h2>Create post</h2>
                <p className="muted">Share a moment with your circle.</p>
              </div>
              <button className="close-icon" type="button" onClick={() => setOpen(false)}>×</button>
            </div>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="What's happening around you?" maxLength="180" />
            <label className="drop-zone">
              {image ? <img src={image} alt="Selected post preview" /> : <span>Choose a photo</span>}
              <input className="file-input" type="file" accept="image/*" onChange={chooseImage} />
            </label>
            {error && <p className="composer-error">{error}</p>}
            <button className="primary" disabled={busy || (!caption.trim() && !image)} type="submit">{busy ? "Posting" : "Post now"}</button>
          </form>
        </div>
      )}
    </>
  );
}

export default CreatePost;
