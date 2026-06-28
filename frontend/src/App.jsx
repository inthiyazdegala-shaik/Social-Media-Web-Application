import { useState } from "react";
import { clearAuth, getStoredAuth } from "./api";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  const [auth, setAuth] = useState(getStoredAuth());

  function logout() {
    clearAuth();
    setAuth({ token: null, user: null });
  }

  return auth.token && auth.user
    ? <Home user={auth.user} onLogout={logout} />
    : <Login onLogin={(user) => setAuth({ token: localStorage.getItem("circlioToken"), user })} />;
}

export default App;
