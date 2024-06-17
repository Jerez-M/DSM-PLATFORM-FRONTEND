import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {Button, Divider, Dropdown, Input, message, Space, Tabs} from "antd";
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
import LibraryEBooksService from "../../../../services/library-ebooks.service";
import AuthenticationService from "../../../../services/authentication.service";
import AllEBooks from "./AllEBooks";
import BooksSubjectsPage from "./BooksSubjectsPage";
import EBooksExamPapers from "./EBooksExamPapers";
import GoogleBooksApiService from "../../../../services/google-books-api.service";

const EBooksListPage = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const tabItems = [
        {
            key: '1',
            label: "All Ebooks",
            children: <AllEBooks />
        },
        // {
        //     key: '2',
        //     label: "School Books",
        //     children: "school"
        // },
        {
            key: '3',
            label: "Past exam papers",
            children: <EBooksExamPapers />
        },
        {
            key: '4',
            label: "Categories",
            children: <BooksSubjectsPage />
        },
    ]

    const onSearch = async (value) => {
        if (!value || value === "") {
            return;
        } else {
            try {
                messageApi.open({
                    type: 'loading',
                    content: 'Searching Book...',
                    duration: 0,
                })
                .then(() => message.success('Book found'))

                const bookResponse = await LibraryEBooksService.findByTitle(AuthenticationService.getUserTenantId(), value)
                if (bookResponse.data?.length > 0) {
                    if(bookResponse.data.length === 1) {
                        message.info("Book found, rerouting to book page")
                        navigate(`/library/ebooks/view/${bookResponse.data[0].id}`)
                    }
                    console.log(bookResponse.data)
                } else {
                    message.error("Book not found")
                }
            } catch (e) {
                message.error("Book not found")
                console.log(e)
            } finally {
                messageApi.destroy();
            }
        }
    }

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>School E-books</h3>

                <Space>
                    <Input.Search
                        placeholder="Search by book title"
                        onSearch={onSearch}
                        size="large"
                        enterButton
                        allowClear
                    />

                    {AuthenticationService.getIsLibrarian() &&
                        <Button
                            icon={<PlusOutlined />}
                            className='border-0 px-3 text-white'
                            type="primary"
                            onClick={() => navigate("/admin/library/ebooks/add")}
                        >
                            Add Book
                        </Button>
                    }
                </Space>
            </div>

            <Divider type={"horizontal"}/>

            <Tabs
                items={tabItems}
                style={{color: '#39b54a'}}
            />

        </>
    );
}

export default EBooksListPage;