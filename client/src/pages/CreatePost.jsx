import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";

const apiUrl=import.meta.env.VITE_KEY;

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect,setRedirect]=useState(false);
  async function createNewPost(e) {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    console.log(files);
    const res = await fetch(`${apiUrl}/post`, {
      method: "POST",
      body: data,
      credentials:"include",
    });

    if (res.ok) {
      setRedirect(true);
    }
  }

  if(redirect){
    return <Navigate to={'/'} />
  }
  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder="Title of your Blog"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="summary"
        placeholder="Add a Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input type="file" onChange={(e) => setFiles(e.target.files)} />
      <ReactQuill
        value={content}
        modules={modules}
        onChange={(e) => setContent(e)}
      />
      <button style={{ marginTop: "7px" }}>Create Post</button>
    </form>
  );
};

export default CreatePost;
