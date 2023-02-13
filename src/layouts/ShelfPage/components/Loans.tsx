import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";


export const Loans = () =>{
    // okta authentication and http error useState
    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(null);
     // Current Loans
     const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
     const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
     const [checkout, setCheckout] = useState(false);

    return(

    )
}