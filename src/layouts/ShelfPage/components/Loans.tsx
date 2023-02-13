import { useOktaAuth } from "@okta/okta-react";
import {  useEffect, useState } from "react";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const Loans = () =>{
    // okta authentication and http error useState
    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(null);
     // Current Loans
     const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
     const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
     const [checkout, setCheckout] = useState(false);

     useEffect(()=>{
        const  fetchUserCurrentLoans = async () => {
            //if  user is authenticated, 
            if (authState && authState.isAuthenticated) {           
             
                const url = `http://localhost:8080/api/books/secure/currentloans`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                //fetch data with url and request url and request headers
                const shelfCurrentLoansResponse = await fetch(url, requestOptions);
                //if api call fails
                if (!shelfCurrentLoansResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                //convert to json object
                const shelfCurrentLoansResponseJson = await shelfCurrentLoansResponse.json();
                setShelfCurrentLoans(shelfCurrentLoansResponseJson);
            }
            // fetching data finished, turn off the loading process
            setIsLoadingUserLoans(false);
        }
    
     fetchUserCurrentLoans().catch((error: any) => {
        setIsLoadingUserLoans(false);
        setHttpError(error.message);
    })
    //each time this use effect is called, scroll to the top of the page.
    window.scrollTo(0, 0);
},[authState])

if (isLoadingUserLoans) {
    return (
        <SpinnerLoading/>
    );
}

if (httpError) {
    return (
        <div className='container m-5'>
            <p>
                {httpError}
            </p>
        </div>
    );
}

    return(

    )
}