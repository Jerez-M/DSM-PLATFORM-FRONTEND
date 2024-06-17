import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import authenticationService from "../../../services/authentication.service";
import schoolTermServices from "../../../services/schoolTerm.services";
import { _CURRENCY_CODES, handleJerryError, refreshPage } from "../../../common";
import accountingService from "../../../services/accounting.service";
import moment from "moment";

const EditTransaction = ({ open, close, record }) => {
    const [termsList, setTermsList] = useState([])

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [formData, setFormData] = useState({
        transaction_type: record ? record?.transaction_type : null,
        description: record ? record?.description : "",
        currency: record ? record?.currency : "USD",
        receipt_number: record ? record?.receipt_number : "",
        date_of_transaction: record ? record?.date_of_transaction : null,
        term: record ? record?.term.id : null,
        amount: record ? record?.amount : null,
    });

    const currencyPrefix = (
        <Form.Item name="currency" initialValue={"USD"} noStyle>
            <Select
                onChange={(value) => handleFormChange("currency", value)}
                style={{ minWidth: 60 }}
                options={_CURRENCY_CODES}
            />
        </Form.Item>
    );
    const institution = authenticationService.getUserTenantId();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {

        try {
            const termsResponse = await schoolTermServices.getTermsInActiveAcademicYearByInstitutionId(institution)

            if (termsResponse.status === 200) {

                const __terms = termsResponse.data?.map((term) => ({
                    label: term?.name,
                    value: term?.id,
                }));
                setTermsList(__terms);
            } else {
                console.log("Request failed. Status:", termsResponse.status);
            }
        } catch (error) {
            console.error("Error occurred during fetching terms:", error);
        }
    };

    const handleFormChange = (field, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: value,
        }));
    };

    const handleFormSubmit = async () => {
        try {
            setLoading(true);
            setDisabled(true);

            const {
                transaction_type,
                description,
                currency,
                receipt_number,
                date_of_transaction,
                term,
                amount,
            } = formData;

            const data = {
                transaction_type: transaction_type || record?.transaction_type,
                description: description || record?.description,
                currency: currency || record?.currency,
                receipt_number: receipt_number || record?.receipt_number,
                date_of_transaction: date_of_transaction || record?.date_of_transaction,
                term: term || record?.term.id,
                amount: amount || record?.amount,
                // institution: institution || record?.institution,
            };

            const response = await accountingService.update(record?.id, data);

            if (response.status === 202) {
                message.success("Transaction Updated Successfully");
            } else {
                message.error("An error occurred, please check your network connection.");
            }
        } catch (error) {
            console.error("Error editing transaction:", error);
            handleJerryError(error)
        } finally {
            setLoading(false);
            setDisabled(false);
            close()
            refreshPage()
        }
    };

    return (
        <>
            <Modal
                title="Edit Transaction"
                visible={open}
                onCancel={close}
                okButtonProps={{
                    className: "d-none",
                }}
                cancelButtonProps={{
                    className: "d-none",
                }}
                width={700}
            >
                {/* <Divider orientation="left">New Transaction</Divider> */}
                <Form layout="vertical">
                    <Form.Item
                        label="Transaction Type"
                        name="transaction_type"
                        rules={[{ required: true, message: "Transaction type is required!" }]}
                    >
                        <Select
                            size="large"
                            defaultValue={record?.transaction_type}
                            onChange={(value) => handleFormChange("transaction_type", value)}
                            disabled
                            options={[
                                { label: "REVENUE", value: "REVENUE" },
                                { label: "EXPENSE", value: "EXPENSE" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Transaction Description"
                        name="description"
                        rules={[{ required: true, message: "Transaction description is required!" }]}
                    >
                        <Input
                            size="large"
                            defaultValue={record ? record?.description : "Enter description"}
                            onChange={(e) => handleFormChange("description", e.target.value)}
                        />
                    </Form.Item>



                    <Form.Item
                        label="Receipt Number"
                        name="receipt_number"
                    >
                        <Input
                            size="large"
                            defaultValue={record ? record?.receipt_number : "Enter receipt number"}
                            onChange={(e) => handleFormChange("receipt_number", e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Date of Transaction"
                        name="date_of_transaction"
                        rules={[{ required: true, message: "Date of transaction is required!" }]}
                    >
                        <DatePicker
                            size="large"
                            className="w-100"
                            defaultValue={record ? moment(record?.date_of_transaction) : "Select date of transaction"}
                            onChange={(date, dateString) => handleFormChange("date_of_transaction", dateString)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Term"
                        name="term"
                        rules={[{ required: true, message: "Term is required!" }]}
                    >
                        <Select
                            size="large"
                            defaultValue={record ? record?.term.name : "Select term"}
                            onChange={(value) => handleFormChange("term", value)}
                            options={termsList}
                        />
                    </Form.Item>


                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[
                            { required: true, message: "Amount is required!" },
                            { type: "number", message: "Amount must be a number!" },
                        ]}
                    >
                        <InputNumber
                            addonBefore={currencyPrefix}
                            style={{ width: "100%" }}
                            type="number"
                            size="large"
                            defaultValue={record ? record?.amount : "Enter amount"}
                            onChange={(value) => handleFormChange("amount", value)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={disabled}
                            icon={<PlusOutlined />}
                            onClick={handleFormSubmit}
                        >
                            Edit Transaction
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default EditTransaction;