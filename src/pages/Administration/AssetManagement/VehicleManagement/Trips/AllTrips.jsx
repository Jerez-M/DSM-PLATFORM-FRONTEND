import {Button, message, Popconfirm, Space, Spin, Table, Tooltip} from "antd";
import {
    getColumnSearchProps,
    handleError,
    normalizeEnumCase,
    refreshPage, toDuration,
    toHumanDateTime
} from "../../../../../common";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import AuthenticationService from "../../../../../services/authentication.service";
import TripService from "../../../../../services/trip.service";
import {useEffect, useRef, useState} from "react";
import EditTrip from "./EditTrip";
import TRIP_PURPOSE from "../../../../../utils/trip-purpose";

const AllTrips = () => {
    const [trips, setTrips] = useState([])
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [editTripModal, setEditTripModal] = useState(false)
    const [selectedTrip, setSelectedTrip] = useState(null)

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
            const response = await TripService.getAllByInstitution(AuthenticationService.getUserTenantId());
            setTrips(response.data);
        } catch (e) {
            setTrips([])
        } finally {
            setLoading(false)
        }
    }

    const editTrip = (record) => {
        setSelectedTrip(record)
        setEditTripModal(true)
    }

    const closeEditTripModal = () => {
        setSelectedTrip(null)
        setEditTripModal(false)
    }

    const deleteTrip = (trip) => {
        TripService.delete(trip.id)
            .then((res) => {
                if (res.status === 204) {
                    message.success("Trip Deleted");
                    refreshPage();
                }
            })
            .catch((e) => {
                handleError(e);
            });
    }

    const tripTableColumns = [
        {
            title: "Vehicle Name",
            dataIndex: ["vehicle", "name"],
            key: "vehicleName",
            sorter: (a, b) => ( a.vehicle?.name?.localeCompare(b.vehicle?.name)),
        },
        {
            title: "Vehicle",
            key: "vehicle",
            responsive: ["xl"],
            sorter: (a, b) => ( a.vehicle?.manufacturer?.localeCompare(b.vehicle?.manufacturer)),
            render: ({vehicle}) => (
                <Link to={`/admin/vehicles/${vehicle.id}`}>
                    {`${vehicle?.manufacturer} ${vehicle?.make} ${vehicle?.model} (${vehicle?.numberplate})`}
                </Link>
            ),
        },
        {
            title: "Destination",
            dataIndex: "destination",
            key: "destination",
            sorter: {
                compare: (a, b) => a.destination.localeCompare(b.destination),
            },
            ...getColumnSearchProps('destination', searchInput, handleSearch, handleReset)
        },
        {
            title: "Return Date",
            key: "returnDate",
            sorter: (a, b) => {
                if (!a.return_date) return -1;
                if (!b.return_date) return -1;
                return new Date(a.return_date) - new Date(b.return_date)
            },
            render: (record) => `${toHumanDateTime(record?.return_date)}`,
            defaultSortOrder: 'descend',
        },
        {
            title: "Trip Duration",
            key: "duration",
            sorter: (a, b) => {
                const durationA = new Date(a.return_date) - new Date(a.start_date)
                const durationB = new Date(b.return_date) - new Date(b.start_date)
                return durationA - durationB
            },
            render: (record) => {
                if(!record.return_date) return <span className="text-danger">Not Returned</span>
                return `${toDuration(new Date(record.start_date), new Date(record.return_date))}`
            },
            responsive: ["lg"],
        },
        {
            title: "Type",
            dataIndex: "trip_type",
            key: "trip_type",
            sorter: {
                compare: (a, b) => a.trip_type.localeCompare(b.trip_type),
            },
            filters: TRIP_PURPOSE.map(trip_type => (
                {text: normalizeEnumCase(trip_type), value: trip_type}
            )),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.trip_type === value,
        },
        {
            title: "Driver",
            key: "driver",
            render: (record) => `${record.driver?.firstName} ${record.driver?.lastName}`
        },
        {
            title: "Distance traveled (Km)",
            key: "distance",
            sorter: (a, b) => {
                const millageA = a.millage_at_finish - a.millage_at_start
                const millageB = b.millage_at_finish - b.millage_at_start
                return millageA - millageB
            },
            render: (record) => {
                if (!record.millage_at_finish) {
                    return <span className="text-danger">Not Returned</span>
                } else {
                    return `${record.millage_at_finish - record.millage_at_start}`
                }
            }
        },
        {
            title: "Fuel Used (L)",
            dataIndex: "fuel_used",
            key: "fuel_used",
            sorter: (a, b) => {
                return a.fuel_used - b.fuel_used
            },
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
                            onClick={() => editTrip(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Trip">
                        <Button
                            type="primary"
                            style={{ background: "#FAAD14" }}
                            icon={<EditOutlined />}
                            onClick={() => editTrip(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Trip">
                        <Popconfirm
                            title="Delete Trip"
                            description="Are you sure you want to delete this trip?"
                            onConfirm={() => deleteTrip(record)}
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
                <Table columns={tripTableColumns} dataSource={trips} rowKey="id" />
            </Spin>

            <EditTrip
                open={editTripModal}
                close={closeEditTripModal}
                trip={selectedTrip}
            />
        </>
    )
}

export default AllTrips;