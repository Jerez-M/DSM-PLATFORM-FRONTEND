import {Button, Form, Input, InputNumber, message, Modal, Select} from "antd";
import {useEffect, useState} from "react";
import AuthenticationService from "../../../services/authentication.service";
import EndTermExamService from "../../../services/end-term-exam.service";
import SubjectService from "../../../services/subject.service";
import LevelService from "../../../services/level.service";
import {handleError} from "../../../common";
import {PlusOutlined} from "@ant-design/icons";

const NewExamination = ({open, close}) => {
    const [form] = Form.useForm();
    const tenantId = AuthenticationService.getUserTenantId();

    const [name, setName] = useState('');
    const [numberOfPapers, setNumberOfPapers] = useState('');
    const [subject, setSubject] = useState(null);
    const [level, setLevel] = useState(null);

    const [newExamBtnLoader, setNewExamBtnLoader] = useState(false);
    const [newExamBtnDisabledState, setNewExamBtnDisabledState] = useState(false);

    const [$subjects, set$Subjects] = useState([]);
    const [$levels, set$Levels] = useState([]);

    const _subjects = $subjects.map(
        i => ({
            label: i?.name,
            value: i?.id
        })
    )

    const _levels = $levels.map(
        i => ({
            label: i?.name,
            value: i?.id
        })
    )

    const handleClearAddClientForm = () => {
        form.resetFields();
    }

    const fetchSubjectsAndLevels = async () => {
        try {
            const subjectsResponse = await SubjectService.getAll(tenantId);
            const levelsResponse = await LevelService.getAll(tenantId);
            set$Subjects(subjectsResponse.data)
            set$Levels(levelsResponse.data)
        } catch (e) {
            set$Subjects([])
            set$Levels([])
        }
    }

    const handleCreateNewExam = async () => {
        if(!subject) {
            message.error("Subject is required");
            return;
        }
        if(!level) {
            message.error("Level is required");
            return;
        }
        if(!numberOfPapers) {
            message.error("Number Of Papers is required");
            return;
        }
        setNewExamBtnLoader(true);
        setNewExamBtnDisabledState(true);

        try {
            const response = await EndTermExamService.create({
                name,
                institution: tenantId,
                subject,
                level,
                numberOfPapers
            })

            if(response?.status === 201) {
                setNewExamBtnDisabledState(false);
                setNewExamBtnLoader(false);
                handleClearAddClientForm();
                setName('');
                setNumberOfPapers(null);
                setLevel(null);
                setSubject(null);
                close();
                window.location.reload();
                await message.success("Examination added successfully.")
            }
        } catch (e) {
            setNewExamBtnDisabledState(false);
            setNewExamBtnLoader(false);

            handleError(e)
            console.clear();
        }
    }

    const handleChangeSubject = (value) => {
        setSubject(value)
    }

    const handleChangeLevel = (value) => {
        setLevel(value)
    }

    const handleChangeNumberOfPapersTaken = (value) => {
        setNumberOfPapers(value)
    }

    useEffect(
        () => {
            fetchSubjectsAndLevels();
        }, []
    )

    return (
        <Modal
            open={open}
            onCancel={() => close()}
            okButtonProps={{
                className: 'd-none'
            }}
            cancelButtonProps={{
                className: 'd-none'
            }}
            destroyOnClose={true}
        >
            <Form form={form} layout={"vertical"} onFinish={handleCreateNewExam}>
                <Form.Item
                    name="client_name"
                    label={"Examination name"}
                    rules={[{ required: true, message: 'Exam Name is required!' }]}
                >
                    <Input size={"large"} placeholder="Examination name" onChange={e => setName(e.target.value)} />
                </Form.Item>
                <Form.Item
                    name="subject"
                    label={"Subject"}
                    rules={[{ required: true, message: 'Subject is required!' }]}
                >
                    <Select
                        options={_subjects}
                        size={"large"}
                        placeholder="Subject"
                        onChange={handleChangeSubject}
                    />
                </Form.Item>
                <Form.Item
                    name="grade"
                    label={"Level"}
                    rules={[{ required: true, message: 'Level is required!' }]}
                >
                    <Select
                        options={_levels}
                        size={"large"}
                        placeholder="Level"
                        onChange={handleChangeLevel}
                    />
                </Form.Item>
                <Form.Item
                    name="address"
                    label={"Number of papers taken"}
                    rules={[{ required: true, message: 'Number of papers taken is required!' }]}
                >
                    <InputNumber
                        className='w-100'
                        size={"large"}
                        min={1}
                        max={20}
                        placeholder="Number of papers take"
                        onChange={handleChangeNumberOfPapersTaken}
                    />
                </Form.Item>

                <Button
                    size={"large"}
                    icon={<PlusOutlined/>}
                    loading={newExamBtnLoader}
                    disabled={newExamBtnDisabledState}
                    htmlType="submit"
                    style={{background: '#39b54a'}}
                    className={"text-light"}
                    block
                >
                    Add examination
                </Button>
            </Form>
        </Modal>
    )
}

export default NewExamination;
