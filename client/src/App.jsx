import React from "react";
import Navbar from "./components/navbar/Navbar";
import "./colors.scss";
import Menu from "./components/menu/Menu";
import "./app.scss";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Video from "./pages/video/Video";
import Home from "./pages/home/Home";
import Signin from "./pages/signin/Signin";
import Search from "./pages/Search";
import ErrorPage from "./pages/ErrorPage";

const App = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="Container">
      {console.log("env", process.env.REACT_APP_ENV_NAME)}
      <BrowserRouter>
        <Menu />
        <div className={isDark ? "Main" : "Main Light"}>
          <Navbar />
          <div className="Wrapper">
            <Routes>
              <Route path="/">
                <Route index element={<Home type="random" />} />
                <Route path="subscription" element={<Home type="sub" />} />
                <Route path="search" element={<Search />} />
                <Route path="trend" element={<Home type="trend" />} />
                <Route path="signin" element={<Signin />} />
                <Route path="video">
                  <Route path=":id" element={<Video />} />
                  <Route
                    path="*"
                    element={<ErrorPage error="404 Page Not Found" />}
                  />
                </Route>
                <Route
                  path="*"
                  element={<ErrorPage error="404 Page Not Found" />}
                />
              </Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
