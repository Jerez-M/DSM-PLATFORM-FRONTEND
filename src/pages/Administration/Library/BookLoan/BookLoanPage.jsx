import {Button, Card, Divider, Tag, Tooltip} from "antd";
import {
    deleteColor, primaryColor,
    successColor, toHumanDate,
} from "../../../../common";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {ArrowLeftOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import LibraryBookLoansService from "../../../../services/library-book-loans.service";
import {getAvailabilityStatusColor, getConditionStatusColor} from "../Books/BooksList";
import AuthenticationService from "../../../../services/authentication.service";


export async function bookLoanLoader({params}) {
    try {
        const bookLoanResponse = await LibraryBookLoansService.getById(params.id);
        return {bookLoan: bookLoanResponse.data};
    } catch (e) {
        console.log(e);
        return {books: null};
    }
}

const BookLoanPage = () => {
    const { bookLoan } = useLoaderData();
    const navigate = useNavigate();

    return (
        <div className="px-4">
            <Link to={'..'}
                  onClick={(e) => {
                      e.preventDefault();
                      navigate(-1);
                  }}
                  className='text-muted text-decoration-none mb-2'
            >
                <ArrowLeftOutlined /> Back
            </Link>

            <div className='d-flex justify-content-between align-items-center'>
                <h3>Book Loan</h3>
                {AuthenticationService.getIsLibrarian() && <Button
                    icon={<PlusOutlined/>}
                    className='border-0 px-3 text-white'
                    type="primary"
                    disabled
                    onClick={() => navigate(`/admin/library/book-loans/edit/${bookLoan.id}`)}
                >
                    Edit
                </Button>}
            </div>

            <Divider />

            <div className="row">
                <div className="col-md-6">
                    <Card>
                        <h4 className="mb-4">Borrowed Books</h4>
                        {(bookLoan.book?.length > 0) ? bookLoan.book?.map((book, index) => (
                            <div key={index} className="mb-4">
                                <h6 className="mb-2">
                                    {book.tittle}
                                    {AuthenticationService.getIsLibrarian() && <Tooltip title="View Book">
                                        <Button
                                            type="text"
                                            icon={<EyeOutlined/>}
                                            style={{color: primaryColor}}
                                            onClick={() => navigate(`/admin/library/books/view/${book.id}`)}
                                        />
                                    </Tooltip>}
                                </h6>
                                <p className="table-row">
                                    <span>Book Author/s:</span>
                                    <strong>{book.authors}</strong>
                                </p>
                                <p className="table-row">
                                    <span>Library code:</span>
                                    <strong>{book.library_code}</strong>
                                </p>
                                {AuthenticationService.getIsLibrarian() && ( <>
                                    <p className="table-row">
                                        <span>Availability Status:</span>
                                        <Tag color={getAvailabilityStatusColor(book.availability)}>{book.availability}</Tag>
                                    </p>
                                    <p className="table-row">
                                        <span>Condition:</span>
                                        <Tag color={getConditionStatusColor(book.condition)}>{book.condition}</Tag>
                                    </p>
                                    <p className="table-row">
                                        <span>Comments:</span>
                                        <span>{book.comment}</span>
                                    </p>
                                </>)}
                                {(index !== bookLoan.book.length - 1) && <Divider />}
                            </div>)) : (
                            <>
                                <p className="text-muted">Please select Book to Loan out</p>
                            </>
                        )
                        }
                    </Card>

                    <Divider />

                    <Card>
                        <h4 className="mb-4">Borrower details</h4>
                        {bookLoan.borrower ? <>
                            <p className="table-row">
                                <span>Full Name:</span>
                                <strong>{bookLoan.borrower.firstName} {bookLoan.borrower.lastName}</strong>
                            </p>
                            <p className="table-row">
                                <span>Registration Number:</span>
                                <strong>{bookLoan.borrower.username}</strong>
                            </p>
                            {AuthenticationService.getIsLibrarian() && <p className="table-row">
                                <span>Phone Number:</span>
                                <strong>{bookLoan.issuer.phoneNumber}</strong>
                            </p>}
                        </> : <>
                            <p className="text-muted">Book has no borrower</p>
                        </>
                        }
                    </Card>
                </div>

                <div className="col-md-6 mt-4 mt-md-0">
                    <Card className="">
                        <h4>Book Loan details</h4>
                        <p className="table-row">
                            <span>Date Borrowed:</span>
                            <strong>{toHumanDate(bookLoan.borrowed_date)}</strong>
                        </p>
                        <p className="table-row">
                            <span>Due Date:</span>
                            <strong className={
                                (new Date(bookLoan.return_due_date) < new Date()) ? "text-danger" :
                                    (new Date(bookLoan.return_due_date) === new Date()) ? "text-warn" : ""}>
                                {toHumanDate(bookLoan.return_due_date)}
                            </strong>
                        </p>
                        <p className="table-row">
                            <span>Returned Date:</span>
                            <strong>{toHumanDate(bookLoan.returned_date)}</strong>
                        </p>
                        <p className="table-row">
                            <span>Return Status:</span>
                            <Tag color={bookLoan.status === "RETURNED" ? successColor : deleteColor}>
                                {bookLoan.status}
                            </Tag>
                        </p>
                        {AuthenticationService.getIsLibrarian() && <p className="table-row">
                            <span>Book Return Comment:</span>
                            <span>{bookLoan.comment}</span>
                        </p>}
                    </Card>

                    <Divider />

                    <Card>
                        <h4 className="mb-4">Loan Service details</h4>
                        {bookLoan.issuer ? <>
                            <h6 className="mb-4">Issuer details</h6>
                            <p className="table-row">
                                <span>Full Name:</span>
                                <strong>{bookLoan.issuer.firstName} {bookLoan.issuer.lastName}</strong>
                            </p>
                            <p className="table-row">
                                <span>Registration Number:</span>
                                <strong>{bookLoan.issuer.username}</strong>
                            </p>
                            {(AuthenticationService.getUserRole() === "ADMIN") && <p className="table-row">
                                <span>Phone Number:</span>
                                <strong>{bookLoan.issuer.phoneNumber}</strong>
                            </p>}
                        </> : <>
                            <p className="text-muted">Book has no recorded issuer</p>
                        </>
                        }

                        {bookLoan.reciever ? <>
                            <h6 className="mt-5 mb-3">Receiver details</h6>
                            <p className="table-row">
                                <span>Full Name:</span>
                                <strong>{bookLoan.reciever.firstName} {bookLoan.reciever.lastName}</strong>
                            </p>
                            <p className="table-row">
                                <span>Registration Number:</span>
                                <strong>{bookLoan.reciever.username}</strong>
                            </p>
                            {(AuthenticationService.getUserRole() === "ADMIN") && <p className="table-row">
                                <span>Phone Number:</span>
                                <strong>{bookLoan.reciever.phoneNumber}</strong>
                            </p>}
                        </> : <>
                            <p className="text-muted">Book has no recorded Receiver</p>
                        </>
                        }
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default BookLoanPage;