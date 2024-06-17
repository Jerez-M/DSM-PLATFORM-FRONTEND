import {useRef, useState} from "react";
import LibraryEBooksService from "../../../../services/library-ebooks.service";
import {Button, message, Popconfirm, Space, Table, Tooltip} from "antd";
import {
    deleteColor,
    editColor,
    fallbackImg,
    getColumnSearchProps,
    getGoogleBooksImageUrlFromGoogleBookId,
    handleError,
    refreshPage, toYear
} from "../../../../common";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import AuthenticationService from "../../../../services/authentication.service";
import {useNavigate} from "react-router-dom";

const EBooksList = ({books, type}) => {
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const editBook = (book) => {
        navigate(`/admin/library/ebooks/edit/${book.id}`)
    }

    const deleteBook = (book) => {
        LibraryEBooksService.delete(book.id)
            .then((res) => {
                if (res.status === 204) {
                    message.success(`${book.tittle} Deleted successfully`);
                    refreshPage();
                }
            })
            .catch((e) => {
                handleError(e);
            });
    }

    let booksTableColumns = [
        {
            title: "Image",
            key: "image",
            render: (record) => {
                return <img
                    style={{height: 100}}
                    src={getGoogleBooksImageUrlFromGoogleBookId(record.google_book_id) || fallbackImg}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src=fallbackImg;
                    }}
                />
            }
        },
        {
            title: "Title",
            dataIndex: "tittle",
            key: "tittle",
            render: (record) => <strong>{record}</strong>,
            sorter: (a, b) => ( a.tittle?.localeCompare(b.tittle)),
            ...getColumnSearchProps('tittle', searchInput, handleSearch, handleReset)
        },
        {
            title: "Authors",
            dataIndex: "authors",
            key: "authors",
            sorter: (a, b) => ( a.authors?.localeCompare(b.authors)),
            ...getColumnSearchProps('authors', searchInput, handleSearch, handleReset)
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            sorter: (a, b) => ( a.tittle?.localeCompare(b.subject)),
            ...getColumnSearchProps('subject', searchInput, handleSearch, handleReset)
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
            responsive: ["md"],
            render: (record) => `${record?.name}`,
            sorter: (a, b) => ( a.department?.name?.localeCompare(b.department?.name)),
            ...getColumnSearchProps('department', searchInput, handleSearch, handleReset),
        },
        {
            title: "ISBN",
            dataIndex: "isbn",
            key: "isbn",
            sorter: (a, b) => ( a.isbn?.localeCompare(b.isbn)),
            ...getColumnSearchProps('isbn', searchInput, handleSearch, handleReset),
        },
        {
            title: "Year",
            key: "year",
            responsive: ["md"],
            render: (record) => `${toYear(record.publication_date)}`,
            sorter: (a, b) => ( a.publication_date?.localeCompare(b.publication_date)),
            ...getColumnSearchProps('publication_date', searchInput, handleSearch, handleReset),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            responsive: ["xl"],
            sorter: (a, b) => ( a.type?.localeCompare(b.type)),
            ...getColumnSearchProps('type', searchInput, handleSearch, handleReset),
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) => (
                <Space size="small">
                    <Tooltip title="More details">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                navigate(
                                    `/library/ebooks/view/${record.id}`
                                );
                            }}
                        />
                    </Tooltip>
                    {AuthenticationService.getIsLibrarian() &&
                        <Tooltip title="Edit Book">
                            <Button
                                className="text-light border-0"
                                style={{ background: editColor }}
                                icon={<EditOutlined />}
                                onClick={() => editBook(record)}
                            />
                        </Tooltip>
                    }
                    {AuthenticationService.getUserRole() === "ADMIN" && <Tooltip title="Delete Book">
                        <Popconfirm
                            title="Delete Book"
                            description="Are you sure you want to delete this book?"
                            onConfirm={() => deleteBook(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="danger"
                                style={{color: deleteColor}}
                                icon={<DeleteOutlined/>}
                            />
                        </Popconfirm>
                    </Tooltip>}
                </Space>
            )
        }
    ]

    if(type === "EXAM_PAPER") {
        booksTableColumns = booksTableColumns.filter(column => (!["isbn", "type", "image"].includes(column.key)))
    }

    return (
        <Table className="table-responsive print-margins" columns={booksTableColumns} dataSource={books} rowKey="id" />
    )
}

export default EBooksList;