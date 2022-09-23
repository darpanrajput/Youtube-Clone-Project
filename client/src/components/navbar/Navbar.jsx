import React from "react";
import "./navbar.scss";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useSelector } from "react-redux";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import { useDispatch } from "react-redux";
import { changeTheme } from "../../redux/callRedux";
import styled from "styled-components";
import { useState } from "react";
import { logout } from "../../redux/userSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UploadPopup from "../UploadPopup";
import { AVATAR_MALE } from "../../constant";
const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${(props) => (props.isDark ? "white" : "black")};
  cursor: pointer;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
  object-fit: contain;
`;

const DropDown = styled.ul`
  position: absolute;
  top: 50px;
  border-radius: 4px;
  list-style: none;
  border: none;
  background-color: ${(props) => (props.isDark ? "white" : "#202020")};
  color: ${(props) => (props.isDark ? "black" : "white")};
  padding: 7px;
`;
const DropDownItem = styled.li`
  padding: 5px;
  cursor: pointer;
`;

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [IsVidoButtonOpen, setIsVidoButtonOpen] = useState(false);
  const [q, setQ] = useState("");
  console.log(currentUser);
  const toggleTheme = () => {
    changeTheme(dispatch, !isDark);
  };
  const isDark = useSelector((state) => state.theme.isDark);
  const dispatch = useDispatch();
  const [dropDown, setDropDown] = useState(false);
  const showDropDown = () => {
    console.log("clicked avatar");
    setDropDown(!dropDown);
  };

  const navigate = useNavigate();

  const signOut = () => {
    setDropDown(!dropDown);
    console.log("logout called");
    dispatch(logout());
    navigate("/");
  };
  return (
    <>
      <div className={isDark ? "Nav-Container" : "Nav-Container Light"}>
        <div className="Nav-Wrapper">
          <div className={isDark ? "Nav-Search" : "Nav-Search Light"}>
            <input
              placeholder="search.."
              type="text"
              className="Nav-Input"
              onChange={(e) => setQ(e.target.value.trim())}
            />
            <SearchOutlinedIcon
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/search?q=${q}`)}
            />
          </div>

          {
            <div className="item" onClick={() => toggleTheme("Menu")}>
              <SettingsBrightnessOutlinedIcon fontSize="small" />
              {isDark ? "Light" : "Dark"}
            </div>
          }
          {currentUser ? (
            <User isDark={isDark}>
              <VideoCallOutlinedIcon
                onClick={() => setIsVidoButtonOpen(true)}
              />
              {currentUser.name}
              <Avatar
                className="Avatar"
                referrerPolicy="no-referrer"
                src={currentUser.img || AVATAR_MALE}
                alt="profile"
                onClick={showDropDown}
              />
            </User>
          ) : (
            <Link to="signin" style={{ textDecoration: "none" }}>
              <button className="Nav-Sign-Btn">
                <AccountCircleOutlinedIcon />
                SIGN IN
              </button>
            </Link>
          )}

          {dropDown && (
            <DropDown isDark={isDark}>
              <DropDownItem onClick={signOut}>Log Out</DropDownItem>
            </DropDown>
          )}
        </div>
      </div>
      {IsVidoButtonOpen && (
        <UploadPopup
          setIsVidoButtonOpen={setIsVidoButtonOpen}
          isDark={isDark}
        />
      )}
    </>
  );
};

export default Navbar;
