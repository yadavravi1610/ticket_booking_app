import React, { useState, useEffect } from 'react';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import azadi from '../assets/Azadi-Logo.png';
import g20 from '../assets/G20.png';
import gps from '../assets/gps.png';
import location from '../assets/maps-and-flags.png';
import calender from '../assets/calendar.png';
import briefcase from '../assets/briefcase.png';
import categories from '../assets/multimedia.png';
import background from '../assets/VandeBharat.jpg';
import { Link, useNavigate } from 'react-router-dom';

const Homepage = () => {
    const [fromStationName, setFromStationName] = useState('');
    const [fromStationSuggestions, setFromStationSuggestions] = useState([]);
    const [toStationName, setToStationName] = useState('');
    const [toStationSuggestions, setToStationSuggestions] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [isToStationListVisible, setIsToStationListVisible] = useState(true);
    const [isFromStationListVisible, setIsFromStationListVisible] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        alertify.set('notifier', 'position', 'top-right');
    }, []);

    const hideToStationList = (stationName, stationCode) => {
        setToStationName(`${stationCode} - ${stationName}`);
        setIsToStationListVisible(false);
    };

    const hideFromStationList = (stationName, stationCode) => {
        setFromStationName(`${stationCode} - ${stationName}`);
        setIsFromStationListVisible(false);
    }

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    useEffect(() => {
        getStationCode(fromStationName, setFromStationSuggestions);
    }, [fromStationName]);

    useEffect(() => {
        getStationCode(toStationName, setToStationSuggestions);
    }, [toStationName]);

    const getStationCode = async (stationName, setSuggestions) => {
        if (stationName.length > 2) {

            const url = 'https://rstations.p.rapidapi.com/';
            const options = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': '04fcb75241msh8da03498fa988b9p111542jsn85a9861a5c10',
                    'X-RapidAPI-Host': 'rstations.p.rapidapi.com'
                },
                body: JSON.stringify({ search: stationName })
            };
            try {
                const response = await fetch(url, options);
                const result = await response.json();
                setSuggestions(result || []);
            } catch (error) {
                console.error(error);
            }
        } else {
            setSuggestions([]);
        }
    };


    const getEmptyField = () => {
        if (!fromStationName) return 'From';
        if (!toStationName) return 'To';
        if (!selectedDate) return 'Date';
        return '';
    };

    const handleSearchTrains = async () => {
        const emptyField = getEmptyField();
        if (emptyField) {
            alertify.error(`Please fill in the "${emptyField}" field.`);
        } else {

            if (fromStationName && toStationName && selectedDate) {
                const fromStationCode = fromStationName.split(' - ')[0];
                const toStationCode = toStationName.split(' - ')[0];
                const dateOfJourney = selectedDate;
                const url = `https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations?fromStationCode=${fromStationCode}&toStationCode=${toStationCode}&dateOfJourney=${dateOfJourney}`;
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '4e1da26adbmsh5b4b3bfce56bce3p106d87jsn1507f8cabae7',
                        'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
                      }
                };
                try {
                    const response = await fetch(url, options);
                    let result = await response.text();
                    result = JSON.parse(result);
                    console.log(result)
                    if (result.message.includes('exceeded the MONTHLY quota')) {
                        alertify.error("You have exceeded the API rate limit. Please try again later or upgrade your plan.");
                        navigate('/');
                    } else {
                        navigate('/search', { state: { searchResults: result } });
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };

    return (
        <div>
            <div className='pt-7 w-full'>
                <div className='w-[100%] bg-contain'>
                    <img src={background} alt='' className='w-full h-screen xs:hidden mdl:block ' />
                </div>
                <div className='border w-full mdl:w-[35rem] p-5 mdl:ml-20 pt-20 bg-white flex flex-col gap-5 xs:z-100 mdl:z-10 absolute top-14 mdl:top-28'>
                    <div className='xs:hidden mdl:flex justify-between '>
                        <div>
                            <img src={azadi} alt='' className='w-32' />
                        </div>
                        <div>
                            <p className='text-4xl font-bold text-blue-900'>BOOK TICKET</p>
                        </div>
                        <div>
                            <img src={g20} alt='' className='w-40' />
                        </div>
                    </div>
                    <div className='flex flex-col mdl:flex-row justify-center mx-auto gap-20'>
                        <div className='flex flex-col gap-10'>
                            <div className='flex flex-col'>
                                <span className='absolute -mt-6 ml-2 text-blue-900 text-sm'>From</span>
                                <img src={gps} alt='' className='absolute w-5 my-3 ml-2 text-blue-900' />
                                <input
                                    type='text'
                                    className='w-60 h-10 border rounded-md text-blue- pl-10'
                                    value={fromStationName}
                                    onChange={(e) => {
                                        setFromStationName(e.target.value);
                                        setIsFromStationListVisible(true)
                                    }}
                                    required
                                />
                                {Array.isArray(toStationSuggestions) && fromStationSuggestions.length > 0 && fromStationName.length > 2 &&
                                    isFromStationListVisible &&
                                    (
                                        <div
                                            className='w-48 z-10 max-h-32 rounded-md pl-3 cursor-pointer absolute bg-white mt-10 ml-10 border overflow-y-scroll overflow-x-hidden'
                                        >
                                            {fromStationSuggestions.map(([stationCode, stationName], index) => (
                                                <p key={index} value={`${stationCode}|${stationName}`}
                                                    onClick={() => { hideFromStationList(stationName, stationCode); }}
                                                >{`${stationCode} - ${stationName}`}</p>
                                            ))}
                                        </div>
                                    )}
                            </div>
                            <div className='flex '>
                                <span className='absolute -mt-6 ml-2 text-blue-900 text-sm'>To</span>
                                <img src={location} alt='' className='absolute w-5 my-3 ml-2 text-blue-900 ' />
                                <input
                                    type='text'
                                    className='w-60 h-10 border rounded-md text-blue- pl-10'
                                    value={toStationName}
                                    onChange={(e) => {
                                        setToStationName(e.target.value);
                                        setIsToStationListVisible(true)
                                    }}
                                    required
                                />
                                {Array.isArray(toStationSuggestions) && toStationSuggestions.length > 0 && toStationName.length > 2 &&
                                    isToStationListVisible &&
                                    (
                                        <div
                                            className='w-48 z-10 max-h-32 rounded-md pl-3 cursor-pointer absolute bg-white mt-10 ml-10 border overflow-y-scroll overflow-x-hidden'
                                        >
                                            {toStationSuggestions.map(([stationCode, stationName], index) => (
                                                <p key={index} value={`${stationCode}|${stationName}`}
                                                    onClick={() => { hideToStationList(stationName, stationCode); }}
                                                >{`${stationCode} - ${stationName}`}</p>
                                            ))}
                                        </div>
                                    )}
                            </div>
                            <div className='xs:hidden mdl:block'>
                                <img src={categories} alt='' className='absolute w-5 my-3 ml-2' />
                                <select className='w-60 border h-10 rounded-md pl-10 text-blue-900'>
                                    <option>General</option>
                                    <option>Ladies</option>
                                    <option>Tatkal</option>
                                </select>
                            </div>

                        </div>
                        <div className='flex flex-col gap-10 xs:-mt-10 mdl:mt-0'>
                            <div>
                                <span className='absolute -mt-6 ml-2 text-blue-900 text-sm'>DD/MM/YY</span>
                                <img src={calender} alt='' className='absolute w-5 my-3 ml-2' />
                                <input type='date' className='xs:w-60 mdl:w-48 pl-10 border h-10 rounded-md text-blue-900' required value={selectedDate} onChange={handleDateChange} />
                            </div>
                            <div>
                                <img src={briefcase} alt='' className='absolute w-5 my-3 ml-2' />
                                <select className='xs:w-60 mdl:w-48 border h-10 rounded-md pl-10 text-blue-900'>
                                    <option>All classes</option>
                                    <option>Second Class</option>
                                    <option>AC First Class</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    <div className='w-28 border mx-auto h-9 py-1 flex justify-center my-4 rounded-md font-semibold text-white cursor-pointer bg-orange-500' onClick={handleSearchTrains} >
                        {fromStationName && toStationName && selectedDate ? (
                            <Link to='/search'><p>Search</p></Link>
                        ) : (
                            <p>Search</p>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Homepage;
