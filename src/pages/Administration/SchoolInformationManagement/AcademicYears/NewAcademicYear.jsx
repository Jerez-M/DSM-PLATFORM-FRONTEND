import {useState, useEffect} from "react";
import {Button, DatePicker, Divider, Form, Modal, message, Checkbox} from "antd";
import academicYearService from "../../../../services/academic-year.service";
import authenticationService from "../../../../services/authentication.service";
import {handleError} from "../../../../common";

const NewAcademicYear = ({open, close}) => {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [formData, setFormData] = useState({

        name: null,
        startDate: "",
        endDate: "",
        graduation_date: null,
        active_year: "false"
    });

    const institution = authenticationService.getUserTenantId()
    console.log("institution is: ", institution)

    const handleFormChange = (field, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: value,
        }));
    };

    const handleFormSubmit = async () => {
        try {
            setLoading(true);
            setDisabled(true)
            const {name, startDate, endDate, graduation_date, active_year} = formData;
            const data = {
                name,
                startDate,
                endDate,
                graduation_date,
                active_year,
                institution
            };
            console.log("form data: ", data);
            const response = await academicYearService.createAcademicYear(data)

            if (response.status === 201) {
                await window.location.reload()
                console.log("New academic year created:", response.data);
                message.success("Academic Year Added Successfully");
            } else {
                console.log("Request was not successful. Status:", response.status);
                message.error("An error occurred while creating the academic year.");
            }
        } catch (error) {
            console.error("Error creating new academic year:", error);
            handleError(error)
        } finally {
            setLoading(false);
            setDisabled(false)

            close();
        }
    };

    // console.clear()
    return (
        <>
            <Modal
                title="Add new academic year"
                visible={open}
                onCancel={close}
                footer={null}
            >
                <Form layout="vertical">
                    <Form.Item label="Year">
                        <DatePicker
                            className="w-100"
                            size="large"
                            onChange={(date, dateString) =>
                                handleFormChange("name", dateString)
                            }
                            picker="year"
                        />
                    </Form.Item>
                    <Divider type="horizontal"/>
                    <Form.Item
                        label="Year duration"
                        help="State the starting and ending dates for the academic year."
                    >
                        <DatePicker.RangePicker
                            className="w-100"
                            size="large"
                            onChange={(dates, dateStrings) => {
                                handleFormChange("startDate", dateStrings[0]);
                                handleFormChange("endDate", dateStrings[1]);
                            }}
                        />
                    </Form.Item>
                    <Divider type="horizontal"/>
                    <Form.Item label="Graduation date">
                        <DatePicker
                            className="w-100"
                            size="large"
                            onChange={(date, dateString) =>
                                handleFormChange("graduation_date", dateString)
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Active Year"
                        help="Mark if it is the current year"
                    >
                        <Checkbox onChange={(e) => handleFormChange("active_year", e.target.checked)}>Active
                            Year</Checkbox>
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
                        Add new academic year
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default NewAcademicYear;