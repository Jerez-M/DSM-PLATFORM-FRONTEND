import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
    Alert,
    Button,
    message,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
} from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import authenticationService from "../../../services/authentication.service";
import {
    deleteColor,
    editColor,
    handleError,
    refreshPage,
    toHumanDate,
    getColumnSearchProps,
} from "../../../common";
import schoolTermServices from "../../../services/schoolTerm.services";
import accountingService from "../../../services/accounting.service";
import EditTransaction from "./EditTransaction";

export async function AllTransactionsLoader() {
    try {
        const termsResponse = await schoolTermServices.getAllTermsByInstitution(
            authenticationService.getUserTenantId()
        );

        let activeCurrentTermId;
        const activeTerm = termsResponse?.data.find((term) => term.is_active);
        if (activeTerm) {
            activeCurrentTermId = activeTerm?.id;
        } else {
            console.log("No active term found.");
        }
        return {
            termsReturned: termsResponse?.data,
            activeTermId: activeCurrentTermId,
        };
    } catch (e) {
        console.log(e);
        return { termsReturned: [], activeTermId: null };
    }
}
const AllTransactions = () => {
    const { termsReturned, activeTermId } = useLoaderData();
    const [income, setIncome] = useState([]);
    const navigate = useNavigate();
    const [editTransactionModalState, setEditTransactionModalState] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null)

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const editTransaction = (record) => {
        setEditTransactionModalState(true)
        setSelectedRecord(record)
    };

    const deleteTransaction = (record) => {
        accountingService
            .delete(record.id)
            .then((res) => {
                if (res.status === 204) {
                    message.success(`Transaction Deleted successfully`);
                    refreshPage();
                }
            })
            .catch((e) => {
                handleError(e);
            });
    };

    const getTransactionColor = (transaction_type) => {
        switch (transaction_type) {
            case "REVENUE":
                return "#3892ea";
            case "EXPENSE":
                return "#ea389d";
            default:
                return "#3892ea";
        }
    };

    const incomeTableColumns = [
        {
            title: "Transaction type",
            dataIndex: ["transaction_type"],
            key: "transactionType",
            defaultSortOrder: "ascend",
            onFilter: (value, record) =>
                record.transaction_type
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            sorter: (a, b) =>
                a.transaction_type.localeCompare(b.transaction_type),
            // ...getColumnSearchProps(["income_type"], searchInputType, handleSearch, handleReset),
            render: (transaction_type) => <Tag color={getTransactionColor(transaction_type)}>{transaction_type}</Tag>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (dataIndex) => <strong>{dataIndex}</strong>,
            sorter: (a, b) => a.description?.localeCompare(b.description),
            ...getColumnSearchProps("description", searchInput, handleSearch, handleReset),
        },
        {
            title: "Transaction No",
            dataIndex: ["transaction_no"],
            key: "transaction_no",
            defaultSortOrder: "ascend",
            // sorter: (a, b) => a?.transaction_no.localeCompare(b?.transaction_no),
            onFilter: (value, record) =>
                record.transaction_no
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            // ...getColumnSearchProps(["subject", "name"], searchInputSubject, searchInput, handleSearch, handleReset)
        },
        {
            title: "Receipt No",
            dataIndex: ["receipt_number"],
            key: "receipt_number",
            defaultSortOrder: "ascend",
            sorter: (a, b) => a?.receipt_number.localeCompare(b?.receipt_number),
            onFilter: (value, record) =>
                record.receipt_number
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            // ...getColumnSearchProps(["subject", "name"], searchInputSubject, searchInput, handleSearch, handleReset)
        },
        {
            title: "Term",
            key: "term",
            dataIndex: ["term", "name"],
            sorter: (a, b) => a.term?.name.localeCompare(b.term?.name),
            ...getColumnSearchProps("term", searchInput, handleSearch, handleReset),
        },
        {
            title: "Transaction recorder",
            key: "user",
            onFilter: (value, record) =>
                record.user?.lastName
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            sorter: (a, b) =>
                a?.lastName?.localeCompare(b?.lastName),
            // ...getColumnSearchProps('teacher', searchInputTeacher, searchInput, handleSearch, handleReset),
            render: (record) => (
                <span>
                    {record?.title} {record?.user?.lastName}{" "}
                    {record?.user?.firstName?.at(0)}.
                </span>
            ),
        },
        {
            title: "Amount",
            key: "amount",
            defaultSortOrder: "ascend",
            render: (record) => (
                <span>
                    {record?.currency}{" "}
                    {record?.amount}.
                </span>
            ),
        },

        {
            title: "Date of transaction",
            key: "date_of_transaction",
            sorter: (a, b) => {
                if (!a.date_of_transaction) return -1;
                if (!b.date_of_transaction) return -1;
                return new Date(a.date_of_transaction) - new Date(b.date_of_transaction);
            },
            defaultSortOrder: "ascend",
            render: (record) => (
                <span
                    className={
                        new Date(record.date_of_transaction)?.toDateString() ===
                            new Date().toDateString()
                            ? "text-warn"
                            : new Date(record.date_of_transaction) < new Date()
                                ? "text-danger"
                                : ""
                    }
                >
                    {toHumanDate(record.date_of_transaction)}
                </span>
            ),
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
                                navigate(`/admin/accounting/transactions/view/${record.id}`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit income">
                        <Button
                            className="text-light border-0"
                            style={{ background: editColor }}
                            icon={<EditOutlined />}
                            onClick={() => editTransaction(record)}
                        />
                    </Tooltip>
                    {(authenticationService.getUserRole() === "ADMIN" ||
                        authenticationService.getUserRole() === "TEACHER") && (
                            <Tooltip title="Delete income">
                                <Popconfirm
                                    title="Delete income"
                                    description="Are you sure you want to delete this income?"
                                    onConfirm={() => deleteTransaction(record)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        type="danger"
                                        style={{ color: deleteColor }}
                                        icon={<DeleteOutlined />}
                                    />
                                </Popconfirm>
                            </Tooltip>
                        )}
                </Space>
            ),
        },
    ];

    useEffect(() => {
        if (activeTermId) {
            fetchTransactionsByTermId(activeTermId);
        }
    }, [activeTermId]);

    const terms = termsReturned?.map((term) => ({
        label: `${term?.name} ${term?.academicYear.name}`,
        value: term?.id,
    }));

    const handleChangeTerm = (value) => {
        const term_id = value;
        fetchTransactionsByTermId(term_id);
    };

    const fetchTransactionsByTermId = async (term_id) => {
        try {
            const institution_id = authenticationService.getUserTenantId();

            const currentIncome = await accountingService.getAllByInstitutionIdAndTermId(
                institution_id,
                term_id
            );

            if (currentIncome?.status === 200) {
                setIncome(currentIncome?.data);
            } else {
                message.error("No transactions found");
            }
        } catch (error) {
            message.error("No transactions found");
        }
    };

    return (
        <>
            <Table
                title={() => (
                    <div>
                        <Alert
                            message={`Please select the term for the transactions you wish to view.`}
                            type="info"
                            className="mb-3 py-3"
                            showIcon
                            closable
                        />

                        <Select
                            size="large"
                            options={terms}
                            placeholder="Select the term"
                            onChange={handleChangeTerm}
                        />
                    </div>
                )}
                className="table-responsive"
                columns={incomeTableColumns}
                dataSource={income}
                rowKey="id"
            />

            <EditTransaction open={editTransactionModalState} close={() => setEditTransactionModalState(false)} record={selectedRecord} />
        </>
    );
};
export default AllTransactions;
