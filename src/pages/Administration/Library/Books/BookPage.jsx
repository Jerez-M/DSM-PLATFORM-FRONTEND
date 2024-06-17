import {Button, Card, Divider, Space, Tag, Tooltip} from "antd";
import {editColor, toHumanDate} from "../../../../common";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {ArrowLeftOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import LibraryBooksService from "../../../../services/library-books.service";
import {getAvailabilityStatusColor, getConditionStatusColor} from "./BooksList";
import LibraryBookLoansService from "../../../../services/library-book-loans.service";

export async function bookPageLoader({params}) {
    try {
        const bookResponse = await LibraryBooksService.getById(params.id);
        const bookLoanResponse = await LibraryBookLoansService.getAllByBook(params.id);
        return {book: bookResponse.data, bookLoans: bookLoanResponse.data};
    } catch (e) {
        console.log(e);
        return {books: null};
    }
}

const BookPage = () => {
    const { book, bookLoans } = useLoaderData();
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
                <h3>Book</h3>
                <Button
                    icon={<PlusOutlined />}
                    className='border-0 px-3 text-white'
                    type="primary"
                    onClick={() => navigate(`/admin/library/books/edit/${book?.id}`)}
                >
                    Edit
                </Button>
            </div>

            <Divider />

            <div className="row mb-4">
                <div className="col-md-7">
                    <Card>
                        <h5 className="mb-2">{book?.tittle}</h5>

                        <p className="table-row">
                            <span>Book Author/s:</span>
                            <strong>{book?.authors}</strong>
                        </p>
                        <p className="table-row">
                            <span>Library code:</span>
                            <strong>{book?.library_code}</strong>
                        </p>
                        <p className="table-row">
                            <span>ISBN:</span>
                            <strong>{book?.isbn}</strong>
                        </p>
                        <p className="table-row">
                            <span>Publisher:</span>
                            <span>{book?.publisher}</span>
                        </p>
                        <p className="table-row">
                            <span>Publication Date:</span>
                            <span>{toHumanDate(book?.publication_date)}</span>
                        </p>
                        <p className="table-row">
                            <span>Language:</span>
                            <span>{book?.language}</span>
                        </p>
                        <p className="table-row">
                            <span>Subject:</span>
                            <span>{book?.subject}</span>
                        </p>
                        <p className="table-row">
                            <span>Page numbers:</span>
                            <span>{book?.page_numbers}</span>
                        </p>

                        <h6 className="mt-5">Availability</h6>
                        <p className="table-row">
                            <span>Availability Status:</span>
                            <Tag color={getAvailabilityStatusColor(book?.availability)}>{book?.availability}</Tag>
                        </p>
                        <p className="table-row">
                            <span>Condition:</span>
                            <Tag color={getConditionStatusColor(book?.condition)}>{book?.condition}</Tag>
                        </p>
                        <p className="table-row">
                            <span>Comments:</span>
                            <span>{book?.comment}</span>
                        </p>
                        <p className="table-row">
                            <span>Library:</span>
                            <strong>{book?.library?.name}</strong>
                        </p>

                        <h6 className="mt-5">Acquisition</h6>
                        <p className="table-row">
                            <span>Date Acquired:</span>
                            <span>{toHumanDate(book?.date_acquired)}</span>
                        </p>
                        <p className="table-row">
                            <span>Purchase price:</span>
                            <strong>{book?.currency} {book?.purchase_price}</strong>
                        </p>
                        <p className="table-row">
                            <span>Bought By:</span>
                            <strong>{book?.sponsor}</strong>
                        </p>
                        <p className="table-row">
                            <span>Supplier:</span>
                            <strong>{book?.supplier}</strong>
                        </p>
                    </Card>
                </div>

                <div className="col-md-5 mt-4 mt-md-0">
                    <Card>
                        <h5 className="mb-4">
                            Book Loan History
                            <Tooltip title="Loan Book">
                                <Button
                                    type="text"
                                    icon={<PlusCircleOutlined/>}
                                    onClick={() => navigate(`/admin/library/book-loans/add?book=${book?.id}`)}
                                />
                            </Tooltip>
                        </h5>
                        {bookLoans?.map((bookLoan, index) => (
                            <div key={index} className="mb-3">
                                <div>
                                    Borrower: {bookLoan.borrower?.firstName} {bookLoan.borrower?.lastName} ({bookLoan.borrower?.username})
                                </div>
                                <div>
                                    Loan Period: <strong>
                                        {toHumanDate(bookLoan.borrowed_date)} - {toHumanDate(bookLoan.returned_date)}
                                    </strong>
                                </div>
                                <p>{bookLoan.comment}</p>
                                <Space size="small">
                                    <Tooltip title="More details">
                                        <Button
                                            type="primary"
                                            icon={<EyeOutlined />}
                                            onClick={() => navigate(`/admin/library/book-loans/view/${bookLoan.id}`)}
                                        />
                                    </Tooltip>
                                    <Tooltip title={bookLoan.return_due_date ? "Return Book" : "Edit Book"}>
                                        <Button
                                            className="text-light border-0"
                                            style={{ background: editColor }}
                                            icon={<EditOutlined />}
                                            onClick={() => navigate(`/admin/library/book-loans/return/${bookLoan.id}`)}
                                        />
                                    </Tooltip>
                                </Space>
                                {(index !== bookLoans.length - 1) && <Divider />}
                            </div>
                        ))}
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default BookPage;