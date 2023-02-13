import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { Pagination } from "../../Utils/Pagination";
import { Review } from "../../Utils/Review";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const ReviewListPage = () => {
    // create useState for reviews
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Book to look up reviews, the third element of the url
    const bookId = (window.location.pathname).split('/')[2];
    
    useEffect(() => {
    const fetchBookReviews = async () => {
          // add page and size to  url, to call specific book
          const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;
          const responseReviews = await fetch(reviewUrl);
          if (!responseReviews.ok) {
            throw new Error("Something went wrong!");
          }
          // transfer to Json object
          const responseJsonReviews = await responseReviews.json();
          // get all the _embedeed data
          const responseData = responseJsonReviews._embedded.reviews;
          // Save the total amount of reviews
          setTotalAmountOfReviews(responseJsonReviews.page.totalElements);
          // save total pages for these reviews
          setTotalPages(responseJsonReviews.page.totalPages);
          // create an empty arry to store the data
          const loadedReviews: ReviewModel[] = [];         
          // loop all the json data and store them into the array
          for (const key in responseData) {
            loadedReviews.push({
              id: responseData[key].id,
              userEmail: responseData[key].userEmail,
              date: responseData[key].date,
              rating: responseData[key].rating,
              book_id: responseData[key].bookId,
              reviewDescription: responseData[key].reviewDescription,
            });           
          }      
          setReviews(loadedReviews);
          setIsLoading(false);
        };
        fetchBookReviews().catch((error: any) => {
          setIsLoading(false);
          setHttpError(error.message);
        });
      }, [currentPage]);
      
      if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }
    // pagination 
    // the firs review and last review of each page
    const indexOfLastReview: number = currentPage * reviewsPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;
    // if current page is not the last page, last item is the current page *reviews per page;
    // if current page is the last page, the last item is the last element of whole reviews
    let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? 
            reviewsPerPage * currentPage : totalAmountOfReviews;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

   // review list page layout
    return(
        <div className="container mt-5">
        <div>
            <h3>Comments: ({reviews.length})</h3>
        </div>
        <p>
            {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
        </p>
        <div className="row">
            {reviews.map(review => (
                <Review review={review} key={review.id} />
            ))}
        </div>
        {/* if there is more than page */}
        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
    </div>
    )
}