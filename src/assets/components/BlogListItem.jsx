import { useEffect, useState } from "react";

export default function BlogListItem() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getData() {
      const data = await fetch(
        "https://gayedinc.pythonanywhere.com/posts"
      ).then((r) => r.json());
      setPosts(data);
    }

    getData();
  }, []);

  return (
    <div className="recent-blog-list">
      {posts.map((post) => (
        <div key={post.id} className="blogItem-blog" onClick={() => (window.location = "/#/detaylar")}>
          <img src={post.imageUrl} alt={post.title} />
          <div className="post-info">
            <span>{post.created}</span>
            <p>{post.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
