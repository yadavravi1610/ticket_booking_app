import React, { useState, useEffect, useRef } from 'react';
import indianrailway from '../assets/railway-logo.jpg';
import irctc from '../assets/IRCTC-Logo.png';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { useUser } from '../context/UserContext';
import Hamburger from '../assets/Hamburger.png';
import close from '../assets/close.png';
import { motion } from "framer-motion"

const Header = () => {
    const auth = getAuth(); 
    const navigate = useNavigate();
    const user = useUser(); 
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [sideBar, setSidebar] = useState(false);
    const sideBarRef = useRef(null);

    useEffect(() => {
        getTime();
        const intervalId = setInterval(getTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const getTime = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const formattedDateTime = `${day}-${month}-${year} [${hours}:${minutes}:${seconds}]`;
        setCurrentDateTime(formattedDateTime);
    }

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    return (
        <div>
            <div className='flex mdl:flex-row xs:flex-col justify-between p-6 pt-3 xs:h-16 mdl:h-24 w-full fixed z-50 xs:bg-blue-800 mdl:bg-white'>
                <div className='xs:hidden mdl:block'>
                    <Link to="/">
                        <img src={indianrailway} alt='' className='w-20' />
                    </Link>
                </div>
                <div className='xl:w-[50rem] lgl:w-[40rem] mdl:w-[25rem] xs:w-[10rem] xs:hidden mdl:flex mdl:px-4 lgl:px-10 bg-blue-800 xs:h-screen mdl:h-10 justify-between items-center border mt-5 flex xs:flex-col mdl:flex-row  text-white rounded-md '>

                    {user ? (
                        <div className='mdl:text-xs lgl:text-lg capitalize cursor-pointer hover:text-orange-500'>Welcome, {user.displayName}</div>
                    ) : (
                        <div className='mdl:text-xs lgl:text-lg uppercase cursor-pointer hover:text-orange-500'>Guest</div>
                    )}
                    {user ? (
                        <div className='mdl:text-xs lgl:text-lg uppercase cursor-pointer hover:text-orange-500'><Link to="/bookings">Bookings</Link></div>
                    ) : (
                        <div className='mdl:text-xs lgl:text-lg uppercase cursor-pointer hover:text-orange-500'><Link to="/register">Register</Link></div>
                    )}

                    <div className='mdl:text-xs lgl:text-lg uppercase cursor-pointer hover:text-orange-500'>Contact Us</div>
                    <div className='mdl:text-xs lgl:text-lg uppercase cursor-default'>{currentDateTime}</div>
                    {user ? (
                        <div className='mdl:text-xs lgl:text-lg uppercase cursor-pointer hover:text-orange-500' onClick={handleLogout}>Logout</div>
                    ) : (
                        <div className='mdl:text-xs lgl:text-lg uppercase cursor-pointer hover:text-orange-500'><Link to="/login">Login</Link></div>
                    )}
                </div>
                <div className='xs:hidden mdl:block'>
                    <img src={irctc} alt='' className='w-36' />
                </div>
                <div className='xs:block md:hidden h-auto'>
                    <div className='flex items-center gap-2'>
                        <img src={Hamburger} alt='' className='w-5 h-5' onClick={() => setSidebar(true)} ref={sideBarRef} />
                        <Link to="/">
                            <p className='text-2xl text-white font-bold'>IRCTC</p>
                        </Link>
                    </div>
                    <div className='absolute right-6 top-5'>
                        {user ? (
                            <div className='text-sm font-semibold text-white capitalize cursor-pointer hover:text-orange-500'>Welcome, {user.displayName}</div>
                        ) : (
                            <div className='text-sm font-semibold text-white uppercase cursor-pointer hover:text-orange-500'>Guest</div>
                        )}

                    </div>
                    {
                        sideBar && (
                            <div className='w-full h-full text-black fixed z-50 top-0 left-0  bg-[#404040] bg-opacity-90 '>
                                <div className='w-20 h-full relative '>
                                    <motion.div initial={{ x: -500, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -500, opacity: 0 }} transition={{ duration: 0.5 }} className='w-52 h-full mt-16 bg-white'

                                    >
                                        <div className='bg-blue-800 h-screen cursor-pointer  text-white py-5 flex xs:flex-col items-center justify-start gap-7'>
                                            {user ? (
                                                <div className='text-lg capitalize cursor-pointer hover:text-orange-500 w-[100%] text-center border-b-2'>{user.displayName}</div>
                                            ) : (
                                                <div className='text-lg uppercase cursor-pointer hover:text-orange-500 w-[100%] text-center border-b-2'>Guest</div>
                                            )}
                                            {user ? (
                                                <div className='text-lg uppercase cursor-pointer hover:text-orange-500 w-[100%] text-center border-b-2' onClick={() => setSidebar(false)}><Link to="/bookings">Bookings</Link></div>
                                            ) : (
                                                <div className='text-lg uppercase cursor-pointer hover:text-orange-500 w-[100%] text-center border-b-2' onClick={() => setSidebar(false)}><Link to="/register">Register</Link></div>
                                            )}

                                            <div className='text-lg uppercase cursor-pointer hover:text-orange-500 w-[100%] text-center border-b-2' onClick={() => setSidebar(false)}>Contact Us</div>
                                            <div className='uppercase cursor-default w-[100%] text-center border-b-2'>{currentDateTime}</div>
                                            {user ? (
                                                <div className='text-lg uppercase cursor-pointer hover:text-orange-500 w-[100%] text-center border-b-2' onClick={() => { handleLogout(); setSidebar(false) }}>Logout</div>
                                            ) : (
                                                <div className='text-lg uppercase cursor-pointer hover:text-orange-500 w-[100%] text-center border-b-2' onClick={() => setSidebar(false)}><Link to="/login">Login</Link></div>
                                            )}
                                        </div>
                                        <span
                                            onClick={() => setSidebar(false)} className='cursor-pointer absolute top-5 left-56 w-5 h-5
                                   text-white flex items-center justify-center'>
                                            <img src={close} alt="close" />
                                        </span>
                                    </motion.div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            <Outlet />
        </div>
    )
}

export default Header;
