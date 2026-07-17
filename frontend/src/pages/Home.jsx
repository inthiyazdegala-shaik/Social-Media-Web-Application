import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { apiRequest } from "../api";
import Feed from "./Feed";
import Profile from "./Profile";
import { initials } from "../utils";

function Home({ user, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState(() => JSON.parse(localStorage.getItem("circlioFriends") || "null") || ["maya.frames", "arjun.wild"]);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("circlioTheme") === "dark");

  const visiblePosts = useMemo(() => posts.filter((post) => `${post.username} ${post.place} ${post.caption}`.toLowerCase().includes(search.toLowerCase())), [posts, search]);

  async function loadPosts() {
    try {
      const data = await apiRequest("/posts");
      setPosts(Array.isArray(data.posts) ? data.posts : []);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    }
  }

  async function likePost(id) {
    try {
      const data = await apiRequest(`/posts/${id}/like`, { method: "POST" });
      if (data.post) {
        setPosts((currentPosts) => currentPosts.map((post) => post.id === id ? data.post : post));
      } else {
        loadPosts();
      }
      setError("");
    } catch (likeError) {
      setError(likeError.message);
    }
  }

  async function openProfile(username) {
    try {
      const data = await apiRequest(`/posts/profiles/${encodeURIComponent(username)}`);
      setModal({ type: "profile", user: data.user, posts: data.posts });
    } catch (profileError) {
      setError(profileError.message);
    }
  }

  useEffect(() => {
    loadPosts();
    const timer = setInterval(loadPosts, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("circlioFriends", JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("circlioTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <>
      <Navbar
        search={search}
        setSearch={setSearch}
        onHome={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onPost={() => document.querySelector(".composer input")?.focus()}
        onInbox={() => setModal({ type: "messages" })}
        onProfile={() => openProfile(user.username)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((current) => !current)}
      />

      <main className="layout">
        <Feed posts={visiblePosts} error={error} onCreate={loadPosts} onLike={likePost} onProfile={openProfile} onStory={(story) => setModal({ type: "story", story })} />
        <Sidebar user={user} posts={posts} friends={friends} setFriends={setFriends} onLogout={onLogout} onProfile={openProfile} />
      </main>
      <Footer />

      {modal?.type === "story" && (
        <Modal onClose={() => setModal(null)}>
          <div className="story-view" style={{ backgroundImage: `url("${modal.story.image}")` }}><h2>{modal.story.name}</h2></div>
        </Modal>
      )}
      {modal?.type === "messages" && (
        <Modal onClose={() => setModal(null)}>
          <div className="messages">
            <h2>Messages</h2>
            {["maya.frames", "arjun.wild", "daily.pulse"].map((name) => (
              <div className="message-row" key={name}><div className="mini-avatar">{initials(name)}</div><div><strong>{name}</strong><p className="muted">Sent you an update.</p></div></div>
            ))}
          </div>
        </Modal>
      )}
      {modal?.type === "profile" && (
        <Modal onClose={() => setModal(null)}>
          <Profile profileUser={modal.user} posts={modal.posts} currentUser={user} friends={friends} />
        </Modal>
      )}
    </>
  );
}

export default Home;
