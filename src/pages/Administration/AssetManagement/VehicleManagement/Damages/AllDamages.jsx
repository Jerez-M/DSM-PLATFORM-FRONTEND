import {Button, message, Popconfirm, Space, Spin, Table, Tooltip} from "antd";
import {
    deleteColor,
    editColor,
    handleJerryError,
    normalizeEnumCase,
    refreshPage,
    toHumanDate
} from "../../../../../common";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import VehicleDamageService from "../../../../../services/vehicle-damage.service";
import AuthenticationService from "../../../../../services/authentication.service";
import NewVehicleDamage from "./NewVehicleDamage";
import {VEHICLE_DAMAGE_SEVERITY, VEHICLE_REPAIR_STATUS} from "../../../../../utils/vehicle-damage";

const AllDamages = () => {
    const [damages, setDamages] = useState([])
    const [editDamageModal, setEditDamageModal] = useState(false)
    const [selectedDamage, setSelectedDamage] = useState(null)

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await VehicleDamageService.getAllByInstitution(AuthenticationService.getUserTenantId());
            setDamages(response.data);
        } catch (e) {
            setDamages([])
        } finally {
            setLoading(false)
        }
    }

    const editDamage = (service) => {
        setSelectedDamage(service)
        setEditDamageModal(true)
    }

    const deleteVehicle = (vehicle) => {
        VehicleDamageService.delete(vehicle.id)
            .then((res) => {
                if (res.status === 204) {
                    message.success("Vehicle Damage Deleted");
                    refreshPage();
                }
            })
            .catch((e) => {
                handleJerryError(e);
            });
    };

    const damageTableColumns = [
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
            title: "Date of Damage",
            key: "damage_date",
            render: (record) => `${toHumanDate(record?.damage_date)}`,
            sorter: (a, b) => new Date(a.damage_date) - new Date(b.damage_date),
            defaultSortOrder: 'ascend',
        },
        {
            title: "Severity",
            dataIndex: "damage_severity",
            key: "damage_severity",
            sorter: {
                compare: (a, b) => a.damage_severity.localeCompare(b.damage_severity),
            },
            filters: VEHICLE_DAMAGE_SEVERITY.map(damage_severity => (
                {text: normalizeEnumCase(damage_severity), value: damage_severity}
            )),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.damage_severity === value,
            defaultSortOrder: 'ascend',
        },
        {
            title: "Repair Status",
            dataIndex: "repair_status",
            key: "repair_status",
            sorter: {
                compare: (a, b) => a.repair_status.localeCompare(b.repair_status),
            },
            filters: VEHICLE_REPAIR_STATUS.map(repair_status => (
                {text: normalizeEnumCase(repair_status), value: repair_status}
            )),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.repair_status === value,
        },
        {
            title: "Estimated Cost",
            key: "estimated_damage_cost",
            render: (record) => record.currency + record.estimated_damage_cost,
            // responsive: ["lg"],
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) => (
                <Space size="small">
                    <Tooltip title="View Damage">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => editDamage(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Damage">
                        <Button
                            type="primary"
                            style={{backgroundColor: editColor}}
                            icon={<EditOutlined />}
                            onClick={() => editDamage(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Vehicle"
                        description="Are you sure you want to delete this Damage?"
                        onConfirm={() => deleteVehicle(record)}
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
            <Table columns={damageTableColumns} dataSource={damages} rowKey="id" />

            <NewVehicleDamage
                open={editDamageModal}
                close={() => setEditDamageModal(false)}
                vehicleDamage={selectedDamage}
            />
        </Spin>
    )
}

export default AllDamages;