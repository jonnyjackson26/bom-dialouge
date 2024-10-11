/*
returns a dict that has keys 'path' and 'text'
if book is 3 nephi and chapter 11, next will return path="/3-nephi/12" and text="3 nephi 12 ->" 
and prev will return path="/3-nephi/10" and text="<- 3 nephi 10"

and if its the last chapter of a book, next will return path="/the-next-book/1" and text="the next book"
and if its the first chapter of a book, prev will do the same thing but with previous book

and if its the last chapter of the last book or the first chapter of the first book, it returns path="/book-of-mormon" and text="Book of Mormon"
*/

import books from "../../public/data/books";

//input: book and chapter. output: book and chapter of previous chapter
export function getNextButtonInfo(book, chapter) {
    const bookIndex = books.findIndex(item => item.bookName === book.bookName);
    const lastChapter = books[bookIndex].numOfChapters;

    if (bookIndex === books.length - 1 && chapter === lastChapter) { //last chapter of the whole bom
        return { path: "/book-of-mormon", text: "Book of Mormon" };
        //here i need to return a chapter and book attibute
    }

    if (chapter === lastChapter) { //last chapter of the current book
        const nextBook = books[bookIndex + 1];
        return { path: `/${nextBook.urlName}/1`, text: `${nextBook.bookName} 1 ->`, chapter: 1, book: nextBook };
    } else { //normal next chapter
        return { path: `/${book.urlName}/${chapter + 1}`, text: `${book.bookName} ${chapter + 1} ->`, chapter: chapter + 1, book: book };
    }
}

//input: book and chapter. output: book and chapter of previous chapter
export function getPrevButtonInfo(book, chapter) {
    const bookIndex = books.findIndex(item => item.bookName === book.bookName);

    if (bookIndex === 0 && chapter === 1) { //first chapter of whole bom
        return { path: "/book-of-mormon", text: "Book of Mormon" };
        //need to return chapter and book here
    }

    if (chapter === 1) { //first chapter of current book
        const prevBook = books[bookIndex - 1];
        const lastChapter = prevBook.numOfChapters;
        return { path: `/${prevBook.urlName}/${lastChapter}`, text: `<- ${prevBook.bookName} ${lastChapter}`, chapter: lastChapter, book: prevBook };
    } else { //normal prev chapter
        return { path: `/${book.urlName}/${chapter - 1}`, text: `<- ${book.bookName} ${chapter - 1}`, chapter: chapter - 1, book: book };
    }
}