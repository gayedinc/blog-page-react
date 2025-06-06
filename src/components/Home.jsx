import { useEffect, useState } from "react";

export default function Home() {

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
    <>
      <div className="home-content">
        <h1>Blog sayfama hoş geldiniz.</h1>
        <p>Bu sayfada blog yazılarımı görebilir, detay sayfasında inceleyebilirsiniz. Editör üzerinden ise yeni blog eklenebiliyor, düzenlenebiliyor veya silinebiliyor. Blog editlerken yetkisiz erişimin önüne geçmek için editör sayfasında kimlik doğrulama sistemi vardır.
        </p>
      </div>
      <div className="recent-blog">
        <h3>Son Bloglar</h3>
        <div className="recent-blog-list">
          {posts.map((post) => (
            <div key={post.id} className="blogItem-blog" onClick={() => (window.location = "/#/detaylar")}>
              <img src={post.imageUrl} alt={post.title} />
              <div className="post-info">
                <span>{formatDateTime(post.created)}</span>
                <p>{post.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
