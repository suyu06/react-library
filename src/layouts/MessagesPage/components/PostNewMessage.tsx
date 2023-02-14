import {useOktaAuth} from '@okta/okta-react'
import {useState} from 'react'
import MessageModel from '../../../models/MessageModel'

export const PostNewMessage = () => {
	// oktaAuth state
	const {authState} = useOktaAuth()
	// useState for title ,question , failure or success for post action
	const [title, setTitle] = useState('')
	const [question, setQuestion] = useState('')
	const [displayWarning, setDisplayWarning] = useState(false)
	const [displaySuccess, setDisplaySuccess] = useState(false)

	// fetch data from the database
	async function submitNewQuestion() {
		// create a const to save our url string
		const url = `http://localhost:8080/api/messages/secure/add/message`
		// if the user is authenticated, and input both the title and qustion of the message
		if (authState?.isAuthenticated && title !== '' && question !== '') {
			//create a new messageModel with the user input and assign it to our const messageRequestModel
			const messageRequestModel: MessageModel = new MessageModel(title, question)
			const requestOptions = {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
					'Content-Type': 'application/json',
				},
				// convert string into JSON
				body: JSON.stringify(messageRequestModel),
			}
			// fetch the data with the url and request option
			const submitNewQuestionResponse = await fetch(url, requestOptions)
			//fetching failure
			if (!submitNewQuestionResponse.ok) {
				throw new Error('Something went wrong!')
			}
			// set the input area blank again
			setTitle('')
			setQuestion('')
			setDisplayWarning(false)
			setDisplaySuccess(true)
		} else {
			// the user is not authenticated or input area is empty
			setDisplayWarning(true)
			setDisplaySuccess(false)
		}
	}

	return (
		<div className="card mt-3">
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
					{/* if question submitted successfully,show this banner */}
					{displaySuccess && (
						<div className="alert alert-success" role="alert">
							Question added successfully
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
					<div className="mb-3">
						<label className="form-label">Question</label>
						<textarea
							className="form-control"
							id="exampleFormControlTextarea1"
							rows={3}
							onChange={(e) => setQuestion(e.target.value)}
							value={question}></textarea>
					</div>
					{/* submit btn*/}
					<div>
						<button type="button" className="btn btn-primary mt-3" onClick={submitNewQuestion}>
							Submit Question
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
