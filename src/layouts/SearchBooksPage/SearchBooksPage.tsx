import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";


export const SerachBooksPage = () => {

    // create a book array
  const [books, setBooks] = useState<BookModel[]>([]);
  //for judging whether in loading process
  const [isLoading, setIsLoading] = useState(true);
  //API call failure scenario
  const [httpError, setHttpError] = useState(null);
  
  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = "http://localhost:8080/api/books";
      // change the query parameter from "size = 9" to "size=5" 
      const url: string = `${baseUrl}?page=0&size=5`;
      // fetching the url data
      const response = await fetch(url);
      //failure scenario
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      // transfer the url data into json;
      const responseJson = await response.json();

      // get the data which is the object of embedded books
      const responseData = responseJson._embedded.books;
      // create a book array
      const loadedBooks: BookModel[] = [];
      // iterate the object in responseData, push them into the book array,and set the loading process finished.
      for (const key in responseData) {
        loadedBooks.push({
          id: responseData[key].id,
          title: responseData[key].title,
          author: responseData[key].author,
          description: responseData[key].description,
          copies: responseData[key].copies,
          copiesAvailable: responseData[key].copiesAvailable,
          category: responseData[key].category,
          img: responseData[key].img,
        });
        setBooks(loadedBooks);
        setIsLoading(false);
      }
    };
    // if async has an error
    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);
  // when in loading process, show: "Loading..."
  if (isLoading) {
    return (
      <SpinnerLoading/>
    );
  }
  // if there is error in fetch data
  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }
   return (
    <div>
        
    </div>
   );
}