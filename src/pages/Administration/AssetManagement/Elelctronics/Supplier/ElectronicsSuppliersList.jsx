import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {Button, message, Popconfirm, Space, Spin, Table, Tooltip} from "antd";
import {useEffect, useRef, useState} from "react";
import AuthenticationService from "../../../../../services/authentication.service";
import ElectronicsSupplierService from "../../../../../services/electronics-supplier.service";
import NewElectronicSupplier from "./NewElectronicSupplier";
import {
    deleteColor,
    editColor,
    getColumnSearchProps,
    handleSingleError,
    refreshPage
} from "../../../../../common";
import {useNavigate} from "react-router-dom";

const ElectronicsSuppliersList = () => {
    const [newSupplier, setNewSupplier] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([])
    const [supplier, setSupplier] = useState(null)

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
            const response = await ElectronicsSupplierService.getAllByInstitution(AuthenticationService.getUserTenantId())
            setSuppliers(response.data);
        } catch (e) {
            setSuppliers([])
        } finally {
            setLoading(false)
        }
    }

    const editSupplier = (supplier) => {
        setSupplier(supplier)
        setNewSupplier(true)
    }

    const deleteSupplier = (supplier) => {
        setLoading(true);
        ElectronicsSupplierService.delete(supplier.id)
            .then((res) => {
                if (res.status === 204) {
                    message.success(`${supplier.supplier_name} Deleted successfully`);
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

    const suppliersTableColumns = [
        {
            title: "Name",
            dataIndex: "supplier_name",
            key: "supplier_name",
            sorter: (a, b) => ( a.supplier_name?.localeCompare(b.supplier_name)),
            ...getColumnSearchProps('supplier_name', searchInput, handleSearch, handleReset),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => ( a.email?.localeCompare(b.email)),
            ...getColumnSearchProps('email', searchInput, handleSearch, handleReset),
        },
        {
            title: "Phone Number",
            dataIndex: "contact",
            key: "contact",
            sorter: (a, b) => ( a.contact?.localeCompare(b.contact)),
            ...getColumnSearchProps('contact', searchInput, handleSearch, handleReset),
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            responsive: ['xl'],
            sorter: (a, b) => ( a.address?.localeCompare(b.address)),
            ...getColumnSearchProps('address', searchInput, handleSearch, handleReset),
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
                                    `/admin/electronics/find-electronics-by-supplier/${record.id}/`
                                );
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Supplier">
                        <Button
                            className="text-light border-0"
                            style={{ background: editColor }}
                            icon={<EditOutlined />}
                            onClick={() => editSupplier(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Supplier">
                        <Popconfirm
                            title="Delete Supplier"
                            description="Are you sure you want to delete this supplier?"
                            onConfirm={() => deleteSupplier(record)}
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
            <Spin spinning={loading} size="large" fullscreen="true" >
                <Table columns={suppliersTableColumns} dataSource={suppliers} />
            </Spin>

            <NewElectronicSupplier
                open={newSupplier}
                close={() => setNewSupplier(false)}
                supplier={supplier}
            />
        </>
    );
}

export default ElectronicsSuppliersList;