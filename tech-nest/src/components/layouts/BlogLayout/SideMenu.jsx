import React from 'react'
import { BLOG_NAVBAR_DATA, SIDE_MENU_DATA } from '../../../utils/data';
import { LuLogOut } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
const SideMenu = ({activeMenu, isBlogMenu}) => {
    const user = null
    const navigate = useNavigate();
    const handleClick = (route) => {
        if(route === "logout"){
            handleLogout();
            return;
        }
        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="">
            {user && (
                <div className="">
                    {user?.profileImageUrl ?(
                        <img
                        src={user?.profileImageUrl || ""}
                        alt='Profile'
                        className=""
                        /> 
                    ) : (
                        <></>
                    )}
                    <div className="">
                        <h5 className=''>
                            {user.name || ""}
                        </h5>
                        <p className="">
                            {user.email || ""}
                        </p>
                    </div>
                </div>
            )}

            {(isBlogMenu ? BLOG_NAVBAR_DATA : SIDE_MENU_DATA).map((item, index) => (
                <button
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] ${
                        activeMenu==item.label
                        ?"text-white bg-linear-to-r from-blue-500 to-blue-400 "
                        : ""
                    } py-3 px-6 rounded-lg mb-3`}
                    onClick={() => handleClick(item.path)}
                >
                    <item.con className="" />
                    {item.label}


                </button>
            ))}
            
            {user && (
                <button></button>
            )}

        </div>
       
    )
}

export default SideMenu
