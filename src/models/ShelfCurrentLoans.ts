import BookModel from "./BookModel";

// mapping with the ShelfCurrentLoansResponse class in our backend
class ShelfCurrentLoans {
    book: BookModel;
    daysLeft: number;

    constructor(book: BookModel, daysLeft: number) {
        this.book = book;
        this.daysLeft = daysLeft;
    }
}

export default ShelfCurrentLoans;