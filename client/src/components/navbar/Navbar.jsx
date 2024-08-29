import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext)

  const fetch = useNotificationStore(state => state.fetch);
  const number = useNotificationStore(state => state.number);

  if (currentUser) {
    fetch();
  }

  return (
    <nav>
      <div className="left">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>HomeQuest</span>
        </Link>
        <Link to="/">Home</Link>
        <Link to="/list">Deals</Link>
        <Link to="/">About</Link>
        <Link to="/">Contact</Link>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img
              src={currentUser.avatar || './noAvatar.jpg'}
              alt=""
            />
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
              {number > 0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/register" className="register">Sign up</Link>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <Link to="/">Home</Link>
          <Link to="/list">Deals</Link>
          <Link to="/">About</Link>
          <Link to="/">Contact</Link>

          {!currentUser ? (
            <>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Sign up</Link>
            </>
            ) :
            <Link to="/profile">Profile</Link>
          }
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
