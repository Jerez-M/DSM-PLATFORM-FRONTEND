import EndTermExamService from "../../../services/end-term-exam.service";
import {useLoaderData} from "react-router-dom";
import {
    Alert,
    Divider,
    message,
    Select,
    Table,
    Button,
    Form,
    Input,
    Space,
    Tooltip,
    Modal,
    FloatButton
} from "antd";
import EndTermPaperService from "../../../services/end-term-paper.service";
import {useRef, useState} from "react";
import StudentMarkService from "../../../services/student-mark.service";
import ClassroomService from "../../../services/classroom.service";
import {EyeOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import TeacherExamCommentService from "../../../services/teacher-exam-comment.service";
import AuthenticationService from "../../../services/authentication.service";
import {refreshPage} from "../../../common";

export async function teacherClassLoader({params}) {
    try {
        const examResponse = await EndTermExamService.getBySubjectIdAndLevelId(params.subjectId, params.levelId);
        const studentsResponse = await ClassroomService.getStudentsByClassroomId(params.classroomId)
        const students = studentsResponse.data;
        const exam = examResponse.data;
        return {exam, students};
    } catch (e) {
        return []
    }
}

const TeacherClassList = () => {
    const {exam, students} = useLoaderData();
    const [papers, setPapers] = useState([]);
    const [examId, setExamId] = useState(exam?.id);
    const [markRecord, setMarkRecord] = useState([]);

    const [currentPaperId, setCurrentPaperId] = useState(null);
    const [currentPaper, setCurrentPaper] = useState(null)
    const [results, setResults] = useState([]);
    const [bulkResultsUploadBtnLoader, setBulkResultsUploadBtnLoader] = useState(false);
    const [bulkResultsUploadBtnDisabledState, setBulkResultsUploadBtnDisabledState] = useState(false);
    const [studentMarkModalState, setStudentMarkModalState] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [customComment, setCustomComment] = useState('');
    const [currentStudentId, setCurrentStudentId] = useState(null);
    const [isSubmitCustomCommentBtnLoading, setIsSubmitCustomCommentBtnLoading] = useState(false);
    const [customCommentData, setCustomCommentData] = useState('');

    const customCommentElement = document.querySelector('#custom-comment');
    const customCommentSaveBtn = document.querySelector('#custom-comment-save-btn');
    const customCommentCancelBtn = document.querySelector('#custom-comment-cancel-btn');
    const customCommentBtn = document.querySelector('#custom-comment-btn');
    const currentCommentElement = document.querySelector('#comment');

    const $papers = papers?.map(
        paper => ({
            label: paper?.name,
            value: paper?.id
        })
    )

    const fetchPapers = async () => {
        if (examId) {
            try {
                const response = await EndTermPaperService.getAllByEndTermExam(examId)
                setPapers(response?.data)
            } catch (e) {

            }
        }
    }

    const fetchPapersBySubjectIdAndStudentId = async (student) => {
        setCurrentStudentId(student);
        try {
            const response = await StudentMarkService.getCurrentTermResultBySubjectIdAndStudentId(
                exam?.subject,
                student
            )
            const commentData = await handleFetchTeacherComment(student)
            setCustomCommentData(commentData);
            setMarkRecord(response?.data);
        } catch (e) {

        }
    }

    const handleFetchTeacherComment = async (student) => {
        /*
        * This function fetches the teacher's custom comment for a particular student.
        * If the teacher has not added a custom comment for the student, it returns None which is saved as
        * undefined.
        *
        * params:
        *       student -> the student's id
        * return value:
        *       comment on success
        *       empty string on error
        * */
        try {
            const response = await TeacherExamCommentService.get(examId, student)
            if(response.status === 200) {
                return response?.data?.comment;
            }
        } catch (e) {
            return '';
        }
    }

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
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            responsive: ['md', 'lg'],
            defaultSortOrder: 'ascend',
            sorter: {
                multiple: 4,
                compare: (a, b) => a.gender?.localeCompare(b.gender),
            },
        },
        {
            title: 'Mark',
            dataIndex: '',
            key: 'x',
            align: 'center',
            render: (record) => (
                <center>
                    <input
                        min={0}
                        max={currentPaper?.totalMark}
                        type='number'
                        className='form-control form-control-sm me-0 test w-50'
                        onBlur={
                            event => {
                                if (Number(event.target.value) > currentPaper?.totalMark) {
                                    event.target.value = currentPaper.totalMark
                                }
                                for (let i = 0; i < results.length; i++) {
                                    if (results[i]['student'] === record?.id) {
                                        if (results[i]['mark'] !== Number(event.target.value)) {
                                            if (event.target.value === '') {
                                                results.splice(i, 1)
                                                return 0
                                            }
                                            results.splice(i, 1)
                                            setResults(
                                                [
                                                    ...results,
                                                    {
                                                        student: record?.id,
                                                        mark: Number(event.target.value)
                                                    }
                                                ]
                                            )
                                            return 0
                                        } else {
                                            return 0
                                        }
                                    }
                                }
                                if (event.target.value === '') return 0;
                                setResults(
                                    [
                                        ...results,
                                        {
                                            student: record?.id,
                                            mark: Number(event.target.value)
                                        }
                                    ]
                                )
                                return 0
                            }
                        }
                    />
                </center>
            )
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
                                    fetchPapersBySubjectIdAndStudentId(record?.id);
                                    setStudentMarkModalState(true);
                                }}
                            />
                        </Tooltip>
                    </Space>
                )
            }
        }
    ]

    const handleChangePaper = (value) => {
        Array.from(document.querySelectorAll('.test')).forEach(
            input => (input.value = "")
        );
        setResults([]);
        setCurrentPaperId(value);
        const currentPaper = papers.find(paper => (paper?.id === value))
        setCurrentPaper(currentPaper);
    }

    const handleSubmitResults = async () => {
        if (results.length === 0) {
            message.info('There is no information to upload.');
            return 0
        }
        if (currentPaperId === null) {
            message.warning('Please select the PAPER for the marks you wish to enter below.');
            return 0
        }

        setBulkResultsUploadBtnLoader(true);
        setBulkResultsUploadBtnDisabledState(true);

        try {
            const response = await StudentMarkService.bulkUploadMarksForParticularPaper(currentPaperId, results)

            if (response?.status === 200) {
                Array.from(document.querySelectorAll('.test')).forEach(
                    input => (input.value = "")
                );
                setBulkResultsUploadBtnLoader(false);
                setBulkResultsUploadBtnDisabledState(false);
                setResults([])
                setCurrentPaperId(null)
                if(response.data.errors.length <=0) {
                    message.success(response.data.success);
                } else {
                    message.success(response.data.success);
                    for(let i = 0; i < response.data.errors.length; i++) {
                        message.error(response.data.errors[i])
                    }
                }
            }
        } catch (e) {
            setBulkResultsUploadBtnLoader(false);
            setBulkResultsUploadBtnDisabledState(false);
            message.error('An error occurred.');
        }
    }

    const handleInitiateCustomCommentUI = () => {
        currentCommentElement.classList.add('d-none');
        customCommentBtn.classList.add('d-none');
        customCommentCancelBtn.classList.remove('d-none');
        customCommentSaveBtn.classList.remove('d-none');
        customCommentElement.classList.remove('d-none');
    }

    const handleCancelCreateCustomComment = () => {
        currentCommentElement.classList.remove('d-none');
        customCommentBtn.classList.remove('d-none');
        customCommentCancelBtn.classList.add('d-none');
        customCommentSaveBtn.classList.add('d-none');
        customCommentElement.classList.add('d-none');
    }

    const handleCreateCustomComment = async () => {
        if(customComment === '') {
            message.warning('Please enter the comment.');
            return;
        }

        setIsSubmitCustomCommentBtnLoading(true);

        try {
            const response = await TeacherExamCommentService.create({
                exam: examId,
                student: currentStudentId,
                comment: customComment,
                teacher: AuthenticationService.getUserId()
            })

            if(response?.status === 201) message.success('Custom comment added successfully.');
            if(response?.status === 200) message.success('Custom comment updated successfully.');
            refreshPage()
        } catch (e) {
            setIsSubmitCustomCommentBtnLoading(false);
            if(e.response.status === 400) message.error(e.response.data.errors);
        }
    }

    return (
        <>
            <div className=''>
                <h3>Examination</h3>
            </div>
            <Divider type={"horizontal"}/>
            <Form layout={"horizontal"}>
                <div className='row'>
                    <div className='col-md-6'>
                        <Form.Item label='Examination name'>
                            <Input value={exam?.name}/>
                        </Form.Item>
                    </div>
                    <div className='col-md-6'>
                        <Form.Item label='Number of papers'>
                            <Input value={exam?.numberOfPapers}/>
                        </Form.Item>
                    </div>
                </div>
            </Form>

            <Table

                pagination={false}
                title={
                    () => (
                        <div>
                            <Alert
                                message="Please select the PAPER for the marks you wish to enter below."
                                type="info"
                                className='mb-3 py-3'
                                showIcon
                                closable
                            />

                            <Select
                                size={"large"}
                                options={$papers}
                                placeholder='Select the paper'
                                onChange={handleChangePaper}
                                onFocus={() => fetchPapers()}
                            />
                        </div>
                    )
                }
                dataSource={students?.sort((a, b) => {
                    if (a.gender > b.gender) return 1;
                    if (a.gender < b.gender) return -1;
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
                            loading={bulkResultsUploadBtnLoader}
                            disabled={bulkResultsUploadBtnDisabledState}
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
                    setMarkRecord([])
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
                <Form layout={"vertical"}>
                    <Form.Item label='Academic year'>
                        <Input
                            value={markRecord[0]?.academic_year}
                        />
                    </Form.Item>
                    <Form.Item label='Term'>
                        <Input
                            value={markRecord[0]?.term}
                        />
                    </Form.Item>
                    <Form.Item label='Total mark'>
                        <Input
                            value={
                                markRecord[1] && markRecord[1]?.total_mark
                            }
                        />
                    </Form.Item>

                    {
                        customCommentData !== undefined ? (
                            <div id='comment' className='mb-3'>
                                <p className='m-1'>Comment</p>
                                <Input.TextArea
                                    size={"large"}
                                    value={customCommentData}
                                />
                            </div>
                        ) : (
                            <div id='comment' className='mb-3'>
                                <p className='m-1'>Comment</p>
                                <Input.TextArea
                                    size={"large"}
                                    value={markRecord[1] && markRecord[1]?.comment}
                                />
                            </div>
                        )
                    }

                    <div id='custom-comment' className='mb-3 d-none'>
                        <p className='m-1'>Write custom comment and save.</p>
                        <Input.TextArea
                            size={"large"}
                            onChange={e => setCustomComment(e.target.value)}
                        />
                    </div>

                    <div className='d-flex justify-content-between align-items-center'>
                        <Button
                            className='d-none'
                            id='custom-comment-save-btn'
                            type={"primary"}
                            onClick={handleCreateCustomComment}
                            loading={isSubmitCustomCommentBtnLoading}
                        >
                            Save comment
                        </Button>

                        <Button
                            className='d-none'
                            id='custom-comment-cancel-btn'
                            type={"primary"}
                            onClick={handleCancelCreateCustomComment}
                            ghost
                        >
                            Cancel
                        </Button>
                    </div>

                    <Button
                        type={"primary"}
                        id='custom-comment-btn'
                        onClick={handleInitiateCustomCommentUI}
                    >
                        Customise comment
                    </Button>
                </Form>
            </Modal>
        </>
    )
}

export default TeacherClassList;



