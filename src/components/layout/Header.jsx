"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import MobileSidebar from "./Mobilesidebar";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex flex-col">
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 py-2 z-50">
          <div className="max-w-[1400px] mx-auto px-4">
            <nav className="flex items-center justify-between h-14">
              {/* Left: Logo and Menu */}
              <div className="flex items-center lg:gap-4">
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  {isMobileMenuOpen ? (
                    <X size={24} className="text-gray-600" />
                  ) : (
                    <Menu size={24} className="text-gray-600" />
                  )}
                </button>

                <Link href="/" className="flex items-center gap-2">
                  <div className="text-xl font-bold text-gray-800">Xenotix</div>
                </Link>
              </div>

              {/* Right: Profile icon only */}
              <div className="flex items-center">
                <div
                  className="w-9 h-9 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors duration-200 shadow-sm flex items-center justify-center cursor-pointer group"
                  title="Profile"
                >
                  <span className="text-sm font-bold text-orange-600 group-hover:text-orange-700">
                    R
                  </span>
                </div>
              </div>
            </nav>
          </div>
        </header>

        {/* Spacer */}
        <div className="h-[60px] md:h-[72px]" />
      </div>
    </>
  );
};

export default Header;
