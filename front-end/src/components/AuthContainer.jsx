import Login from "./Login";
import Signup from "./Signup";
import { useState } from "react"; // Added missing useState and useEffect import

const AuthContainer = ({ onLoginClick }) => {
  function onSignUpClick() {
    console.log("Clicked Sign up!");
    setIsLogin(false);
  }

  function onBackToLogin() {
    console.log("Successfully signed up!");
    setIsLogin(true);
  }

  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <Login onLogin={onLoginClick} onSignUpClick={onSignUpClick} />
      ) : (
        <Signup onBackToLogin={onBackToLogin} />
      )}
    </div>
  );
};

export default AuthContainer;
