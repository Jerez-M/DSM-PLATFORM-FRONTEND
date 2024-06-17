import {Button, message, Popconfirm, Space, Spin, Table, Tooltip} from "antd";
import {
    deleteColor,
    editColor,
    getColumnSearchProps,
    handleError,
    normalizeEnumCase,
    refreshPage,
    toHumanDate
} from "../../../../../common";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import AuthenticationService from "../../../../../services/authentication.service";
import {useEffect, useRef, useState} from "react";
import VehicleServiceService from "../../../../../services/vehicle-service.service";
import NewVehicleService from "./NewVehicleService";
import {VEHICLE_SERVICE_TYPE} from "../../../../../utils/vehicle-service";

const AllServices = () => {
    const [services, setServices] = useState([])
    const [editVehicleService, setEditVehicleService] = useState(false)
    const [selectedVehicleService, setSelectedVehicleService] = useState(null)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await VehicleServiceService.getAllByInstitution(AuthenticationService.getUserTenantId());
            setServices(response.data);
        } catch (e) {
            setServices([])
        } finally {
            setLoading(false)
        }
    }

    const editService = (service) => {
        setSelectedVehicleService(service)
        setEditVehicleService(true)
    }


    const deleteService = (service) => {
        VehicleServiceService.delete(service.id)
            .then((res) => {
                if (res.status === 204) {
                    message.success("Vehicle service Deleted");
                    refreshPage();
                }
            })
            .catch((e) => {
                handleError(e);
            });
    };

    const serviceTableColumns = [
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
            title: "Service Provider",
            dataIndex: "service_provider",
            key: "service_provider",
            sorter: {
                compare: (a, b) => a.service_provider.localeCompare(b.service_provider),
            },
            ...getColumnSearchProps('service_provider', searchInput, handleSearch, handleReset)
        },
        {
            title: "Date of Service",
            key: "dateOfService",
            render: (record) => `${toHumanDate(record?.date_of_service)}`,
            sorter: (a, b) => new Date(a.date_of_service) - new Date(b.date_of_service),
            defaultSortOrder: 'ascend',
        },
        {
            title: "Type",
            dataIndex: "service_type",
            key: "service_type",
            sorter: {
                compare: (a, b) => a.service_type.localeCompare(b.service_type),
            },
            filters: VEHICLE_SERVICE_TYPE.map(service_type => (
                {text: normalizeEnumCase(service_type), value: service_type}
            )),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.trip_type === value,
        },
        {
            title: "Millage (Km)",
            dataIndex: "millage",
            key: "millage",
            sorter: (a, b) => a.millage.localeCompare(b.millage),
            ...getColumnSearchProps('millage', searchInput, handleSearch, handleReset)
        },
        {
            title: "Cost",
            key: "cost",
            render: (record) => record.currency + record.cost,
            sorter: {
                compare: (a, b) => a.cost.localeCompare(b.cost),
            },
            ...getColumnSearchProps('cost', searchInput, handleSearch, handleReset)
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) => (
                <Space size="small">
                    <Tooltip title="View Service">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => editService(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Service">
                        <Button
                            type="primary"
                            style={{backgroundColor: editColor}}
                            icon={<EditOutlined />}
                            onClick={() => editService(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Vehicle"
                        description="Are you sure you want to delete this service?"
                        onConfirm={() => deleteService(record)}
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
            <Table columns={serviceTableColumns} dataSource={services} rowKey="id" />


            <NewVehicleService
                open={editVehicleService}
                close={() => setEditVehicleService(false)}
                vehicleService={selectedVehicleService}
            />
        </Spin>
    )
}

export default AllServices;