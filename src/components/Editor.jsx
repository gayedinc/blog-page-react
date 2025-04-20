import { useEffect, useState, useRef, useContext } from "react";
import { ThemeContext } from "../App";

export default function Editor() {
  const { theme } = useContext(ThemeContext);

  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  const [deletePostId, setDeletePostId] = useState(null);

  const [username, setUsername] = useState(localStorage.username || "");
  const [password, setPassword] = useState(localStorage.password || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.username);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loginRef = useRef();
  const blogRef = useRef();
  const deleteRef = useRef();

  useEffect(() => {
    async function getData() {
      const data = await fetch("https://gayedinc.pythonanywhere.com/posts").then((r) => r.json());
      setPosts(data);
    }
    getData();
  }, []);

  function openBlogModal(post = null) {
    setEditingPost(post);
    setIsBlogModalOpen(true);
  }

  function handleLogin(e) {
    e.preventDefault();
    localStorage.username = username;
    localStorage.password = password;
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formObj = Object.fromEntries(new FormData(e.target));

    if (editingPost) {
      const updatedPost = await fetch(
        `https://gayedinc.pythonanywhere.com/posts/${editingPost.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
          method: "PUT",
          body: JSON.stringify(formObj),
        }
      ).then((r) => r.json());

      setPosts(posts.map((post) => (post.id === updatedPost.id ? { ...post, ...formObj } : post)));
      setEditingPost(null);
    } else {
      const request = await fetch("https://gayedinc.pythonanywhere.com/posts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
        method: "POST",
        body: JSON.stringify(formObj),
      });

      if (!request.ok) {
        alert("Ekleme yapılamadı.");
        return;
      }

      const newPost = await request.json();
      setPosts([...posts, newPost]);
      e.target.reset();
    }

    setIsBlogModalOpen(false);
  }

  function confirmDelete(id) {
    setDeletePostId(id);
    setIsDeleteOpen(true);
  }

  async function removePost() {
    if (!deletePostId) return;

    await fetch(`https://gayedinc.pythonanywhere.com/posts/${deletePostId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
    });

    setPosts(posts.filter((x) => x.id !== deletePostId));
    setIsDeleteOpen(false);
  }

  function handleOutsideClick(e, ref, onClose) {
    if (ref.current && !ref.current.contains(e.target)) {
      onClose();
    }
  }

  useEffect(() => {
    function handleAllModals(e) {
      handleOutsideClick(e, loginRef, () => setIsLoginOpen(false));
      handleOutsideClick(e, blogRef, () => setIsBlogModalOpen(false));
      handleOutsideClick(e, deleteRef, () => setIsDeleteOpen(false));
    }

    document.addEventListener("mousedown", handleAllModals);
    return () => document.removeEventListener("mousedown", handleAllModals);
  }, []);

  return (
    <>
      <div className="head-btn-area">
        <button className="addBtn" onClick={() => openBlogModal()}>
          Yeni Blog
        </button>
        <button className="logBtn" onClick={() => setIsLoginOpen(true)}>
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
      {isLoginOpen && (
        <div className="modal-overlay login-overlay">
          <div className="modal-content login-modal" ref={loginRef}>
            <h2>Giriş Yap</h2>
            <form onSubmit={handleLogin} autoComplete="off">
              <input
                type="text"
                placeholder="Kullanıcı Adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Giriş Yap</button>
            </form>
            <img
              src={theme === "dark-mode" ? "/img/hamburger-menu-close-dark.svg" : "/img/hamburger-menu-close-icon.svg"}
              alt="Kapat"
              className="close-img"
              onClick={() => setIsLoginOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {isBlogModalOpen && (
        <div className="modal-overlay blog-overlay">
          <div className="modal-content blog-modal" ref={blogRef}>
            <h2>{editingPost ? "Düzenle" : "Yeni Blog Yazısı Ekle"}</h2>
            <img
              src={theme === "dark-mode" ? "/img/hamburger-menu-close-dark.svg" : "/img/hamburger-menu-close-icon.svg"}
              alt="Kapat"
              className="close-img"
              onClick={() => setIsBlogModalOpen(false)}
            />
            <form onSubmit={handleSubmit} autoComplete="off">
              <input required name="title" placeholder="Başlık" defaultValue={editingPost?.title || ""} />
              <input required name="summary" placeholder="Özet" defaultValue={editingPost?.summary || ""} />
              <textarea required name="body" placeholder="İçerik" rows={4} defaultValue={editingPost?.body || ""}></textarea>
              <input required name="imageUrl" placeholder="Image URL" defaultValue={editingPost?.imageUrl || ""} />
              <button>{editingPost ? "Kaydet" : "Ekle"}</button>
            </form>
          </div>
        </div>
      )}

      {/* Silme Modalı */}
      {isDeleteOpen && (
        <div className="modal-overlay delete-overlay">
          <div className="modal-content delete-modal" ref={deleteRef}>
            <h2>Silmek istediğine emin misin?</h2>
            <div className="dialog-buttons">
              <button className="deleteConfirmBtn" onClick={removePost}>Sil</button>
              <button className="closeDialogBtn" onClick={() => setIsDeleteOpen(false)}>Kapat</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};