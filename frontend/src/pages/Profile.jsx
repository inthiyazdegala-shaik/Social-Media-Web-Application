import { initials } from "../utils";

function Profile({ profileUser, posts, currentUser, friends }) {
  return (
    <div className="profile-modal-body">
      <div className="profile-cover" />
      <div className="profile-modal-head">
        <div className="mini-avatar">{initials(profileUser.username)}</div>
        <div><h2>{profileUser.name || profileUser.username}</h2><p className="muted">@{profileUser.username}</p></div>
      </div>
      <div className="stats">
        <div className="stat"><strong>{posts.length}</strong><span>posts</span></div>
        <div className="stat"><strong>2.4k</strong><span>followers</span></div>
        <div className="stat"><strong>{profileUser.username === currentUser.username ? friends.length : 0}</strong><span>circle</span></div>
      </div>
      <p className="muted">{profileUser.bio || "Sharing on Circlio."}</p>
      <div className="profile-grid">
        {posts.map((post) => <div className="profile-grid-item" key={post.id} title={post.caption} style={{ backgroundImage: `url("${post.image}")` }} />)}
      </div>
    </div>
  );
}

export default Profile;
