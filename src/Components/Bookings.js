import React, { useContext } from 'react';
import { BookingsContext } from '../context/BookingsContext';
import { useNavigate } from 'react-router-dom';

const BookingsPage = () => {
    const { bookings } = useContext(BookingsContext);
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between mb-4 xs:mt-12 mdl:mt-24">
                <h1 className="text-3xl font-bold">My Bookings</h1>
                <button onClick={handleGoBack} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back</button>
            </div>
            <div className="flex flex-wrap -mx-4 mt-6">
                {bookings.map((booking, index) => (
                    <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-4">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <p className="text-xl font-semibold mb-2">Booking {index + 1}</p>
                            <p><span className="font-semibold">Train Number:</span> {booking.TrainNumber}</p>
                            <p><span className="font-semibold">Train Name:</span> {booking.Train}</p>
                            <p><span className="font-semibold">Date Of Journey:</span> {booking.DateOfJourney}</p>
                            <p><span className="font-semibold">Start Time:</span> {booking.StartTime}</p>
                            <p><span className="font-semibold">Reach Time:</span> {booking.ReachTime}</p>
                            <p><span className="font-semibold">From:</span> {booking.From}</p>
                            <p><span className="font-semibold">To:</span> {booking.To}</p>
                            <p><span className="font-semibold">Fare:</span> {booking.Fare}</p>
                            <p><span className="font-semibold">Booking Date:</span> {new Date(booking.BookingDate).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingsPage;

