import React, { createContext, useState, useEffect } from 'react';
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from '../Firebase/firebase.config';
import { useUser } from './UserContext';

const BookingsContext = createContext();

const BookingsProvider = ({ children }) => {
    const [bookings, setBookings] = useState([]);
    const user = useUser();

    useEffect(() => {
        if (user) {
            const getuserBookingsFromFirebase = async (user) => {
                const userBookingsRef = doc(collection(db, 'users', user.email, 'bookings'), user.uid);
                const docSnapshot = await getDoc(userBookingsRef);
                if (docSnapshot.exists()) {
                    setBookings(docSnapshot.data().bookings);
                }
            };
            getuserBookingsFromFirebase(user);
        } else {
            setBookings([]);
        }
    }, [user]);

    const updateBookings = (newBookings) => {
        setBookings(newBookings);
    };
    
    return (
        <BookingsContext.Provider value={{bookings,updateBookings}}>
            {children}
        </BookingsContext.Provider>
    );
};

export { BookingsProvider, BookingsContext };
