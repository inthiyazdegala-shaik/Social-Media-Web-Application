import { useEffect, useMemo, useState } from "react";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import { initials, pulseTopics, storyUsers, worldPosts } from "../utils";

function PulseHero({ postCount }) {
  return (
    <section className="pulse-hero">
      <div className="pulse-copy">
        <span className="eyebrow">Live social pulse</span>
        <h1>See what people are noticing around the world.</h1>
        <p>Circlio is your real-world feed for community updates, ideas, local moments, and conversations that feel alive.</p>
        <div className="pulse-metrics">
          <span><strong>{postCount}</strong> posts in view</span>
          <span><strong>24h</strong> fresh circle</span>
        </div>
      </div>
      <div className="earth-card" aria-label="World pulse preview">
        <div className="earth-glow" />
        <div className="signal-card signal-one">Climate watch</div>
        <div className="signal-card signal-two">Tech brief</div>
        <div className="signal-card signal-three">City updates</div>
      </div>
    </section>
  );
}

function TopicRail() {
  return (
    <div className="topic-rail" aria-label="Popular topics">
      {pulseTopics.map((topic) => <button type="button" key={topic}>{topic}</button>)}
    </div>
  );
}

function FeedTabs({ mode, setMode, followingCount }) {
  return (
    <div className="feed-tabs" role="tablist">
      <button className={mode === "for-you" ? "active" : ""} type="button" onClick={() => setMode("for-you")}>For you</button>
      <button className={mode === "following" ? "active" : ""} type="button" onClick={() => setMode("following")}>Following {followingCount ? `(${followingCount})` : ""}</button>
      <button className={mode === "world" ? "active" : ""} type="button" onClick={() => setMode("world")}>World</button>
    </div>
  );
}

function Stories({ stories, onAdd, onRemove, onOpen }) {
  return (
    <div className="panel stories">
      <button className="story add-story" type="button" onClick={onAdd}>
        <span className="ring"><span className="avatar">+</span></span>
        <span>Add story</span>
      </button>
      {stories.map((story) => (
        <div className="story-wrap" key={story.name}>
          <button className="story" type="button" onClick={() => onOpen(story)}>
            <span className="ring"><span className="avatar">{initials(story.name)}</span></span>
            <span>{story.name}</span>
          </button>
          <button className="story-remove" type="button" onClick={() => onRemove(story.name)} aria-label={`Remove ${story.name} story`}>x</button>
        </div>
      ))}
    </div>
  );
}

function Feed({ posts, search, friends, setFriends, error, onCreate, onLike, onProfile, onStory }) {
  const [mode, setMode] = useState("for-you");
  const [stories, setStories] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("circlioStories") || "null");
    return Array.isArray(saved) && saved.length ? saved : storyUsers;
  });
  const [hiddenDemoPosts, setHiddenDemoPosts] = useState(() => JSON.parse(localStorage.getItem("circlioHiddenDemoPosts") || "[]"));
  const [likedDemoPosts, setLikedDemoPosts] = useState(() => JSON.parse(localStorage.getItem("circlioLikedDemoPosts") || "[]"));

  const demoPosts = useMemo(() => worldPosts
    .filter((post) => !hiddenDemoPosts.includes(post.id))
    .filter((post) => `${post.username} ${post.place} ${post.caption} ${post.source}`.toLowerCase().includes((search || "").toLowerCase()))
    .map((post) => ({
      ...post,
      liked: likedDemoPosts.includes(post.id),
      likes: Number(post.likes || 0) + (likedDemoPosts.includes(post.id) ? 1 : 0)
    })), [hiddenDemoPosts, likedDemoPosts, search]);

  const followedSources = friends.filter((friend) => worldPosts.some((post) => post.username === friend));
  const displayPosts = [...posts, ...demoPosts]
    .filter((post) => mode !== "following" || friends.includes(post.username) || post.username === posts[0]?.username)
    .filter((post) => mode !== "world" || post.demo);

  useEffect(() => {
    localStorage.setItem("circlioStories", JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem("circlioHiddenDemoPosts", JSON.stringify(hiddenDemoPosts));
  }, [hiddenDemoPosts]);

  useEffect(() => {
    localStorage.setItem("circlioLikedDemoPosts", JSON.stringify(likedDemoPosts));
  }, [likedDemoPosts]);

  function addStory() {
    const nextStory = storyUsers.find((story) => !stories.some((item) => item.name === story.name)) || {
      name: `update ${stories.length + 1}`,
      image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80"
    };
    setStories([nextStory, ...stories]);
  }

  function removeStory(name) {
    setStories(stories.filter((story) => story.name !== name));
  }

  function likePost(post) {
    if (!post.demo) {
      onLike(post.id);
      return;
    }

    setLikedDemoPosts((current) => current.includes(post.id)
      ? current.filter((id) => id !== post.id)
      : [...current, post.id]);
  }

  function hidePost(post) {
    if (post.demo) {
      setHiddenDemoPosts((current) => current.includes(post.id) ? current : [...current, post.id]);
    }
  }

  function followSource(username) {
    if (!friends.includes(username)) {
      setFriends([username, ...friends]);
    }
    setMode("following");
  }

  return (
    <section>
      <PulseHero postCount={displayPosts.length} />
      <TopicRail />
      <FeedTabs mode={mode} setMode={setMode} followingCount={followedSources.length} />
      {mode === "following" && !followedSources.length && (
        <article className="follow-hint">
          <strong>Follow real-world sources</strong>
          <span>Tap Follow on a source below or on the sidebar, then this tab becomes your personal feed.</span>
        </article>
      )}
      <Stories stories={stories} onAdd={addStory} onRemove={removeStory} onOpen={onStory} />
      <CreatePost onCreated={onCreate} />
      {error && <article className="post"><div className="post-body"><p className="muted">{error}</p></div></article>}
      {displayPosts.map((post) => (
        <Post
          key={post.id}
          post={post}
          followed={friends.includes(post.username)}
          onFollow={() => followSource(post.username)}
          onLike={() => likePost(post)}
          onHide={() => hidePost(post)}
          onProfile={onProfile}
        />
      ))}
      {!displayPosts.length && !error && (
        <article className="post empty-state">
          <div className="post-body">
            <span className="empty-icon">+</span>
            <h2>Start the real-world feed</h2>
            <p className="muted">Share a real update, useful signal, local moment, or question people can respond to.</p>
            <button className="primary compact-primary" type="button" onClick={() => document.querySelector(".composer-trigger")?.click()}>Create post</button>
          </div>
        </article>
      )}
    </section>
  );
}

export default Feed;
