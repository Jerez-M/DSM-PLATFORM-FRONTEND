import {Button, Card, Checkbox, Form, Input, message, Select} from "antd";
import {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import authenticationService from "../../../services/authentication.service";
import {handleError} from "../../../common";
import NewsletterService from "../../../services/newsletter.service";
import AuthenticationService from "../../../services/authentication.service";
import TextEditor from "../../../common/TextEditor";
import BackButton from "../../../common/BackButton";
import {useLoaderData, useNavigate} from "react-router-dom";

export const updateNewsletterLoader = async ({params}) => {
    try {
        const newsletterResponse = await NewsletterService.getById(params.id)
        return {newsletter: newsletterResponse.data}
    } catch (e) {
        console.log(e)
        return null
    }
}

const UpdateNewsletter = () => {
    const [form] = Form.useForm();
    const [isPublished, setIsPublished] = useState(true)
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const { newsletter } = useLoaderData();
    const navigate = useNavigate();

    const institution = authenticationService.getUserTenantId();

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
            formData.set("is_published", isPublished ? "True" : "False");
            formData.append("institution", institution);
            formData.append("created_by", AuthenticationService.getUserId());

            const response = await NewsletterService.update(newsletter?.id, formData);

            if (response.status === 200) {
                message.success("Newsletter Updated Successfully");
                navigate(`/admin/newsletter/${newsletter?.id}`)
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

    useEffect(() => {
        form.setFieldsValue({
            is_published: newsletter ? newsletter?.is_published : true,
            title: newsletter ? newsletter?.title : "",
            author: newsletter ? newsletter?.author : "",
            body: newsletter ? newsletter?.body : "",
            audience: newsletter ? newsletter?.audience : "all",
            institution: institution
        })
    }, [newsletter]);

    const audience = [
        { label: "All", value: "all" },
        { label: "Teachers", value: "teachers" },
        { label: "Students", value: "students" },
        { label: "Parents", value: "parents" }
    ]
    return (
        <div className="mx-4">
            <BackButton />
            <h3>Update Newsletter Content</h3>

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
                    >
                        <Input
                            placeholder="Title"
                            size="large"
                        />
                    </Form.Item>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Item
                                label="Author"
                                name="author"
                            >
                                <Input
                                    placeholder="Author"
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                        <div className="col-md-6">
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
                        </div>
                    </div>

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
                    Update Newsletter
                </Button>
            </Form>
        </div>
    );
};

export default UpdateNewsletter;
