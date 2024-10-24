import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar.jsx';
import LinkButton from '../../Components/LinkButton/LinkButton.jsx';
import DocumentTitle from '../../Components/DocumentTitle.jsx';
import { getNextButtonInfo, getPrevButtonInfo } from "../../utils/next-and-prev-button-info.js"
import books from "../../../public/data/books.js"
import "../ChapterPage/ChapterPage.css"
import "./dialouge.css"

//google sheets database 
import axios from 'axios';
import { google_api_key, sheet_id } from '../../../api_keys';

export function ChapterPage({ book, chapter, setSelectedChapter, setSelectedBook }) {
    const [verses, setVerses] = useState([]);
    const [dialougeInfo, setDialougeInfo] = useState([]);
    
    DocumentTitle(book.bookName + " " + chapter);

    //verses
    useEffect(() => {
        const fetchVerses = async () => {
            try {
                let path = "";
                path = `data/bom/${book.urlName}/${chapter}.txt`;
                const response = await fetch(path);
                const text = await response.text();
                const lines = text.split('\n').slice(0, -1); //I slice because the text files have an empty \n at the end
                setVerses(lines.map((line, index) => <p className="verse-class" key={index}>
                    {line}
                </p>));

            } catch (error) {
                console.error('Error fetching verses:', error);
            }
        };
        fetchVerses();
    }, [book.urlName, chapter]);

    //TODO: NEED TO INCLUDE LOGIC TO NOT GET THE WHOLE DATABASE, BUT ONLY WITH THE CURRENT BOOK AND CHAPTER
    //dialouge
    useEffect(() => {
        const fetchDialouge = async () => {
            const sheetId = sheet_id;
            const apiKey = google_api_key;
            const range = "Sheet1"; 
    
            const response = await axios.get(
                `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`
            );
    
            const data = response.data.values || [];  // Ensure 'data' is not undefined
    
            // Assuming the first row is the header and the following rows are the data
            const headers = data[0]; // ['person', 'bookUrl', 'chapter', 'verseStart', 'verseEnd', 'wordStart', 'wordEnd']
            const rows = data.slice(1); // The rest of the data

            // Map each row to an object with keys based on the headers
            const formattedData = rows.map(row => {
                let obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index];
                });
                return obj;
            });

            setDialougeInfo(formattedData); // Set the formatted data into state


        };
        fetchDialouge();
    }, []);

    /*
    * Documentation: 1 nephi 1:13 says "And he read, saying: Wo, wo, unto Jerusalem, for I have seen thine abominations! Yea, and many things ..."
                                         1  2    3     4     5   6    7       8       9  10  11  12    13       14        15  16   17    18
                as you can see, the words which he speaks are the 5th-14th word. so thats the startWord and endWord. *note: you start coutning at 1
    */

                const processedChapterText = (verses, dialouges) => {
                    const processedText = [];
                
                    verses.forEach((verse, index) => {
                        let highlightedText = verse.props.children; // Start with the original verse text
                        const verseNumber = index + 1;
                    
                        // Loop through dialogue information to find words to highlight
                        dialouges.forEach(({ person, verseStart, verseEnd, wordStart, wordEnd }) => {
                            // Only process dialogues that are within the current verse or span multiple verses
                            if (verseNumber >= parseInt(verseStart) && verseNumber <= parseInt(verseEnd)) {
                                const words = highlightedText.split(' '); 
                
                                // Handle case where dialogue starts and ends in the same verse
                                if (verseNumber === parseInt(verseStart) && verseNumber === parseInt(verseEnd)) {
                                    const startIndex = parseInt(wordStart) - 1; // Adjust to 0-based index
                                    const endIndex = parseInt(wordEnd);
                
                                    if (startIndex >= 0 && endIndex <= words.length && startIndex < endIndex) {
                                        const highlightedWords = `<span class='${person}'>${words.slice(startIndex, endIndex).join(' ')}</span>`;
                                        words.splice(startIndex, endIndex - startIndex, highlightedWords);
                                        highlightedText = words.join(' ');
                                    }
                                }
                
                                // Handle case where dialogue starts in this verse but ends in a later verse
                                else if (verseNumber === parseInt(verseStart)) {
                                    const startIndex = parseInt(wordStart) - 1;
                
                                    if (startIndex >= 0 && startIndex < words.length) {
                                        const highlightedWords = `<span class='${person}'>${words.slice(startIndex).join(' ')}</span>`; // Highlight from startIndex to the end of the verse
                                        words.splice(startIndex, words.length - startIndex, highlightedWords);
                                        highlightedText = words.join(' ');
                                    }
                                }
                
                                // Handle case where dialogue is ongoing from a previous verse and ends in this verse
                                else if (verseNumber === parseInt(verseEnd)) {
                                    const endIndex = parseInt(wordEnd);
                
                                    if (endIndex > 0 && endIndex <= words.length) {
                                        const highlightedWords = `<span class='${person}'>${words.slice(0, endIndex).join(' ')}</span>`; // Highlight from the start of the verse to wordEnd
                                        words.splice(0, endIndex, highlightedWords);
                                        highlightedText = words.join(' ');
                                    }
                                }
                
                                // Handle case where the whole verse is part of the ongoing dialogue
                                else if (verseNumber > parseInt(verseStart) && verseNumber < parseInt(verseEnd)) {
                                    highlightedText = `<span class='${person}'>${highlightedText}</span>`; // Highlight the whole verse
                                }
                            }
                        });
                
                        // Add the processed verse with the verse number and highlighted text
                        processedText.push(
                            `<p class='verse-class'><span class='verse-number-class'>${verseNumber}</span> ${highlightedText}</p>`
                        );
                    });
                
                    // Join all processed text and return as a single string
                    return processedText.join('');
                };
                
    
    
    

    return (
        <>
            <NavBar book={book} chapter={chapter} /> 

            <h1 className="title">
                The book of {book.urlName} chapter {chapter}
            </h1>


            <div className="nextButton-container">
                <LinkButton text={getPrevButtonInfo(book, chapter).text} path={getPrevButtonInfo(book, chapter).path} />
                <LinkButton text={getNextButtonInfo(book, chapter).text} path={getNextButtonInfo(book, chapter).path} />
            </div>


            {dialougeInfo.length > 0 && console.log(dialougeInfo)}

             {/* you gotta do .length>0 bc it takes time to get the data but render is near-instant. */}
            {dialougeInfo.length > 0 && <div dangerouslySetInnerHTML={{ __html: processedChapterText(verses, dialougeInfo) }} />}


        </>
    );
}