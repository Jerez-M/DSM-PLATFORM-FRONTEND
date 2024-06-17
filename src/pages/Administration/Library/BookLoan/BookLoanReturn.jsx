import {Button, Card, DatePicker, Divider, Form, message, Tag} from "antd";
import dayjs from "dayjs";
import {
    dateFormat,
    deleteColor,
    handleJerryError,
    successColor,
    toHumanDate,
} from "../../../../common";
import {useState} from "react";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {ArrowLeftOutlined} from "@ant-design/icons";
import LibraryBookLoansService from "../../../../services/library-book-loans.service";
import AuthenticationService from "../../../../services/authentication.service";
import TextArea from "antd/es/input/TextArea";
import {getAvailabilityStatusColor, getConditionStatusColor} from "../Books/BooksList";


export async function bookLoanReturnLoader({params}) {
    try {
        const bookLoanResponse = await LibraryBookLoansService.getById(params.id);
        return {bookLoan: bookLoanResponse.data};
    } catch (e) {
        console.log(e);
        return {books: null};
    }
}

const BookLoanReturn = () => {
    const [form] = Form.useForm();
    const { bookLoan } = useLoaderData();
    const navigate = useNavigate();

    const [loading, setLoading] = useState();

    if(bookLoan) {
        form.setFieldsValue({
            borrowed_date: bookLoan.borrowed_date,
            return_due_date: bookLoan.return_due_date,
            issuer: bookLoan.issuer.id,
        })
    }

    const handleSubmit = async (values) => {
        setLoading(true)
        try {
            const requestData = {
                ...values,
                book: bookLoan.book?.map(bk => bk.id),
                status: "RETURNED",
                institution:  AuthenticationService.getUserTenantId(),
                reciever: AuthenticationService.getUserId()
            }
            const response = await LibraryBookLoansService.update(bookLoan.id, requestData)

            if (response.status === 200) {
                message.success("Book Returned Successfully");
                navigate(-1);
                form.resetFields();
            }
        } catch (e) {
            handleJerryError(e);
        } finally {
            setLoading(false);
        }
    }

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
                    <div className="col-md-7">
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
                                        (new Date(bookLoan.return_due_date) === new Date()) ? "text-warn" : ""}
                                >
                                    {toHumanDate(bookLoan.return_due_date)}
                                </strong>
                            </p>
                            <p className="table-row">
                                <span>Return Status:</span>
                                <Tag color={bookLoan.status === "RETURNED" ? successColor : deleteColor}>
                                    {bookLoan.status}
                                </Tag>
                            </p>
                            <p className="table-row">
                                <span>Borrower:</span>
                                <strong>
                                    {bookLoan.borrower.firstName} {bookLoan.borrower.lastName} ({bookLoan.borrower.username})
                                </strong>
                            </p>
                            <p className="table-row">
                                <span>Issuer:</span>
                                <strong>
                                    {bookLoan.issuer.firstName} {bookLoan.issuer.lastName} ({bookLoan.issuer.username})
                                </strong>
                            </p>
                        </Card>

                        <Divider />

                        <Card>
                            <h4 className="mb-4">Borrowed Books - {bookLoan.book?.length}:</h4>
                            {(bookLoan.book?.length > 0) ? bookLoan.book?.map((book, index) => (
                                <div key={index} className="mb-4">
                                    <h6 className="mb-2">{book.tittle}</h6>
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
                                    {(index !== bookLoan.book.length - 1) && <Divider />}
                                </div>)) : (
                                <>
                                    <p className="text-muted">Please select Book to Loan out</p>
                                </>
                            )
                            }
                        </Card>
                    </div>

                    <div className="col-md-5 mt-4 mt-md-0">
                        <Card>
                            <h4>Return Book</h4>
                            <Form.Item
                                name="returned_date"
                                label="Returned Date"
                                getValueFromEvent={(e) => e?.format(dateFormat)}
                                getValueProps={(e) => ({
                                    value: e ? dayjs(e) : "",
                                })}
                                initialValue={new Date().toISOString().slice(0, 10)}
                                rules={[{ required: true, message: 'Returned Date is required!' }]}
                            >
                                <DatePicker
                                    placeholder="Returned Date"
                                    format={dateFormat}
                                    className="w-100"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item name="comment" label="Comment">
                                <TextArea
                                    style={{ height: "200px" }}
                                    placeholder="Comment"
                                />
                            </Form.Item>
                        </Card>

                        <div className="mt-4 d-flex justify-content-end">
                            <Button
                                size="large"
                                htmlType="submit"
                                type="primary"
                                loading={loading}
                                className="px-3"
                            >
                                Return Book
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
        </>
    )
}

export default BookLoanReturn;