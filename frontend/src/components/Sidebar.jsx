import { useState } from "react";
import { initials, suggestionUsers } from "../utils";

function FriendForm({ onAdd }) {
  const [value, setValue] = useState("");
  return (
    <form className="friend-form" onSubmit={(event) => {
      event.preventDefault();
      onAdd(value);
      setValue("");
    }}>
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Add friend username" />
      <button type="submit">Add</button>
    </form>
  );
}

function Sidebar({ user, posts, friends, setFriends, onLogout, onProfile }) {
  const ownPosts = posts.filter((post) => post.username === user?.username).length;

  function addFriend(name) {
    const clean = name.trim().replace(/^@/, "");
    if (clean && !friends.includes(clean)) setFriends([clean, ...friends]);
  }

  return (
    <aside className="sidebar">
      <section className="panel profile">
        <div className="profile-head">
          <div className="mini-avatar">{initials(user?.username)}</div>
          <div>
            <h1>{user?.name || user?.username}</h1>
            <p className="muted">@{user?.username}</p>
          </div>
        </div>
        <div className="stats">
          <div className="stat"><strong>{ownPosts}</strong><span>posts</span></div>
          <div className="stat"><strong>2.4k</strong><span>followers</span></div>
          <div className="stat"><strong>{friends.length}</strong><span>circle</span></div>
        </div>
        <p className="muted">{user?.bio || "Building my circle on Circlio."}</p>
        <button className="logout" type="button" onClick={onLogout}>Log out</button>
      </section>

      <section className="panel suggestions">
        <h2>Suggested for you</h2>
        {suggestionUsers.map((name) => (
          <div className="suggestion" key={name}>
            <button className="profile-head profile-link" type="button" onClick={() => onProfile(name)}>
              <span className="mini-avatar">{initials(name)}</span>
              <span><strong>{name}</strong><span className="muted">Popular on Circlio</span></span>
            </button>
            <button className="follow" type="button" onClick={() => addFriend(name)}>Follow</button>
          </div>
        ))}
      </section>

      <section className="panel circle-panel">
        <h2>Your Social Circle</h2>
        <FriendForm onAdd={addFriend} />
        {friends.map((friend) => (
          <div className="suggestion" key={friend}>
            <button className="profile-head profile-link" type="button" onClick={() => onProfile(friend)}>
              <span className="mini-avatar">{initials(friend)}</span>
              <span><strong>{friend}</strong><span className="muted">In your circle</span></span>
            </button>
            <button className="follow" type="button" onClick={() => setFriends(friends.filter((item) => item !== friend))}>Remove</button>
          </div>
        ))}
      </section>
    </aside>
  );
}

export default Sidebar;
