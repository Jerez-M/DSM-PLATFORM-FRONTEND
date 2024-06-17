import {Button, Form, Modal, message, Select} from "antd";
import {useState} from "react";
import levelService from "../../../../services/level.service";
import authenticationService from "../../../../services/authentication.service";
import LEVELS from "../../../../utils/levels";
import {handleError} from "../../../../common";

const EditLevel = ({open, close, record}) => {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [formData, setFormData] = useState({
        name: record ? record?.name : "",
    });

    const institution = authenticationService.getUserTenantId();

    const handleLevelChange = (value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            ['name']: value,
        }));
    };

    const handleFormSubmit = async () => {
        setLoading(true);
        setDisabled(true)
        try {
            const {name} = formData;
            const data = {
                name: name || record?.name,
                institution
            };

            const id = record?.id
            console.log("form data: ", data);

            const response = await levelService.update(id, data);

            if (response.status === 200) {
                await window.location.reload()
                message.success("Level updated successfully");
            } else {
                console.log("Request was not successful. Status:", response.status);
                message.error("An error occurred, please check your network.");
            }
        } catch (error) {
            console.error("Error creating new level :", error);
            handleError(error)
        } finally {
            setLoading(false);
            setDisabled(false)
            close();
        }
    };

    return (
        <>
            <Modal
                title="Update level"
                visible={open}
                onCancel={close}
                okButtonProps={{
                    className: "d-none",
                }}
                cancelButtonProps={{
                    className: "d-none",
                }}
            >
                <Form layout="vertical">
                    <Form.Item label="Level name">
                        <Select
                            defaultValue={record?.name}
                            showSearch
                            options={LEVELS}
                            size="large"
                            onChange={handleLevelChange}
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                        size="large"
                        className="mt-3"
                        loading={loading}
                        disabled={disabled}
                        block
                        onClick={handleFormSubmit}
                    >
                        Update level
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default EditLevel;