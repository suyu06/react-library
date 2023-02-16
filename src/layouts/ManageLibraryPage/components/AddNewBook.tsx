import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";

export const AddNewBook = () => {
    // authState
    const { authState } = useOktaAuth();

    // New Book
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [copies, setCopies] = useState(0);
    const [category, setCategory] = useState('Category');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // Displays
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    // get the category string from the user's choice in the drop down menu
    function categoryField(value: string) {
        setCategory(value);
    }
    // dealing with the image of book
    async function base64ConversionForImages(e: any) {
        if (e.target.files[0]) {
            //passing this file into getBase64();
            getBase64(e.target.files[0]);
        }
    }
    function getBase64(file: any) {
        // create a file readerread the contents of file of our ccomputer
        let reader = new FileReader();
        //read the contents of file,representing the file's data as a base64 encoded string.
        reader.readAsDataURL(file);
        // set the read result to state,
        reader.onload = function () {
            setSelectedImage(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error', error);
        }
    }
    

    return(
        <div className='container mt-5 mb-5'>
            {/* successful banner */}
            {displaySuccess && 
                <div className='alert alert-success' role='alert'>
                    Book added successfully
                </div>
            }
            {/* alert banner */}
            {displayWarning && 
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out
                </div>
            }
            <div className='card'>
                {/* card header */}
                <div className='card-header'>
                    Add a new book
                </div>
                {/* form in the card body */}
                <div className='card-body'>
                    <form method='POST'>
                        <div className='row'>
                            {/* basic book info */}
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Title</label>
                                <input type="text" className='form-control' name='title' required 
                                    onChange={e => setTitle(e.target.value)} value={title} />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Author </label>
                                <input type="text" className='form-control' name='author' required 
                                    onChange={e => setAuthor(e.target.value)} value={author}/>
                            </div>
                            {/* drop down menu */}
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Category</label>
                                <button className='form-control btn btn-secondary dropdown-toggle' type='button' 
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                        {category}
                                </button>
                                {/* contene of drop down menu */}
                                <ul id='addNewBookId' className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li><a onClick={() => categoryField('FE')} className='dropdown-item'>Front End</a></li>
                                    <li><a onClick={() => categoryField('BE')} className='dropdown-item'>Back End</a></li>
                                    <li><a onClick={() => categoryField('Data')} className='dropdown-item'>Data</a></li>
                                    <li><a onClick={() => categoryField('DevOps')} className='dropdown-item'>DevOps</a></li>
                                </ul>
                            </div>
                        </div>
                        {/* input box part */}
                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>Description</label>
                            <textarea className='form-control' id='exampleFormControlTextarea1' rows={3} 
                                onChange={e => setDescription(e.target.value)} value={description}></textarea>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <label className='form-label'>Copies</label>
                            <input type='number' className='form-control' name='Copies' required 
                                onChange={e => setCopies(Number(e.target.value))} value={copies}/>
                        </div>
                        <input type='file' onChange={e => base64ConversionForImages(e)}/>
                        {/* add book btn */}
                        <div>
                            <button type='button' className='btn btn-primary mt-3'>
                                Add Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
}