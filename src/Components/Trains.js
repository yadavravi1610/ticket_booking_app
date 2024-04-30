import React, { useState, useContext, useEffect } from 'react';
import { db } from '../Firebase/firebase.config';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import { BookingsContext } from '../context/BookingsContext';
import { useNavigate } from 'react-router-dom';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const Trains = (props) => {
    const { searchResults } = props;
    const [seatAvailability, setSeatAvailability] = useState([]);
    const [trainNumber, setTrainNumber] = useState("");
    const [selectedSeat, setSelectedSeat] = useState(null);
    const navigate = useNavigate();
    const { updateBookings } = useContext(BookingsContext);

    const user = useUser();

    useEffect(() => {
        alertify.set('notifier', 'position', 'top-right');
    }, []);

    const fetchSeatAvailability = async (classType, fromStationCode, toStationCode, trainNumber, trainDate) => {
        setSelectedSeat(null);
        setTrainNumber(trainNumber);
        const url = `https://irctc1.p.rapidapi.com/api/v1/checkSeatAvailability?classType=${classType}&fromStationCode=${fromStationCode}&quota=GN&toStationCode=${toStationCode}&trainNo=${trainNumber}&date=${trainDate}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '4643da9772msh323b73b04fa5f26p197ec9jsn72ee64395adb',
                'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
              }
        };
        try {
            const response = await fetch(url, options);
            let result = await response.text();
            result = JSON.parse(result);
            if (result.message.includes('exceeded the MONTHLY quota')) {
                alertify.error("You have exceeded the API rate limit. Please try again later or upgrade your plan.");
            } else {
                setSeatAvailability(result.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleBookNow = (trainData) => {
        if (!user) {
            alertify.error(`Please Login to book.`);
            navigate('/Login')
        }
        else {
            if (selectedSeat) {
                const bookingDetails = {
                    BookingDate: new Date().toISOString(),
                    DateOfJourney: selectedSeat.date,
                    Fare: selectedSeat.total_fare,
                    Train: trainData.train_name,
                    TrainNumber: trainData.train_number,
                    From: trainData.from_station_name,
                    To: trainData.to_station_name,
                    StartTime: trainData.from_std,
                    ReachTime: trainData.to_std,
                }
                saveUserBookingToFirebase(user, bookingDetails);
                setSeatAvailability([]);
                setTrainNumber("");
                setSelectedSeat(null);
                navigate('/bookings');
            } else {
                alertify.error(`Please select the date of journey.`);
            }
        }
    };

    const saveUserBookingToFirebase = async (user, bookingDetails) => {
        try {
            const userBookingRef = doc(collection(db, 'users', user.email, 'bookings'), user.uid);
            const userBookingSnapshot = await getDoc(userBookingRef);

            let bookingsArray = [];
            if (userBookingSnapshot.exists()) {
                const userData = userBookingSnapshot.data();
                if (userData.bookings) {
                    bookingsArray.push(...userData.bookings);
                }
            }
            bookingsArray.push(bookingDetails);
            await setDoc(userBookingRef, { bookings: bookingsArray }, { merge: true });
            updateBookings(bookingsArray);
            alertify.success("Booking saved successfully!");
        } catch (error) {
            console.error("Error saving booking: ", error);
            alertify.error("Failed to save booking.");
        }
    };

    return (
        <div>
            {searchResults.data.map((train, index) => (
                <div key={index} className='border my-2 border-black mx-1 rounded-md'>
                    <div className='flex w-full flex-wrap justify-between items-center bg-[#f5f5f5] py-5 xs:px-5 xl:px-10'>
                        <div className='flex gap-2 items-baseline'>
                            <p className='font-bold xs:text-sm mdl:text-xl xl:text-3xl'>{train.train_name}</p>
                            <p className='xs:text-xs mdl:text-base xl:text-lg font-semibold'>({train.train_number})</p>
                        </div>
                        <div className='flex items-baseline gap-2 xs:hidden mdl:block'>
                            <p className='mdl:text-lg xl:text-xl'>Runs On:</p>
                            <p className='text-sm'>{train.run_days.join(", ")}</p>
                        </div>
                        <div className='xs:hidden mdl:block'>
                            <p className='text-xl text-blue-400 font-medium'>Train Schedule</p>
                        </div>
                    </div>
                    <div className='flex justify-around items-center py-5 xs:px-1 w-full xl:px-10'>
                        <div className='flex xs:flex-col xl:flex-row xs:w-16 mdl:w-auto justify-start items-baseline'>
                            <p className='xs:text-sm mdl:text-base xl:text-2xl font-medium flex gap-1'>{train.from_std} <span className='xs:hidden xl:block'>|</span></p>
                            <p className='xs:text-xs mdl:text-base items-baseline xl:text-xl flex gap-1'>{train.from_station_name} <span className='text-2xl font-medium xs:hidden xl:block'>|</span></p>
                            <p className='xs:text-xs mdl:text-base xl:text-xl flex gap-1'>{train.train_date}</p>
                        </div>
                        <div className='flex xs:flex-col xl:flex-row items-center gap-2'>
                            <div className='flex items-center'>
                                <hr className='xs:w-5 mdl:w-8 xl:w-12 border-black mr-1' />
                                <p className='xs:text-sm mdl:text-base xl:text-xl flex gap-1'>{train.duration} <span className='xs:hidden mdl:block'>hr</span></p>
                                <hr className='xs:w-5 mdl:w-8 xl:w-12 border-black ml-1' />
                            </div>
                            <div className='flex items-baseline gap-2 xs:block mdl:hidden'>
                                <p className='xs:text-xs mdl:text-sm'>{train.run_days.map(day => day.charAt(0)).join(", ")}</p>
                            </div>

                        </div>
                        <div className='flex xs:flex-col xl:flex-row items-end xs:w-16 xl:w-auto text-right justify-end'>
                            <p className='xs:text-sm mdl:text-base xl:text-2xl font-medium flex gap-1'>{train.to_std} <span className='xs:hidden xl:block'>|</span></p>
                            <p className='xs:text-xs mdl:text-base xl:text-xl flex gap-1'>{train.to_station_name} </p>
                        </div>
                    </div>

                    <div className='flex flex-col justify-between bg-[#f5f5f5] xs:py-2 mdl:py-5 '>
                        <div className='flex items-baseline w-full overflow-x-scroll' style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'hidden' }}>
                            {train.class_type.map((type, idx) => (
                                <div key={idx} className='xs:w-24 mdl:w-32 xl:w-44 xs:h-16 mdl:h-20 xl:h-24 border flex flex-col xs:mx-1 mdl:mx-3 justify-center items-center gap-2 bg-white rounded-md py-2 px-2' >
                                    <p className='xs:text-sm mdl:text-base xl:text-xl font-semibold'>{type}</p>
                                    <button className='bg-blue-500 hover:bg-blue-700 text-white xs:font-medium msl:text-semibold xl:font-bold xs:py-0 mdl:py-1 xl:py-2 xs:text-sm xs:px-2 xl:px-4 rounded'
                                        onClick={() => fetchSeatAvailability(type, train.from, train.to, train.train_number, train.train_date)}>
                                        Refresh
                                    </button>
                                </div>
                            ))}
                        </div>
                        {seatAvailability && trainNumber === train.train_number && (
                            <div className='flex items-baseline w-full overflow-x-scroll' style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'hidden' }} >
                                <ul className='flex justify-between mx-2 my-4' >
                                    {seatAvailability.map((availability, idx) => (
                                        <li key={idx} className={`xs:w-32 mdl:w-44 xl:w-52 xs:h-20 mdl:h-24 xl:h-28 border mx-2 border-black rounded-md flex flex-col px-2 py-2 cursor-pointer ${selectedSeat && selectedSeat.date === availability.date ? 'bg-orange-200' : 'bg-white'}`}
                                            onClick={() => setSelectedSeat(availability)}>
                                            <p className='xs:text-sm mdl:text-base xl:text-xl'>{availability.date}</p>
                                            <p className='xs:text-sm mdl:text-base xl:text-xl'>Total Fare: {availability.total_fare}</p>
                                            <p className='xs:text-sm mdl:text-base xl:text-xl' style={{ color: availability.current_status.includes('AVAILABLE') ? 'green' : 'red' }}>{availability.current_status}</p>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        )}

                    </div>
                    <div className='flex gap-3 items-center py-5 px-10'>
                        {seatAvailability.length > 0 && trainNumber === train.train_number ? (
                            <button
                                className='bg-orange-400 text-white font-semibold py-1 w-24 rounded-md border border-orange-500'
                                onClick={() => handleBookNow(train)}
                            >
                                Book Now
                            </button>
                        ) : (
                            <button
                                className='bg-gray-300 text-gray-600 font-semibold py-1 w-24 rounded-md border border-gray-400 cursor-not-allowed'
                                disabled
                            >
                                Book Now
                            </button>
                        )}
                    </div>
                </div >
            ))}
        </div >
    );
}

export default Trains;