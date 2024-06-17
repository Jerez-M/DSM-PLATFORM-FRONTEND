import {AutoComplete, Button, Card, DatePicker, Divider, Form, Input, InputNumber, message, Select} from "antd";
import dayjs from "dayjs";
import {currencyPrefix, dateFormat, handleJerryError, normalizeEnumCase, toInputUppercase} from "../../../../common";
import {useEffect, useState} from "react";
import {BOOK_AVAILABILITY, BOOK_CONDITION, LANGUAGES} from "../../../../utils/library-book";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import LibraryService from "../../../../services/library.service";
import AuthenticationService from "../../../../services/authentication.service";
import LibraryBooksService from "../../../../services/library-books.service";
import {ArrowLeftOutlined} from "@ant-design/icons";

export const editBookLoader = async ({params}) => {
    try {
        const librariesResponse = await LibraryService.getAllByInstitution(AuthenticationService.getUserTenantId());
        const bookResponse = await LibraryBooksService.getById(params.id);
        return {libraries: librariesResponse.data, book: bookResponse.data}
    } catch (e) {
        return {libraries: []};
    }
}

const EditBook = () => {
    const [form] = Form.useForm();
    const { libraries, book } = useLoaderData();
    const navigate = useNavigate();

    const [loading, setLoading] = useState()

    const libraryOptions = libraries?.map((library) => ({
        label: library.name,
        value: library.id,
    }));

    useEffect(() => {
        form.setFieldsValue({
            tittle: book?.tittle,
            authors: book?.authors,
            isbn: book?.isbn,
            publication_date: book?.publication_date,
            publisher: book?.publisher,
            library_code: book?.library_code,
            condition: book?.condition,
            availability: book?.availability,
            subject: book?.subject,
            comment: book?.comment,
            date_acquired: book?.date_acquired,
            currency: book?.currency,
            purchase_price: book?.purchase_price,
            language: book?.language,
            page_numbers: book?.page_numbers,
            sponsor: book?.sponsor,
            supplier: book?.supplier,
            library: book?.library?.id,
        })
    }, []);

    const handleSubmit = async (values) => {
        setLoading(true)
        try {
            const requestData = {...values, institution: AuthenticationService.getUserTenantId()}
            const response = await LibraryBooksService.update(book?.id, requestData)
            if (response.status === 200) {
                message.success("Book Updated Successfully");
                navigate(-1);
            }
        } catch (e) {
            handleJerryError(e);
        } finally {
            setLoading(false)
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

            <h3>Edit Book</h3>

            <Divider />

            <Form
                form={form}
                layout={"vertical"}
                className="m-2"
                onFinish={handleSubmit}
            >
                <Card className="w-75 mx-auto">
                    <h4>Book details</h4>
                    <div className="row">
                        <div className="col-12">
                            <Form.Item
                                label="Title"
                                name="tittle"
                                rules={[{ required: true, message: 'Book title is required!' }]}
                            >
                                <Input placeholder="Title" size="large" />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                label="ISBN"
                                name="isbn"
                                rules={[{ required: true, message: 'Book isbn is required!' }]}
                            >
                                <Input placeholder="ISBN" size="large" onInput={toInputUppercase} />
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                label="Language"
                                name="language"
                            >
                                <AutoComplete
                                    placeholder="Language"
                                    options={LANGUAGES}
                                    size="large"
                                    filterOption={(inputValue, option) =>
                                        option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item
                        label="Authors"
                        name="authors"
                        rules={[{ required: true, message: 'Book authors is required!' }]}
                    >
                        <Input placeholder="Authors" size="large" />
                    </Form.Item>

                    <div className="row">
                        <div className="col-md-4">
                            <Form.Item
                                label="Page numbers"
                                name="page_numbers"
                            >
                                <Input placeholder="Page numbers" size="large" />
                            </Form.Item>
                        </div>
                        <div className="col-md-4">
                            <Form.Item
                                label="Publisher"
                                name="publisher"
                            >
                                <Input placeholder="Publisher" size="large" />
                            </Form.Item>
                        </div>
                        <div className="col-md-4">
                            <Form.Item
                                name="publication_date"
                                label="Publication Date"
                                getValueFromEvent={(e) => e?.format(dateFormat)}
                                getValueProps={(e) => ({
                                    value: e ? dayjs(e) : "",
                                })}
                            >
                                <DatePicker
                                    placeholder="Publication Date"
                                    format={dateFormat}
                                    className="w-100"
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                <Card className="w-75 mx-auto mt-4">
                    <h4>Library information</h4>
                    <div className="row">
                        <div className="col">
                            <Form.Item
                                label="Library"
                                name="library"
                                rules={[{ required: true, message: 'Library is required!' }]}
                            >
                                <Select
                                    placeholder="Library"
                                    size="large"
                                    allowClear
                                    options={libraryOptions}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                name="date_acquired"
                                label="Date Acquired"
                                getValueFromEvent={(e) => e?.format(dateFormat)}
                                getValueProps={(e) => ({
                                    value: e ? dayjs(e) : "",
                                })}
                            >
                                <DatePicker
                                    placeholder="Date Acquired"
                                    format={dateFormat}
                                    className="w-100"
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                label="Book Availability"
                                name="availability"
                                initialValue="AVAILABLE"
                            >
                                <Select
                                    placeholder="Availability"
                                    size="large"
                                    allowClear
                                    options={BOOK_AVAILABILITY.map(availability => (
                                        {value: availability, label: normalizeEnumCase(availability)}
                                    ))}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                label="Library Code"
                                name="library_code"
                            >
                                <Input
                                    placeholder="Library Code"
                                    onInput={toInputUppercase}
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                label="Book Condition"
                                name="condition"
                            >
                                <Select
                                    placeholder="Condition"
                                    size="large"
                                    allowClear
                                    options={BOOK_CONDITION.map(condition => (
                                        {value: condition, label: normalizeEnumCase(condition)}
                                    ))}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <Form.Item
                                label="Purchase price"
                                name="purchase_price"
                            >
                                <InputNumber
                                    addonBefore={currencyPrefix}
                                    placeholder="Purchase price"
                                    className="w-100"
                                    type="number"
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                        <div className="col-md-4">
                            <Form.Item
                                label="Sponsor"
                                name="sponsor"
                            >
                                <Input
                                    placeholder="Sponsor"
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                        <div className="col-md-4">
                            <Form.Item
                                label="Supplier"
                                name="supplier"
                            >
                                <Input
                                    placeholder="Supplier"
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item
                        label="Subject"
                        name="subject"
                    >
                        <Input
                            placeholder="Subject"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="comment"
                        label="Comment"
                    >
                        <Input.TextArea
                            size="large"
                            placeholder="Comment"
                        />
                    </Form.Item>
                </Card>

                <div className="w-75 mx-auto mt-4 d-flex justify-content-end">
                    <Button
                        size="large"
                        htmlType="submit"
                        type="primary"
                        loading={loading}
                        className="px-3"
                    >
                        Edit Book
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default EditBook;