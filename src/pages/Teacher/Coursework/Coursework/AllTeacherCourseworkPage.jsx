import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
    Alert,
    Button,
    message,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
} from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import courseworkService from "../../../../services/coursework.service";
import authenticationService from "../../../../services/authentication.service";
import {
    deleteColor,
    editColor,
    handleError,
    refreshPage,
    toHumanDate,
    getColumnSearchProps,
} from "../../../../common";
import schoolTermServices from "../../../../services/schoolTerm.services";

export async function allTeacherCourseworkLoader() {
    try {
        // const termsResponse = await schoolTermServices.getTermsInActiveAcademicYearByInstitutionId(authenticationService.getUserTenantId());
        const termsResponse = await schoolTermServices.getAllTermsByInstitution(
            authenticationService.getUserTenantId()
        );

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
const AllTeacherCourseworkPage = () => {
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

    const editBook = (coursework) => {
        navigate(`/teacher/coursework/edit/${coursework.id}`);
    };

    const deleteCoursework = (record) => {
        courseworkService
            .delete(record.id)
            .then((res) => {
                if (res.status === 204) {
                    message.success(`Coursework Deleted successfully`);
                    refreshPage();
                }
            })
            .catch((e) => {
                handleError(e);
            });
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
                                navigate(`/teacher/coursework/view/${record.id}`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Coursework">
                        <Button
                            className="text-light border-0"
                            style={{ background: editColor }}
                            icon={<EditOutlined />}
                            onClick={() => editBook(record)}
                        />
                    </Tooltip>
                    {(authenticationService.getUserRole() === "ADMIN" ||
                        authenticationService.getUserRole() === "TEACHER") && (
                            <Tooltip title="Delete Coursework">
                                <Popconfirm
                                    title="Delete Coursework"
                                    description="Are you sure you want to delete this coursework?"
                                    onConfirm={() => deleteCoursework(record)}
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
                        )}
                </Space>
            ),
        },
    ];

    useEffect(() => {
        if (activeTermId) {
            fetchCourseworkByTermId(activeTermId);
        }
    }, [activeTermId]);

    const terms = termsReturned?.map((term) => ({
        label: `${term?.name} ${term?.academicYear.name}`,
        value: term?.id,
    }));

    const handleChangeTerm = (value) => {
        const term_id = value;
        fetchCourseworkByTermId(term_id);
    };

    const fetchCourseworkByTermId = async (term_id) => {
        try {
            const user_id = authenticationService.getUserId();

            const currentCoursework = await courseworkService.getAllByUserIdAndTermId(
                user_id,
                term_id
            );
            // const currentCoursework = await courseworkService.getAllByUserId(user_id)

            if (currentCoursework?.status === 200) {
                setCoursework(currentCoursework?.data);
            } else {
                message.error("No coursework found");
            }
        } catch (error) {
            message.error("No coursework found");
        }
    };

    return (
        <>
            <Table
                title={() => (
                    <div>
                        <Alert
                            message={`Please select the term for the coursework you wish to view.`}
                            type="info"
                            className="mb-3 py-3"
                            showIcon
                            closable
                        />

                        <Select
                            size="large"
                            options={terms}
                            placeholder="Select the term"
                            onChange={handleChangeTerm}
                        />
                    </div>
                )}
                className="table-responsive"
                columns={courseworkTableColumns}
                dataSource={coursework}
                rowKey="id"
            />
        </>
    );
};
export default AllTeacherCourseworkPage;
