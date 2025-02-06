import { useEffect, useState, useRef, useContext } from "react";
import { ThemeContext } from "../App";

export default function Editor() {
  const { theme } = useContext(ThemeContext);
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const blogDialogRef = useRef(null);
  const loginDialogRef = useRef(null);
  const deleteDialogRef = useRef(null);
  const [deletePostId, setDeletePostId] = useState(null);
  const [username, setUsername] = useState(localStorage.username || "");
  const [password, setPassword] = useState(localStorage.password || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.username); // daha önce giriş yapıldı mı kontrolü

  useEffect(() => {
    async function getData() {
      const data = await fetch("https://gayedinc.pythonanywhere.com/posts")
        .then((r) => r.json());
      setPosts(data);
    }

    getData();
  }, []);

  function openBlogModal(post = null) {
    setEditingPost(post);
    blogDialogRef.current.showModal();
  }

  function openLoginModal() {
    loginDialogRef.current.showModal();
  }

  function handleLogin(e) {
    e.preventDefault();
    localStorage.username = username;
    localStorage.password = password;
    setIsLoggedIn(true);
    loginDialogRef.current.close();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);

    if (editingPost) {
      const updatedPost = await fetch(
        `https://gayedinc.pythonanywhere.com/posts/${editingPost.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${username}:${password}`)}`
          },
          method: "PUT",
          body: JSON.stringify(formObj),
        }
      ).then((r) => r.json());
      setPosts(
        posts.map((post) =>
          post.id === updatedPost.id ? { ...post, ...formObj } : post
        )
      );
      setEditingPost(null);
    } else {
      const request = await fetch("https://gayedinc.pythonanywhere.com/posts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${username}:${password}`)}`
        },
        method: "POST",
        body: JSON.stringify(formObj),
      });

      if (!request.ok) {
        alert('Ekleme yapılamadı.');
        return;
      }

      const newPost = await request.json();
      setPosts([...posts, newPost]);
      e.target.reset();
    }
    blogDialogRef.current.close();
  }

  function confirmDelete(id) {
    setDeletePostId(id);
    deleteDialogRef.current.showModal();
  }

  async function removePost() {
    if (!deletePostId) return;

    await fetch(`https://gayedinc.pythonanywhere.com/posts/${deletePostId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`
      }
    });

    setPosts(posts.filter((x) => x.id !== deletePostId));
    deleteDialogRef.current.close();
  }

  return (
    <>
      <div className="head-btn-area">
        <button className="addBtn" onClick={() => openBlogModal()}>Yeni Blog</button>
        <button className="logBtn" onClick={openLoginModal}>
          {isLoggedIn ? "Yeniden Giriş" : "Giriş Yap"}
        </button>
      </div>

      <div className="edit-blog-area">
        <ul>
          {posts.map((x) => (
            <li key={x.id}>
              <h2>{x.title}</h2>
              <h4>{x.summary}</h4>
              <div className="edit-btn-area">
                <button className="editBtn" onClick={() => openBlogModal(x)}>Düzenle</button>
                <button className="deleteBtn" onClick={() => confirmDelete(x.id)}>Sil</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Giriş Modalı */}
      <dialog ref={loginDialogRef} className="login-dialog">
        <h2>Giriş Yap</h2>
        <form onSubmit={handleLogin} autoComplete="off">
          <p>
            <input
              type="text"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </p>
          <p>
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </p>
          <button type="submit">Giriş Yap</button>
        </form>
        <img
          src={theme === "dark-mode" ? "/img/hamburger-menu-close-dark.svg" : "/img/hamburger-menu-close-icon.svg"}
          alt="Hamburger Menu Close"
          onClick={() => loginDialogRef.current.close()}
        />
      </dialog>

      {/* Blog Ekleme ve Düzenleme Modalı */}
      <dialog ref={blogDialogRef}>
        <h2>{editingPost ? "Düzenle" : "Yeni Blog Yazısı Ekle"}</h2>
        <img
          src={theme === "dark-mode" ? "/img/hamburger-menu-close-dark.svg" : "/img/hamburger-menu-close-icon.svg"}
          alt="Hamburger Menu Close"
          onClick={() => blogDialogRef.current.close()}
        />
        <form onSubmit={handleSubmit} autoComplete="off">
          <p>
            <input required type="text" name="title" placeholder="Başlık" defaultValue={editingPost?.title || ''} />
          </p>
          <p>
            <input required type="text" name="summary" placeholder="Özet" defaultValue={editingPost?.summary || ''} />
          </p>
          <p>
            <textarea
              required
              name="body"
              placeholder="İçerik"
              rows={4}
              cols={40}
              defaultValue={editingPost?.body || ''}></textarea>
          </p>
          <p>
            <input required type="text" name="imageUrl" placeholder="Image URL" defaultValue={editingPost?.imageUrl || ''} />
          </p>
          <button className="saveBtn">{editingPost ? "Kaydet" : "Ekle"}</button>
        </form>
      </dialog>

      {/* Silme Onayı Modalı */}
      <dialog ref={deleteDialogRef} className="delete-dialog">
        <h2>Silmek istediğine emin misin?</h2>
        <div className="dialog-buttons">
          <button className="deleteConfirmBtn" onClick={removePost}>Sil</button>
          <button className="closeDialogBtn" onClick={() => deleteDialogRef.current.close()}>Kapat</button>
        </div>
      </dialog>
    </>
  );
}
