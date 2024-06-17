import {Button, Form, Input, Modal, message, InputNumber} from "antd";
import {useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {handleError, refreshPage} from "../../../common";
import EndTermPaperService from "../../../services/end-term-paper.service";

const AddPaperModal = ({ open, close, examId }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const handleFormSubmit = async (values) => {
        console.log("submitted: ", values)

        try {
            setLoading(true);
            setDisabled(true);

            const data = {
                ...values,
                exam: examId
            }
            console.log("request Data: ", data);

            const response = await EndTermPaperService.create(data);

            if (response.status === 201) {
                message.success("Exam Paper Added Successfully");
                refreshPage();
            } else {
                console.log("Request was not successful. Status:", response.status);
                message.error(response?.data?.error ?? "An error occurred, please check your network.");
            }
        } catch (error) {
            console.log("Error occurred:", error);
            handleError(error)
        } finally {
            setLoading(false);
            setDisabled(false)
            close();
        }
    };

    const handleClear = () => {
        form.resetFields();
    }

    // console.clear()
    return (
        <>
            <Modal
                title={"Add Exam Paper"}
                open={open}
                onCancel={() => {
                    handleClear();
                    close()
                }}
                getFieldsValue={true}
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
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    form={form}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Paper name is required!' }]}
                    >
                        <Input
                            placeholder="e.g. Paper 1"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Total Mark"
                        name="totalMark"
                        rules={[{ required: true, message: 'Total Mark is required!' }]}
                    >
                        <InputNumber
                            placeholder="Total Mark"
                            className="w-100"
                            size="large"
                            min={1}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Weight"
                        name="weight"
                        rules={[{ required: true, message: 'Weight is required!' }]}
                    >
                        <InputNumber
                            placeholder="Weight"
                            className="w-100"
                            size="large"
                            min={1}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        size="large"
                        className="mt-4"
                        loading={loading}
                        disabled={disabled}
                        block
                        htmlType="submit"
                        icon={<PlusOutlined/>}
                    >
                        Save Paper
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default AddPaperModal;
