import {Button, Form, Input, Modal, Select, message, InputNumber} from "antd";
import {useEffect, useState} from "react";
import authenticationService from "../../../../services/authentication.service";
import LevelService from "../../../../services/level.service";
import GradeScaleService from "../../../../services/grade-scale.service";
import {handleError, refreshPage} from "../../../../common";

const EditGradingScale = ({ open, close, gradingScale }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [levelsList, setLevelsList ] = useState([]);

    const institution = authenticationService.getUserTenantId()

    const fetchLevels = async () => {
        try {
            const response = await LevelService.getAll(authenticationService.getUserTenantId())

            if (response.status === 200) {
                const levels = response.data?.map((level) => ({
                    label: level?.name,
                    value: level?.id,
                }));
                setLevelsList(levels);
            } else {
                console.log("Request was not successful. Status:", response.status);
            }
        } catch (error) {
            console.error("Error occured during fetching departments:", error);
        }
    };

    useEffect(() => {
        fetchLevels();
    }, [open]);

    const handleFormSubmit = async (values) => {
        console.log("submitted: ", values)

        try {
            setLoading(true);
            setDisabled(true);

            const data = {
                ...values,
                institution: institution
            }
            console.log("request Data: ", data);

            const response = await GradeScaleService.update(gradingScale?.id, data);

            if (response.status === 200) {
                message.success("Grade Updated Successfully");
                refreshPage()
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

    const toInputUppercase = e => {
        e.target.value = ("" + e.target.value).toUpperCase();
    };

    const handleClear = () => {
        form.resetFields();
    }

    // console.clear()
    return (
        <>
            <Modal
                title={"Edit Grade Scaling"}
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
                        label="Level"
                        name="level"
                    >
                        <Select
                            defaultValue={gradingScale?.level?.id}
                            placeholder="level"
                            size="large"
                            options={levelsList}
                        />
                    </Form.Item>

                    <div className="row align-items-baseline">
                        <div className="col-4">
                            <Form.Item
                                label="Grade name"
                                name="symbol"
                            >
                                <Input
                                    placeholder="A"
                                    size="large"
                                    maxLength={2}
                                    count={{
                                        show: true,
                                        max: 2,
                                    }}
                                    className="w-100"
                                    defaultValue={gradingScale?.symbol}
                                    onInput={toInputUppercase}
                                />
                            </Form.Item>
                        </div>
                        <div className="col-4">
                            <Form.Item
                                label="Upper limit"
                                name="upperLimit"
                            >
                                <InputNumber
                                    defaultValue={gradingScale?.upperLimit}
                                    placeholder="100"
                                    size="large"
                                    type="number"
                                    className="w-100"
                                    min={1}
                                    max={100}
                                />
                            </Form.Item>
                        </div>
                        <div className="col-4">
                            <Form.Item
                                label="Lower limit"
                                name="lowerLimit"
                            >
                                <Input
                                    defaultValue={gradingScale?.lowerLimit}
                                    className="w-100"
                                    placeholder="80"
                                    type="number"
                                    size="large"
                                    min={0}
                                    max={100}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        className="mt-4"
                        loading={loading}
                        disabled={disabled}
                        block
                        htmlType="submit"
                    >
                        Edit grade
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default EditGradingScale;
