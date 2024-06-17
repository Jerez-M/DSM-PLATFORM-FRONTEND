import {Button, message, Popconfirm, Space, Spin, Table, Tooltip, Typography} from "antd";
import {deleteColor, editColor, handleError, refreshPage, toHumanDate} from "../../../../../common";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import AuthenticationService from "../../../../../services/authentication.service";
import NewVehicleInsurance from "./NewVehicleInsurance";
import VehicleInsuranceService from "../../../../../services/vehicle-insurance.service";

const AllInsurances = () => {
    const [insurances, setInsurances] = useState([])
    const [editInsuranceModal, setEditInsuranceModal] = useState(false)
    const [selectedInsurance, setSelectedInsurance] = useState(null)

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await VehicleInsuranceService.getAllByInstitution(AuthenticationService.getUserTenantId());
            setInsurances(response.data);
        } catch (e) {
            setInsurances([])
        } finally {
            setLoading(false)
        }
    }

    const editInsurance = (service) => {
        setSelectedInsurance(service)
        setEditInsuranceModal(true)
    }

    const deleteInsurance = (insurance) => {
        VehicleInsuranceService.delete(insurance.id)
            .then((res) => {
                if (res.status === 204) {
                    message.success("Vehicle Insurance Deleted");
                    refreshPage();
                }
            })
            .catch((e) => {
                handleError(e);
            });
    };

    const insuranceTableColumns = [
        {
            title: "Vehicle Name",
            dataIndex: ["vehicle", "name"],
            key: "vehicleName",
            sorter: (a, b) => ( a.vehicle?.name?.localeCompare(b.vehicle?.name)),
        },
        {
            title: "Vehicle",
            key: "vehicle",
            sorter: (a, b) => ( a.vehicle?.manufacturer?.localeCompare(b.vehicle?.manufacturer)),
            render: ({vehicle}) => (
                <Link to={`/admin/vehicles/${vehicle.id}`}>
                    {`${vehicle?.manufacturer} ${vehicle?.make} ${vehicle?.model} (${vehicle?.numberplate})`}
                </Link>
            )
        },
        {
            title: "Purchased Date",
            key: "purchased_date",
            render: (record) => `${toHumanDate(record?.purchased_date)}`,
            sorter: (a, b) => new Date(a.purchased_date) - new Date(b.purchased_date),
        },
        {
            title: "Expiry Date",
            key: "expiry_date",
            render: (record) => `${toHumanDate(record?.expiry_date)}`,
            sorter: (a, b) => new Date(a.expiry_date) - new Date(b.expiry_date),
            defaultSortOrder: 'ascend',
        },
        {
            title: "Cost",
            key: "estimated_insurance_cost",
            render: (record) => record.currency + record.amount,
            sorter: (a, b) => {
                return a.amount - b.amount
            },
        },
        {
            title: "Description",
            key: "description",
            render: (record) => (
                <Typography.Paragraph ellipsis={{rows: 2, expandable: true, symbol: "more"}} className="mt-2">
                    {record.description}
                </Typography.Paragraph>
            ),
            responsive: ["xl"],
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) => (
                <Space size="small">
                    <Tooltip title="View Trip">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => editInsurance(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Insurance">
                        <Button
                            type="primary"
                            style={{backgroundColor: editColor}}
                            icon={<EditOutlined />}
                            onClick={() => editInsurance(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Vehicle"
                        description="Are you sure you want to delete this insurance?"
                        onConfirm={() => deleteInsurance(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="danger"
                            style={{ color: deleteColor }}
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return (
        <Spin spinning={loading} size="large" fullscreen="true" >
            <Table columns={insuranceTableColumns} dataSource={insurances} rowKey="id" />

            <NewVehicleInsurance
                open={editInsuranceModal}
                close={() => setEditInsuranceModal(false)}
                vehicleInsurance={selectedInsurance}
            />
        </Spin>
    )
}

export default AllInsurances;