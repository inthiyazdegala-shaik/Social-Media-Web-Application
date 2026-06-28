import AuthPage from "./Login";

function Register({ onLogin }) {
  return <AuthPage initialMode="signup" onLogin={onLogin} />;
}

export default Register;
