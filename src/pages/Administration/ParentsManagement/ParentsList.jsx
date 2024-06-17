import { Button, Divider, Space, Table, Tooltip } from "antd";
import { useLoaderData, useNavigate } from "react-router-dom";
import { EyeOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import parentService from "../../../services/parent.service";
import authenticationService from "../../../services/authentication.service";
import { getColumnSearchProps } from "../../../common";
import SchoolStatistics from "../Dashboard/SchoolStatistics";

export async function parentListLoader() {
    try {
      const tenantId = authenticationService.getUserTenantId();
      const response = await parentService.getParentByInstitutionId(tenantId);
      const totalParentsResponse = await parentService.getTotalParentsByInstitutionId(tenantId);
      let parents = [];
      let totalParents = null;
  
      if (response?.status === 200) {
        parents = response?.data;
      }
      if (totalParentsResponse?.status === 200) {
        totalParents = totalParentsResponse?.data;
      }
  
      return { parents, totalParents };
    } catch (e) {
      return { parents: [], totalParents: null};
    }
  }

const ParentList = () => {
    const navigate = useNavigate();
    const { parents, totalParents } = useLoaderData();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const _parents = parents.map(
        (parent, key) => ({
            parentId: parent?.id,
            registrationNumber: parent?.user?.username,
            cellNumber: parent?.user?.phoneNumber,
            firstname: parent?.user?.firstName,
            middlename: parent?.user?.middleNames,
            lastname: parent?.user?.lastName,
            gender: parent?.user?.gender,
            parentType: parent?.parentType,
            key: key + 1
        })
    )

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const parentsTableColumns = [
        {
            title: 'Parent number',
            dataIndex: 'registrationNumber',
            key: 'registrationNumber',
            sorter: {
                compare: (a, b) => a.registrationNumber.localeCompare(b.registrationNumber),
                multiple: 2
            },
            ...getColumnSearchProps('registrationNumber', searchInput, handleSearch, handleReset)
        },
        {
            title: 'First name',
            dataIndex: 'firstname',
            key: 'firstname',
            defaultSortOrder: 'ascend',
            sorter: {
                compare: (a, b) => a.firstname?.localeCompare(b.firstname),
                multiple: 3
            },
            ...getColumnSearchProps('firstname', searchInput, handleSearch, handleReset)
        },
        {
            title: 'Last name',
            dataIndex: 'lastname',
            key: 'lastname',
            defaultSortOrder: 'ascend',
            sorter: {
                compare: (a, b) => a.lastname?.localeCompare(b.lastname),
                multiple: 4
            },
            ...getColumnSearchProps('lastname', searchInput, handleSearch, handleReset)
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            filters: [
                {
                    text: 'MALE',
                    value: 'MALE',
                },
                {
                    text: 'FEMALE',
                    value: 'FEMALE',
                },
            ],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.gender.startsWith(value),
            sorter: {
                compare: (a, b) => a.gender?.localeCompare(b.gender),
                multiple: 5
            },
        },
        {
            title: 'Parent type',
            dataIndex: 'parentType',
            key: 'parentType',
            sorter: {
                compare: (a, b) => a.parentType?.localeCompare(b.parentType),
                multiple: 6
            },
        },
        {
            title: 'Parent cell number',
            dataIndex: 'cellNumber',
            key: 'cellNumber',
            sorter: {
                compare: (a, b) => a.cellNumber.localeCompare(b.cellNumber),
                multiple: 7
            },
            ...getColumnSearchProps('cellNumber', searchInput, handleSearch, handleReset)
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View Children">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/admin/parents/${record?.parentId}`)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ]

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>All Parents</h3>
                <Button
                    icon={<PlusOutlined />}
                    className='border-0 text-light'
                    style={{ background: '#39b54a' }}
                    onClick={() => navigate('/admin/new-parent')}
                >
                    Register new Parent
                </Button>
            </div>
            <Divider className='my-3' type={"horizontal"} />

            <div className="container-fluid p-0">
                <div className="row gy-3 mb-3">
                    <div className="col-md-4">
                        <SchoolStatistics
                            name="Total Parents Available"
                            value={totalParents.total_Parents}
                            icon={<TeamOutlined style={{ fontSize: 40, color: "#1b5dd9" }} />}
                        />
                    </div>
                </div>
            </div>
            <Divider className='my-3' type={"horizontal"} />
            <Table className="table-responsive"
                dataSource={_parents}
                columns={parentsTableColumns}
            />
        </>
    )
}

export default ParentList;