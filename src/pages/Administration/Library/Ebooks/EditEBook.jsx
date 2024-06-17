import {
    AutoComplete,
    Button,
    Card,
    Checkbox,
    DatePicker,
    Divider,
    Form,
    Input,
    message,
    Select, Upload
} from "antd";
import dayjs from "dayjs";
import {dateFormat, handleJerryError, toInputUppercase} from "../../../../common";
import {useEffect, useState} from "react";
import {LANGUAGES} from "../../../../utils/library-book";
import AuthenticationService from "../../../../services/authentication.service";
import LibraryEBooksService from "../../../../services/library-ebooks.service";
import {InboxOutlined, PlusOutlined} from "@ant-design/icons";
import GoogleBooksApiService from "../../../../services/google-books-api.service";
import DepartmentService from "../../../../services/department.service";
import BackButton from "../../../../common/BackButton";
import LibraryEbooksService from "../../../../services/library-ebooks.service";
import {useLoaderData, useNavigate} from "react-router-dom";

export const editEbookLoader = async ({params}) => {
    try {
        const bookResponse = await LibraryEbooksService.getById(params.id);
        return {book: bookResponse.data};
    } catch (e) {
        console.log(e);
        return {books: null};
    }
}

const EditEBook = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState()
    const [file, setFile] = useState(null)
    const [departments, setDepartments] = useState([])
    const [isExamPaper, setIsExamPaper] = useState(false)
    const [isDownloadable, setIsDownloadable] = useState(true)
    const [googleBookId, setGoogleBookId] = useState("")

    const navigate = useNavigate();
    const { book } = useLoaderData();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchData = async () => {
            const response = await DepartmentService.getAllDepartments(AuthenticationService.getUserTenantId());
            const departmentsMapped = response.data?.map((department) => ({
                label: department?.name,
                value: department?.id,
            }));
            setDepartments(departmentsMapped);
        }
        fetchData()

        form.setFieldsValue({
            tittle: book?.tittle,
            authors: book?.authors,
            isbn: book?.isbn,
            publication_date: book?.publication_date,
            publisher: book?.publisher,
            subject: book?.subject,
            date_acquired: book?.date_acquired,
            language: book?.language,
            page_numbers: book?.page_numbers,
            department: book?.department?.id,
            is_exam_paper: book?.is_exam_paper,
            is_downloadable: book?.is_downloadable,
        })
    }, []);

    const handleFileUpload = ({ fileList }) => {
        setFile(fileList[0]?.originFileObj)
    }

    const handleSubmit = async (values) => {
        setLoading(true)
        try {
            const requestData = {...values, institution: AuthenticationService.getUserTenantId()}
            const formData = new FormData();
            for (const [key, value] of Object.entries(requestData)) {
                if (key !== 'file') {
                    formData.append(key, value);
                }
            }
            if(file) formData.set("file", file);
            formData.append("availability", "AVAILABLE")
            formData.append("is_ebook", "True");
            formData.set("is_exam_paper", isExamPaper ? "True" : "False");
            formData.set("is_downloadable", isDownloadable ? "True" : "False");
            if(googleBookId) formData.set("google_book_id", googleBookId);

            const response = await LibraryEBooksService.update(book?.id, formData);
            if (response.status === 202) {
                message.success("Book Updated Successfully");
                form.resetFields();
                setGoogleBookId("")
                navigate(-1)
            }
        } catch (e) {
            handleJerryError(e);
        } finally {
            setLoading(false)
        }
    }

    const onSearch = async (value) => {
        if (!value || value === "") {
            return;
        }
        if (!value || !value.length === 13 || value === "") {
            message.error("Invalid ISBN")
        } else {
            try {
                messageApi.open({
                    type: 'loading',
                    content: 'Searching Book...',
                    duration: 0,
                })
                    .then(() => message.success('Book found'))

                const bookResponse = await GoogleBooksApiService.findByIsbn(value)
                if (bookResponse.status === 200) {
                    if(bookResponse.data?.totalItems === 0) {
                        message.error("Book not found, please re-check your ISBN")
                        return;
                    }
                    messageApi.open({
                        type: 'success',
                        content: 'Book found',
                        duration: 2,
                    })
                    const returnedBook = bookResponse.data?.items[0]
                    setGoogleBookId(returnedBook?.id)
                    form.setFieldsValue({
                        tittle: returnedBook?.volumeInfo?.title,
                        authors: returnedBook?.volumeInfo?.authors?.toString(),
                        isbn: value,
                        language: returnedBook?.volumeInfo?.language,
                        publisher: returnedBook?.volumeInfo?.publisher,
                        publication_date: returnedBook?.volumeInfo?.publishedDate,
                        page_numbers: returnedBook?.volumeInfo?.pageCount,
                        subject: returnedBook?.volumeInfo?.categories?.toString(),
                        price: returnedBook?.saleInfo?.listPrice?.amount,
                    })
                }
            } catch (e) {
                message.error("Failed to search for book, please input manually")
                console.log(e)
            } finally {
                messageApi.destroy();
            }
        }
    }

    return (
        <>
            <BackButton />

            {contextHolder}

            <div className='d-flex justify-content-between align-items-center'>
                <h3>New E-book</h3>

                <Input.Search
                    placeholder="Search book by ISBN"
                    style={{ width: 304 }}
                    onSearch={onSearch}
                    size="large"
                    enterButton
                    allowClear
                />
            </div>

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

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                label="Subjects"
                                name="subject"
                            >
                                <Input
                                    placeholder="Subjects"
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
                            <Form.Item
                                label="Department"
                                name="department"
                            >
                                <Select
                                    placeholder="Department"
                                    size="large"
                                    options={departments}
                                />
                            </Form.Item>
                        </div>
                    </div>


                    <Form.Item
                        label="File"
                        name="file"
                    >
                        <Upload.Dragger
                            name="file"
                            type="file"
                            maxCount={1}
                            multiple={false}
                            listType="picture"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            maxFileSize={1024 * 1024 * 10}
                            beforeUpload={() => false}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                You can only upload one ebook at a time. The ebook should be a .pdf, .doc or .docx file. The maximum file size is 10MB.
                            </p>
                        </Upload.Dragger>
                    </Form.Item>


                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                label="Type"
                                name="type"
                            >
                                <Select
                                    placeholder="type"
                                    size="large"
                                    options={[
                                        { value: 'TEXTBOOK', label: 'Textbook' },
                                        { value: 'REFERENCE', label: 'Reference' },
                                        { value: 'FICTION', label: 'Fiction' },
                                        { value: 'NONFICTION', label: 'Non-fiction' },
                                        { value: 'EXAM_PAPER', label: 'Exam Paper' },
                                        { value: 'OTHER', label: 'Other' },
                                    ]}
                                />
                            </Form.Item>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-md-4">
                            <Form.Item name="is_exam_paper">
                                <Checkbox onChange={(e) => setIsExamPaper(e.target.checked)}>
                                    Is Exam Paper
                                </Checkbox>
                            </Form.Item>
                        </div>

                        <div className="col-md-4">
                            <Form.Item name="is_downloadable" valuePropName="checked" initialValue={isDownloadable}>
                                <Checkbox onChange={(e) => setIsDownloadable(e.target.checked)}>
                                    Is Downloadable
                                </Checkbox>
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                <div className="w-75 mx-auto mt-4 d-flex justify-content-end">
                    <Button
                        size="large"
                        htmlType="submit"
                        type="primary"
                        loading={loading}
                        className="px-3"
                        icon={<PlusOutlined/>}
                    >
                        Add Book
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default EditEBook;