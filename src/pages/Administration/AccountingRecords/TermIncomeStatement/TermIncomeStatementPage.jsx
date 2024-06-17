import React, { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
    Alert,
    Button,
    Card,
    message,
    Select,
    Tag,
} from "antd";
import authenticationService from "../../../../services/authentication.service";
import schoolTermServices from "../../../../services/schoolTerm.services";
import accountingService from "../../../../services/accounting.service";
import { PrinterOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";

export async function TermIncomeStatementPageLoader() {
    try {
        const termsResponse = await schoolTermServices.getAllTermsByInstitution(
            authenticationService.getUserTenantId()
        );
        console.log("TermIncomeStatementPageLoader")

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
const TermIncomeStatementPage = () => {
    const { termsReturned, activeTermId } = useLoaderData();
    const [incomeStatement, setIncomeStatement] = useState([]);
    const [netIncome, setNetIncome] = useState([]);
    const [expenseRecords, setExpenseRecords] = useState([]);
    const [revenueRecords, setRevenueRecords] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState([]);
    const [totalExpense, setTotalExpense] = useState([]);
    const [currency, setCurrency] = useState([]);

    const componentRef = useRef();

    useEffect(() => {
        if (activeTermId) {
            fetchIncomeStatementByTermId(activeTermId);
        }
    }, [activeTermId]);

    const terms = termsReturned?.map((term) => ({
        label: `${term?.name} ${term?.academicYear.name}`,
        value: term?.id,
    }));

    const handleChangeTerm = (value) => {
        const term_id = value;
        fetchIncomeStatementByTermId(term_id);
    };

    const fetchIncomeStatementByTermId = async (term_id) => {
        try {
            const institution_id = authenticationService.getUserTenantId();

            const currentIncomeStatement = await accountingService.getIncomeStatementByInstitutionIdAndTermId(
                institution_id,
                term_id
            );


            if (currentIncomeStatement?.status === 200) {
                setIncomeStatement(currentIncomeStatement?.data);
                setTotalRevenue(currentIncomeStatement?.data[2]?.total_revenue);
                setTotalExpense(currentIncomeStatement?.data[3]?.total_expenses);
                setNetIncome(currentIncomeStatement?.data[4]);
                setRevenueRecords(currentIncomeStatement?.data[5].income_records);
                setExpenseRecords(currentIncomeStatement?.data[6].expense_records);
                setCurrency(currentIncomeStatement?.data[5].income_records[0].currency);
            } else {
                message.error("No income statement generated");
            }
        } catch (error) {
            message.error("No income statement generated");
        }
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Income Statement ${new Date().toLocaleDateString()}`,
    })

    return (
        <>
            <div className="mb-2">
                <Alert
                    message={`Please select the term for the income incomeStatement you wish to generate.`}
                    type="info"
                    className="mb-2 py-2"
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

            <Card>
                <div className="border border-black py-1" ref={componentRef}>
                    <div className="bg-light">
                        <div className="d-flex justify-content-center align-items-center">
                            <h4 className="mb-2">{incomeStatement[0]?.institution}</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <h5 className="mb-2">{incomeStatement[1]?.term} Income Statement</h5>
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
                            <h5 className="mb-2"><strong>Revenues</strong></h5>

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
                                <strong>{`${currency } ${totalRevenue}`}</strong>
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
                                <strong>{`${currency } ${totalExpense}`}</strong>
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
        </>
    );
};
export default TermIncomeStatementPage;
