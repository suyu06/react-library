import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import AdminMessageRequest from "../../../models/AdminMessageRequest";
import MessageModel from "../../../models/MessageModel";
import { Pagination } from "../../Utils/Pagination";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { AdminMessage } from "./AdminMessage";

export const AdminMessages = () => {
    // oktaAuth
    const { authState } = useOktaAuth();

    // Normal Loading Pieces
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);
    
    // Messages endpoint State
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Recall useEffect
    const [btnSubmit, setBtnSubmit] = useState(false);

    useEffect(() => {
        const fetchUserMessages = async () => {
            // only if user is authenticated
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/messages/search/findByClosed/?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                //fetch() to get the data from the url
                const messagesResponse = await fetch(url, requestOptions);
                //meets error
                if (!messagesResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                // convert to JSON
                const messagesResponseJson = await messagesResponse.json();
                // save messages and total page number
                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            //finish loadin process
            setIsLoadingMessages(false);


        }
        //if fetching data meets error:
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        })
        //each time turn to a new page, it will go to the top of the page
        window.scrollTo(0, 0);
    },[authState, currentPage, btnSubmit])

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
    
    async function submitResponseToQuestion(id: number, response: string) {
        const url = `http://localhost:8080/api/messages/secure/admin/message`;
        // user is authenticated and both response request id and response exist:
        if (authState && authState?.isAuthenticated && id !== null && response !== '') {
            const messageAdminRequestModel: AdminMessageRequest = new AdminMessageRequest(id, response);
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageAdminRequestModel)
            };
            // fetch the data
            const messageAdminRequestModelResponse = await fetch(url, requestOptions);
            // if fetching meets error
            if (!messageAdminRequestModelResponse.ok) {
                throw new Error('Something went wrong!');
            }
            //reset the state of the btn
            setBtnSubmit(!btnSubmit);
        }
    }




    // pagination const
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return(
        <div className='mt-3'>
            {/* if there is messages: */}
            {messages.length > 0 ? 
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                         <AdminMessage message={message} key={message.id} 
                         submitResponseToQuestion={submitResponseToQuestion} />
                    ))}
                </>
                :
                //no messages
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}