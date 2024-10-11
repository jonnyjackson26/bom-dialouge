import React, { useState, createContext } from 'react';
import ReactDOM from 'react-dom/client'
import { Home } from './Pages/Home/Home.jsx'
import { BookPage } from './Pages/BookPage/BookPage.jsx'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import books from '../public/data/books'
import { ChapterPage } from './Pages/ChapterPage/ChapterPage.jsx'
import NavBar from './Components/NavBar/NavBar.jsx'
let routerList = [];

//each books page
for (let i = 0; i < books.length; i++) {
  let pathElement = {};
  pathElement["path"] = "/" + books[i].urlName;
  pathElement["element"] = <BookPage book={books[i]} />
  routerList.push(pathElement);
}

//each chapters page
for (let i = 0; i < books.length; i++) {
  for (let j = 0; j < books[i].numOfChapters + 1; j++) {
    let pathElement = {};
    pathElement["path"] = "/" + books[i].urlName + "/" + j;
    pathElement["element"] = <ChapterPage book={books[i]} chapter={j} />
    routerList.push(pathElement);
  }
}


const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  ...routerList
])


function Main() {

  return (
    <RouterProvider router={router} />
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <Main />
)