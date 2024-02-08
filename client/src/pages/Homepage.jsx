import React, { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import Post from "../components/Post";

const apiUrl = import.meta.env.VITE_KEY;

const Homepage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}/post`).then((res) => {
      res.json().then((posts) => {
        setPosts(posts);
        setLoading(false);
      })
      .catch((e)=>{
        console.log("Homepage Catch 1",e);
      })
      .catch((e)=>{
        console.log("Homepage Catch 2");
      })
    });
  }, []);
  return (
    <div className="postAlignment">
      {loading ? (
        <InfinitySpin color="#f47b0c" />
      ) : (
        posts.map((post) => (
            <Post key={post._id} {...post} />
        ))
      )}
    </div>
  );
};

export default Homepage;
