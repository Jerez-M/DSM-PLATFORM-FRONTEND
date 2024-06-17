import {useLoaderData} from "react-router-dom";
import {
    Alert,
    Divider,
    message,
    Select,
    Table,
    Button,
    Input,
    Space,
    FloatButton,
    Tooltip,
    Modal,
    Form,
    Tag
} from "antd";
import {useEffect, useRef, useState} from "react";
import { EyeOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import courseworkService from "../../../../services/coursework.service";
import courseworkMarksService from "../../../../services/coursework-marks.service";
import { capitaliseFirstLetters, handleJerryError, refreshPage } from "../../../../common";
import classroomService from "../../../../services/classroom.service";
import BackButton from "../../../../common/BackButton";


export async function adminMarkCourseworkLoader({params}) {
    try {
        const courseworkResponse = await courseworkService.getById(params?.id);
        const studentsCourseworkMarksResponse = await courseworkMarksService.getAllByCourseworkId(courseworkResponse?.data?.id)
        return {coursework: courseworkResponse?.data, studentsCourseworkMarks: studentsCourseworkMarksResponse?.data};
    } catch (e) {
        message.error("Error retrieving coursework marks, please check your network")
        return {coursework: []}
    }
}

const AdminMarkCoursework = () => {
    const {coursework, studentsCourseworkMarks} = useLoaderData();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentClassroom, setCurrentClassroom] = useState(null);
    const [students, setStudents] = useState(null);

    const [studentMarkModalState, setStudentMarkModalState] = useState(false);
    const [studentCourseworkMark, setStudentCourseworkMark] = useState([]);

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

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        }
    });

    const subjectClassStudentsTableColumns = [
        {
            title: 'Registration number',
            dataIndex: 'regnumber',
            key: 'regnumber',
            sorter: {
                compare: (a, b) => a.regnumber?.localeCompare(b.regnumber),
                multiple: 1
            },
            ...getColumnSearchProps('regnumber')
        },
        {
            title: 'First name',
            dataIndex: 'firstname',
            key: 'firstname',
            responsive: ['md', 'lg'],
            sorter: {
                compare: (a, b) => a.firstname?.localeCompare(b.firstname),
                multiple: 2
            },
            ...getColumnSearchProps('firstname')
        },
        {
            title: 'Last name',
            dataIndex: 'lastname',
            key: 'lastname',
            responsive: ['md', 'lg'],
            sorter: {
                multiple: 3,
                compare: (a, b) => a.lastname?.localeCompare(b.lastname),
            },
            defaultSortOrder: 'ascend',
            ...getColumnSearchProps('lastname')
        },
        {
            title: "Status",
            dataIndex: "",
            key: "status",
            align: "center",
            render: (record) => {
              const hasMarkUploaded = studentsCourseworkMarks.some(
                (mark) => mark.student?.id === record?.id
              );
        
              return hasMarkUploaded ? (
                <Tag color="green">Mark Uploaded</Tag>
              ) : (
                <Tag color="magenta">Mark Not Uploaded</Tag>
              );
            },
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title="View mark and comment">
                            <Button
                                type="primary"
                                icon={<EyeOutlined/>}
                                onClick={async () => {
                                    fetchStudentCourseworkMark(record);
                                    setStudentMarkModalState(true);
                                }}
                            />
                        </Tooltip>
                    </Space>
                )
            }
        }
    ]

    const fetchStudentCourseworkMark = async(record) => {
        const student_id = record?.id
        const coursework_id = coursework?.id
        try {
            const studentCourseworkMarkResponse = await courseworkMarksService.getByStudentIdAndCourseworkId(student_id, coursework_id)
            setStudentCourseworkMark(studentCourseworkMarkResponse?.data)
        } catch (error) {
            console.log("error occured: ", error)
        }
    }
    const $classes = coursework?.classrooms?.map(
        classroom => ({
            label: `${classroom?.level?.name} - ${classroom?.name}`,
            value: classroom?.id
        })
    )


    const handleSubmitResults = async () => {
        if (results.length === 0) {
            message.info('There is no information to upload.');
            return 0
        }

        const courseworkMarks = results.map(result => ({
            ...result,
            coursework: coursework?.id,
        }))

        setLoading(true);

        try {
            const response = await courseworkMarksService.bulkUploadMarks(courseworkMarks)

            if (response?.status === 201) {
                Array.from(document.querySelectorAll('.test')).forEach(
                    input => (input.value = "")
                );
                setResults([])
                setCurrentClassroom(null)
                message.success(response.data.message);
                refreshPage()
            }
        } catch (e) {
            handleJerryError(e);
        } finally {
            setLoading(false);
        }
    }

    const handleChangeClass = (value) => {
        Array.from(document.querySelectorAll('.test')).forEach(
            input => (input.value = "")
        );
        setResults([]);
        setCurrentClassroom(value);
    }

    const fetchStudents = async () => {
        if(currentClassroom) {
            const studentsResponse = await classroomService.getStudentsByClassroomId(currentClassroom)
            setStudents(studentsResponse?.data)
        }

        // fetchStudentCourseworkMark()
    }

    // useEffect( () => {
    //     if (coursework?.classrooms?.length === 1) {
    //         setCurrentClassroom(coursework?.classrooms[0].id)
    //     }
    // }, [])

    useEffect( () => {
        fetchStudents()
    }, [currentClassroom]);

    return (
        <>
            <BackButton />
            <div className=''>
                <h3>Mark {coursework?.title} for {capitaliseFirstLetters(coursework?.subject?.name)}</h3>
            </div>
            <Divider />

            <Table
                pagination={false}
                rowKey="id"
                title={
                    () => (
                        <div>
                            <Alert
                                message={
                                    `Please select the class for the marks you wish to enter below.
                                     (${capitaliseFirstLetters(coursework?.coursework_type?.name)} is out of ${coursework?.total_mark})`
                                }
                                type="info"
                                className='mb-3 py-3'
                                showIcon
                                closable
                            />

                            <Select
                                size="large"
                                options={$classes}
                                placeholder='Select the classroom'
                                onChange={handleChangeClass}
                            />
                        </div>
                    )
                }
                dataSource={students?.sort((a, b) => {
                    if (a.lastname > b.lastname) return 1;
                    if (a.lastname < b.lastname) return -1;
                    return 0;
                })}
                columns={subjectClassStudentsTableColumns}
                footer={
                    () => (
                        <Button
                            size={"large"}
                            type={"primary"}
                            onClick={handleSubmitResults}
                            loading={loading}
                            block
                        >
                            Save
                        </Button>
                    )
                }
            >
            </Table>

            {(students?.length > 9) && <FloatButton
                type="primary"
                className="blue-float-btn"
                style={{background: '#2ba5d2 !important'}}
                tooltip="save"
                icon={<SaveOutlined/>}
                onClick={handleSubmitResults}
            />}

            <Modal
                open={studentMarkModalState}
                onCancel={() => {
                    setStudentMarkModalState(false);
                }}
                cancelButtonProps={{
                    className: 'd-none'
                }}
                okButtonProps={{
                    className: 'd-none'
                }}
                destroyOnClose={true}
            >
                {studentCourseworkMark.length === 0 ? (
                        <Alert
                        message="No mark or comment uploaded, please upload mark and comment for this student."
                        type="info"
                        showIcon
                        />
                    ) : (
                    <Form layout="vertical">
                        <Form.Item label="Coursework">
                            <Input value={studentCourseworkMark[0]?.coursework?.title} />
                        </Form.Item>
                        <Form.Item label="Student Name">
                            <Input
                            value={`${studentCourseworkMark[0]?.student?.user?.firstName} ${studentCourseworkMark[0]?.student?.user?.lastName}`}
                            />
                        </Form.Item>
                        <Form.Item label="Scored mark">
                            <Input value={studentCourseworkMark[0]?.mark} />
                        </Form.Item>
                        <Form.Item label="Comment">
                            <Input.TextArea
                            size="large"
                            value={studentCourseworkMark[0]?.comment}
                            />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </>
    )
}

export default AdminMarkCoursework;