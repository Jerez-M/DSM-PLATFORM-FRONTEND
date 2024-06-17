// @ts-ignore
import React, { useState } from 'react';
import { Button, Divider, Form, Input, InputNumber, Popconfirm, Space, Table, Tooltip, Typography, message } from 'antd';
import EndTermPaperService from "../../../services/end-term-paper.service";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import {ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import endTermPaperService from '../../../services/end-term-paper.service';
import AddPaperModal from "./AddPaper";

interface Item {
    key: string;
    name: string;
    totalMark: number;
    weight: number;
}


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export async function examinationPapersListLoader({ params }) {
    try {
        const response = await EndTermPaperService.getAllByEndTermExam(params.id);
        if (response?.status === 200) {
            const endTermPapers = response.data;
            return { endTermPapers };
        }
    } catch (e) {
        return []
    }
}

const EndTermPapersList: React.FC = () => {
    // @ts-ignore
    const { endTermPapers } = useLoaderData();
    const [form] = Form.useForm();
    const [data, setData] = useState(endTermPapers);
    const [editingKey, setEditingKey] = useState('');
    const [addPaperDialog, setAddPaperDialog] = useState(false)
    const navigate = useNavigate();
    const { name, id } = useParams()

    const _endTermPapers = endTermPapers.map(
        (i, key) => ({
            key: i?.id,
            ...i
        })
    )

    const isEditing = (record: Item) => record.key === editingKey;

    const edit = (record: Partial<Item> & { key: React.Key }) => {
        form.setFieldsValue({ name: '', totalMark: '', weight: '', ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as Item;

            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                try {
                    await EndTermPaperService.update(editingKey, row)
                    window.location.reload();
                } catch (e) {

                }
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const papersTableColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            editable: false,
        },
        {
            title: 'Maximum mark',
            dataIndex: 'totalMark',
            key: 'totalMark',
            editable: true,
        },
        {
            title: 'Weight',
            dataIndex: 'weight',
            key: 'weight',
            editable: true,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_: any, record: Item) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Space size={'middle'}>
                        
                        <Tooltip title="Edit Exam Paper">
                        <Button
                            type="primary"
                            icon={<EditOutlined/>}
                            disabled={editingKey !== ''} 
                            onClick={() => edit(record)}
                        />
                        </Tooltip>

                        {' '}

                        <Tooltip title="Delete Exam Paper">
                        <Popconfirm
                            title="Delete paper"
                            description="Are you sure you want to delete this paper?"
                            onConfirm={() => deletePaper(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                className='ms-2 btn btn-danger'
                                icon={<DeleteOutlined/>}
                            />
                        </Popconfirm>
                    </Tooltip>
                    </Space>
                );
            },
        },
    ]

    const deletePaper = async(record) => {
        try {
            const response = await endTermPaperService.delete(record?.id)
            if (response?.status === 200) {
                window.location.reload()
                message.info(response?.data?.message)
            } else {
                message.error("Failed to delete exam paper")
            }
        } catch (error) {
            message.error("Failed to delete exam paper")
        }
    }

    const mergedColumns = papersTableColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: col.dataIndex === 'totalMark' || 'weight' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            <div>
                <ArrowLeftOutlined
                    onClick={() => navigate('/admin/examinations')}
                />
            </div>
            <div className="d-flex justify-content-between align-items-center">
                <h3 className='mb-3'>{name}</h3>
                <Button
                    onClick={() => setAddPaperDialog(true)}
                    icon={<PlusOutlined />}
                    type="primary"
                    size={'large'}
                >
                    Add Paper
                </Button>
            </div>
            <Divider type={"horizontal"} />
            <h3 className='mb-3'>Papers/components</h3>

            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    className='table-responsive'
                    bordered
                    dataSource={_endTermPapers}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                    }}
                />
            </Form>

            <AddPaperModal
            // @ts-ignore
                open={addPaperDialog}
                close={() => setAddPaperDialog(false)}
                examId={id}
            />

        </>
    );
};

export default EndTermPapersList;