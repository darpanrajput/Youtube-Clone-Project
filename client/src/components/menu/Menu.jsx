import React from "react";
import "./menu.scss";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { changeTheme } from "../../redux/callRedux";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("isDark=", isDark);

  const toggleTheme = () => {
    changeTheme(dispatch, !isDark);
  };

  const navigateToHome = () => {
    navigate("/");
    navigate(0);
  };

  return (
    <div className={isDark ? "Menu" : "Menu Light"}>
      <div className="Menu-Items">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="Logo">
            <img src="/images/logo.png" alt="logo" /> Mytube
          </div>
        </Link>
        {/* <div className={isDark ? "item" : "item Light"}>
          <MenuIcon /> Close
        </div> */}

        <div
          className={isDark ? "item" : "item Light"}
          onClick={navigateToHome}
        >
          <HomeIcon /> Home
        </div>

        <Link to="trend" style={{ textDecoration: "none", color: "inherit" }}>
          <div className={isDark ? "item" : "item Light"}>
            <ExploreOutlinedIcon /> Explore
          </div>
        </Link>

        <Link
          to="subscription"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className={isDark ? "item" : "item Light"}>
            <SubscriptionsOutlinedIcon />
            Subscriptions
          </div>
        </Link>
        <hr />
        <div className={isDark ? "item" : "item Light"}>
          <VideoLibraryOutlinedIcon />
          Library
        </div>

        <div className={isDark ? "item" : "item Light"}>
          <HistoryOutlinedIcon />
          History
        </div>
        <hr />
        {!currentUser && (
          <>
            <div className="Login">
              Sign in to like videos, comment, and subscribe.
              <Link to="signin" style={{ textDecoration: "none" }}>
                <button>
                  <AccountCircleOutlinedIcon />
                  SIGN IN
                </button>
              </Link>
            </div>
            <hr />
          </>
        )}

        {
          // <Login>
          //   Sign in to like videos, comment, and subscribe.
          //   <Link to="signin" style={{ textDecoration: "none" }}>
          //     <Button>
          //       <AccountCircleOutlinedIcon />
          //       SIGN IN
          //     </Button>
          //   </Link>
          // </Login>
        }
        <h2 className="Title">Best of Youtube</h2>
        <div className={isDark ? "item" : "item Light"}>
          <LibraryMusicOutlinedIcon />
          Music
        </div>

        <div className={isDark ? "item" : "item Light"}>
          <SportsBasketballOutlinedIcon />
          Sports
        </div>

        <div className={isDark ? "item" : "item Light"}>
          <SportsEsportsOutlinedIcon />
          Gaming
        </div>

        <div className={isDark ? "item" : "item Light"}>
          <MovieOutlinedIcon />
          Movies
        </div>

        <div className={isDark ? "item" : "item Light"}>
          <ArticleOutlinedIcon />
          News
        </div>

        <div className={isDark ? "item" : "item Light"}>
          <LiveTvOutlinedIcon />
          Live
        </div>
        <hr />
        <div className={isDark ? "item" : "item Light"}>
          <SettingsOutlinedIcon />
          Settings
        </div>

        <div className={isDark ? "item" : "item Light"}>
          <FlagOutlinedIcon />
          Report
        </div>

        <div className={isDark ? "item" : "item Light"}>
          <HelpOutlineOutlinedIcon />
          Help
        </div>

        {
          <div className="item" onClick={() => toggleTheme("Menu")}>
            <SettingsBrightnessOutlinedIcon />
            {isDark ? "Light" : "Dark"} Mode
          </div>
        }
      </div>
    </div>
  );
};

export default Menu;
