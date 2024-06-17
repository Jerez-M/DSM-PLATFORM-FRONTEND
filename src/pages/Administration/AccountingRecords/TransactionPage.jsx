import { Button, Card, Divider, Tag } from "antd";
import {
    EditOutlined
} from "@ant-design/icons";
import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import accountingService from "../../../services/accounting.service";
import EditTransaction from "./EditTransaction";
import BackButton from "../../../common/BackButton";
import { toHumanDate } from "../../../common";


export async function TransactionPageLoader({ params }) {
    try {
        const transactionResponse = await accountingService.getById(params.id);
        return { transaction: transactionResponse?.data };
    } catch (e) {
        console.log(e);
        return { transaction: [] };
    }
}

const TransactionPage = () => {
    const { transaction } = useLoaderData();
    const navigate = useNavigate();
    const [editTransactionModalState, setEditTransactionModalState] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null)

    const editTransaction = (record) => {
        setEditTransactionModalState(true)
        setSelectedRecord(record)
    };

    const getTransactionTypeColor = () => {
        if (transaction?.transaction_type === "EXPENSE") return "warning";
        if (transaction?.transaction_type === "REVENUE") return "success";
        return "success"
    }

    return (
        <>
            <BackButton />
            <div className="d-flex justify-content-between align-items-center">
                <h3>View Transaction</h3>
                <div className="align-items-center">
                    <Button
                        icon={<EditOutlined />}
                        className='border-0 px-3 text-white'
                        style={{ background: '#39b54a' }}
                        onClick={() => editTransaction(transaction)}
                    >
                        Edit Transaction
                    </Button>
                </div>
            </div>

            <Divider />

            <Card>
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-2">Transaction type</h3>
                    <Tag bordered={true} color={getTransactionTypeColor()}>
                        <h5 className="text-strong">{transaction?.transaction_type}</h5>
                    </Tag>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <p className="table-row">
                            <span>Description:</span>
                            <strong>
                                {transaction?.description}.
                            </strong>
                        </p>
                        <p className="table-row">
                            <span>Date of transaction:</span>
                            <strong className={
                                (new Date(transaction?.date_of_transaction)?.toDateString() === new Date().toDateString()) ? "text-warn" :
                                    (new Date(transaction?.date_of_transaction) < new Date()) ? "text-danger" : ""}
                            >
                                {toHumanDate(transaction?.date_of_transaction)}
                            </strong>
                        </p>
                        <p className="table-row">
                            <span>Amount:</span>
                            <strong>{transaction?.amount}</strong>
                            <strong>{`${transaction?.currency}  ${transaction?.amount}`}</strong>
                        </p>
                        {/* <p className="table-row">
                            <span>Currency:</span>
                            <strong>{transaction?.currency}</strong>
                        </p> */}
                    </div>
                    <div className="col-md-6">
                        <p className="table-row">
                            <span>Created date:</span>
                            <strong>
                                {toHumanDate(transaction?.date_created)}
                            </strong>
                        </p>
                        <p className="table-row">
                            <span>Term:</span>
                            <strong>{transaction?.term?.name}</strong>
                        </p>
                        <p className="table-row">
                            <span>Receipt number:</span>
                            <strong>{transaction?.receipt_number}</strong>
                        </p>
                    </div>
                    <p className="table-row">
                        <span>Transaction Recorder:</span>
                        <strong>{`${transaction?.user?.firstName}  ${transaction?.user?.lastName}`}</strong>
                    </p>
                </div>
            </Card>

            <EditTransaction open={editTransactionModalState} close={() => setEditTransactionModalState(false)} record={selectedRecord} />

        </>
    )
}

export default TransactionPage