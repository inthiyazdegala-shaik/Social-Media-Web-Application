function Navbar({ search, setSearch, onHome, onPost, onInbox, onProfile }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">Circlio</div>
        <input className="search" value={search} onChange={(e) => setSearch(e.target.value)} type="search" placeholder="Search" />
        <nav className="actions" aria-label="Dashboard actions">
          <button className="icon-btn" type="button" onClick={onHome}>Home</button>
          <button className="icon-btn" type="button" onClick={() => document.querySelector(".search")?.focus()}>Search</button>
          <button className="icon-btn" type="button" onClick={onPost}>Post</button>
          <button className="icon-btn" type="button" onClick={onInbox}>Inbox</button>
          <button className="icon-btn" type="button" onClick={onProfile}>Profile</button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
