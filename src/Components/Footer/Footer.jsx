import React from "react";
import "./Footer.module.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className="bg-neutral-primary border-t border-default mt-20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-body">
            © 2025 <span className="font-semibold text-heading">ToDo App</span>.
            All rights reserved.
          </span>

          <ul className="flex items-center gap-6 text-sm text-body">
            <li>
              <Link
                to="#"
                className="hover:text-heading transition-colors duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="hover:text-heading transition-colors duration-200"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="hover:text-heading transition-colors duration-200"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
