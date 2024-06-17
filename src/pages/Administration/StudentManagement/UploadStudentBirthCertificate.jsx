import {Button, Form, Input, message, Modal} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {useState} from "react";
import StudentService from "../../../services/student.service";

const UploadStudentBirthCertificate = ({open, close, id}) => {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const inputElement = document.querySelector('#document-form-file');
        if (!inputElement.files[0]) {
            message.error('Please select a file to upload');
            return;
        }

        setDisabled(true);
        setLoading(true);

        try {
            const form = document.querySelector('#document-form');
            const data = new FormData(form);
            await StudentService.uploadStudentDocument(id, data)
            message.success('Document uploaded successfully.')
            setLoading(false);
            setDisabled(false);
            close()
        } catch (e) {
            if (e.response && e.response.status === 404) {
                message.error(e.response.data.error)
                setLoading(false);
                setDisabled(false);
            } else {
                message.error('An error occurred, please check your internet connection');
                setLoading(false);
                setDisabled(false);
            }
        }
    }

    return (
        <Modal
            open={open}
            onCancel={() => close()}
            cancelButtonProps={{
                className: 'd-none'
            }}
            okButtonProps={{
                className: 'd-none'
            }}
            destroyOnClose={true}
        >
            <Form
                layout={"vertical"}
                className='pt-4'
                method='post'
                encType='multipart/form-data'
                onSubmitCapture={handleSubmit}
                id='document-form'
            >
                <Form.Item label='Select birth certificate' help="Select the student's birth certificate.">
                    <Input
                        type='file'
                        size={"large"}
                        name='document'
                        id='document-form-file'
                    />
                </Form.Item>
                <Button
                    size={"large"}
                    block={true}
                    className='border-0 px-3 text-white'
                    style={{background: '#39b54a'}}
                    icon={<UploadOutlined />}
                    htmlType={"submit"}
                    loading={loading}
                    disabled={disabled}
                >
                    Upload
                </Button>
            </Form>
        </Modal>
    )
}

export default UploadStudentBirthCertificate;