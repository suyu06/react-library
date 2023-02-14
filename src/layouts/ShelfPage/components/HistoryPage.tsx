import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import HistoryModel from "../../../models/HistoryModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const HistoryPage = () =>{

    //useState
    const { authState } = useOktaAuth();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState(null);
    //Histories
    const [histories, setHistories] = useState<HistoryModel[]>([]);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // useEffect
    useEffect (() => {
        const fetchUserHistory = async () => {
            // only user is authenticated
            if (authState && authState.isAuthenticated) {
                const url =
                 `http://localhost:8080/api/histories/search/findBooksByUserEmail/?userEmail
                 =${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                // fetch data with url and request (get method and json content)
                const historyResponse = await fetch(url, requestOptions);
                // if failure
                if (!historyResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                // convert to json object
                const historyResponseJson = await historyResponse.json();
                // get all histories
                setHistories(historyResponseJson._embedded.histories);
                // get the total page number
                setTotalPages(historyResponseJson.page.totalPages);
            }
            setIsLoadingHistory(false);

        }
        fetchUserHistory().catch((error: any) => {
            setIsLoadingHistory(false);
            setHttpError(error.message);
        })
    },[authState, currentPage]);
    
    if (isLoadingHistory) {
        return (
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }
    
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return(

    )
}