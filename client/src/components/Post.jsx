import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_KEY;

function Post({ title, summary, _id, cover, createdAt, author }) {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={`http://localhost:4000/` + cover} alt="pic.jpg" />
        </Link>
      </div>
      <div className="details">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a href="">{author.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}

export default Post;
