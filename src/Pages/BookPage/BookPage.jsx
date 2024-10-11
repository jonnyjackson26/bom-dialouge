import { Link } from "react-router-dom"
import './BookPage.css'
import NavBar from "../../Components/NavBar/NavBar.jsx";
import React, { useState, useEffect, useContext } from 'react';
import DocumentTitle from "../../Components/DocumentTitle.jsx";

export function BookPage({ book, setSelectedChapter }) {

    DocumentTitle(book.urlName)

    const chapterLinks = [];
    for (let i = 1; i <= book.numOfChapters; i++) {
        chapterLinks.push(
            <Link
                key={i}
                to={`${i}`}
                className="chapter-item"
            >
                {`chapter ${i}`}
            </Link> // Chapter 6 or Capitulo 6
        );
    }

    return (
        <>
            <NavBar book={book} chapter={undefined} />

            <h1 className="title">
                The book of {book.bookName}
            </h1>

            <div className="chapters-container">
                {chapterLinks}
            </div>

        </>
    );
}