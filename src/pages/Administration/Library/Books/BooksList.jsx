import {
    DeleteOutlined,
    EditOutlined, EyeOutlined,
} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {Button, message, Popconfirm, Space, Table, Tag, Tooltip} from "antd";
import {useRef, useState} from "react";
import {
    deleteColor,
    editColor,
    getColumnSearchProps, getColumnSearchPropsNoFilter,
    handleError,
    normalizeEnumCase,
    refreshPage, successColor,
} from "../../../../common";
import LibraryBooksService from "../../../../services/library-books.service";
import {BOOK_AVAILABILITY} from "../../../../utils/library-book";
import AuthenticationService from "../../../../services/authentication.service";

export const getAvailabilityStatusColor = (availability) => {
    switch (availability) {
        case "AVAILABLE":
            return 'green';
        case "RESERVED":
            return 'orange';
        case "DISCARDED":
        case "LOST":
            return 'black';
        case "DAMAGED":
            return deleteColor;
        default:
            return 'red';
    }
}


export const getConditionStatusColor = (condition) => {
    switch (condition) {
        case "NEW":
        case "WORKING":
            return successColor;
        case "OLD":
            return editColor;
        case "DAMAGED":
            return "#de6b3a";
        default:
            return deleteColor;
    }
}

const BooksList = ({books, hasLibrary}) => {
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
        navigate(`/admin/library/books/edit/${book.id}`)
    }

    const deleteBook = (book) => {
        LibraryBooksService.delete(book.id)
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
            title: "Title",
            dataIndex: "tittle",
            key: "tittle",
            sorter: (a, b) => ( a.tittle?.localeCompare(b.tittle)),
            ...getColumnSearchProps('tittle', searchInput, handleSearch, handleReset)
        },
        {
            title: "ISBN",
            dataIndex: "isbn",
            key: "isbn",
            sorter: (a, b) => ( a.isbn?.localeCompare(b.isbn)),
            ...getColumnSearchProps('isbn', searchInput, handleSearch, handleReset),
        },
        {
            title: "Library Code",
            dataIndex: "library_code",
            key: "library_code",
            sorter: (a, b) => ( a.library_code?.localeCompare(b.library_code)),
            ...getColumnSearchProps('library_code', searchInput, handleSearch, handleReset)
        },
        {
            title: "Availability",
            key: "availability",
            sorter: (a, b) => ( a.availability?.localeCompare(b.availability)),
            filters: BOOK_AVAILABILITY.map(availability => (
                {text: normalizeEnumCase(availability), value: availability}
            )),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.availability === value,
            render: (record) => <Tag color={getAvailabilityStatusColor(record.availability)}>{record.availability}</Tag>,
        },
        {
            title: "Library",
            dataIndex: ["library", "name"],
            key: "library",
            responsive: ['xl'],
            sorter: {
                compare: (a, b) => a.library?.name?.localeCompare(b.library?.name)
            },
            onFilter: (value, record) =>
                record.library?.name
                    .toString()
                    .toLowerCase()
                    .includes((value).toLowerCase()),
            ...getColumnSearchPropsNoFilter('username', searchInput, handleSearch, handleReset),
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
                                    `/admin/library/books/view/${record.id}`
                                );
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Book">
                        <Button
                            className="text-light border-0"
                            style={{ background: editColor }}
                            icon={<EditOutlined />}
                            onClick={() => editBook(record)}
                        />
                    </Tooltip>
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

    if(!hasLibrary) {
        booksTableColumns = booksTableColumns.filter(col => col.key !== "library");
    }

    return (
        <>
          <Table columns={booksTableColumns} dataSource={books} rowKey="id" />
        </>
    );
}

export default BooksList;