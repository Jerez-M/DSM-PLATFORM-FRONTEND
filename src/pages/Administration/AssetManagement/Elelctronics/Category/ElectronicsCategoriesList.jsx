import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {Button, message, Popconfirm, Space, Spin, Table, Tooltip} from "antd";
import {useEffect, useRef, useState} from "react";
import {
    deleteColor,
    editColor,
    getColumnSearchProps,
    handleSingleError,
    refreshPage
} from "../../../../../common";
import ElectronicsCategoryService from "../../../../../services/electronics-category.service";
import NewElectronicCategory from "./NewElectronicCategory";
import {useNavigate} from "react-router-dom";

const ElectronicsCategoriesList = () => {
    const [newCategory, setNewCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState(null)

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
            const response = await ElectronicsCategoryService.getAllByInstitution()
            setCategories(response.data);
        } catch (e) {
            setCategories([])
        } finally {
            setLoading(false)
        }
    }

    const editCategory = (category) => {
        setCategory(category)
        setNewCategory(true)
    }

    const deleteCategory = (category) => {
        setLoading(true);
        ElectronicsCategoryService.delete(category.id)
            .then((res) => {
                if (res.status === 204) {
                    message.success(`${category.name} Deleted successfully`);
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

    const categoriesTableColumns = [
        {
            title: "Name",
            dataIndex: "name",
            sorter: (a, b) => ( a.name?.localeCompare(b.name)),
            ...getColumnSearchProps('name', searchInput, handleSearch, handleReset),
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
                                    `/admin/electronics/find-electronics-by-category/${record.id}/`
                                );
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Category">
                        <Button
                            className="text-light border-0"
                            style={{ background: editColor }}
                            icon={<EditOutlined />}
                            onClick={() => editCategory(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Category">
                        <Popconfirm
                            title="Delete Category"
                            description="Are you sure you want to delete this category?"
                            onConfirm={() => deleteCategory(record)}
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
                <Table columns={categoriesTableColumns} dataSource={categories} />
            </Spin>

            <NewElectronicCategory
                open={newCategory}
                close={() => setNewCategory(false)}
                category={category}
            />
        </>
    );
}

export default ElectronicsCategoriesList;