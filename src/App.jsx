import { createContext, useEffect, useState } from "react";
import Home from "./assets/components/Home";
import About from "./assets/components/About";
import BlogListItem from "./assets/components/BlogListItem";
import Detail from "./assets/components/Detail";
import Editor from "./assets/components/Editor";
import NotFound from "./assets/components/NotFound";
import "./assets/css/darkMode.css";

const routes = [
  { title: "ANASAYFA", url: "/", component: <Home /> },
  { title: "HAKKIMDA", url: "/hakkinda", component: <About /> },
  { title: "BLOG", url: "/blog", component: <BlogListItem /> },
  { title: "DETAYLAR", url: "/detaylar", component: <Detail /> },
  { title: "EDİTÖR", url: "/editor", component: <Editor /> },
];

const notFound = { component: <NotFound /> };

export function getPage(url) {
  return routes.findLast((x) => url.startsWith(x.url)) ?? notFound;
}

export function getUrlParam() {
  const parts = location.hash.substring(1).split('/');
  return parts.length > 2 ? parts[2] : null;  // id varsa al yoksa null dön
}

export const PageContext = createContext(null);
export const ThemeContext = createContext(null);

function App() {
  const [url, setUrl] = useState(location.hash.substring(1) || "/");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Hamburger menü için state

  useEffect(() => {
    window.addEventListener("hashchange", () => {
      setUrl(location.hash.substring(1));
    });
  }, []);


  // Hamburger menüyü aç/kapat
  function hamburgerMenu() {
    setIsMenuOpen((prevState) => !prevState);
  }

  const page = getPage(url);

  function getSystemThemePref() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-mode' : 'light';
  }

  const [theme, setTheme] = useState(localStorage.theme || getSystemThemePref()); // dark mode için olan state

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  function handleChangeTheme(e) {
    const changedTheme = e.target.checked ? 'dark-mode' : 'light';
    setTheme(changedTheme);
    localStorage.theme = changedTheme;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <header className="header">
        <div className="header-mobile">
          <h1>Gaye Dinç</h1>
          <div className="hamburger-menu">
            <img
              src={theme === "light" ? "/img/hamburger-menu-icon.svg" : "/img/hamburger-menu-open-dark.svg"}
              alt="Hamburger Menu"
              onClick={hamburgerMenu}
              className={isMenuOpen ? "hamburger-icon-none" : ""}
            />
          </div>
        </div>
        <div className={`hamburger-menu-overlay ${isMenuOpen ? "block" : "none"}`}>
          <div className={`hamburger-menu-content ${isMenuOpen ? "block" : "none"}`}>
            <div className="menu-header">
              <h1>Gaye Dinç</h1>
            </div>
            <nav className="nav-hamburger">
              <ul>
                {routes.map((route) => (
                  <li key={route.url}>
                    <a href={`#${route.url}`} onClick={() => setIsMenuOpen(false)}>
                      {route.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <img
              src={theme === "light" ? "/img/hamburger-menu-close-icon.svg" : "/img/hamburger-menu-close-dark.svg"}
              alt="Hamburger Menu Close"
              onClick={hamburgerMenu}
            />
            <label className="theme-switch">
              <img src={theme === "light" ? "/img/sun-light-mode.svg" : "/img/sun-dark-mode.svg"} alt="Sun Icon" />
              <input
                className="switch"
                type="checkbox"
                defaultChecked={theme === "dark-mode"}
                onChange={handleChangeTheme}
              />
              <img src={theme === "light" ? "/img/moon-light-mode.svg" : "/img/moon-dark-mode.svg"} alt="Moon Icon" />
            </label>
          </div>
        </div>
        <nav className="nav-desktop">
          <h1>Gaye Dinç</h1>
          <div className="nav-adres">
            <ul>
              {routes.map((route) => (
                <li key={route.url}>
                  <a href={`#${route.url}`} onClick={() => setIsMenuOpen(false)}>
                    {route.title}
                  </a>
                </li>
              ))}
            </ul>
            <label className="theme-switch">
              <img src={theme === "light" ? "/img/sun-light-mode.svg" : "/img/sun-dark-mode.svg"} alt="Sun Icon" />
              <input
                className="switch"
                type="checkbox"
                defaultChecked={theme === "dark-mode"}
                onChange={handleChangeTheme}
              />
              <img src={theme === "light" ? "/img/moon-light-mode.svg" : "/img/moon-dark-mode.svg"} alt="Moon Icon" />
            </label>
          </div>
        </nav>
      </header>
      <PageContext.Provider value={page}>
        <div className="container">
          <div className="page-title">
            {page.title}
          </div>
          <div className="page-component">
            {page.component}
          </div>
        </div>
      </PageContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
