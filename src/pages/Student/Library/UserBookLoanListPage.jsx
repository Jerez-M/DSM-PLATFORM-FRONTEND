import {EyeOutlined,
} from "@ant-design/icons";
import {useLoaderData, useNavigate} from "react-router-dom";
import {Button, Divider, Space, Table, Tag, Tooltip} from "antd";
import {useRef, useState} from "react";
import {
    getColumnSearchPropsNoFilter,
    normalizeEnumCase,
    toHumanDate,
} from "../../../common";
import AuthenticationService from "../../../services/authentication.service";
import LibraryBookLoansService from "../../../services/library-book-loans.service";
import {RETURNED_STATUS} from "../../../utils/library-book-loan";
import {getReturnedStatusColor} from "../../Administration/Library/BookLoan/BookLoanListPage";


export const userBookLoanListLoader = async () => {
    try {
        // const bookLoansResponse = await LibraryBookLoansService.getAllByUserId(AuthenticationService.getUserTenantId());
        const bookLoansResponse = await LibraryBookLoansService.getAllByRegNumber(AuthenticationService.getUsername());
        return {bookLoans: bookLoansResponse.data}
    } catch (e) {
        return {bookLoans: []};
    }
}

const UserBookLoanListPage = () => {
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

    const booksTableColumns = [
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
            ...getColumnSearchPropsNoFilter('tittle', searchInput, handleSearch, handleReset)
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
                            onClick={() => navigate(`/library/book-loans/view/${record.id}`)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ]

    return (
        <>

            <div className='d-flex justify-content-between align-items-center'>
                <h3>My Book Loans</h3>
            </div>

            <Divider type={"horizontal"}/>

            <Table columns={booksTableColumns} dataSource={bookLoans} />
        </>
    );
}

export default UserBookLoanListPage;