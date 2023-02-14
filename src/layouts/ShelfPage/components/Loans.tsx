import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { LoansModal } from "./LoansModal";

export const Loans = () => {
  // okta authentication and http error useState
  const { authState } = useOktaAuth();
  const [httpError, setHttpError] = useState(null);
  // Current Loans
  const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
  const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
  const [checkout, setCheckout] = useState(false);

  useEffect(() => {
    const fetchUserCurrentLoans = async () => {
      //if  user is authenticated,
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8080/api/books/secure/currentloans`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        //fetch data with url and request url and request headers
        const shelfCurrentLoansResponse = await fetch(url, requestOptions);
        //if api call fails
        if (!shelfCurrentLoansResponse.ok) {
          throw new Error("Something went wrong!");
        }
        //convert to json object
        const shelfCurrentLoansResponseJson = await shelfCurrentLoansResponse.json();
        setShelfCurrentLoans(shelfCurrentLoansResponseJson);
      }
      // fetching data finished, turn off the loading process
      setIsLoadingUserLoans(false);
    };

    fetchUserCurrentLoans().catch((error: any) => {
      setIsLoadingUserLoans(false);
      setHttpError(error.message);
    });
    //each time this use effect is called, scroll to the top of the page.
    window.scrollTo(0, 0);
  }, [authState, checkout]);

  if (isLoadingUserLoans) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }
  async function returnBook(bookId: number) {
    const url = `http://localhost:8080/api/books/secure/return/?bookId=${bookId}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    //fetch the data using url and request url and headers
    const returnResponse = await fetch(url, requestOptions);
    //if failure
    if (!returnResponse.ok) {
      throw new Error("Something went wrong!");
    }
    // change the checkout state
    setCheckout(!checkout);
  }

  async function renewLoan(bookId: number) {
    const url = `http://localhost:8080/api/books/secure/renew/loan/?bookId=${bookId}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    //fetch the data using url and request url and headers
    const returnResponse = await fetch(url, requestOptions);
    //if failure
    if (!returnResponse.ok) {
      throw new Error("Something went wrong!");
    }
    // change the checkout state
    setCheckout(!checkout);
  }
  //html and css
  return (
    <div>
      {/* Desktop */}
      <div className="d-none d-lg-block mt-2">
        {shelfCurrentLoans.length > 0 ? (
          <>
            {/*user has borrowed books*/}
            <h5>Current Loans: </h5>

            {shelfCurrentLoans.map((shelfCurrentLoan) => (
              <div key={shelfCurrentLoan.book.id}>
                <div className="row mt-3 mb-3">
                  {/* book image part */}
                  <div className="col-4 col-md-4 container">
                    {shelfCurrentLoan.book?.img ? (
                      // image of current borrowed book
                      <img src={shelfCurrentLoan.book?.img} width="226" height="349" alt="Book" />
                    ) : (
                      //default image
                      <img src={require("./../../../Images/BooksImages/book-luv2code-1000.png")} width="226" height="349" alt="Book" />
                    )}
                  </div>
                  <div className="card col-3 col-md-3 container d-flex">
                    <div className="card-body">
                      <div className="mt-3">
                        <h4>Loan Options</h4>
                        {/* present different messages based on how many days are left for that current loan. */}
                        {shelfCurrentLoan.daysLeft > 0 && <p className="text-secondary">Due in {shelfCurrentLoan.daysLeft} days.</p>}
                        {shelfCurrentLoan.daysLeft === 0 && <p className="text-success">Due Today.</p>}
                        {shelfCurrentLoan.daysLeft < 0 && <p className="text-danger">Past due by {shelfCurrentLoan.daysLeft} days.</p>}
                        <div className="list-group mt-3">
                          <button
                            className="list-group-item list-group-item-action"
                            aria-current="true"
                            data-bs-toggle="modal"
                            data-bs-target={`#modal${shelfCurrentLoan.book.id}`}
                          >
                            Manage Loan
                          </button>
                          <Link to={"search"} className="list-group-item list-group-item-action">
                            Search more books?
                          </Link>
                        </div>
                      </div>
                      <hr />
                      <p className="mt-3">Help other find their adventure by reviewing your loan.</p>
                      <Link className="btn btn-primary" to={`/checkout/${shelfCurrentLoan.book.id}`}>
                        Leave a review
                      </Link>
                    </div>
                  </div>
                </div>
                <hr />
                <LoansModal shelfCurrentLoan={shelfCurrentLoan} mobile={false} returnBook={returnBook} renewLoan={renewLoan}/>/
              </div>
            ))}
          </>
        ) : (
          //  user has not borrowed books yet
          <>
            <h3 className="mt-3">Currently no loans</h3>
            <Link className="btn btn-primary" to={`search`}>
              Search for a new book
            </Link>
          </>
        )}
      </div>
      {/* mobile version */}
      <div className="container d-lg-none mt-2">
        {shelfCurrentLoans.length > 0 ? (
          <>
            {/*user has borrowed books*/}
            <h5 className="mb-3">Current Loans: </h5>

            {shelfCurrentLoans.map((shelfCurrentLoan) => (
              <div key={shelfCurrentLoan.book.id}>
                {/* book image part */}
                <div className="d-flex justify-content-center align-items-center">
                  {shelfCurrentLoan.book?.img ? (
                    // image of current borrowed book
                    <img src={shelfCurrentLoan.book?.img} width="226" height="349" alt="Book" />
                  ) : (
                    //default image
                    <img src={require("./../../../Images/BooksImages/book-luv2code-1000.png")} width="226" height="349" alt="Book" />
                  )}
                </div>
                <div className="card d-flex mt-5 mb-3">
                  <div className="card-body">
                    <div className="mt-3">
                      <h4>Loan Options</h4>
                      {/* present different messages based on how many days are left for that current loan. */}
                      {shelfCurrentLoan.daysLeft > 0 && <p className="text-secondary">Due in {shelfCurrentLoan.daysLeft} days.</p>}
                      {shelfCurrentLoan.daysLeft === 0 && <p className="text-success">Due Today.</p>}
                      {shelfCurrentLoan.daysLeft < 0 && <p className="text-danger">Past due by {shelfCurrentLoan.daysLeft} days.</p>}
                      <div className="list-group mt-3">
                        <button
                          className="list-group-item list-group-item-action"
                          aria-current="true"
                          data-bs-toggle="modal"
                          data-bs-target={`#mobilemodal${shelfCurrentLoan.book.id}`}
                        >
                          Manage Loan
                        </button>
                        <Link to={"search"} className="list-group-item list-group-item-action">
                          Search more books?
                        </Link>
                      </div>
                    </div>
                    <hr />
                    <p className="mt-3">Help other find their adventure by reviewing your loan.</p>
                    <Link className="btn btn-primary" to={`/checkout/${shelfCurrentLoan.book.id}`}>
                      Leave a review
                    </Link>
                  </div>
                </div>
                <hr />
                <LoansModal shelfCurrentLoan={shelfCurrentLoan} mobile={true} returnBook={returnBook} renewLoan={renewLoan}/>/
              </div>
            ))}
          </>
        ) : (
          //  user has not borrowed books yet
          <>
            <h3 className="mt-3">Currently no loans</h3>
            <Link className="btn btn-primary" to={`search`}>
              Search for a new book
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
