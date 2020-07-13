import React from "react";

function NavbarDesktop() {
  return (
    <div className="flex items-center justify-center bg-indigo-500 h-20 shadow-lg text-white">
      <div className="container px-10 flex items-center">
        <div className="mr-auto">
          <h1 className="font-bold">hamop.gr</h1>
        </div>
        <div>
          <p>Πιλοτική λειτουργία</p>
        </div>
      </div>
    </div>
  )
}

export default NavbarDesktop;