import { Badge, Button, Divider, Popconfirm, Space, Table, Tag, Tooltip, message } from "antd";
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import EditAssetItem from "./EditAssetItems";
import NewAssetItem from "./NewAssetItem";
import generalAssetsServices from "../../../../../services/general-assets.services";
import { deleteColor, editColor } from "../../../../../common";

export const fetchAssetCategoryLoader = async ({ params }) => {
    const categoryId = params.id
    try {
        const response = await generalAssetsServices.getAssetCategory(categoryId);

        if (response.status === 200) {
            const assetCategoryLoaded = response.data
            console.log(assetCategoryLoaded)
            return { assetCategoryLoaded }
        } else {
            console.log("Request was not successful. Status:", response.status);
            return {
                assetCategoryLoaded: {}
            }
        }
    } catch (error) {
        console.error("Error occured during fetching asset items:", error);
        return {
            assetCategoryLoaded: {}
        }
    }
};

const AssetItemsList = () => {
    const [editAssetCategoryItemModalState, seteditAssetCategoryItemModalState] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [assetCategoryList, setAssetCategoryList] = useState([]);
    const [NewAssetItemModalState, setNewAssetItemModalState] = useState(false);
    const { id } = useParams()
    const { assetCategoryLoaded } = useLoaderData()
    const navigate = useNavigate();


    const categoryId = id

    const fetchAssetCategorys = async () => {
        try {
            const response = await generalAssetsServices.getAllAssetItems(categoryId);

            if (response.status === 200) {
                setAssetCategoryList(response.data);
            } else {
                console.log("Request was not successful. Status:", response.status);
            }
        } catch (error) {
            console.error("Error occured during fetching asset items:", error);
        }
    };

    useEffect(() => {
        fetchAssetCategorys();
    }, []);

    // console.clear()

    const assetCategorysTableColumns = [
        {
            title: "Asset Item ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Asset Category name",
            key: "name",
            dataIndex: ["category", "name"],
            render: (dataIndex) => (
                <strong>
                    {dataIndex}
                </strong>
            ),
            sorter: {
                compare: (a, b) => a.category.name.localeCompare(b.status),
                multiple: 3,
            },
        },
        {
            title: "Purchase date",
            dataIndex: "purchase_date",
            key: "purchase_date",
            sorter: {
                compare: (a, b) => a.purchase_date.localeCompare(b.purchase_date),
                multiple: 5,
            },
        },
        {
            title: "Asset No",
            dataIndex: "asset_no",
            key: "asset_no",
            render: (dataIndex) => (
                <strong>
                    {dataIndex}
                </strong>
            ),
            sorter: {
                compare: (a, b) => a.asset_no.localeCompare(b.asset_no),
                multiple: 4,
            },
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            sorter: {
                compare: (a, b) => a.price.localeCompare(b.price),
                multiple: 3,
            },
        },
        {
            title: "Serial Number",
            dataIndex: "serial_number",
            key: "serial_number",
            render: (dataIndex) => (
                <strong>
                    {dataIndex}
                </strong>
            ),
            sorter: {
                compare: (a, b) => a.serial_number.localeCompare(b.serial_number),
                multiple: 2,
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (dataIndex) => (
                dataIndex === 'WORKING' ? (
                    <Tag color="green"><strong>{dataIndex}</strong></Tag>
                ) : (
                <Tag color="geekblue"><strong>{dataIndex}</strong></Tag>
                )
            ),
            sorter: {
                compare: (a, b) => a.status.localeCompare(b.status),
                multiple: 1,
            },
            filters: [
                {text: 'WORKING', value: 'WORKING'},
                {text: 'DAMAGED', value: 'DAMAGED'},
                {text: 'DISCARDED', value: 'DISCARDED'},
                {text: 'INSTORE', value: 'STOLEN'},
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        // {
        //     title: "price",
        //     dataIndex: "price",
        //     key: "price",
        //     render: (value) => {
        //         if (value) {
        //             return <span className="badge rounded-pill text-bg-success">Active</span>
        //         } else {
        //             return <span className="badge rounded-pill text-bg-danger">Inactive</span>
        //         }
        //     }
        // },
        {
            title: "Action",
            dataIndex: "",
            key: "",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit AssetCategory">
                        <Button
                            className="text-light border-0"
                            style={{ background: editColor }}
                            icon={<EditOutlined />}
                            onClick={() => editAssetCategory(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Asset Item">
                        <Popconfirm
                            title="Delete Asset Item"
                            description="Are you sure you want to delete this asset Item?"
                            onConfirm={() => deleteThisAssetItem(record)}
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
            ),
        },
    ];

    const editAssetCategory = (record) => {
        setSelectedRecord(record)
        seteditAssetCategoryItemModalState(true)
    }

    const deleteThisAssetItem = async (record) => {
        try {
            console.log("record to delete is: ", record.id)
            const response = await generalAssetsServices.deleteAssetItem(record.id)

            if (response.status === 204) {
                message.info("Asset category deleted successifully")
                fetchAssetCategorys()
            } else {
                message.error("Asset category could not be deleted")
            }
        } catch (error) {
            message.error("Asset category could not be deleted")
        }
    }

    return (
        <>
            <div className="mb-1">
                <ArrowLeftOutlined
                    onClick={() => navigate('/admin/general-assets')}
                />
                Back
            </div>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>
                    Assets Items{' '}
                    <span style={{ fontWeight: 'bold' }}>
                        :[{assetCategoryLoaded?.name}]
                    </span>
                </h3>
                <Button
                    className='border-0 px-3 text-white'
                    style={{ background: '#39b54a' }}
                    onClick={() => setNewAssetItemModalState(true)}
                >
                    <Space>
                        Add new asset item
                        <PlusCircleOutlined />
                    </Space>
                </Button>

            </div>
            <Divider type={"horizontal"} />

            <Table dataSource={assetCategoryList} columns={assetCategorysTableColumns} />

            <NewAssetItem open={NewAssetItemModalState} close={() => setNewAssetItemModalState(false)} />
            <EditAssetItem open={editAssetCategoryItemModalState} close={() => seteditAssetCategoryItemModalState(false)} record={selectedRecord} />
        </>
    );
};

export default AssetItemsList;
