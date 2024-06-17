import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Alert, Button, message, Select, Space, Table, Tag, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import courseworkService from "../../../../services/coursework.service";
import authenticationService from "../../../../services/authentication.service";
import {
    toHumanDate,
    getColumnSearchProps,
} from "../../../../common";
import studentClassService from "../../../../services/student-class.service";
import schoolTermServices from "../../../../services/schoolTerm.services";

export async function allStudentCourseworkLoader() {
    try {
        const termsResponse = await schoolTermServices.getAllTermsByInstitution(authenticationService.getUserTenantId());
    
        let activeCurrentTermId;
        const activeTerm = termsResponse?.data.find((term) => term.is_active);
        if (activeTerm) {
            activeCurrentTermId = activeTerm?.id;
        } else {
            console.log("No active term found.");
        }
        return {
            termsReturned: termsResponse?.data,
            activeTermId: activeCurrentTermId,
        };
    } catch (e) {
        console.log(e);
        return { termsReturned: [], activeTermId: null };
    }

}
const AllStudentCourseworkPage = () => {
    const { termsReturned, activeTermId } = useLoaderData();
    const [coursework, setCoursework] = useState([]);
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const getCourseworkColor = (courseworkType) => {
        switch (courseworkType) {
            case "HOMEWORK":
                return "#3892ea";
            case "ASSIGNMENT":
                return "#3282ea";
            case "EXAM":
                return "#3893za";
            case "INCLASS TEST":
                return "#8898ea";
            case "CALA":
                return "#ABDFF1";
            case "LAB WORK":
                return "#37d9ab";
            case "PRESENTATION":
                return "#ea6d38";
            case "GROUP WORK":
                return "#4C4556";
            case "PROJECT":
                return "#E2495B";
            case "QUIZ":
                return "#872642";
            default:
                return "#ea389d";
        }
    };

    const courseworkTableColumns = [
        {
            title: "Type",
            dataIndex: ["coursework_type", "name"],
            key: "courseworkType",
            defaultSortOrder: "ascend",
            onFilter: (value, record) =>
                record.coursework_type.name
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            sorter: (a, b) =>
                a.coursework_type?.name?.localeCompare(b.coursework_type?.name),
            // ...getColumnSearchProps(["coursework_type"], searchInputType, handleSearch, handleReset),
            render: (name) => <Tag color={getCourseworkColor(name)}>{name}</Tag>,
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (dataIndex) => <strong>{dataIndex}</strong>,
            sorter: (a, b) => a.title?.localeCompare(b.title),
            ...getColumnSearchProps("title", searchInput, handleSearch, handleReset),
        },
        {
            title: "Subject",
            dataIndex: ["subject", "name"],
            key: "subject",
            defaultSortOrder: "ascend",
            sorter: (a, b) => a?.subject?.name?.localeCompare(b?.subject?.name),
            onFilter: (value, record) =>
                record.subject?.name
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            // ...getColumnSearchProps(["subject", "name"], searchInputSubject, searchInput, handleSearch, handleReset)
        },
        {
            title: "Classes",
            key: "classrooms",
            render: (record) => (
                <span>
                    {record?.classrooms?.map((classroom, index) => (
                        <span
                            key={index}
                        >{`[${classroom?.level?.name}-${classroom?.name}]`}</span>
                    ))}
                </span>
            ),
        },
        {
            title: "Subject teacher",
            key: "teacher",
            onFilter: (value, record) =>
                record.teacher?.user?.lastName
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            sorter: (a, b) =>
                a?.teacher?.lastName?.localeCompare(b?.teacher?.lastName),
            // ...getColumnSearchProps('teacher', searchInputTeacher, searchInput, handleSearch, handleReset),
            render: (record) => (
                <span>
                    {record?.teacher?.title} {record?.teacher?.user?.lastName}{" "}
                    {record?.teacher?.user?.firstName?.at(0)}.
                </span>
            ),
        },
        {
            title: "Due Date",
            key: "dueDate",
            sorter: (a, b) => {
                if (!a.due_date) return -1;
                if (!b.due_date) return -1;
                return new Date(a.due_date) - new Date(b.due_date);
            },
            defaultSortOrder: "ascend",
            render: (record) => (
                <span
                    className={
                        new Date(record.due_date)?.toDateString() ===
                            new Date().toDateString()
                            ? "text-warn"
                            : new Date(record.due_date) < new Date()
                                ? "text-danger"
                                : ""
                    }
                >
                    {toHumanDate(record.due_date)}
                </span>
            ),
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
                                navigate(`/student/coursework/view/${record.id}`);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        if (activeTermId) {
            fetchCourseworkByTermId(activeTermId);
        }
    }, [activeTermId]);

    const terms = termsReturned?.map(
        term => ({
            label: `${term?.name} ${term?.academicYear.name}`,
            value: term?.id
        })
    )

    const handleChangeTerm = (value) => {
        const term_id = value
        fetchCourseworkByTermId(term_id)
    }

    const fetchCourseworkByTermId = async(term_id) => {
        try {
            const studentClassResponse = await studentClassService.getStudentClassByStudentUserId(
                authenticationService.getUserId()
            );
            const classroom_id = studentClassResponse?.data?.classroom?.id;
            // const currentCoursework = await courseworkService.getAllByClassroomId(
            //     classroom_id
            // );
            const currentCoursework = await courseworkService.getAllByClassroomIdAndTermId(
                classroom_id, term_id
            );
            
             if (currentCoursework?.status === 200) {
                setCoursework(currentCoursework?.data)
             } else {
                message.error("No coursework found")
             }

        } catch (error) {
            message.error("No coursework found")
        }
    }

    return (
        <>
            <Table
                className="table-responsive print-margins"
                columns={courseworkTableColumns}
                dataSource={coursework}
                rowKey="id"
                title={
                    () => (
                        <div>
                            <Alert
                                message={
                                    `Please select the term for the coursework you wish to view.`
                                }
                                type="info"
                                className='mb-3 py-3'
                                showIcon
                                closable
                            />

                            <Select
                                size="large"
                                options={terms}
                                placeholder='Select the term'
                                onChange={handleChangeTerm}
                            />
                        </div>
                    )
                }
            />
        </>
    );
};
export default AllStudentCourseworkPage;
