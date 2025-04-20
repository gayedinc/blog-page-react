# 📖 Blog Page React

> A modern React blog application featuring hash routing, theme switching, and full CRUD operations.

## 🔍 Project Overview

**Blog Page React** is a single-page application built using React and Vite, offering seamless navigation without page reloads through hash-based routing.  
Main sections include:

- **Home**: Highlights of recent posts  
- **About**: Personal info section  
- **Blog**: Full list of blog posts  
- **Detail**: Full content view of selected posts  
- **Editor**: Authenticated area for creating, editing, and deleting blog posts

![image](https://github.com/user-attachments/assets/974f9229-3010-415a-96a5-29e1ff106a5e)

## 🚀 Key Features

### 📌 Hash Routing

- Routes like `#/`, `#/hakkinda`, `#/blog`, `#/detaylar`, `#/editor` are mapped to corresponding components.
- Enables dynamic content rendering without full page reload.

### 🌙 Theme Management

- Uses `ThemeContext` and `useContext` to provide light/dark mode toggle.
- The selected theme is saved in `localStorage` and persists across sessions.

![image](https://github.com/user-attachments/assets/29704761-0520-426b-8328-f3ec1257e3e9)

### 🖥️ Home & Blog Listing

- Posts are fetched from `https://gayedinc.pythonanywhere.com/posts`.
- **Home** displays the most recent blog posts in a grid layout.
- **Blog** shows a complete list of posts.
- Clicking on a post redirects the user to the detail view.

### 📄 Post Detail View

- Each post shows its image, title, date, summary, and full content.
- A loading state is displayed while data is being fetched.

![image](https://github.com/user-attachments/assets/6fd76c50-16af-42e7-a24f-50c7280198fe)

### ✍️ Editor (CRUD)

![image](https://github.com/user-attachments/assets/1f099e70-ca6b-4e85-bbb3-023537703ff4)

- The **Login Modal** validates the username and password.

![image](https://github.com/user-attachments/assets/904c2459-54f3-45e8-afb4-d9498dedcb92)

- The **Editor Modal** allows adding new posts or editing existing ones.

![image](https://github.com/user-attachments/assets/c2aa6172-ef11-420c-b6f9-af9c1a02a9af)  
![image](https://github.com/user-attachments/assets/85c5e3f3-0bb0-40fd-ad38-16dc204551f5)

- Posts cannot be deleted without confirmation from the user.

![image](https://github.com/user-attachments/assets/d7906b2c-8cba-49be-be63-4cf7fd7312a1)

- If the user is **not admin**, or login credentials do not match the admin credentials, any changes made to the blog posts **will not be saved**.
- Only the **admin user** has permission to add, edit, or delete blog posts.
- All API requests are securely sent with the `Authorization: Basic` header.

## 🌐 Live Demo

🔗 [https://blog-page-react-two.vercel.app](https://blog-page-react-two.vercel.app)

## 🛠️ Technologies & Tools

- React (Hooks, Context)  
- Vite (development server, fast builds)  
- Fetch API for HTTP requests  
- Dialog API for modal handling  
- LocalStorage (for theme and auth persistence)  
- CSS Flexbox & Media Queries (responsive design)
