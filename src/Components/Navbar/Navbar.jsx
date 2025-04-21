
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { FaBars } from 'react-icons/fa';
import { CgGym } from 'react-icons/cg';
import { AiOutlineShoppingCart, AiFillHome } from 'react-icons/ai';
import { GiFalling } from 'react-icons/gi';
import { IoMdChatbubbles } from "react-icons/io";
import { FaUserPlus } from 'react-icons/fa';
import { FaSignInAlt } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';

import axios from 'axios';

const handleLogout = async () => {
  try {
    // Ensure cookies are sent by setting withCredentials: true
    const res = await axios.post(
      "http://localhost:3000/api/logout",
      {},
      { withCredentials: true }
    );
    console.log(res.data.message);
    // Optionally, clear local user data and navigate to login or home page
    localStorage.removeItem("user");
    // For example, using useNavigate from react-router-dom:
    // navigate("/login");
    alert('logout successful')
  } catch (error) {
    console.error("Logout error: ", error);
  }
};

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div>
      <div className="menu">
        <FaBars className="hamburger-icon" onClick={toggleNav} />
        <h1>OldCare Connect</h1>
      </div>
      <div className={`sidenav-container ${isNavOpen ? 'expanded' : 'minimized'}`}>
        <NavLink to={'/'}>
          <AiFillHome />
          {isNavOpen && <span>Home</span>}
        </NavLink>
        <NavLink to={'/home/signup'}>
          <FaUserPlus />
          {isNavOpen && <span>Signup</span>}
        </NavLink>
        <NavLink to={'/home/login'}>
          <FaSignInAlt />
          {isNavOpen && <span>Login</span>}
        </NavLink>

        <NavLink to={'/home/activities'}>
          <CgGym />
          {isNavOpen && <span>Track Activities</span>}
        </NavLink>
        <NavLink to="/home/services">
          <AiOutlineShoppingCart />
          {isNavOpen && <span>Homecare Services</span>}
        </NavLink>
        <NavLink to={'/home/fall'}>
          <GiFalling />
          {isNavOpen && <span>Fall Detection</span>}
        </NavLink>
        <NavLink to={'/home/chat'}>
          <IoMdChatbubbles />
          {isNavOpen && <span>Chat with me</span>}

        </NavLink>

        <NavLink onClick={handleLogout}>
          <FaSignOutAlt />
          {isNavOpen && <span>Logout</span>}

        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;