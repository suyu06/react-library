import {useOktaAuth} from '@okta/okta-react'
import {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import HistoryModel from '../../../models/HistoryModel'
import { Pagination } from '../../Utils/Pagination'
import {SpinnerLoading} from '../../Utils/SpinnerLoading'

export const HistoryPage = () => {
	//useState
	const {authState} = useOktaAuth()
	const [isLoadingHistory, setIsLoadingHistory] = useState(true)
	const [httpError, setHttpError] = useState(null)
	//Histories
	const [histories, setHistories] = useState<HistoryModel[]>([])

	//Pagination
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(0)

	// useEffect
	useEffect(() => {
		const fetchUserHistory = async () => {
			// only user is authenticated
			if (authState && authState.isAuthenticated) {
				const url = `http://localhost:8080/api/histories/search/findBooksByUserEmail/?userEmail
				=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;
				const requestOptions = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
				// fetch data with url and request (get method and json content)
				const historyResponse = await fetch(url, requestOptions)
				// if failure
				if (!historyResponse.ok) {
					throw new Error('Something went wrong!')
				}
				// convert to json object
				const historyResponseJson = await historyResponse.json()
				// get all histories
				setHistories(historyResponseJson._embedded.histories)
				// get the total page number
				setTotalPages(historyResponseJson.page.totalPages)
			}
			setIsLoadingHistory(false)
		}
		fetchUserHistory().catch((error: any) => {
			setIsLoadingHistory(false)
			setHttpError(error.message)
		})
	}, [authState, currentPage])

	if (isLoadingHistory) {
		return <SpinnerLoading />
	}

	if (httpError) {
		return (
			<div className="container m-5">
				<p>{httpError}</p>
			</div>
		)
	}

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

	return (
		<div className="mt-2">
			{histories.length > 0 ? (
				<>   
                    {/*if lenght is >0, which means there is book in history repository  */}
					<h5>Recent History:</h5>
					{histories.map((history) => (
						<div key={history.id}>
							<div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
								<div className="row g-0">
									<div className="col-md-2">
                                        {/* image part */}
										<div className="d-none d-lg-block">
											{history.img ? (
                                                // if ther is an image
												<img src={history.img} width="123" height="196" alt="Book" />
											) : (
                                                //if not show our default image
												<img
													src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
													width="123"
													height="196"
													alt="Default"
												/>
											)}
										</div>
										<div className="d-lg-none d-flex justify-content-center align-items-center">
											{history.img ? (
                                                // if ther is an image
												<img src={history.img} width="123" height="196" alt="Book" />
											) : (
                                                 //if not show our default image
												<img
													src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
													width="123"
													height="196"
													alt="Default"
												/>
											)}
										</div>
									</div>
									<div className="col">
										<div className="card-body">
											<h5 className="card-title"> {history.author} </h5>
											<h4>{history.title}</h4>
											<p className="card-text">{history.description}</p>
											<hr />
											<p className="card-text"> Checked out on: {history.checkoutDate}</p>
											<p className="card-text"> Returned on: {history.returnedDate}</p>
										</div>
									</div>
								</div>
							</div>
							<hr />
						</div>
					))}
				</>
			) : (
                //if no book in history repository
				<>
					<h3 className="mt-3">Currently no history: </h3>
					<Link className="btn btn-primary" to={'search'}>
						Search for new book
					</Link>
				</>
			)}
			{totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
		</div>
	)
}
