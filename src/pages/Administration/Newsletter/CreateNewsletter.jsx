import {Button, Card, Checkbox, Form, Input, message, Select, Upload} from "antd";
import {useState} from "react";
import {InboxOutlined, PlusOutlined} from "@ant-design/icons";
import authenticationService from "../../../services/authentication.service";
import {handleError} from "../../../common";
import NewsletterService from "../../../services/newsletter.service";
import AuthenticationService from "../../../services/authentication.service";
import TextEditor from "../../../common/TextEditor";
import BackButton from "../../../common/BackButton";
import {useNavigate} from "react-router-dom";

const CreateNewsletter = () => {
    const [form] = Form.useForm();
    const [image, setImage] = useState(null)
    const [isPublished, setIsPublished] = useState(true)
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();

    const institution = authenticationService.getUserTenantId();

    const handleFileUpload = ({ fileList }) => {
        setImage(fileList[0]?.originFileObj)
    }

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);
            setDisabled(true);

            const formData = new FormData();
            for (const [key, value] of Object.entries(values)) {
                if (key !== 'image' || 'is_published') {
                    formData.append(key, value);
                }
            }
            formData.append("image", image);
            formData.set("is_published", isPublished ? "True" : "False");
            formData.append("institution", institution);
            formData.append("created_by", AuthenticationService.getUserId());

            const response = await NewsletterService.create(formData);

            if (response.status === 201) {
                message.success("Newsletter Created Successfully");
                navigate(-1)
            } else {
                console.log("Request was not successful. Status:", response.status);
                message.error(response?.data?.error ?? "An error occurred, please check your network.");
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false);
            setDisabled(false)
        }
    };

    const audience = [
        { label: "All", value: "all" },
        { label: "Teachers", value: "teachers" },
        { label: "Students", value: "students" },
        { label: "Parents", value: "parents" }
    ]
    return (
        <div className="mx-4">
            <BackButton />

            <h3>Create Newsletter</h3>
            <Form
                form={form}
                layout="vertical"
                id="newsletter-form"
                onFinish={handleFormSubmit}
            >
                <Card className="w-90 mx-auto">
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: "Please enter the newsletter title" }]}
                    >
                        <Input
                            placeholder="Title"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Author"
                        name="author"
                        rules={[{ required: true, message: "Please enter the newsletter author" }]}
                    >
                        <Input
                            placeholder="Author"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Image"
                        name="image"
                        rules={[{ required: true, message: "Upload newsletter image" }]}
                    >
                        <Upload.Dragger
                            name="image"
                            type="file"
                            maxCount={1}
                            multiple={false}
                            listType="picture"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                            maxFileSize={1024 * 1024 * 10}
                            beforeUpload={() => false}
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

                    <Form.Item
                        label="Audience"
                        name="audience"
                    >
                        <Select
                            placeholder="Audience"
                            size="large"
                            options={audience}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Message"
                        name="body"
                    >
                        <TextEditor />
                    </Form.Item>

                    <Form.Item name="is_published" valuePropName="checked">
                        <Checkbox onChange={(e) => setIsPublished(e.target.checked)}>
                            Publish
                        </Checkbox>
                    </Form.Item>
                </Card>

                <Button
                    type="primary"
                    size="large"
                    className="mt-4 px-4"
                    loading={loading}
                    disabled={disabled}
                    htmlType="submit"
                    icon={<PlusOutlined />}
                >
                    Create Newsletter
                </Button>
            </Form>
        </div>
    );
};

export default CreateNewsletter;
