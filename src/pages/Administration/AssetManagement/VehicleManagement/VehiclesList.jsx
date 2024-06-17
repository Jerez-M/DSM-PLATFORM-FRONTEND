import {Button, message, Popconfirm, Space, Spin, Table, Tag, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import VehicleService from "../../../../services/vehicle.service";
import AuthenticationService from "../../../../services/authentication.service";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import NewVehicle from "./NewVehicle";
import bus from "../../../../Assets/images/vehicles/bus.svg";
import car from "../../../../Assets/images/vehicles/car.svg";
import carOther from "../../../../Assets/images/vehicles/car-other.svg";
import truck from "../../../../Assets/images/vehicles/truck.svg";
import tractor from "../../../../Assets/images/vehicles/tractor.svg";
import {
    getColumnSearchProps,
    handleError,
    normalizeEnumCase,
    refreshPage
} from "../../../../common";
import VEHICLE_AVAILABILITY from "../../../../utils/vehicle-availability";
import VEHICLE_TYPE from "../../../../utils/vehicle-type";

const VehiclesList = () => {
    const [newVehicleModal, setNewVehicleModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [loading, setLoading] = useState(false)

    const [vehicles, setVehicles] = useState([]);
    const navigate = useNavigate();

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
            const response = await VehicleService.getAllByInstitution(AuthenticationService.getUserTenantId());
            setVehicles(response.data);
        } catch (e) {
            setVehicles([])
        } finally {
            setLoading(false)
        }
    }

    const closeNewVehicleModal = () => {
        setNewVehicleModal(false);
        setSelectedVehicle(null);
    }

    const editVehicle = (vehicle) => {
        setSelectedVehicle(vehicle);
        setNewVehicleModal(true);
    };

    const deleteVehicle = (vehicle) => {
        setSelectedVehicle(vehicle);
        VehicleService.delete(vehicle.id)
            .then((res) => {
                if (res.status === 204) {
                    message.success("Vehicle Deleted");
                    refreshPage();
                }
            })
            .catch((e) => {
                handleError(e);
            });
    };


    const vehicleTableColumns = [
        {
            title: "Type",
            key: "type",
            render: ({type}) => {
                let src;
                switch (type) {
                    case "BUS":
                        src = bus;
                        break;
                    case "CAR":
                        src = car;
                        break;
                    case "TRUCK":
                        src = truck;
                        break;
                    case "TRACTOR":
                        src = tractor;
                        break;
                    default:
                        src = carOther;
                }
                return <>
                    <img height={50} src={src} alt="placeholder"/>
                    <span>{"  "}{type}</span>
                </>;
            },
            sorter: {
                compare: (a, b) => a.type.localeCompare(b.type),
            },
            defaultSortOrder: 'ascend',
            filters: VEHICLE_TYPE.map(type => (
                {text: normalizeEnumCase(type), value: type}
            )),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.type === value,
        },
        {
            title: "Color",
            key: "color",
            render: ({color}) => {
                return <Tag>
                    {color}
                </Tag>
            },
            sorter: {
                compare: (a, b) => a.color.localeCompare(b.color),
            },
            ...getColumnSearchProps('color', searchInput, handleSearch, handleReset)
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: {
                compare: (a, b) => a.name.localeCompare(b.name),
            },
            ...getColumnSearchProps('name', searchInput, handleSearch, handleReset)
        },
        {
            title: "Number Plate",
            dataIndex: "numberplate",
            key: "numberplate",
            sorter: {
                compare: (a, b) => a.numberplate.localeCompare(b.numberplate),
            },
            ...getColumnSearchProps('numberplate', searchInput, handleSearch, handleReset)
        },
        {
            title: "Model",
            key: "model",
            render: (record) => (
                <strong>
                    {record.manufacturer} {record.model}
                </strong>
            ),
            defaultSortOrder: 'ascend',
            sorter: {
                compare: (a, b) => a.manufacturer.localeCompare(b.manufacturer),
            },
            ...getColumnSearchProps('manufacturer', searchInput, handleSearch, handleReset)
        },
        {
            title: "Availability",
            key: "availability",
            render: ({availability}) => {
                let color = "green"
                if (availability === "UNAVAILABLE") {
                    color = "red"
                } else if (availability === "ON_TRIP") {
                    color = "orange"
                } else if (availability === "DAMAGED") {
                    color = "red"
                }

                return <Tag color={color}>
                    {availability}
                </Tag>
            },
            sorter: {
                compare: (a, b) => a.availability.localeCompare(b.availability),
            },
            filters: VEHICLE_AVAILABILITY.map(availability => (
                {text: normalizeEnumCase(availability), value: availability}
            )),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.availability.startsWith(value),
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) => (
                <Space size="small">
                    <Tooltip title="More details">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                navigate(
                                    `/admin/vehicles/${record.id}/`
                                );
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Vehicle">
                        <Button
                            className="text-light border-0"
                            style={{ background: "#FAAD14" }}
                            icon={<EditOutlined />}
                            onClick={() => editVehicle(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Vehicle">
                        <Popconfirm
                            title="Delete Vehicle"
                            description="Are you sure you want to delete this vehicle?"
                            onConfirm={() => deleteVehicle(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="danger"
                                style={{ color: "#d22323" }}
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
        }
    ]

    return (
        <>
            <Spin spinning={loading} size="large" fullscreen="true" >
                <Table columns={vehicleTableColumns} dataSource={vehicles} rowKey="id" />
            </Spin>

            <NewVehicle
                open={newVehicleModal}
                close={closeNewVehicleModal}
                vehicle={selectedVehicle}
            />
        </>
    )
}

export default VehiclesList;