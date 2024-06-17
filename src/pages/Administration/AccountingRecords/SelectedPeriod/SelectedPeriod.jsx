import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Button,
    Card,
    message,
    Select,
    DatePicker,
    Divider,
    Form,
    Spin
} from "antd";
import authenticationService from "../../../../services/authentication.service";
import accountingService from "../../../../services/accounting.service";
import { PrinterOutlined, PullRequestOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";

const SelectedPeriod = () => {
    const [incomeStatement, setIncomeStatement] = useState([]);
    const [netIncome, setNetIncome] = useState([]);
    const [expenseRecords, setExpenseRecords] = useState([]);
    const [revenueRecords, setRevenueRecords] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState([]);
    const [totalExpense, setTotalExpense] = useState([]);
    const [currency, setCurrency] = useState([]);

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [formData, setFormData] = useState({
        start_date: null,
        end_date: null,
    });

    const handleFormChange = (field, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: value,
        }));
    };

    const componentRef = useRef();

    const handleFormSubmit = async () => {

        try {
            setLoading(true);
            setDisabled(true);

            const institution_id = authenticationService.getUserTenantId();
            const { start_date, end_date } = formData;

            const currentIncomeStatement = await accountingService.getIncomeStatementByInstitutionIdAndPeriod(
                institution_id, start_date, end_date
            );

            if (currentIncomeStatement?.status === 200) {
                setIncomeStatement(currentIncomeStatement?.data);
                setTotalRevenue(currentIncomeStatement?.data[1]?.total_revenue);
                setTotalExpense(currentIncomeStatement?.data[2]?.total_expenses);
                setNetIncome(currentIncomeStatement?.data[3]);
                setRevenueRecords(currentIncomeStatement?.data[4].income_records);
                setExpenseRecords(currentIncomeStatement?.data[5].expense_records);
                setCurrency(currentIncomeStatement?.data[4].income_records[0].currency);
                message.success("Income statement generated successfully");
            } else {
                console.log("Error occurred while fetching income statements");
            }
        } catch (error) {
            message.error("Failed to generate income statement");
            console.error(error)
        }
        finally {
            setLoading(false);
            setDisabled(false);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Income Statement ${new Date().toLocaleDateString()}`,
    })

    const isIncomeStatementReady = incomeStatement.length > 0

    return (
        <>
            <div className="mb-2">
                <Alert
                    message={`Please select the period for the income statement you wish to generate.`}
                    type="info"
                    className="mb-2 py-2"
                    showIcon
                    closable
                />

                <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
                    <Divider type="horizontal" />
                    <Form.Item
                        name="transactionDuration"
                        rules={[{ required: true, message: "Period is required!" }]}
                    >
                        <DatePicker.RangePicker
                            className="w-100"
                            size="large"
                            onChange={(dates, dateStrings) => {
                                handleFormChange("start_date", dateStrings[0]);
                                handleFormChange("end_date", dateStrings[1]);
                            }}
                        />
                    </Form.Item>
                    <Divider type="horizontal" />
                    <Button
                        type="primary"
                        size="large"
                        className="mt-3"
                        loading={loading}
                        disabled={disabled}
                        icon={<PullRequestOutlined />}
                        block
                        htmlType="submit"
                    >
                        Generate Income Statement
                    </Button>
                </Form>

            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
                    <Spin size="large" />
                </div>
            ) : (
                isIncomeStatementReady && (
                    <Card>
                        <div className="border border-black py-1" ref={componentRef}>
                            <div className="bg-light">
                                <div className="d-flex justify-content-center align-items-center">
                                    <h4 className="mb-2">{incomeStatement[0]?.institution}</h4>
                                </div>
                                <div className="d-flex justify-content-center align-items-center">
                                    <h5 className="mb-2">{incomeStatement[1]?.academic_year} Income Statement</h5>
                                </div>
                                <div className="d-flex justify-content-center align-items-center">
                                    <h6 className="mb-2">
                                        <span>Date generated: </span>
                                        {new Date().toLocaleDateString()}
                                    </h6>
                                </div>
                            </div>


                            <div className="row px-3 mt-2">
                                <div className="col-md-12 justify-content-center">
                                    <h5 className="mb-2"><strong>Revenue</strong></h5>

                                    {
                                        revenueRecords && revenueRecords?.map(
                                            revenueRecord => (
                                                <p className="table-row" key={revenueRecord?.id}>
                                                    <span>{revenueRecord.description}</span>
                                                    <span>{`${revenueRecord.currency} ${revenueRecord?.amount}`}</span>
                                                </p>
                                            )
                                        )
                                    }

                                    <p className="table-row">
                                        <strong>Total Revenue</strong>
                                        <strong>{`${currency} ${totalRevenue}`}</strong>
                                    </p>

                                    <h5 className="mb-2"><strong>Expenses</strong></h5>

                                    {
                                        expenseRecords && expenseRecords?.map(
                                            expense_record => (
                                                <p className="table-row" key={expense_record?.id}>
                                                    <span>{expense_record.description}</span>
                                                    <span>{`${expense_record.currency} ${expense_record?.amount}`}</span>
                                                </p>
                                            )
                                        )
                                    }
                                    <p className="table-row">
                                        <strong>Total Expenses</strong>
                                        <strong>{`${currency} ${totalExpense}`}</strong>
                                    </p>

                                    <p className="table-row">
                                        <strong>Net Income</strong>
                                        <strong>{`${currency} ${netIncome?.net_income}`}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='d-flex justify-content-end mt-3'>
                            <Button
                                icon={<PrinterOutlined />}
                                style={{ background: '#39b54a' }}
                                className='border-0 px-3 text-white'
                                onClick={handlePrint}
                            >
                                Print Statement
                            </Button>
                        </div>
                    </Card>
                )
            )}
        </>
    );
};
export default SelectedPeriod;
