import HumanResources from "../../../services/human-resources";
import AuthenticationService from "../../../services/authentication.service";
import {useEffect, useState} from "react";
import {DollarOutlined, TeamOutlined} from "@ant-design/icons";

async function retrieveAncillaryStaffMetrics() {
    try {
        const response1 = await HumanResources.getSalaryBillByInstitutionId(
            AuthenticationService.getUserTenantId()
        );

        const response2 = await HumanResources.getEmployeeCountByInstitutionId(
            AuthenticationService.getUserTenantId()
        );

        const ancillaryStaff = response2.data;
        const salaryBill = response1.data;

        return {ancillaryStaff, salaryBill}

    } catch (error) {
        return null;
    }
}
const AncillaryStaffMetrics = () => {
    const [employeeMetricsData, setEmployeeMetricsData] = useState(null);

    useEffect(
        () => {
            const fetchEmployeeMetrics = async () => {
                const _employeeMetrics = await retrieveAncillaryStaffMetrics();
                setEmployeeMetricsData(_employeeMetrics);
            }
            fetchEmployeeMetrics();
        },
        []
    )

    return (
        <div className='my-3'>
            <div className="row gy-3">
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="me-2">
                                    <span className="text-muted">Total Ancillary Staff</span>
                                    <h5 className="mb-0">{employeeMetricsData?.ancillaryStaff?.employee_count}</h5>
                                </div>
                                <div className="sw-3">
                                    <TeamOutlined
                                        className='fs-1'
                                        style={{
                                            color: "#39b54a"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="me-2">
                                    <span className="text-muted">Salary Bill</span>
                                    <h5 className="mb-0">${employeeMetricsData?.salaryBill?.salary_bill}</h5>
                                </div>
                                <div className="sw-3">
                                    <DollarOutlined
                                        className='fs-1'
                                        style={{
                                            color: "gold"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AncillaryStaffMetrics