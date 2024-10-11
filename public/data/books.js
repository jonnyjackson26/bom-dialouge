class Book {
    constructor(numOfChapters, bookName, urlName) {
        this.numOfChapters = numOfChapters;
        this.bookName = bookName;
        this.urlName = urlName;
    }
}


const books = [
    new Book(22, "1 Nephi", "1-nephi"),
    new Book(33, "2 Nephi", "2-nephi"),
    new Book(7, "Jacob", "jacob"),
    new Book(1, "Enos", "enos"),
    new Book(1, "Jarom", "jarom"),
    new Book(1, "Omni", "omni"),
    new Book(1, "Words of Mormon", "words-of-mormon"),
    new Book(29, "Mosiah", "mosiah"),
    new Book(63, "Alma", "alma"),
    new Book(16, "Helaman", "helaman"),
    new Book(30, "3 Nephi", "3-nephi"),
    new Book(1, "4 Nephi", "4-nephi"),
    new Book(9, "Mormon", "mormon"),
    new Book(15, "Ether", "ether"),
    new Book(10, "Moroni", "moroni")
];
export default books;