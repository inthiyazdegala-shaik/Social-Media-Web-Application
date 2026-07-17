import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import { initials, storyUsers } from "../utils";

function Stories({ onOpen }) {
  return (
    <div className="panel stories">
      <button className="story add-story" type="button" onClick={() => onOpen({ name: "your story", image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80" })}>
        <span className="ring"><span className="avatar">＋</span></span>
        <span>Your story</span>
      </button>
      {storyUsers.map((story) => (
        <button className="story" key={story.name} type="button" onClick={() => onOpen(story)}>
          <span className="ring"><span className="avatar">{initials(story.name)}</span></span>
          <span>{story.name}</span>
        </button>
      ))}
    </div>
  );
}

function Feed({ posts, error, onCreate, onLike, onProfile, onStory }) {
  return (
    <section>
      <Stories onOpen={onStory} />
      <CreatePost onCreated={onCreate} />
      {error && <article className="post"><div className="post-body"><p className="muted">{error}</p></div></article>}
      {posts.map((post) => <Post key={post.id} post={post} onLike={onLike} onProfile={onProfile} />)}
      {!posts.length && !error && (
        <article className="post empty-state">
          <div className="post-body">
            <span className="empty-icon">＋</span>
            <h2>No posts yet</h2>
            <p className="muted">Start the circle by sharing your first moment, campus update, or photo.</p>
            <button className="primary compact-primary" type="button" onClick={() => document.querySelector(".composer-trigger")?.click()}>Create post</button>
          </div>
        </article>
      )}
    </section>
  );
}

export default Feed;
