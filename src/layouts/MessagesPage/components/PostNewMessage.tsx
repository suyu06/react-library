import {useOktaAuth} from '@okta/okta-react'
import {useState} from 'react'

export const PostNewMessage = () => {
	// oktaAuth state
	const {authState} = useOktaAuth()
	// useState for title ,question , failure or success for post action
	const [title, setTitle] = useState('')
	const [question, setQuestion] = useState('')
	const [displayWarning, setDisplayWarning] = useState(false)
	const [displaySuccess, setDisplaySuccess] = useState(false)

	return (
		<div className="card mt-3">
            {/* alert message  */}
			{displaySuccess && (
				<div className="alert alert-success" role="alert">
					Question added successfully
				</div>
			)}
            {/* card header */}
			<div className="card-header">Ask question to JAC Read Admin</div>
            {/* card boby */}
			<div className="card-body">
                {/* form  */}
				<form method="POST">
                    {/* warning text:if user do not input the fields */}
					{displayWarning && (
						<div className="alert alert-danger" role="alert">
							All fields must be filled out
						</div>
					)}
                    {/* title label and input area */}
					<div className="mb-3">
						<label className="form-label">Title</label>
						<input
							type="text"
							className="form-control"
							id="exampleFormControlInput1"
							placeholder="Title"
							onChange={(e) => setTitle(e.target.value)}
							value={title}
						/>
					</div>
                    {/* question label and textarea */}
                    <div className='mb-3'>
                        <label className='form-label'>
                            Question
                        </label>
                        <textarea className='form-control' id='exampleFormControlTextarea1' 
                            rows={3} onChange={e => setQuestion(e.target.value)} value={question}>
                        </textarea>
                    </div>   
                     {/* submit btn*/}
                    <div>
                        <button type='button' className='btn btn-primary mt-3'>
                            Submit Question
                        </button>
                    </div>                
				</form>
			</div>
		</div>
	)
}
