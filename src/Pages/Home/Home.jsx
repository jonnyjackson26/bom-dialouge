import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import books from '../../../public/data/books.js';
import NavBar from "../../Components/NavBar/NavBar.jsx";
import DocumentTitle from "../../Components/DocumentTitle.jsx";

export function Home({ setSelectedBook }) {


    return (
        <>
            <NavBar book={undefined} chapter={undefined} />

            <h1 className="title">
                The Book of Mormon
            </h1>

            <div className="book-container-grid">
                {books.map((book) => (
                    <Link
                        className={"book-grid"}
                        key={book.urlName}
                        to={`/${book.urlName}`}
                    >
                        {book.bookName}
                    </Link>
                ))}
            </div>
        </>
    );
}

export default Home;