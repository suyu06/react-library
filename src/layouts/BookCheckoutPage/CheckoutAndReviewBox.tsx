import { Link } from "react-router-dom";
import BookModel from "../../models/BookModel";
import { LeaveAReview } from "../Utils/LeaveAReview";

export const CheckoutAndReviewBox: React.FC<{
  book: BookModel | undefined;
  mobile: boolean;
  currentLoansCount: number;
  isAuthenticated: any;
  isCheckedOut: boolean;
  checkoutBook: any;
  isReviewLeft: boolean;
  submitReview: any;
}> = (props) => {
  // add a function to judge how to present  sign in btn
  function buttonRender() {
    //  if user is authenticated
    if (props.isAuthenticated) {
      // if the book is not checked out and user has borrowed less than 5 books, means user can borrow this book,
      if (!props.isCheckedOut && props.currentLoansCount < 5) {
        return (
          <button
            onClick={() => props.checkoutBook()}
            className="btn btn-success btn-lg"
          >
            Checkout
          </button>
        );
      }
      // if user borrowed this book
      else if (props.isCheckedOut) {
        return (
          <p>
            <b>Book checked out. Enjoy!</b>
          </p>
        );
      } else if (!props.isCheckedOut) {
        return <p className="text-danger">Too many books checked out.</p>;
      }
    }
    // if user not authenticated
    return (
      <Link to={"/login"} className="btn btn-success btn-lg">
        Sign in
      </Link>
    );
  }
  // review render function
  function reviewRender() {
    // check if the user is authenticated and if the user has left a review
    // if the user is authenticates and has not left a review
    if (props.isAuthenticated && !props.isReviewLeft) {
      return (
        <p>          
          <LeaveAReview submitReview={props.submitReview} />
        </p>
      );
    } else if (props.isAuthenticated && props.isReviewLeft) {
      // if the user is authenticated and has already left a review
      return (
        <p>
          <b>Thank you for your review!</b>
        </p>
      );
    }
    return (
      <div>
        <hr />
        <p>Sign in to be able to leave a review.</p>
      </div>
    );
  }

  return (
    // if in mobile version, use "card d-flex mt-5";if not, use"card col-3 container d-flex mb-5"
    <div
      className={
        props.mobile ? "card d-flex mt-5" : "card col-3 container d-flex mb-5"
      }
    >
      <div className="card-body container">
        <div className="mt-3">
          <p>
            <b>{props.currentLoansCount}/5 </b>
            books checked out
          </p>
          <hr />
          {/* if we have book and its number of copies available which is positive, we let it "available" ;if not, let it be "wait list"*/}
          {props.book &&
          props.book.copiesAvailable &&
          props.book.copiesAvailable > 0 ? (
            <h4 className="text-success">Available</h4>
          ) : (
            <h4 className="text-danger">Wait List</h4>
          )}
          {/* text for copies and copies available */}
          <div className="row">
            <p className="col-6 lead">
              <b>{props.book?.copies} </b>
              copies
            </p>
            <p className="col-6 lead">
              <b>{props.book?.copiesAvailable} </b>
              available
            </p>
          </div>
        </div>
        {/* sign in button */}
        {buttonRender()}
        <hr />
        <p className="mt-3">
          This number can change until placing order has been complete.
        </p>
        {reviewRender()}
      </div>
    </div>
  );
};
