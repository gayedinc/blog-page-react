import { useEffect, useRef, useState } from "react";

export default function Blog() {
  const [page, setPage] = useState(<Home changePage={changePage} />);

  function changePage(id) {
    if (id === null) {
      setPage(<Home changePage={changePage} />);
      return;
    }

    setPage(<Detail id={id} changePage={changePage} />);
  }

  function openEditor() {
    setPage(<Editor changePage={changePage} />);
  }

  return (
    <>
      <p style={{ textAlign: "right" }}>
        <button onClick={openEditor}>Editör</button>
      </p>
      {page}
    </>
  );
}

function Home({ changePage }) {
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
    <>
      <h1>Blog Anasayfa</h1>
      {posts.map((x) => (
        <BlogListItem key={x.id} {...x} changePage={changePage} />
      ))}
    </>
  );
}

function BlogListItem({ id, title, summary, created, imageUrl, changePage }) {
  return (
    <div className="blogItem" onClick={() => changePage(id)}>
      <h3>{title}</h3>
      <p>{summary}</p>
      <img src={imageUrl} alt="" />
      <p>
        <em>{created}</em>
      </p>
      <hr />
    </div>
  );
}

function Detail({ id, changePage }) {
  const [content, setContent] = useState();

  useEffect(() => {
    async function getData() {
      const data = await fetch(
        `https://gayedinc.pythonanywhere.com/posts/${id}`
      ).then((r) => r.json());
      setContent(data);
    }

    getData();
  }, []);

  return (
    <>
      <p>
        <small onClick={() => changePage(null)}>geri</small>
      </p>
      <h1>{content?.title}</h1>
      <p>{content?.summary}</p>
      <p>{content?.body}</p>
      <img src={content?.imageUrl} alt="" />
      <hr />
      <p>Bu yazı {content?.created} tarihinde yazıldı.</p>
    </>
  );
}

function Editor({ changePage }) {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(false);
  const dialogRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    async function getData() {
      const data = await fetch(
        "https://gayedinc.pythonanywhere.com/posts"
      ).then((r) => r.json());
      setPosts(data);
    }

    getData();

    setUsername(prompt('Username'));
    setPassword(prompt('Password'));
  }, []);

  async function handleEdit(post) {
    const data = await fetch(
      `https://gayedinc.pythonanywhere.com/posts/${post.id}`
    ).then((r) => r.json());
    setEditingPost(data);
    dialogRef.current.showModal();
  }

  async function handleSubmit(e) {
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
        posts.map((post) => (post.id === updatedPost.id ? { ...post, ...formObj } : post))
      );
      setEditingPost(true);
    } else {
      const request = await fetch(
        "https://gayedinc.pythonanywhere.com/posts",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${username}:${password}`)}`

          },
          method: "POST",
          body: JSON.stringify(formObj),
        }
      )

      // kontrol yapıp akışı kestim
      if (!request.ok) {
        alert('ekleme yapılamadı.');
        return;
      }

      const newPost = await request.json();

      console.log(newPost);

      setPosts([...posts, newPost]);
      e.target.reset();
    }
    setEditingPost(false);

    dialogRef.current.close();
  }

  async function removePost(id) {
    if (!confirm("Emin misin?")) {
      return;
    }

    await fetch(`https://gayedinc.pythonanywhere.com/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`
      }
    });

    setPosts(posts.filter((x) => x.id !== id));
  }

  function goBack() {
    changePage(null);
  }

  return (
    <>
      <p>
        <button onClick={() => dialogRef.current.showModal()}>Yeni</button>
      </p>
      <ul>
        {posts.map((x) => (
          <li key={x.id}>
            {x.title} -
            <a
              href="#"
              onClick={() => {
                setEditingPost(x);
                handleEdit(x);
                dialogRef.current.showModal();
              }}
            >
              düzenle
            </a>{" "}
            -
            <a href="#" onClick={() => removePost(x.id)}>
              sil
            </a>
          </li>
        ))}
      </ul>
      <button onClick={goBack}>Back</button>
      <dialog ref={dialogRef}>
        <form onSubmit={handleSubmit} method="dialog" autoComplete="off">
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
              defaultValue={editingPost?.body || ''}
            ></textarea>
          </p>
          <p>
            <input required type="text" name="imageUrl" placeholder="Image URL" defaultValue={editingPost?.imageUrl || ''} />
          </p>
          <p>
            <button>{editingPost ? "Kaydet" : "Ekle"}</button>
          </p>
        </form>
      </dialog>
    </>
  );
}