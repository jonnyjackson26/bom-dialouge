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


    const processedChapterText = (verses, dialouges) => {
        // Initialize the processed text as an array to collect parts of the chapter
        const processedText = [];
    
        verses.forEach((verse, index) => {
            // Here, you'd include logic to process each verse based on dialogueInfo
            // For demonstration, we're just wrapping each verse in a paragraph tag
            let verseText = verse.props.children; // Assume verse.text contains the actual verse text

            // You would replace the following with your highlighting logic
            /*dialouges.forEach(({ person, wordStart, wordEnd }) => {
                const words = verseText.split(' ');
                const startIndex = wordStart - 1; // Convert to 0-based index
                const endIndex = wordEnd; // This will be the slice endpoint
                
                // Wrap the words in a span for the specified person
                const highlightedWords = `<span class="${person}">${words.slice(startIndex, endIndex).join(' ')}</span>`;
                words.splice(startIndex, endIndex - startIndex, highlightedWords);
                verseText = words.join(' '); // Join the modified words back into a string
            });*/
    
            // Add the processed verse to the array
            processedText.push(`<p class='verse-class'><span class='verse-number-class'>${index+1}</span> ${verseText}</p>`);
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
            {dialougeInfo.length > 0 && <div dangerouslySetInnerHTML={{ __html: processedChapterText(verses, dialougeInfo) }} />}


        </>
    );
}