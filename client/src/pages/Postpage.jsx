import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { MdDeleteOutline } from "react-icons/md";
import { RiEditBoxLine } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_KEY;

const Postpage = () => {
  const { id } = useParams();
  const [postinfo, setPostinfo] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch(`${apiUrl}/post/${id}`).then((res) => {
      res.json().then((postInfo) => {
        setPostinfo(postInfo);
      });
    });
  }, []);

  if (!postinfo) return;

  async function Delete_Post() {
    if (!confirm("Are You Sure ?")) return;

    const res = await fetch(`${apiUrl}/Delete`, {
      method: "DELETE",
      body: JSON.stringify({ id: postinfo._id }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (res.ok) {
      toast.success("Post Deleted Successfully");
      setRedirect(true);
    } else {
      alert("Unable to Delete");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="post-page">
      <h1>{postinfo.title}</h1>
      <time>{formatISO9075(new Date(postinfo.createdAt))}</time>
      <div className="author">by @{postinfo.author.username}</div>
      {userInfo?.id === postinfo.author._id && (
        <div id="post-features">
          <div className="edit-delete">
            <Link to={`/edit/${postinfo._id}`}>
              <button className="all-btns">
                <span>
                  Edit
                  <RiEditBoxLine />
                </span>
              </button>
            </Link>
          </div>
          <div className="edit-delete">
            <button className="all-btns" onClick={Delete_Post}>
              <span>
                Delete
                <MdDeleteOutline />
              </span>
            </button>
          </div>
        </div>
      )}
      <div className="image">
        <img src={`${apiUrl}/${postinfo.cover}`} alt="Hello" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postinfo.content }}
      />
    </div>
  );
};

export default Postpage;
