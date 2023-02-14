import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";

export const LoansModal: React.FC<{ shelfCurrentLoan: ShelfCurrentLoans; mobile: boolean; returnBook: any; renewLoan: any }> = (props) => {
  return (
    <div
      className="modal fade"
      // give this div a id, if it equals to the mobilemodal, show mobile version, else desktop version
      id={props.mobile ? `mobilemodal${props.shelfCurrentLoan.book.id}` : `modal${props.shelfCurrentLoan.book.id}`}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      key={props.shelfCurrentLoan.book.id}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Loan Options
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="mt-3">
                <div className="row">
                  {/* image part */}
                  <div className="col-2">
                    {props.shelfCurrentLoan.book?.img ? (
                      //current borrowed book's image
                      <img src={props.shelfCurrentLoan.book?.img} width="56" height="87" alt="Book" />
                    ) : (
                      // default image
                      <img src={require("./../../../Images/BooksImages/book-luv2code-1000.png")} width="56" height="87" alt="Book" />
                    )}
                  </div>
                  <div className="col-10">
                    {/* author and title part */}
                    <h6>{props.shelfCurrentLoan.book.author}</h6>
                    <h4>{props.shelfCurrentLoan.book.title}</h4>
                  </div>
                </div>
                <hr />
                {/* present different messages based on how many days are left for that current loan. */}
                {props.shelfCurrentLoan.daysLeft > 0 && <p className="text-secondary">Due in {props.shelfCurrentLoan.daysLeft} days.</p>}
                {props.shelfCurrentLoan.daysLeft === 0 && <p className="text-success">Due Today.</p>}
                {props.shelfCurrentLoan.daysLeft < 0 && <p className="text-danger">Past due by {props.shelfCurrentLoan.daysLeft} days.</p>}
                <div className="list-group mt-3">
                  {/* return book btn */}
                  <button
                    onClick={() => props.returnBook(props.shelfCurrentLoan.book.id)}
                    data-bs-dismiss="modal"
                    className="list-group-item list-group-item-action"
                    aria-current="true"
                  >
                    Return Book
                  </button>
                  {/* renew book btn */}
                  <button
                    onClick={props.shelfCurrentLoan.daysLeft < 0 ? 
                      (event) => event.preventDefault() : () => props.renewLoan(props.shelfCurrentLoan.book.id)}
                    data-bs-dismiss="modal"
                    className={
                      //if book already due , cannot clik on renew button
                      props.shelfCurrentLoan.daysLeft < 0 ? "list-group-item list-group-item-action inactiveLink" : "list-group-item list-group-item-action"
                    }
                  >
                    {/* if book is already due, shows"Late dues cannot be renewed", else{Renew loan for 7 days}*/}
                    {props.shelfCurrentLoan.daysLeft < 0 ? "Late dues cannot be renewed" : "Renew loan for 7 days"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
