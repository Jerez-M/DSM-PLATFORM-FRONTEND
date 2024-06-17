import {Button, Popconfirm, Space, Table, Tooltip, message} from "antd";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import authenticationService from "../../../../services/authentication.service";
import levelService from "../../../../services/level.service";
import EditLevel from "./EditLevel";
import {deleteColor, editColor} from "../../../../common";

const LevelsList = () => {
    const [levels, setLevels] = useState([]);
    const [selectedRecord, setSelectedRecord ] = useState(null);
    const [editLevelModalState, setEditLevelModalState] = useState(false);

    const id = authenticationService.getUserTenantId();
  
    const fetchLevels = async () => {
      try {
        const response = await levelService.getAll(id)
  
        if (response.status === 200) {
          setLevels(response.data);
        } else {
          console.log("Request was not successful. Status:", response.status);
        }
      } catch (error) {
        console.error("Error occured during fetching levels:", error);
      }
    };
  
    useEffect(() => {
      fetchLevels();
    }, []);

    
    const levelsTableColumns = [
        {
            title: 'Level ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Level name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (_, record) => (
              <Space size="middle">
                  <Tooltip title="Edit Level">
                      <Button
                          type="primary"
                          icon={<EditOutlined/>}
                          style={{ background: editColor }}
                          onClick={() => edit(record)}
                      />
                  </Tooltip>
                  <Tooltip title="Delete Level">
                      <Popconfirm
                          title="Delete Level"
                          description="Cannot delete level.?"
                          // onConfirm={() => deleteSubjectAllocation(record.id)}
                          okText="Yes"
                          cancelText="No"
                      >
                          <Button
                              type="danger"
                              style={{ color: deleteColor }}
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
      setEditLevelModalState(true)
    }

    return (
        <>
            <Table dataSource={levels} columns={levelsTableColumns} />
            <EditLevel open={editLevelModalState} close={() => setEditLevelModalState(false)} record = {selectedRecord}/>

        </>
        
    )
}

export default LevelsList;