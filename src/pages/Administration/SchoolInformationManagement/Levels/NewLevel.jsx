import {Button, Form, Modal, message, Select} from "antd";
import {useState} from "react";
import levelService from "../../../../services/level.service";
import authenticationService from "../../../../services/authentication.service";
import LEVELS from "../../../../utils/levels";
import {handleError, handleListErrors, refreshPage} from "../../../../common";

const NewLevel = ({open, close}) => {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [levels, setLevels] = useState([]);
    const [form] = Form.useForm();

    const institution = authenticationService.getUserTenantId();

    const handleFormSubmit = async () => {
        setLoading(true);
        setDisabled(true)
        try {
            const data = {
                name: levels,
                institution
            };
            console.log("form data: ", data);

            const response = await levelService.create(data);

            if (response.status === 200) {
                message.success("New Level Added Successfully");
                refreshPage()
                console.log("Level created:", response.data);
            } else {
                console.log("Request was not successful. Status:", response.status);
                message.error("An error occurred, please check your network.");
            }
        } catch (error) {
            console.error("Error creating new level :", error);
            handleListErrors(error)
        } finally {
            setLoading(false);
            setDisabled(false)
            close();
        }
    };

    return (
        <>
            <Modal
                title="Add new level"
                visible={open}
                onCancel={close}
                okButtonProps={{
                    className: "d-none",
                }}
                cancelButtonProps={{
                    className: "d-none",
                }}
            >
                <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
                    <Form.Item
                        label="Level name"
                        name="name"
                        rules={[{ required: true, message: "At least one level is required!" }]}
                    >
                        <Select
                            showSearch
                            options={LEVELS}
                            placeholder="Level name e.g. FORM 1"
                            size="large"
                            onChange={setLevels}
                            mode="multiple"
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                        size="large"
                        className="mt-3"
                        loading={loading}
                        disabled={disabled}
                        block
                        htmlType="submit"
                    >
                        Add new level
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default NewLevel;