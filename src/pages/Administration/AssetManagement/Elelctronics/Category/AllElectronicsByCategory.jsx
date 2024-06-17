import {
    ArrowLeftOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {Button, Divider, message, Popconfirm, Space, Spin, Table, Tooltip} from "antd";
import {useEffect, useRef, useState} from "react";
import {
    deleteColor,
    editColor,
    getColumnSearchProps,
    getColumnSearchPropsNoFilter,
    handleSingleError,
    normalizeEnumCase,
    refreshPage,
    toHumanDate
} from "../../../../../common";
import ElectronicsService from "../../../../../services/electronics.service";
import NewElectronicGadget from "./../NewElectronicGadget";
import {ELECTRONIC_DEVICE_STATUS} from "../../../../../utils/electronics";
import ElectronicsCategoryService from "../../../../../services/electronics-category.service";


export const allElectronicsByCategoryLoader = async ({params}) => {
    try {
        const categoryResponse = await ElectronicsCategoryService.getById(params.id)
        return {category: categoryResponse.data}
    } catch (e) {
        console.log(e)
        return null
    }
}


const AllElectronicsByCategory = () => {
    const [newElectronic, setNewElectronic] = useState(false);
    const [loading, setLoading] = useState(false);
    const [electronics, setElectronics] = useState([])
    const [gadget, setGadget] = useState(null)

    const navigate = useNavigate();
    const { category } = useLoaderData();

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
        if(category?.id) {
            fetchData()
        }
    }, [category]);

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await ElectronicsService.getAllByCategory(category?.id)
            setElectronics(response.data);
        } catch (e) {
            setElectronics([])
        } finally {
            setLoading(false)
        }
    }

    const editGadget = (gadget) => {
        setGadget(gadget)
        setNewElectronic(true)
    }

    const deleteGadget = (gadget) => {
        setLoading(true);
        ElectronicsService.delete(gadget.id)
            .then((res) => {
                if (res.status === 204) {
                    message.success(`${gadget.name} Deleted successfully`);
                    refreshPage();
                }
            })
            .catch((e) => {
                handleSingleError(e);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const electronicsTableColumns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => ( a.name?.localeCompare(b.name)),
            ...getColumnSearchProps('name', searchInput, handleSearch, handleReset)
        },
        {
            title: "Type",
            dataIndex: ["type", "name"],
            key: "type",
            sorter: (a, b) => ( a.type?.name?.localeCompare(b.type?.name)),
            onFilter: (value, record) =>
                record.type?.name
                    .toString()
                    .toLowerCase()
                    .includes((value).toLowerCase()),
            ...getColumnSearchPropsNoFilter('type', searchInput, handleSearch, handleReset),
        },
        {
            title: "Serial Number",
            dataIndex: "serial_number",
            key: "serial_number",
            sorter: (a, b) => ( a.serial_number?.localeCompare(b.serial_number)),
            ...getColumnSearchProps('serial_number', searchInput, handleSearch, handleReset)
        },
        {
            title: "Purchase Date",
            key: "purchase_date",
            render: (record) => `${toHumanDate(record.purchase_date)}`,
            sorter: (a, b) => new Date(a.purchase_date) - new Date(b.purchase_date),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => ( a.status?.localeCompare(b.status)),
            filters: ELECTRONIC_DEVICE_STATUS.map(status => (
                {text: normalizeEnumCase(status), value: status}
            )),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            responsive: ['xxl'],
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
                                    `/admin/electronics/${record.id}/`
                                );
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Gadget">
                        <Button
                            className="text-light border-0"
                            style={{ background: editColor }}
                            icon={<EditOutlined />}
                            onClick={() => editGadget(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Gadget">
                        <Popconfirm
                            title="Delete Gadget"
                            description="Are you sure you want to delete this gadget?"
                            onConfirm={() => deleteGadget(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="danger"
                                style={{ color: deleteColor }}
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
            <Link to={'..'}
                  onClick={(e) => {
                      e.preventDefault();
                      navigate(-1);
                  }}
                  className='text-muted text-decoration-none mb-2'
            >
                <ArrowLeftOutlined /> Back
            </Link>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>
                    Electronic Gadget Items{' '}
                    <span style={{ fontWeight: 'bold' }}>
                        :[{category?.name}]
                    </span>
                </h3>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => editGadget({type: category?.id})}
                >
                    Add new gadget
                </Button>

            </div>

            <Divider type={"horizontal"} />

            <Spin spinning={loading} size="large" fullscreen="true" >
                <Table columns={electronicsTableColumns} dataSource={electronics} />
            </Spin>

            <NewElectronicGadget
                open={newElectronic}
                close={() => setNewElectronic(false)}
                gadget={gadget}
            />
        </>
    );
}

export default AllElectronicsByCategory;