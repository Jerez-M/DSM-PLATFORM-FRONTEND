import {Button, Card, DatePicker, Divider, Form, message, Select, Tag, Tooltip} from "antd";
import dayjs from "dayjs";
import {
    dateFormat,
    handleJerryError,
} from "../../../../common";
import {useEffect, useState} from "react";
import { useSearchParams } from 'react-router-dom'
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {ArrowLeftOutlined, PlusCircleOutlined} from "@ant-design/icons";
import LibraryBookLoansService from "../../../../services/library-book-loans.service";
import LibraryBooksService from "../../../../services/library-books.service";
import AuthenticationService from "../../../../services/authentication.service";
import AccountsService from "../../../../services/accounts.service";
import {getAvailabilityStatusColor, getConditionStatusColor} from "../Books/BooksList";


export async function newBookLoansLoader({request}) {
    try {
        const url = new URL(request.url);
        const libraryId = url.searchParams.get("libraryId");

        const usersResponse = await AccountsService.getAllAccountsByInstitution(AuthenticationService.getUserTenantId())

        if(libraryId) {
            const booksResponse = await LibraryBooksService.getAllByLibrary(libraryId);
            return {books: booksResponse.data, borrowers: usersResponse.data};
        } else {
            const booksResponse = await LibraryBooksService.getAllByInstitution(AuthenticationService.getUserTenantId());
            return {books: booksResponse.data, borrowers: usersResponse.data};
        }
    } catch (e) {
        console.log(e);
        return {books: []};
    }
}

const NewBookLoan = () => {
    const [form] = Form.useForm();
    const { books, borrowers } = useLoaderData();
    const navigate = useNavigate();

    const [loading, setLoading] = useState();
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [borrower, setBorrower] = useState(null);

    const [searchParams] = useSearchParams();

    const bookOptions = books?.map((book) => ({
        label: `${book.tittle} - ${book.authors} (${book.library_code})`,
        value: book.id,
    }));

    const borrowersOptions = borrowers?.map((user) => ({
        label: `${user.firstName} ${user.lastName} (${user.username})`,
        value: user.id,
    }));

    const handleSubmit = async (values) => {
        setLoading(true)
        try {
            const requestData = {
                ...values,
                status: "NOT RETURNED",
                issuer: AuthenticationService.getUserId(),
                institution: AuthenticationService.getUserTenantId(),
            }
            const response = await LibraryBookLoansService.create(requestData)

            if (response.status === 201) {
                message.success("Book Loan Created Successfully");
                navigate(-1);
                form.resetFields();
            }
        } catch (e) {
            handleJerryError(e);
        } finally {
            setLoading(false);
        }
    }

    const changeBook = (booksId) => {
        const filteredBooks = books.filter((book) => booksId.includes(book.id));
        setSelectedBooks(filteredBooks);
    }

    const changeBorrower = (borrowerId) => {
        const borrower = borrowers.find((borrower) => borrower.id === borrowerId);
        setBorrower(borrower);
    }

    useEffect(() => {
        if(searchParams.get('book')) {
            const bookId = +searchParams.get('book')
            form.setFieldsValue({book: [bookId]})
            changeBook([bookId])
        }
    }, []);

    return (
        <>
            <Link to={'..'}
                  onClick={(e) => {
                      e.preventDefault();
                      navigate(-1);
                  }}
                  className='text-muted text-decoration-none mb-2'
            >
                <ArrowLeftOutlined /> Back
            </Link>

            <h3>New Book</h3>

            <Divider />

            <Form
                form={form}
                layout={"vertical"}
                className="m-2"
                onFinish={handleSubmit}
            >
                <div className="row">
                    <div className="col-md-5">
                        <Card>
                            <h4 className="mb-4">Book details</h4>
                            {(selectedBooks?.length > 0) ? selectedBooks?.map((book, index) => (
                                <div key={index} className="mb-4">
                                    <h6 className="mb-2">
                                        {book.tittle}
                                        <Tooltip title="View Book">
                                            <Button
                                                type="text"
                                                icon={<PlusCircleOutlined/>}
                                                onClick={() => navigate(`/admin/library/books/view/${book.id}`)}
                                            />
                                        </Tooltip>
                                    </h6>
                                    <p className="table-row">
                                        <span>Book Author/s:</span>
                                        <strong>{book.authors}</strong>
                                    </p>
                                    <p className="table-row">
                                        <span>Library code:</span>
                                        <strong>{book.library_code}</strong>
                                    </p>
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
                                    <Divider />
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
                            {borrower ? <>
                                <p className="table-row">
                                    <span>Full Name:</span>
                                    <strong>{borrower.firstName} {borrower.lastName}</strong>
                                </p>
                                <p className="table-row">
                                    <span>Registration Number:</span>
                                    <strong>{borrower.username}</strong>
                                </p>
                            </> : <>
                                <p className="text-muted">Please select the borrower of the book</p>
                            </>
                            }
                        </Card>
                    </div>

                    <div className="col-md-7 mt-4 mt-md-0">
                        <Card className="">
                            <h4>Book details</h4>
                            <div className="row">
                                <div className="col">
                                    <Form.Item
                                        label="Book"
                                        name="book"
                                        extra="Search the book you want using the title or library code"
                                        rules={[{ required: true, message: 'Book is required!' }]}
                                    >
                                        <Select
                                            placeholder="Book"
                                            mode="multiple"
                                            size="large"
                                            allowClear
                                            options={bookOptions}
                                            onChange={(value) => changeBook(value)}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').includes(input) ||
                                                (option?.label ?? '').toLowerCase().includes(input)}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                        />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <Form.Item
                                        label="Borrower"
                                        name="borrower"
                                        extra="Search the borrower you want using their name or regnumber"
                                        rules={[{ required: true, message: 'Borrower is required!' }]}
                                    >
                                        <Select
                                            placeholder="Borrower"
                                            size="large"
                                            allowClear
                                            options={borrowersOptions}
                                            onChange={(value) => changeBorrower(value)}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').includes(input) ||
                                                (option?.label ?? '').toLowerCase().includes(input)}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                        />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Item
                                        name="borrowed_date"
                                        label="Borrowed Date"
                                        initialValue={new Date().toISOString().slice(0, 10)}
                                        getValueFromEvent={(e) => e?.format(dateFormat)}
                                        getValueProps={(e) => ({
                                            value: e ? dayjs(e) : "",
                                        })}
                                    >
                                        <DatePicker
                                            placeholder="Borrowed Date"
                                            format={dateFormat}
                                            className="w-100"
                                            size="large"
                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-md-6">
                                    <Form.Item
                                        name="return_due_date"
                                        label="Due Date"
                                        getValueFromEvent={(e) => e?.format(dateFormat)}
                                        getValueProps={(e) => ({
                                            value: e ? dayjs(e) : "",
                                        })}
                                    >
                                        <DatePicker
                                            placeholder="Due Date"
                                            format={dateFormat}
                                            className="w-100"
                                            size="large"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </Card>

                        <div className="mt-4 d-flex justify-content-end">
                            <Button
                                size="large"
                                htmlType="submit"
                                type="primary"
                                loading={loading}
                                className="px-3"
                            >
                                Lend Book
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
        </>
    )
}

export default NewBookLoan;