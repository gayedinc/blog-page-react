import { useEffect, useState } from "react";

export default function Detail() {
  const [content, setContent] = useState([]); // Tüm içerikleri tutacak state

  useEffect(() => {
    async function getData() {
      const data = await fetch(
        "https://gayedinc.pythonanywhere.com/posts"
      ).then((r) => r.json());
      setContent(data);
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
    <>
      {content.length > 0 ?
        <div className="blog-list">
          {content.map((post) => (
            <div key={post.id} className="blogItem">
              <img src={post.imageUrl} alt={post.title} />
              <div className="blog-info">
                <span>{formatDateTime(post.created)}</span>
                <h3>{post.title}</h3>
                <h4>{post.summary}</h4>
                <p>{post.body}</p>
              </div>
            </div>
          ))}
        </div>
        : (
          <p>Blog yazıları yükleniyor...</p>
        )}
    </>
  );
}
