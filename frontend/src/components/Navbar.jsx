function Navbar({ search, setSearch, onHome, onPost, onInbox, onProfile, darkMode, onToggleTheme }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand brand-button" type="button" onClick={onHome}>Circlio</button>
        <label className="search-wrap">
          <span>⌕</span>
          <input className="search" value={search} onChange={(e) => setSearch(e.target.value)} type="search" placeholder="Search people, posts, places" />
        </label>
        <nav className="actions" aria-label="Dashboard actions">
          <button className="icon-btn active" type="button" onClick={onHome} title="Home"><span>⌂</span><small>Home</small></button>
          <button className="icon-btn" type="button" onClick={() => document.querySelector(".search")?.focus()} title="Search"><span>⌕</span><small>Search</small></button>
          <button className="icon-btn create-action" type="button" onClick={onPost} title="Create post"><span>＋</span><small>Post</small></button>
          <button className="icon-btn" type="button" onClick={onInbox} title="Messages"><span>✉</span><small>Inbox</small></button>
          <button className="icon-btn" type="button" onClick={onToggleTheme} title="Toggle theme"><span>{darkMode ? "☀" : "☾"}</span><small>Theme</small></button>
          <button className="icon-btn profile-nav" type="button" onClick={onProfile} title="Profile"><span>●</span><small>Profile</small></button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
