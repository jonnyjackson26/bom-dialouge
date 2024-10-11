import { Link } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import './Path.css';

const Path = ({ book, chapter }) => {
    
    return (
        <>
            <div id="path-container">
                <Link to="/" className="link">
                    Book of Mormon
                </Link>
                {/* Render book.bookName link only if book is defined */}
                {book && <Link to={`/${book.urlName}`} className="link">
                    {[book.urlName]}
                </Link>}
                {/* Render chapter link only if both book and chapter are defined */}
                {book && chapter && <Link to={`/${book.urlName}/${chapter}`} className="link">
                    chapter {chapter}
                </Link>}
            </div>
        </>
    )
}
export default Path;