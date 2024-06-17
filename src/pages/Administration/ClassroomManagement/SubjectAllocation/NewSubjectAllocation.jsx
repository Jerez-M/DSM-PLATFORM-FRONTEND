import { Button, Checkbox, Form, Modal, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import authenticationService from "../../../../services/authentication.service";
import subjectService from "../../../../services/subject.service";
import teacherService from "../../../../services/teacher.service";
import studentClassService from "../../../../services/classroom.service";
import subjectAllocationService from "../../../../services/subject-allocation.service";
import {handleError} from "../../../../common";

const NewSubjectAllocation = ({ open, close }) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [subjectList, setSubjectList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [classroomList, setClassroomList] = useState([]);

  const [form] = Form.useForm();


  const [formData, setFormData] = useState({
    teacher: null,
    classroom: null,
    subject: null,
    status: true,
  });

  const handleFormChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const handleFormSubmit = async () => {
    const { teacher, subject, classroom, status} = formData;
    try {
      setLoading(true);
      setDisabled(true)

      const data = {
        teacher,
        subject,
        classroom,
        status
      };

      console.log("request Data: ", data);
      const response = await subjectAllocationService.create(data);

      if (response.status === 200) {
        console.log("New subject allocation created:", response.data);
        await message.success("Subject allocation Added Successfully");
        window.location.reload()
      } else {
        console.log("Request was not successful. Status:", response.status);
        message.error("An error occurred, please check your network.");
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

  const tenantId = authenticationService.getUserTenantId();

  const fetchFormData = async () => {
    try {
      const subjectResponse = await subjectService.getAll(tenantId)
      const teacherResponse = await teacherService.getAllTeachersByInstitutionId(tenantId)
      const classroomResponse = await studentClassService.getAll(tenantId)

      if (subjectResponse.status === 200 && teacherResponse.status === 200 && classroomResponse.status === 200) {
        const subjectsMapped = subjectResponse.data?.map((subject)=> ({
          label: subject?.name,
          value: subject?.id
        }))
        const teacherMapped = teacherResponse.data?.map((teacher)=> ({
          label: `${teacher?.user?.firstName} ${teacher?.user?.lastName}`,
          value: teacher?.id
        }))
        const classroomMapped = classroomResponse.data?.map((classroom)=> ({
          label: `${classroom?.level?.name} - ${classroom?.name}`,
          value: classroom?.id
        }))

        setSubjectList(subjectsMapped);
        setClassroomList(classroomMapped)
        setTeacherList(teacherMapped)

      } else {
        console.log("Request was not successful");
      }
    } catch (error) {
      console.error("Error occured during fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  console.clear()
  return (
    <>
      <Modal
        title="Add new subject class"
        open={open}
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
              label="Teacher"
              name="teacher"
              rules={[{ required: true, message: "Teacher is required!" }]}
          >
            <Select
              placeholder="Teacher"
              size="large"
              onChange={(value) => handleFormChange("teacher", value)}
              options={teacherList}
            />
          </Form.Item>
          <Form.Item
              label="Subject"
              name="subject"
              rules={[{ required: true, message: "Subject is required!" }]}
          >
            <Select
              placeholder="Subject"
              size="large"
              onChange={(value) => handleFormChange("subject", value)}
              options={subjectList}
            />
          </Form.Item>
          <Form.Item
              label="Classroom"
              name="classroom"
              rules={[{ required: true, message: "Classroom is required!" }]}
          >
            <Select
              placeholder="classroom"
              size="large"
              onChange={(value) => handleFormChange("classroom", value)}
              mode="multiple"
              options={classroomList}
            />
          </Form.Item>
          <Form.Item
            label="Status"
            help="Mark if the teacher is active"
          >
            <Checkbox defaultChecked={true} onChange={(e) => handleFormChange("status", e.target.checked)}>active</Checkbox>
          </Form.Item>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            size="large"
            loading={loading}
            disabled={disabled}
            block
            htmlType="submit"
          >
            Add new subject allocation
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default NewSubjectAllocation;
