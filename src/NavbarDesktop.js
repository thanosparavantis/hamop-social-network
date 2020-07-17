import React from "react";
import {Link} from "react-router-dom";

function NavbarDesktop() {
  return (
    <div className="flex items-center justify-center bg-indigo-500 h-12 shadow-lg text-white">
      <div className="container flex items-center">
        <div className="mr-auto">
          <Link to="/" className="font-bold px-10 h-12 flex items-center focus:bg-indigo-600 focus:shadow-outline">
            <div>hamop.gr</div>
          </Link>
        </div>
        <div>

        </div>
      </div>
    </div>
  )
}

export default NavbarDesktop;