import {Button, Form, Input, Modal, Select, message, InputNumber} from "antd";
import {useEffect, useState} from "react";
import authenticationService from "../../../../services/authentication.service";
import LevelService from "../../../../services/level.service";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import GradeScaleService from "../../../../services/grade-scale.service";
import {handleError, refreshPage} from "../../../../common";

const NewGradingScale = ({ open, close }) => {
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

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);
            setDisabled(true);

            let requestData = [];

            values.scales?.forEach(scale => {
                return values.level?.forEach(level => {
                    requestData.push({
                        institution,
                        level: level,
                        lowerLimit: +scale.lowerLimit,
                        upperLimit: +scale.upperLimit,
                        symbol: scale.symbol
                    })
                })
            })

            const response = await GradeScaleService.batchCreate(requestData);

            if (response.status === 200) {
                message.success("New grade Added Successfully");
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

    useEffect(() => {
        fetchLevels();
    }, [open]);

    const toInputUppercase = e => {
        e.target.value = ("" + e.target.value).toUpperCase();
    };

    return (
        <>
            <Modal
                title={"Add Grade Scaling for Level"}
                open={open}
                onCancel={close}
                getFieldsValue={true}
                okButtonProps={{
                    className: "d-none",
                }}
                cancelButtonProps={{
                    className: "d-none",
                }}
            >
                <Form
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        label="Levels"
                        name="level"
                        rules={[{ required: true, message: 'Level is required' }]}
                    >
                        <Select
                            placeholder="level"
                            mode="multiple"
                            size="large"
                            options={levelsList}
                        />
                    </Form.Item>

                    <Form.List
                        name="scales"
                        initialValue={[{}]}
                    >
                        {(fields, {add, remove}) => (
                            <div style={{display: 'flex', rowGap: 16, flexDirection: 'column'}}>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div className="row align-items-center" key={key}>
                                        <div className="row col-11 align-items-baseline">
                                            <div className="col-4">
                                                <Form.Item
                                                    label="Grade name"
                                                    name={[name, 'symbol']}
                                                    rules={[{ required: true, message: 'Missing grade name' }]}
                                                >
                                                    <Input
                                                        placeholder="A"
                                                        size="large"
                                                        maxLength={2}
                                                        count={{
                                                            show: true,
                                                            max: 2,
                                                        }}
                                                        onInput={toInputUppercase}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div className="col-4">
                                                <Form.Item
                                                    label="Upper limit"
                                                    name={[name, 'upperLimit']}
                                                    rules={[{ required: true, message: 'Missing Upper limit value' }]}
                                                >
                                                    <InputNumber
                                                        placeholder="100"
                                                        size="large"
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div className="col-4">
                                                <Form.Item
                                                    label="Lower limit"
                                                    name={[name, 'lowerLimit']}
                                                    rules={[{ required: true, message: 'Missing Lower limit value' }]}
                                                >
                                                    <Input
                                                        placeholder="80"
                                                        type="number"
                                                        size="large"
                                                        min={0}
                                                        max={100}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="col-1">
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    icon={<PlusOutlined/>}
                                    type="dashed"
                                    onClick={() => add()}
                                    size={"large"}
                                    block
                                >
                                    Add Grade scale
                                </Button>
                            </div>
                        )}
                    </Form.List>

                    <Button
                        type="primary"
                        size="large"
                        className="mt-4"
                        loading={loading}
                        disabled={disabled}
                        block
                        htmlType="submit"
                    >
                        Add new grade
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default NewGradingScale;
