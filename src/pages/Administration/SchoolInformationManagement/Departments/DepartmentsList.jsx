import {Button, Popconfirm, Space, Table, Tooltip} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import authenticationService from "../../../../services/authentication.service";
import departmentService from "../../../../services/department.service";
import EditDepartment from "./EditDepartment";
import {deleteColor, editColor} from "../../../../common";

const DepartmentsList = () => {
    const [departmentsList, setDepartmentsList ] = useState([]);
    const [selectedRecord, setSelectedRecord ] = useState(null);
    const [editDepartmentModalState, setEditDepartmentModalState] = useState(false);

    const tenantId = authenticationService.getUserTenantId();
  
    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getAllDepartments(tenantId)
  
        if (response.status === 200) {
          setDepartmentsList(response.data);
        } else {
          console.log("Request was not successful. Status:", response.status);
        }
      } catch (error) {
        console.error("Error occurred during fetching departments:", error);
      }
    };
  
    useEffect(() => {
        fetchDepartments();
    }, []);


    const departmentsTableColumns = [
        {
            title: 'Department ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Department name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (_, record) => (
              <Space size="middle">
                  <Tooltip title="Edit Department">
                      <Button
                          type="primary"
                          icon={<EditOutlined/>}
                          style={{ background: editColor }}
                          onClick={() => edit(record)}
                      />
                  </Tooltip>
                  <Tooltip title="Delete department">
                      <Popconfirm
                          title="Delete department"
                          description="Cannot delete department. this action will delete all subjects which belongs to this department?"
                          okText="OK"
                          cancelText="Cancel"
                      >
                          <Button
                              type="danger"
                              style={{color: deleteColor}}
                              icon={<DeleteOutlined/>}
                          />
                      </Popconfirm>
                  </Tooltip>
              </Space>
          ),
        }
    ]

    const edit = (record) => {
        setSelectedRecord(record)
        setEditDepartmentModalState(true)
    }

    return (
        <>
            <Table dataSource={departmentsList} columns={departmentsTableColumns} />
            <EditDepartment open={editDepartmentModalState} close={() => setEditDepartmentModalState(false)} record = {selectedRecord}/>

        </>
    )
}

export default DepartmentsList;