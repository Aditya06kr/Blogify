import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { RiContactsLine } from "react-icons/ri";
import { MdOutlineAddToPhotos, MdOutlineLogin, MdLogout } from "react-icons/md";
import blog from "../assets/blogger.png";

const apiUrl = import.meta.env.VITE_KEY;

function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  useEffect(() => {
    fetch(`${apiUrl}/profile`, {
      credentials: "include",
    })
      .then((res) => {
        res
          .json()
          .then((userDetails) => {
            setUserInfo(userDetails);
          })
          .catch((e) => {
            console.log("Catch 1");
          });
      })
      .catch((e) => {
        console.log("Catch 2");
      });
  }, []);

  async function logout() {
    const res = await fetch(`http://localhost:4000/logout`, {
      credentials: "include",
      method: "POST",
    });
    if (res.ok) setUserInfo(null);
    else console.log("Unable to Logout");
  }

  const username = userInfo?.username;
  return (
    <header>
      <Link id="logo" to="/">
        <img src={blog} alt="BlogImage" />
        <h4 style={{ color: "black", fontSize: "37px" }}>
          B<span style={{ fontSize: "28px" }}>LOGIFY</span>
        </h4>
      </Link>
      <nav className="nav-btn">
        {username && (
          <div className="header-btn-block">
            <Link to="/create">
              <div className="header-btn">
                <span>
                  Add Post
                  <MdOutlineAddToPhotos />
                </span>
              </div>
            </Link>
            <a onClick={logout}>
              <div className="header-btn">
                <span>
                  LogOut
                  <MdLogout />
                </span>
              </div>
            </a>
          </div>
        )}
        {!username && (
          <div className="header-btn-block">
            <Link to="/login">
              <div className="header-btn">
                <span>
                  Login
                  <MdOutlineLogin />
                </span>
              </div>
            </Link>
            <Link to="/register">
              <div className="header-btn">
                <span>
                  Register
                  <RiContactsLine />
                </span>
              </div>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
