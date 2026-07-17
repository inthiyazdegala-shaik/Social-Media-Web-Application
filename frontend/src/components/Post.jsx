import { initials } from "../utils";

function Post({ post, onLike, onProfile }) {
  const createdAt = post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Today";

  return (
    <article className="post">
      <header className="post-head">
        <button className="mini-avatar profile-button" type="button" onClick={() => onProfile(post.username)}>{initials(post.username)}</button>
        <div>
          <button className="post-user" type="button" onClick={() => onProfile(post.username)}>{post.username}</button>
          <div className="post-place">{post.place} · {createdAt}</div>
        </div>
        <button className="more-btn" type="button" aria-label="More options">•••</button>
      </header>
      <div className="post-image" style={{ backgroundImage: `url("${post.image}")` }} />
      <div className="post-body">
        <div className="post-tools">
          <button className={`icon-btn like-btn ${post.liked ? "active" : ""}`} type="button" onClick={() => onLike(post.id)}><span>{post.liked ? "♥" : "♡"}</span><small>{post.liked ? "Liked" : "Like"}</small></button>
          <button className="icon-btn" type="button"><span>◌</span><small>Comment</small></button>
          <button className="icon-btn" type="button"><span>↗</span><small>Share</small></button>
          <button className="icon-btn save-btn" type="button"><span>◇</span><small>Save</small></button>
        </div>
        <div className="likes">{Number(post.likes || 0).toLocaleString()} likes</div>
        <p className="caption"><strong>{post.username}</strong>{post.caption}</p>
        <p className="comments">View all {post.comments || 0} comments</p>
      </div>
    </article>
  );
}

export default Post;
