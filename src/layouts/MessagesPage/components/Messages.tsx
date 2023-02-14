import { useOktaAuth } from "@okta/okta-react/bundles/types";
import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const Messages = () => {
    //common useState
    const { authState } = useOktaAuth();
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);
    // Messages useState
    const [messages, setMessages] = useState<MessageModel[]>([]);

    // Pagination useState
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // useEffect
    useEffect(() => {
        const fetchUserMessages = async () => {
            // only if user is authenticated
            if (authState && authState?.isAuthenticated) {
                // save the string url to a const
                const url = `http://localhost:8080/api/messages/search/findByUserEmail
                /?userEmail=${authState?.accessToken?.claims.sub}&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                // fetch the data with url and right request type and header
                const messagesResponse = await fetch(url, requestOptions);
                // if there is an fetching error
                if (!messagesResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                // convert to json object
                const messagesResponseJson = await messagesResponse.json();
                // save the message fetched 
                setMessages(messagesResponseJson._embedded.messages);
                // save the total pages fetched
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);

        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.messages);
        })
        window.scrollTo(0, 0);

    },[authState, currentPage])
    // showing spinner if in loading process
    if (isLoadingMessages) {
        return (
            <SpinnerLoading/>
        );
    }
    // if meets an error
    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }
    // pagination const
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return(
        
    );
}