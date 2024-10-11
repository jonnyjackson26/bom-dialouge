import React, { useState, useContext } from 'react';
import './NavBar.css';
import Path from './Path/Path.jsx'

const NavBar = ({ book, chapter }) => {


    return (
        <nav className="navbar">
            <Path book={book} chapter={chapter} />

        </nav>
    );
};

export default NavBar;