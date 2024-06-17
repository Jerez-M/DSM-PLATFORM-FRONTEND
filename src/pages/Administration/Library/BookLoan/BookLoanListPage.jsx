import {
    DeleteOutlined,
    EditOutlined, EyeOutlined, PlusOutlined,
} from "@ant-design/icons";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Button, Divider, message, Popconfirm, Space, Table, Tag, Tooltip} from "antd";
import {useRef, useState} from "react";
import {
    deleteColor,
    editColor,
    getColumnSearchPropsNoFilter,
    handleError,
    normalizeEnumCase,
    refreshPage, successColor, toHumanDate,
} from "../../../../common";
import AuthenticationService from "../../../../services/authentication.service";
import LibraryBookLoansService from "../../../../services/library-book-loans.service";
import {RETURNED_STATUS} from "../../../../utils/library-book-loan";


export const bookLoanListLoader = async () => {
    try {
        const bookLoansResponse = await LibraryBookLoansService.getAllByInstitution(AuthenticationService.getUserTenantId());
        return {bookLoans: bookLoansResponse.data}
    } catch (e) {
        return {bookLoans: []};
    }
}


export const getReturnedStatusColor = (returnedStatus) => {
    switch (returnedStatus) {
        case "RETURNED":
            return successColor;
        default:
            return deleteColor;
    }
}

const BookLoanListPage = () => {
    const navigate = useNavigate();
    const {bookLoans} = useLoaderData();

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
        navigate(`/admin/library/book-loans/return/${book.id}`)
    }

    const deleteBook = (book) => {
        LibraryBookLoansService.delete(book.id)
            .then((res) => {
                if (res.status === 204) {
                    message.success(`Book loan deleted successfully`);
                    refreshPage();
                }
            })
            .catch((e) => {
                handleError(e);
            });
    }

    const booksTableColumns = [
        {
            title: "Number of books",
            key: "numberOfBooks",
            sorter: (a, b) => ( a.book?.length - b.book?.length ),
            render: ({book}) => <span>{book.length}</span>,
        },
        {
            title: "Books",
            key: "tittle",
            sorter: (a, b) => ( a.tittle?.localeCompare(b.tittle)),
            render: ({book}) => {
                return book.map((borrowedBook, index) => (
                    <span key={index}>
                        {borrowedBook.tittle} <strong>({borrowedBook.library_code})</strong>
                        {(index !== book.length - 1) && ",   "}
                    </span>
                ))
            },
        },
        {
            title: "Borrower",
            key: "borrower",
            sorter: (a, b) => ( a.borrower?.lastName?.localeCompare(b.borrower?.lastName)),
            render: ({borrower}) => `${borrower.firstName} ${borrower.lastName} (${borrower.username})`,
            responsive: ['xl'],
            onFilter: (value, record) =>
                record.borrower?.lastName
                    .toString()
                    .toLowerCase()
                    .includes((value).toLowerCase()) ||
                record.borrower?.firstName
                    .toString()
                    .toLowerCase()
                    .includes((value).toLowerCase()),
            ...getColumnSearchPropsNoFilter('borrower', searchInput, handleSearch, handleReset)
        },
        {
            title: "Returned Status",
            key: "status",
            sorter: (a, b) => ( a.status?.localeCompare(b.status)),
            filters: RETURNED_STATUS.map(status => (
                {text: normalizeEnumCase(status), value: status}
            )),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.status === value,
            render: (record) => <Tag color={getReturnedStatusColor(record.status)}>{record.status}</Tag>
        },
        {
            title: "Borrowed Date",
            key: "borrowedDate",
            sorter: (a, b) => {
                if (!a.borrowed_date) return -1;
                if (!b.borrowed_date) return -1;
                return new Date(a.borrowed_date) - new Date(b.borrowed_date)
            },
            render: (record) => `${toHumanDate(record?.borrowed_date)}`,
            defaultSortOrder: 'descend',
        },
        {
            title: "Due Date",
            key: "dueDate",
            sorter: (a, b) => {
                if (!a.return_due_date) return -1;
                if (!b.return_due_date) return -1;
                return new Date(a.return_due_date) - new Date(b.return_due_date)
            },
            render: (record) => (
                <span className={
                    (new Date(record.return_due_date).toDateString() === new Date().toDateString() && record.status === "NOT RETURNED") ? "text-warn" :
                        (new Date(record.return_due_date) < new Date() && record.status === "NOT RETURNED") ? "text-danger" : ""}
                >
                    {toHumanDate(record.return_due_date)}
                </span>
            ),
            defaultSortOrder: 'descend',
        },
        {
            title: "Return Date",
            key: "returnDate",
            sorter: (a, b) => {
                if (!a.returned_date) return -1;
                if (!b.returned_date) return -1;
                return new Date(a.returned_date) - new Date(b.returned_date)
            },
            render: (record) => `${toHumanDate(record?.returned_date)}`,
            defaultSortOrder: 'descend',
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
                            onClick={() => navigate(`/admin/library/book-loans/view/${record.id}`)}
                        />
                    </Tooltip>
                    <Tooltip title={record.status === "NOT RETURNED" ? "Return Book" : "Edit Book"}>
                        <Button
                            className="text-light border-0"
                            style={{ background: editColor }}
                            icon={<EditOutlined />}
                            disabled={record.status === "RETURNED"}
                            onClick={() => editBook(record)}
                        />
                    </Tooltip>
                    {AuthenticationService.getUserRole() === "ADMIN" && <Tooltip title="Delete Book Loan">
                        <Popconfirm
                            title="Delete Book"
                            description="Are you sure you want to delete this book loan?"
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

    return (
        <>

            <div className='d-flex justify-content-between align-items-center'>
                <h3>Book Loans</h3>
                <Button
                    icon={<PlusOutlined />}
                    className='border-0 px-3 text-white'
                    type="primary"
                    onClick={() => navigate("/admin/library/book-loans/add")}
                >
                    Loan New Book
                </Button>
            </div>

            <Divider type={"horizontal"}/>

            <Table columns={booksTableColumns} dataSource={bookLoans} rowKey="id" />
        </>
    );
}

export default BookLoanListPage;