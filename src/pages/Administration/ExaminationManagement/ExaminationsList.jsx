import {Button, Divider, message, Space, Table, Tooltip, Tabs, Select, Spin} from "antd";
import {EyeFilled, EyeOutlined, PlusOutlined, SendOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useLoaderData, useNavigate} from "react-router-dom";
import NewExamination from "./NewExamination";
import EndTermExamService from "../../../services/end-term-exam.service";
import AuthenticationService from "../../../services/authentication.service";
import ExaminationAnalytics from "./ExaminationAnalytics";
import StudentMarkService from "../../../services/student-mark.service";
import SchoolTermServices from "../../../services/schoolTerm.services";

export async function examinationsListLoader() {
    try {
        const tenantId = AuthenticationService.getUserTenantId();
        const response = await EndTermExamService.getAllByInstitutionId(tenantId);
        if (response?.status === 200) {
            const endTermExams = response.data;
            return {endTermExams};
        }
    } catch (e) {
        return []
    }
}

const ExaminationsList = () => {
    const {endTermExams} = useLoaderData();
    const navigate = useNavigate();
    const [newExaminationModalState, setNewExaminationModalState] = useState(false);
    const [isPublished, setIsPublished] = useState(
        endTermExams !== [] ? endTermExams[0]?.is_published : undefined
    );
    const [publishResultsBtnLoader, setPublishResultsBtnLoader] = useState(false);
    const [terms, setTerms] = useState([]);
    const [examinations, setExaminations] = useState([]);
    const [isFetchingExaminations, setIsFetchingExaminations] = useState(true);

    const termsSelectOptions = terms?.map(
        term => ({
            label: `${term?.name} ${term?.academicYear?.name}`,
            value: term?.id
        })
    )

    const _endTermExams = examinations.map(
        (i, key) => ({
            id: i?.id,
            name: i?.name,
            papers: i?.numberOfPapers,
            subject: i?.subject?.name,
            level: i?.level?.name,
            term: i?.term?.name,
            key: key + 1
        })
    )


    const examinationsListTableColumns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Examination name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Number of papers',
            dataIndex: 'papers',
            key: 'papers',
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            sorter: {
                compare: (a, b) => a.subject.localeCompare(b.subject),
                multiple: 3,
            },
            filters: [
                { text: 'CHEMISTRY', value: 'CHEMISTRY' },
                { text: 'PHYSICS', value: 'PHYSICS' },
                { text: 'BIOLOGY', value: 'BIOLOGY' },
                { text: 'SHONA', value: 'SHONA' },
                { text: 'ENGLISH', value: 'SHONA' },
                { text: 'GEOGRAPHY', value: 'GEOGRAPHY' },
                { text: 'HISTORY', value: 'HISTORY' },
                { text: 'INTEGRATED SCIENCE', value: 'INTEGRATED SCIENCE' },
                { text: 'MATHEMATICS', value: 'MATHEMATICS' },
                { text: 'COMMERCE', value: 'COMMERCE' },
                { text: 'AGRICULTURE', value: 'AGRICULTURE' },

            ],
            onFilter: (value, record) => record.subject === value,
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            sorter: {
                compare: (a, b) => a.level.localeCompare(b.level),
                multiple: 1,
            },
            filters: [
                { text: 'FORM 1', value: 'FORM 1' },
                { text: 'FORM 2', value: 'FORM 2' },
                { text: 'FORM 3', value: 'FORM 3' },
                { text: 'FORM 4', value: 'FORM 4' },
                { text: 'FORM 5', value: 'FORM 5' },
            ],
            onFilter: (value, record) => record.level === value,
        },
        {
            title: 'Term',
            dataIndex: 'term',
            key: 'term',
            sorter: {
                compare: (a, b) => a.term.localeCompare(b.term),
                multiple: 1,
            },
            filters: [
                { text: 'TERM 1', value: 'TERM 1' },
                { text: 'TERM 2', value: 'TERM 2' },
                { text: 'TERM 3', value: 'TERM 3' },
            ],
            onFilter: (value, record) => record.term === value,
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View exam info">
                        <Button
                            type="primary"
                            icon={<EyeOutlined/>}
                            onClick={() => navigate(`/admin/examinations/${record?.name}/${record?.id}`)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ]

    const handlePublishResults = async () => {
        if(!isPublished) {
            setPublishResultsBtnLoader(true);
            try {
                const response = await EndTermExamService.publishEndTermExams(
                    AuthenticationService.getUserTenantId()
                )
                if(response.status === 200) {
                    setPublishResultsBtnLoader(false);
                    message.success('Results published.')
                    window.location.reload();
                }
            } catch (e) {
                setPublishResultsBtnLoader(false);
            }
        } else {
            setPublishResultsBtnLoader(true);
            try {
                const response = await EndTermExamService.unPublishEndTermExams(
                    AuthenticationService.getUserTenantId()
                )
                if(response.status === 200) {
                    setPublishResultsBtnLoader(false);
                    message.success('Results unpublished.')
                    window.location.reload();
                }
            } catch (e) {
                setPublishResultsBtnLoader(false);
            }
        }
    }

    const handleChangeTerm = async (value) => {
        try {
            setIsFetchingExaminations(true);
            const examsResponse = await EndTermExamService.getAllByInstitutionIdAndTermId(
                AuthenticationService.getUserTenantId(),
                value
            )
            setExaminations(examsResponse.data);
            setIsFetchingExaminations(false);
        } catch (e) {
            setIsFetchingExaminations(false);
            setExaminations([]);
        }
    }

    const tabs = [
        {
            label: 'Examinations list',
            key: 1,
            children: (
                <>
                    <div className='d-flex justify-content-between mb-3'>
                        <div>
                            <Select
                                style={{width: '400px'}}
                                placeholder='Select term to view examinations for that particular term'
                                options={termsSelectOptions}
                                onChange={handleChangeTerm}
                            />
                        </div>
                        <div>
                            <Tooltip title="Publish results">
                                <Button
                                    type="primary"
                                    className='me-2'
                                    icon={<SendOutlined />}
                                    danger={!isPublished}
                                    loading={publishResultsBtnLoader}
                                    disabled={isPublished === undefined ? true : publishResultsBtnLoader}
                                    onClick={handlePublishResults}
                                >
                                    {isPublished ? 'Unpublish results' : 'Publish all results'}
                                </Button>
                            </Tooltip>
                            <Button
                                icon={<PlusOutlined/>}
                                className='border-0 px-3 text-white'
                                style={{background: '#39b54a'}}
                                onClick={() => setNewExaminationModalState(true)}
                            >
                                Add new examination
                            </Button>
                        </div>
                    </div>
                    {
                        isFetchingExaminations ? (
                            <div className='pt-5 d-flex justify-content-center align-items-center'>
                                <Spin size={"large"}/>
                            </div>
                            ):
                        examinations.length !== 0 ? <Table
                            dataSource={_endTermExams}
                            columns={examinationsListTableColumns}
                            bordered={true}
                            className="table-responsive"
                        /> : (
                            <div className='pt-5 d-flex justify-content-center align-items-center'>
                                <p>No examinations set for this term</p>
                            </div>
                        )
                    }
                </>
            )
        },
        {
            label: 'Reports and analytics',
            key: 2,
            children: (
                <ExaminationAnalytics/>
            )
        }
    ]

    useEffect(() => {
        async function fetchAllTerms() {
            try {
                const examsResponse = await EndTermExamService.getAllByInstitutionId(AuthenticationService.getUserTenantId());
                const termsResponse = await SchoolTermServices.getAllTermsByInstitution(AuthenticationService.getUserTenantId());
                const examsResponseData = examsResponse?.data;
                const termsResponseData = termsResponse?.data;
                setIsFetchingExaminations(false);
                return {termsResponseData, examsResponseData}
            } catch (e) {
                setIsFetchingExaminations(false);
                return {};
            }
        }

        fetchAllTerms()
            .then(data => {
                setExaminations(data?.examsResponseData);
                setTerms(data?.termsResponseData);
            })
    }, [])

    return (
        <div className={"overflow-x-hidden"}>
            <div>
                <h3>Examination management</h3>
            </div>

            <NewExamination
                open={newExaminationModalState}
                close={() => setNewExaminationModalState(false)}
            />

            <Tabs
                defaultActiveKey={1}
                className='mt-2'
                items={tabs}
            />

        </div>
    )
}

export default ExaminationsList;