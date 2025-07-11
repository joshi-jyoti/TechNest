import React, { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { LuSearch } from 'react-icons/lu';
import { BLOG_NAVBAR_DATA } from '../../../utils/data';
import Logo from '../../../assets/logo1.svg' // Comment out until file exists
import SideMenu from './SideMenu';

const BlogNavbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openSearchBar, setOpenSearchBar] = useState(false);
  return (
    <>
      <div className="bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between gap-5">
          <div className="flex gap-5">
            <button
              className="block lg:hidden text-black -mt-1"
              onClick={() => {
                setOpenSideMenu(!openSideMenu);
              }}
            >
              {openSideMenu ? (
                <HiOutlineX className="text-2xl text-gray-700" />
              ) : (
                <HiOutlineMenu className="text-2xl text-gray-700" />
              )}
            </button>
            <Link to="/">
                <img src={Logo} alt="Logo" className="h-[24px] md:h-[26px]" />
            </Link>
            {/* <div className="text-xl font-bold">TechNest</div> */}
          </div>

          <nav className="hidden md:flex items-center gap-10">
            {BLOG_NAVBAR_DATA.map((item, index) => {
                if (item?.onlySideMenu) return;

                return (
                    <Link key={item.id} to={item.path}>
                        <li className="text-[15px] text-black font-medium list-none relative group cursor-pointer">
                            {item.label}
                            <span
                                className={`absolute inset-x-0 bottom-0 h-[2px] bg-sky-500 transition-all duration-300 origin-left ${
                                   index == 0? "scale-x-100" : "scale-x-0" 
                                } group-hover:scale-x-100`}
                            ></span>
                        </li>
                    </Link>
                );
            })}
          </nav>
          <div className='flex items-center gap-6'>
            <button
                className="hover:text-sky-500 cursor-pointer"
                onClick={() => setOpenSearchBar(true)}
            >
                <LuSearch className='text-[22px]' />
                
            </button>
            <button
              className='flex items-center justify-center gap-3 bg-linear-to-r from-blue-700 to-blue-500 md:text-sm font-semibold text-white px-5 md:px-7 py-2 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-blue-200'
              onClick={() =>setOpemAuthForm(true)}
            >
              Login/SignUp
            </button>
          </div>
          {openSideMenu && (
            <div className="fixed top-[61px] -ml-4 bg-white">
              <SideMenu  activeMenu={activeMenu} isBlogMenu />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogNavbar;
