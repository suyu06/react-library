import {useOktaAuth} from '@okta/okta-react'
import {useEffect, useState} from 'react'
import MessageModel from '../../../models/MessageModel'
import {Pagination} from '../../Utils/Pagination'
import {SpinnerLoading} from '../../Utils/SpinnerLoading'

export const Messages = () => {
	//common useState
	const {authState} = useOktaAuth()
	const [isLoadingMessages, setIsLoadingMessages] = useState(true)
	const [httpError, setHttpError] = useState(null)
	// Messages useState
	const [messages, setMessages] = useState<MessageModel[]>([])

	// Pagination useState
	const [messagesPerPage] = useState(5)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(0)

	// useEffect
	useEffect(() => {
		const fetchUserMessages = async () => {
			// only if user is authenticated
			if (authState && authState?.isAuthenticated) {
				// save the string url to a const
				const url = `http://localhost:8080/api/messages/search/findByUserEmail/?userEmail=${authState?.accessToken?.claims.sub}&page=${currentPage - 1}&size=${messagesPerPage}`;
				const requestOptions = {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
						'Content-Type': 'application/json',
					},
				}
				// fetch the data with url and right request type and header
				const messagesResponse = await fetch(url, requestOptions)
				// if there is an fetching error
				if (!messagesResponse.ok) {
					throw new Error('Something went wrong!')
				}
				// convert to json object
				const messagesResponseJson = await messagesResponse.json()
				// save the message fetched
				setMessages(messagesResponseJson._embedded.messages)
				// save the total pages fetched
				setTotalPages(messagesResponseJson.page.totalPages)
			}
			setIsLoadingMessages(false)
		}
		fetchUserMessages().catch((error: any) => {
			setIsLoadingMessages(false)
			setHttpError(error.messages)
		})
		window.scrollTo(0, 0)
	}, [authState, currentPage])

	// showing spinner if in loading process
	if (isLoadingMessages) {
		return <SpinnerLoading />
	}
	// if meets an error
	if (httpError) {
		return (
			<div className="container m-5">
				<p>{httpError}</p>
			</div>
		)
	}
	// pagination const
	const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

	return (
		<div className="mt-2">
            {/* judge if the message exists */}
			{messages.length > 0 ? (
				<>
					{/* if message exists */}
					<h5>Current Q/A: </h5>
					{messages.map((message) => (
						<div key={message.id}>
							<div className="card mt-2 shadow p-3 bg-body rounded">
								<h5>
									Case #{message.id}: {message.title}
								</h5>
								<h6>{message.userEmail}</h6>
								<p>{message.question}</p>
								<hr />
								{/*resonse part*/}
								<div>
									<h5>Response: </h5>
									{message.response && message.adminEmail ? (
										<>
                                        {/* if there is a response show info below */}
											<h6>{message.adminEmail} (admin)</h6>
											<p>{message.response}</p>
										</>
									) : (
                                        // if no response
										<p>
											<i>Pending response from administration. Please be patient.</i>
										</p>
									)}
								</div>
							</div>
						</div>
					))}
				</>
			) : (
				// no message for the user
				<h5>All questions you submit will be shown here</h5>
			)}
			{/* panination */}
			{totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
		</div>
	)
}
