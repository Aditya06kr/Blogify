import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { CiLogin } from "react-icons/ci";
import blog from "../assets/blogger.png";

const apiUrl=import.meta.env.VITE_KEY; 

function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  useEffect(() => {
    fetch(`http://localhost:4000/profile`, {
      credentials: "include",
    }).then(res => {
      res.json().then(userDetails => {
        setUserInfo(userDetails);
      })
      .catch((e)=>{
        console.log("Catch 1");
      });
    })
    .catch((e)=>{
      console.log("Catch 2");
    });
  }, []);

  function logout() {
    fetch(`http://localhost:4000/logout`, {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;
  return (
    <header>
      <Link id="logo" to="/">
        <img src={blog} alt="BlogImage" />
        <h4>BLOGIFY</h4>
      </Link>
      <nav className="nav-btn">
        {username && (
          <>
            <Link to="/create"><button className="header-btn"><span>Add Post<CiLogin /></span></button></Link>
            <a onClick={logout}><button className="header-btn"><span>LogOut<CiLogin /></span></button></a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login"><button className="header-btn"><span>Login<CiLogin /></span></button></Link>
            <Link to="/register"><button className="header-btn"><span>Register<CiLogin /></span></button></Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
