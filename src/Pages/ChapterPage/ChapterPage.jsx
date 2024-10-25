import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar.jsx';
import LinkButton from '../../Components/LinkButton/LinkButton.jsx';
import DocumentTitle from '../../Components/DocumentTitle.jsx';
import { getNextButtonInfo, getPrevButtonInfo } from "../../utils/next-and-prev-button-info.js"
import "../ChapterPage/ChapterPage.css"
import "./dialouge.css"

//google sheets database 
import axios from 'axios';
import { google_api_key, sheet_id } from '../../../api_keys';

export function ChapterPage({ book, chapter, setSelectedChapter, setSelectedBook }) {
    const [verses, setVerses] = useState([]);
    const [dialougeInfo, setDialougeInfo] = useState([]);
    
    DocumentTitle(book.bookName + " " + chapter);

    useEffect(() => {
        //verses
        const fetchVerses = async () => {
            try {
                let path = "";
                path = `data/bom/${book.urlName}/${chapter}.txt`;
                const response = await fetch(path);
                const text = await response.text();
                const lines = text.split('\n').slice(0, -1); //I slice because the text files have an empty \n at the end
                setVerses(lines);

            } catch (error) {
                console.error('Error fetching verses:', error);
            }
        };
        fetchVerses();


        //dialouge
        const fetchDialouge = async () => {
            try {
                const sheetId = sheet_id;
                const apiKey = google_api_key;
                const range = "Sheet1";
        
                const response = await axios.get(
                    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`
                );
        
                const data = response.data.values || [];
                
                if (!data.length) {
                    console.warn("No data received from Google Sheets");
                    return;
                }
        
                const headers = data[0];
                const rows = data.slice(1);
        
                const formattedData = rows.map(row => {
                    let obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    return obj;
                });

                const filteredData = formattedData.filter(row => {
                    return row.bookUrl === book.urlName && String(row.chapter) === String(chapter);
                });
        
                setDialougeInfo(filteredData);
        
            } catch (error) {
                console.error("Error fetching dialogue:", error); // Add this
            }
        };
        
        fetchDialouge();
    }, [book.urlName, chapter]);

    

    /*
    * Documentation: 1 nephi 1:13 says "And he read, saying: Wo, wo, unto Jerusalem, for I have seen thine abominations! Yea, and many things ..."
                                         1  2    3     4     5   6    7       8       9  10  11  12    13       14        15  16   17    18
                as you can see, the words which he speaks are the 5th-14th word. so thats the startWord and endWord. *note: you start coutning at 1
    */
    const processedChapterText = (verses, dialouges) => {
        if (dialouges.length === 0) {  // If there are no dialogues, return verses normally
            return verses.map((verse, index) => 
                `<p class='verse-class'><span class='verse-number-class'>${index + 1}</span> ${verse}</p>`
            ).join('');
        }
        const processedText = [];
    
        verses.forEach((verse, index) => {
            let highlightedText = verse; // Start with the original verse text
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
                            const highlightedWords = `<span class='dialouge ${person}'>${words.slice(startIndex, endIndex).join(' ')}</span>`;
                            words.splice(startIndex, endIndex - startIndex, highlightedWords);
                            highlightedText = words.join(' ');
                        }
                    }
    
                    // Handle case where dialogue starts in this verse but ends in a later verse
                    else if (verseNumber === parseInt(verseStart)) {
                        const startIndex = parseInt(wordStart) - 1;
    
                        if (startIndex >= 0 && startIndex < words.length) {
                            const highlightedWords = `<span class='dialouge ${person}'>${words.slice(startIndex).join(' ')}</span>`; // Highlight from startIndex to the end of the verse
                            words.splice(startIndex, words.length - startIndex, highlightedWords);
                            highlightedText = words.join(' ');
                        }
                    }
    
                    // Handle case where dialogue is ongoing from a previous verse and ends in this verse
                    else if (verseNumber === parseInt(verseEnd)) {
                        const endIndex = parseInt(wordEnd);
    
                        if (endIndex > 0 && endIndex <= words.length) {
                            const highlightedWords = `<span class='dialouge ${person}'>${words.slice(0, endIndex).join(' ')}</span>`; // Highlight from the start of the verse to wordEnd
                            words.splice(0, endIndex, highlightedWords);
                            highlightedText = words.join(' ');
                        }
                    }
    
                    // Handle case where the whole verse is part of the ongoing dialogue
                    else if (verseNumber > parseInt(verseStart) && verseNumber < parseInt(verseEnd)) {
                        highlightedText = `<span class='dialouge ${person}'>${highlightedText}</span>`; // Highlight the whole verse
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


             {/* you gotta do .length>0 bc it takes time to get the data but render is near-instant. */}
            {verses.length>0 && <div dangerouslySetInnerHTML={{ __html: processedChapterText(verses, dialougeInfo) }} />}


        </>
    );
}