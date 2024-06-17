import React, { useState } from "react";
import { Button, Divider, Tabs } from "antd";
import { CheckCircleOutlined, DollarOutlined, ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import AllTransactions from "./AllTransactions";
import NewTransaction from "./NewTransaction";
import SchoolStatistics from "../Dashboard/SchoolStatistics";
import { useEffect } from "react";
import accountingService from "../../../services/accounting.service";
import schoolTermServices from "../../../services/schoolTerm.services";
import authenticationService from "../../../services/authentication.service";
import TermIncomeStatementPage from "./TermIncomeStatement/TermIncomeStatementPage";
import YearIncomeStatementPage from "./YearIncomeStatement/YearIncomeStatementPage";
import SelectedPeriod from "./SelectedPeriod/SelectedPeriod";


const IncomeStatementTab = () => {
    const [newTermModalState, setNewTermModalState] = useState(false);
    const [transactionStats, setTransactionStats] = useState([])

    const tabItems = [
        {
            key: "1",
            label: "Termly",
            children: <TermIncomeStatementPage />
        },
        {
            key: "2",
            label: "Yearly",
            children: <YearIncomeStatementPage />,
        },
        {
            key: "3",
            label: "Selected period",
            children: <SelectedPeriod />,
        },
    ];

    useEffect(() => {
        getTransactionStats()
    }, [])

    const getTransactionStats = async () => {
        try {
            const institution_id = authenticationService.getUserTenantId()
            const termsResponse = await schoolTermServices.getAllTermsByInstitution(institution_id);

            let activeCurrentTermId;
            const activeTerm = termsResponse?.data.find((term) => term.is_active);
            if (activeTerm) {
                activeCurrentTermId = activeTerm?.id;
            } else {
                console.log("No active term found.");
            }

            const transactionStatsResponse = await accountingService.getTransactionStatsByInstitutionIdAndTermId(institution_id, activeCurrentTermId)
            const transactionStatistics = transactionStatsResponse?.data

            setTransactionStats(transactionStatistics)
        } catch (e) {
            console.log(e);
        }
    }


    return (
        <>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h3>Income Statements</h3>

                <div className="align-items-center">
                    <Button
                        icon={<PlusOutlined />}
                        className='border-0 px-3 text-white'
                        style={{ background: '#39b54a' }}
                        onClick={() => setNewTermModalState(true)}
                    >
                        Record Transaction
                    </Button>
                </div>
            </div>

            <div className="container-fluid p-0">
                <div className="row gy-3 mb-3">
                    <div className="col-md-4">
                        <SchoolStatistics
                            name="Total Current Term transactions"
                            value={transactionStats.total_current_term_transactions}
                            icon={<CheckCircleOutlined style={{ fontSize: 40, color: "#1b5dd9" }} />}
                        />
                    </div>
                    <div className="col-md-4">
                        <SchoolStatistics
                            name="Total Current Year Transactions"
                            value={transactionStats.total_current_year_transactions}
                            icon={<ExclamationCircleOutlined style={{ fontSize: 40, color: "#17e891" }} />}
                        />
                    </div>
                    <div className="col-md-4">
                        <SchoolStatistics
                            name=" Total Overall Transactions"
                            value={transactionStats?.overall_total_transactions}
                            icon={<CheckCircleOutlined style={{ fontSize: 40, color: "#518d18" }} />}
                        />
                    </div>
                </div>
            </div>

            <div className="container-fluid p-0">
                <div className="row gy-3 mb-3">
                    <div className="col-md-4">
                        <SchoolStatistics
                            name="Current Term Net Income"
                            value={`USD ${transactionStats.current_term_net_income}`}
                            icon={<DollarOutlined style={{ fontSize: 40, color: "#1b5dd9" }} />}
                        />
                    </div>
                    <div className="col-md-4">
                        <SchoolStatistics
                            name="Current Year Net Income"
                            value={`USD ${transactionStats.current_year_net_income}`}
                            icon={<DollarOutlined style={{ fontSize: 40, color: "#17e891" }} />}
                        />
                    </div>
                    <div className="col-md-4">
                        <SchoolStatistics
                            name="Overall Net Income"
                            value={`USD ${transactionStats?.overall_net_income}`}
                            icon={<DollarOutlined style={{ fontSize: 40, color: "#518d18" }} />}
                        />
                    </div>
                </div>
            </div>

            <Divider type={"horizontal"} />
            <Tabs defaultActiveKey="1" items={tabItems} style={{ color: '#39b54a' }} />
            <NewTransaction open={newTermModalState} close={() => setNewTermModalState(false)} />
        </>
    );
}
export default IncomeStatementTab;
