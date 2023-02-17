import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";

export const ChangeQuantityOfBook: React.FC<{ book: BookModel }> = (props, key) => {
    //OktaAuth
    const { authState } = useOktaAuth();
    // useSate
    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);
    // useEffect
    useEffect(() => {
        const fetchBookInState = () => {
            // if book's copies number exists, we set it as the number of its quantity. or, ser it as 0;
            props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
             // if book's available copies number exists, we set it as the number of its available quantity. 
             //or, ser it as 0;
            props.book.copiesAvailable ? setRemaining(props.book.copiesAvailable) : setRemaining(0);
        };
        fetchBookInState();
    }, []);


    return(
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
        <div className='row g-0'>
            <div className='col-md-2'>
                {/* image part, if exists, show its picture, if not, show defaut image */}
                <div className='d-none d-lg-block'>
                    {props.book.img ?
                        <img src={props.book.img} width='123' height='196' alt='Book' />
                        :
                        <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} 
                            width='123' height='196' alt='Book' />
                    }
                </div>
                {/* mobile version */}
                <div className='d-lg-none d-flex justify-content-center align-items-center'>
                    {props.book.img ?
                        <img src={props.book.img} width='123' height='196' alt='Book' />
                        :
                        <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} 
                            width='123' height='196' alt='Book' />
                    }
                </div>
            </div>
            <div className='col-md-6'>
                <div className='card-body'>
                    <h5 className='card-title'>{props.book.author}</h5>
                    <h4>{props.book.title}</h4>
                    <p className='card-text'> {props.book.description} </p>
                </div>
            </div>
            <div className='mt-3 col-md-4'>
                <div className='d-flex justify-content-center algin-items-center'>
                    <p>Total Quantity: <b>{quantity}</b></p>
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    <p>Books Remaining: <b>{remaining}</b></p>
                </div>
            </div>
            <div className='mt-3 col-md-1'>
                <div className='d-flex justify-content-start'>
                    <button className='m-1 btn btn-md btn-danger' >Delete</button>
                </div>
            </div>
            <button className='m1 btn btn-md main-color text-white' >Add Quantity</button>
            <button className='m1 btn btn-md btn-warning' >Decrease Quantity</button>
        </div>
    </div>

    );
}