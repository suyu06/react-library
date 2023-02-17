import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { Pagination } from "../../Utils/Pagination";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const ChangeQuantityOfBooks = () => {
  // copy useSate from SearchBooksPage.tsx
  // create a book array
  const [books, setBooks] = useState<BookModel[]>([]);
  //for judging whether in loading process
  const [isLoading, setIsLoading] = useState(true);
  // failure scenario
  const [httpError, setHttpError] = useState(null);
  // paginaton array
  const [currentPage, setCurrentPage] = useState(1);
  // each page show 5 books
  const [booksPerPage] = useState(5);
  // total amounts of books
  const [totalAmountofBooks, setTotalAmountofBooks] = useState(0);
  // total pages
  const [totalPages, setTotalPages] = useState(0);
  
  // copy useEffect, isLoading and httpError from SearchBooksPage.tsx
  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = `http://localhost:8080/api/books?page=${currentPage - 1}&size=${booksPerPage}`;   
      // fetching the url data
      const response = await fetch(baseUrl);
      //failure scenario
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      // transfer the url data into json;
      const responseJson = await response.json();
      // get the data of embedded books
      const responseData = responseJson._embedded.books;
      //get the total amount of books
      setTotalAmountofBooks(responseJson.page.totalElements);
      //get the total pages to show these books
      setTotalPages(responseJson.page.totalPages);
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
    // pass current page , so each time we click on different page number, the data will be refreshed.
    //(S13-95,search by title)step3: add searchUrl parameter
  }, [currentPage]);
  // pagination functionality
  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem =
    booksPerPage * currentPage <= totalAmountofBooks
      ? booksPerPage * currentPage
      : totalAmountofBooks;
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // when in loading process, show: "Loading..."
  if (isLoading) {
    return <SpinnerLoading />;
  }
  // if there is error in fetch data
  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }
 

    return(
        <div className='container mt-5'>
            {/* judge if the total amount of books is positive, which means the book exists */}
            {totalAmountofBooks > 0 ?
                <>
                    <div className='mt-3'>
                        <h3>Number of results: ({totalAmountofBooks})</h3>
                    </div>
                    <p>
                        {indexOfFirstBook + 1} to {lastItem} of {totalAmountofBooks} items: 
                    </p>
                    {books.map(book => (
                       <p>display different quantity of books </p>
                    ))}
                </>
                :
                // if no book
                <h5>Add a book before changing quantity</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    )
}