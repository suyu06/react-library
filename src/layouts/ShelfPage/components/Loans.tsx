import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

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
  }, [authState]);

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
                      <img src={require("./../../../Images/BooksImages/book-luv2code-1000.png")} 
                      width="226" height="349" alt="Book" />
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
