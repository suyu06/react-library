import { useState } from "react"
import BookModel from "../../models/BookModel"

export const BookCheckoutPage = () =>{

    // create useState
    const [book,setBook] = useState<BookModel>();
    const [isLoadingBook,setIsLoadingBook] = useState(true);
    const [httpError,setHttpError] = useState(null);
    //add two slashes in the url: http://localhost:3000/checkout/<bookId> 
    const bookId = (window.location.pathname).split('/')[2];
    return(
        <div>
            <h3>HI Library</h3>
        </div>
    )
}