import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { Pagination } from "../Utils/Pagination";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";

export const SerachBooksPage = () => {
  // create a book array
  const [books, setBooks] = useState<BookModel[]>([]);
  //for judging whether in loading process
  const [isLoading, setIsLoading] = useState(true);
  //API call failure scenario
  const [httpError, setHttpError] = useState(null);
  // paginaton array
  const [currentPage, setCurrentPage] = useState(1);
  // each page show 5 books
  const [booksPerPage] = useState(5);
  // total amounts of books
  const [totalAmountofBooks, setTotalAmountofBooks] = useState(0);
  // total pages
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = "http://localhost:8080/api/books";
      // 1.change the query parameter from "size = 9" to "size=5"
      // 2.change the query parameter page number from 0 to a  dynamically number
      const url: string = `${baseUrl}?page=${
        currentPage - 1
      }&size=${booksPerPage}`;
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
    window.scrollTo(0,0);
    // pass current page , so each time we click on different page number, the data will be refreshed.
  }, [currentPage]);
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
  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem =
    booksPerPage * currentPage <= totalAmountofBooks
      ? booksPerPage * currentPage
      : totalAmountofBooks;
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <div>
      <div className="container">
        <div>
          <div className="row mt-5">
            <div className="col-6">
              <div className="d-flex">
                {/* search input box */}
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-labelledby="Search"
                />
                <button className="btn btn-outline-success">Search</button>
              </div>
            </div>
            {/* category dropdown menu  */}
            <div className="col-4">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Category
                </button>
                {/* drop down menu items */}
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      All
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Front End
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Back End
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Data
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      DevOps{" "}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* short description of search result part */}
          <div className="mt-3">
            {/* change the original 22 to a dynamical number */}
            <h5> Number of results: ({totalAmountofBooks})</h5>
          </div>
          {/* 1 to 5 of 22 items :change into dynamical number */}
          <p>{indexOfFirstBook +1} to {lastItem} of {totalAmountofBooks} items :</p>
          {books.map((book) => (
            <SearchBook book={book} key={book.id} />
          ))}
          {/* only render <pagination/> if totalPages >1*/}
          {totalPages >1 && 
          <Pagination currentPage={currentPage } totalPages={totalPages} paginate={paginate}/>
        }
        </div>
      </div>
    </div>
  );
};
