import React from "react";
import {Link, NavLink} from "react-router-dom";

function NavbarDesktop() {
  return (
    <div className="flex items-center justify-center bg-indigo-500 h-20 shadow-lg text-white">
      <div className="container flex items-center">
        <div className="mr-auto">
          <Link to="/" className="font-bold px-10 h-20 flex items-center">
            hamop.gr
          </Link>
        </div>
        <div>
          <NavLink to="/news" className="font-bold px-10 h-20 flex items-center hover:bg-indigo-600" activeClassName="bg-indigo-600">
            Ειδήσεις
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default NavbarDesktop;