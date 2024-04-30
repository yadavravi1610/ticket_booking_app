import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Trains from './Trains';

const SearchResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState(null);

    useEffect(() => {
        const results = location.state?.searchResults;
        if (results) {
            setSearchResults(results);
        } else {
            navigate('/');
        }
    }, [location.state, navigate]);

    return (
        <div>
            {searchResults ? (
                <div className='pt-24'>
                    <Trains searchResults={searchResults} />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default SearchResultsPage;
