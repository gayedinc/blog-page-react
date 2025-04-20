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

  // Yardımcı tarih formatlayıcı
  function formatDateTime(datetimeString) {
    const date = new Date(datetimeString);
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    const datePart = date.toLocaleDateString("tr-TR", options);
    const timePart = date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${datePart} - ${timePart}`;
  }

  return (
    <div className="recent-blog-list">
      {posts.map((post) => (
        <div
          key={post.id}
          className="blogItem-blog"
          onClick={() => (window.location = "/#/detaylar")}>
          <img src={post.imageUrl} alt={post.title} />
          <div className="post-info">
            <span>{formatDateTime(post.created)}</span>
            <p>{post.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
