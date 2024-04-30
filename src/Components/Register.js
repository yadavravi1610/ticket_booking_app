import React, { useState,useEffect } from 'react';
import indianrailway from '../assets/railway-logo.jpg';
import info from '../assets/information.png';
import { Link } from 'react-router-dom';
import { RotatingLines } from "react-loader-spinner";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { db } from '../Firebase/firebase.config';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const Register = () => {
    const auth = getAuth();

    const [nameInput, setNameInput] = useState("");
    const [mobileInput, setMobileInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);

    const [nameError, setNameError] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [firebaseError, setFirebaseError] = useState("");

    
    useEffect(() => {
        alertify.set('notifier', 'position', 'top-right');
    }, []);

    const validate = () => {
        // Regular expressions for input validation
        const reqName = /^[A-Za-z\s]+$/;
        const reqEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const reqMobile = /^[0-9]{10}$/;
        // const reqPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        const reqPassword = /^.{6,}$/;
        let isValid = true;

        // Validate name
        if (!reqName.test(nameInput)) {
            setNameError("Enter your name");
            isValid = false;
        }
        if (mobileInput === "") {
            setMobileError("");
            isValid = true;
        }
        // Validate mobile number
        if (mobileInput) {
            if (!reqMobile.test(mobileInput)) {
                setMobileError("Enter a valid mobile number");
                isValid = false;
            }
        }
        // Validate email
        if (!reqEmail.test(emailInput)) {
            setEmailError("Enter a valid email address");
            isValid = false;
        }
        // Validate password
        if (!reqPassword.test(passwordInput)) {
            setPasswordError("Enter your password");
            isValid = false;
        }
        return isValid;
    }

    const saveUserDataToFirebase = async (user) => {
        const userDetailsRef = doc(collection(db, 'users', user.email, 'details'), user.uid);
        const userDetailsSnapshot = await getDoc(userDetailsRef);
        if (!userDetailsSnapshot.exists()) {
            await setDoc(userDetailsRef, {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                image: user.photoURL,
                mobile: user.phoneNumber,
                createdOn: new Date(),
            }, { merge: true });
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) {
            return;
        }
        setLoading(true);
        createUserWithEmailAndPassword(auth, emailInput, passwordInput)
            .then((userCredential) => {
                updateProfile(auth.currentUser, {
                    displayName: nameInput,
                }).then(() => {
                    const user = userCredential.user;
                    saveUserDataToFirebase(user);
                    sendEmailVerification(auth.currentUser).then(() => {
                        // Send mail to verify the user's email
                    })
                    setLoading(false);
                    setSuccessMsg(true);
                    
                }).catch((error) => {
                    setLoading(false);
                    setFirebaseError("Failed to create an account. Please try again later.");
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode.includes("auth/email-already-in-use")) {
                    setFirebaseError("Email already in use. Try another one.");
                    alertify.error("Email already in use. Try another one.")
                    setLoading(false);
                }
            });
        setEmailInput("");
        setMobileInput("");
        setNameInput("");
        setPasswordInput("");
    };

    return (
        <div className='bg-white'>
            <div className='flex flex-col w-full h-full justify-center mb-5 items-center'>

                <Link to="/">
                    <div className="headerHover">
                        <img className="w-20 mt-2" src={indianrailway} alt="logo" />
                    </div>
                </Link>

                <div className='w-80 mt-4 border-[0.066rem] rounded-lg'>
                    <div className='my-4 mx-5 '>
                        <span className='text-[26px] font-semibold'>
                            Register Your Account
                        </span>
                        {
                            successMsg
                                ? <div className=' my-2 flex flex-col gap-2'>
                                    <p className='font-semibold text-green-600'>
                                        Your account has been successfully created!
                                    </p>
                                    <p className='font-semibold '>
                                        Please check your email for a verification link to confirm your email address.
                                    </p>
                                    <p className='font-semibold text-red-600'>
                                        Remember, if you don't verify your email, your data may be lost.
                                    </p>
                                </div>
                                : <form className='my-3'>
                                    <label className='text-sm font-semibold'>
                                        Your name
                                        <input type="text" placeholder="First and last name" autoComplete="true" value={nameInput} onChange={(e) => {
                                            setNameInput(e.target.value);
                                            setNameError("");
                                        }} className='w-full border-[1px] border-[#a6a6a6] rounded p-1 ' />
                                    </label>
                                    {
                                        nameError && <div className='text-sm text-[#FF0000]'>{nameError}</div>
                                    }
                                    <label className='text-sm font-semibold mt-3'>
                                        Email
                                        <input type="text" value={emailInput} autoComplete="true" onChange={(e) => {
                                            setEmailInput(e.target.value.toString().toLowerCase());
                                            setEmailError("");
                                            setFirebaseError("");
                                        }} className='w-full border-[1px] border-[#a6a6a6] rounded p-1' />

                                    </label>
                                    {
                                        (emailError || firebaseError) && <div className='text-sm text-[#FF0000]'>{emailError || firebaseError}</div>
                                    }
                                    <label className='text-sm font-semibold my-3'>
                                        Mobile number (Optional)
                                        <div className='flex items-center justify-between mt-1'>
                                            <div className='w-[22%] border-[1px] rounded-md border-[#a6a6a6] p-1'>IN +91</div>
                                            <input type="tel" autoComplete="true" maxLength="10" placeholder="Mobile number" value={mobileInput} onChange={(e) => {
                                                setMobileInput(e.target.value);
                                                setMobileError("");
                                            }} className='w-[74%] border-[1px] border-[#a6a6a6] rounded p-1' />
                                        </div>
                                    </label>
                                    {
                                        mobileError && <div className='text-sm text-[#FF0000]  pl-20'>{mobileError}</div>
                                    }
                                    <label className='text-sm font-semibold mt-3'>
                                        Password
                                        <input type="password" autoComplete="true" value={passwordInput} onChange={(e) => {
                                            setPasswordInput(e.target.value);
                                            setPasswordError("");
                                        }} placeholder="At least 6 characters" className='w-full border-[1px] border-[#a6a6a6] rounded p-1' />
                                    </label>
                                    {
                                        passwordError && <div className='text-sm text-[#FF0000]'>{passwordError}</div>
                                    }
                                    {!passwordError && <div className='flex items-center gap-1 justify-start mt-1' >
                                        <img src={info} alt='i' className='w-4 h-4' />
                                        <span className='text-xs'>Passwords must be at least 6 characters.</span>
                                    </div>}
                                    <button className={`text-sm w-full text-center rounded-lg bg-blue-800 hover:bg-orange-500 p-[6px] mt-5 shadow active:ring-2 text-white active:ring-offset-1 active:ring-blue-500`} onClick={handleSubmit}
                                    >Continue</button>
                                    {
                                        loading && <div className='flex justify-center mt-4'>
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
                        }
                        <div className='flex items-center gap-2 mt-7 '>
                            <div className=' text-xs'>
                                {
                                    successMsg
                                        ? "You can now sign-in "
                                        : "Already have an account? "}
                                <Link to="/Login" >
                                    <span className='text-blue-500 hover:underline hover:text-red-500 cursor-pointer'>
                                        Sign in
                                    </span>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default Register;