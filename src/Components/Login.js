import React, { useState, useEffect } from "react";
import indianrailway from '../assets/railway-logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { RotatingLines } from "react-loader-spinner";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const Login = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        alertify.set('notifier', 'position', 'top-right');
    }, []);

    const handleNewClickEffect = (e) => {
        e.stopPropagation();
        setIsClicked(true);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.classList.contains("clicked")) {
                setIsClicked(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const [inputValue, setInputValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        let isValid = true;
        if (inputValue === "") {
            alertify.error("Enter your email or mobile number");
            isValid = false;
        }
        if (passwordValue === "") {
            alertify.error("Enter your password");
            isValid = false;
        }
        return isValid;
    }

    const handleUser = (user) => {
        setLoading(false);
        alertify.success("Successfully Logged-in! Welcome back.")
        setTimeout(() => {
            navigate(-1);
        }, 2000);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) {
            return;
        }
        setLoading(true);
        signInWithEmailAndPassword(auth, inputValue, passwordValue)
            .then((userCredential) => {
                const user = userCredential.user;
                handleUser(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                setLoading(false);
                alertify.error(errorCode)
            });
        setInputValue("");
        setPasswordValue("");
    }

    return (
        <div className='bg-white w-full h-full'>
            <div className='flex flex-col justify-center items-center'>

                <Link to="/">
                    <div className="headerHover">
                        <img className="w-20 mt-2" src={indianrailway} alt="logo" />
                    </div>
                </Link>

                <div className='w-80 mt-4 border-[1px] rounded-lg'>
                    <div className='my-4 mx-7 '>
                        <span className='text-[28px] font-semibold'>
                            Login
                        </span>
                        <div>
                            <form className='mt-2 mb-3' onSubmit={handleSubmit}>
                                <label className='text-sm font-semibold'>
                                    Email address
                                    <input type="text" autoComplete="true" value={inputValue} onChange={(e) => {
                                        setInputValue(e.target.value.toString().toLowerCase());
                                    }} className='w-full border-[1px] border-[#a6a6a6] rounded p-1' />
                                </label>
                                <label className='text-sm font-semibold'>
                                    Password
                                    <input type="password" autoComplete="true" value={passwordValue} onChange={(e) => {
                                        setPasswordValue(e.target.value);
                                    }} className='w-full border-[1px] border-[#a6a6a6] rounded p-1' />
                                </label>
                                <button className={`${isClicked ? "clicked" : ""} text-sm my-4 w-full text-center rounded-lg bg-blue-800 text-white hover:bg-orange-500 p-[6px]`}
                                    onClick={(e) => { handleNewClickEffect(e) }}>Continue</button>
                                {
                                    loading && <div className='flex justify-center'>
                                        <RotatingLines
                                            strokeColor="#febd69"
                                            strokeWidth="5"
                                            animationDuration="0.75"
                                            width="50"
                                            visible={true}
                                        />
                                    </div>
                                }
                            </form>
                        </div>
                    </div>
                </div>
                <div className='w-80 text-[12px] my-4 font-medium tracking-wide text-center border-[1px] rounded-lg p-[5px] hover:bg-gray-100 mb-7 shadow active:ring-2 active:ring-offset-1 active:ring-blue-500'>
                    <Link to="/register">
                        <div>Create your IRCTC account</div>
                    </Link>
                </div>
            </div>
        </div>
    )
};

export default Login;