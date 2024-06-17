import { Button, Divider, Modal, Space, Table, Tooltip } from "antd";
import { ArrowLeftOutlined, EyeOutlined, PlusOutlined, PrinterOutlined } from "@ant-design/icons";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import HumanResources from "../../../services/human-resources";
import AuthenticationService from "../../../services/authentication.service";
import React, { useRef, useState } from "react";
import { InstitutionLogo, InstitutionName } from "../../../common";
import { useReactToPrint } from "react-to-print";
import BackButton from "../../../common/BackButton";


export async function retrieveAllPayslipsByPayrollRecordLoader({ params }) {
    try {
        const response = await HumanResources.getPayslipsByPayrollRecordIdAndInstitutionId(
            params?.id,
            AuthenticationService.getUserTenantId()
        );
        if (response.status === 200) {
            const payslips = response.data;
            return { payslips };
        }
    } catch (error) {
        return []
    }
}

const PayslipsListByPayrollRecord = () => {
    const navigate = useNavigate();
    const { payslips } = useLoaderData();
    const componentRef = useRef();

    const [viewPayslipModal, setViewPayslipModal] = useState(false);
    const [currentPayslipData, setCurrentPayslipData] = useState({});

    const payslipsData = payslips.map(
        (payslip, key) => ({
            empNumber: payslip?.employee?.user?.username,
            name: `${payslip?.employee?.user?.firstName} ${payslip?.employee?.user?.lastName}`,
            net: `$ ${payslip?.net_salary}`,
            id: payslip?.id,
            key
        })
    )

    const payslipsRecordsTableColumns = [
        {
            title: 'Employee number',
            dataIndex: 'empNumber',
            key: 'empNumber'
        },
        {
            title: 'Fullname',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Net salary',
            dataIndex: 'net',
            key: 'net',
            render: record => (
                <p className='text-danger fw-bolder'>{record}</p>
            )
        },
        {
            title: 'Action',
            dataIndex: 'id',
            key: 'id',
            render: record => (
                <Space size="small">
                    <Tooltip title="More details">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewPayslip(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    const handleViewPayslip = (payslipId) => {
        setViewPayslipModal(true);

        const currentPayslip = payslips.filter(
            currentPayslipItem => currentPayslipItem?.id === payslipId
        )[0]

        setCurrentPayslipData(currentPayslip)
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Payslip`,
    })

    return (
        <div className='mx-5'>
            <div>
                <div className='d-flex justify-content-start align-items-center'>
                    <BackButton />
                </div>
            </div>
            <Divider className='my-1 mb-3' type={"horizontal"} />

            <Table
                columns={payslipsRecordsTableColumns}
                dataSource={payslipsData}
            />
            <Modal
                width={720}
                open={viewPayslipModal}
                okButtonProps={{
                    className: 'd-none'
                }}
                cancelButtonProps={{
                    className: 'd-none'
                }}
                onCancel={() => setViewPayslipModal(false)}
                destroyOnClose={true}
                className='p-2'
            >
                <div className='p-2' ref={componentRef}>
                    <h3>
                        {currentPayslipData?.payroll?.month} {currentPayslipData?.payroll?.year?.name}
                    </h3>
                    <div className='d-flex justify-content-between'>
                        <InstitutionLogo />
                        <InstitutionName textColor='text-dark' />
                    </div>

                    <div className='border'>
                        <h4 className='p-2'>Payslip for period
                            ending {currentPayslipData?.payroll?.month} {currentPayslipData?.payroll?.year?.name}</h4>
                        <Divider className='my-0' type={"horizontal"} />
                        <div className='p-2 bg-light'>
                            <p className='small text-muted m-0'>Employee</p>
                            <span className='d-block mb-2'>
                                {currentPayslipData?.employee?.user?.firstName} &nbsp;
                                {currentPayslipData?.employee?.user?.lastName} &nbsp;
                                ({currentPayslipData?.employee?.user?.username})</span>

                            <p className='small text-muted m-0'>ID number</p>
                            <span className='d-block mb-2'>-</span>

                            <p className='small text-muted m-0'>Job position</p>
                            <span className='d-block mb-2'>{currentPayslipData?.employee?.job_title}</span>

                            <p className='small text-muted m-0'>Department</p>
                            <span className='d-block mb-2'>-</span>
                        </div>
                        <Divider className='mt-0' type={"horizontal"} />
                        <p className='d-flex justify-content-between align-items-center fw-bold px-2'>
                            <span>Basic salary</span>
                            <span>{currentPayslipData?.gross_salary}</span>
                        </p>
                        <Divider className='' type={"horizontal"} />
                        {
                            currentPayslipData?.compensation_elements && currentPayslipData?.compensation_elements?.map(
                                salaryAdjustmentItem => (
                                    <div>
                                        <p
                                            key={salaryAdjustmentItem?.id}
                                            className='d-flex justify-content-between align-items-center fw-bold px-2'>
                                            <span>{salaryAdjustmentItem?.code}</span>
                                            <span>
                                                {
                                                    salaryAdjustmentItem?.percentage ? salaryAdjustmentItem?.percentage : salaryAdjustmentItem?.amount
                                                }
                                            </span>
                                        </p>
                                        <Divider className='' type={"horizontal"} />
                                    </div>
                                )
                            )
                        }
                        <p className='d-flex justify-content-between align-items-center fw-bold px-2'>
                            <span>Net salary</span>
                            <span>{currentPayslipData?.net_salary}</span>
                        </p>
                    </div>
                </div>

                <div className='d-flex justify-content-center mt-3'>
                    <Button
                        icon={
                            <PrinterOutlined className='fs-2 text-light' />
                        }
                        className='rounded-circle bg-primary border-primary shadow-sm'
                        style={{
                            width: 75,
                            height: 75
                        }}
                        onClick={handlePrint}
                    ></Button>
                </div>
            </Modal>
        </div>
    )
}

export default PayslipsListByPayrollRecord;