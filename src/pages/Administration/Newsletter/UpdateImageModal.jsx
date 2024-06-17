import {Button, Form, message, Modal, Upload} from "antd";
import {InboxOutlined, PlusOutlined} from "@ant-design/icons";
import {useState} from "react";
import {handleError} from "../../../common";
import NewsletterService from "../../../services/newsletter.service";

const UpdateImageModal = ({ open, close, newsletter }) => {
    const [form] = Form.useForm();
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);
            setDisabled(true);

            const formData = new FormData();
            formData.append("image", image);

            const response = await NewsletterService.updateImage(newsletter?.id, formData);
            if (response.status === 200) {
                await message.success("Newsletter Updated Successfully");
                await window.location.reload()
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false);
            setDisabled(false)
        }
    };

    const handleFileUpload = ({ fileList }) => {
        setImage(fileList[0]?.originFileObj)
    }

    const handleClear = () => {
        form.resetFields();
    }

    return (
        <Modal
            title={`Update Image for ${newsletter?.title} Newsletter`}
            open={open}
            onCancel={() => {
                handleClear();
                close()
            }}
            okButtonProps={{
                className: "d-none",
            }}
            cancelButtonProps={{
                className: "d-none",
            }}
            maskClosable
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                id="newsletter-form"
                onFinish={handleFormSubmit}
            >
                <Form.Item
                    label="Image"
                    name="image"
                >
                    <Upload.Dragger
                        name="image"
                        multiple={false}
                        listType="picture"
                        accept=".jpg,.jpeg,.png"
                        maxCount={1}
                        type="file"
                        maxFileSize={1024 * 1024 * 10}
                        beforeUpload={() => false}
                        onChange={handleFileUpload}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            You can only upload one image at a time. The image should be a .jpg, .jpeg or .png file. The maximum file size is 10MB.
                        </p>
                    </Upload.Dragger>
                </Form.Item>

                <Button
                    type="primary"
                    size="large"
                    className="mt-4"
                    loading={loading}
                    disabled={disabled}
                    block
                    htmlType="submit"
                    icon={<PlusOutlined />}
                >
                    Update Newsletter Image
                </Button>
            </Form>
        </Modal>
    )
};

export default UpdateImageModal;