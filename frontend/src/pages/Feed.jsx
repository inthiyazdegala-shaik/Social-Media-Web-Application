import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import { initials, storyUsers } from "../utils";

function Stories({ onOpen }) {
  return (
    <div className="panel stories">
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
      {!posts.length && !error && <article className="post"><div className="post-body"><p className="muted">No posts found.</p></div></article>}
    </section>
  );
}

export default Feed;
