import InstitutionService from "../../../services/institution.service";
import {useLoaderData} from "react-router-dom";
import {Button, Card, Divider, message, Modal, Tag} from "antd";
import {useState} from "react";
import StudentService from "../../../services/student.service";
import {ArrowLeftOutlined} from "@ant-design/icons";


export const institutionInformationLoader = async ({ params }) => {
    try {
        const response = await InstitutionService.get(params.id);
        const students = await StudentService.getTotalNumberOfStudentsByInstitutionId(params.id);
        if(response?.status === 200) {
            const institution = response.data;
            const _students = students.data;
            return { institution, _students };
        }
    } catch (e) {
        return []
    }
}
const InstitutionInformation = () => {
    const { institution, _students } = useLoaderData();
    const [updateInstitutionLogoModalState, setUpdateInstitutionLogoModalState] = useState(false);

    const handleUpdateInstitutionLogo = async (e) => {
        e.preventDefault();
        const form = document.getElementById('update-institution-logo');
        const formData = new FormData(form);

        try {
            const response = await InstitutionService.updateInstitutionLogo(institution?.tenant_id, formData);
            if(response?.status === 200) {
                message.success('Institution logo updated successfully');
                setUpdateInstitutionLogoModalState(false);
                window.location.reload();
            }
        } catch (e) {
            message.error('An error occurred while updating institution logo');
        }
    }
    return (
        <div>
            <ArrowLeftOutlined
                className='mb-3'
                onClick={() => window.history.back()}
            />
            <h5>{institution?.institution_name}</h5>
            <Divider type={"horizontal"} />

            <div className='row'>
                <div className='col-md-3'>
                    <Card>

                        <img
                            src={institution?.logo}
                            alt={institution?.institution_name}
                            height={200}
                            width={200}
                            className='rounded-circle'
                        />
                        <Button
                            type={"primary"}
                            ghost={true}
                            className={'d-block'}
                            size='small'
                            onClick={() => setUpdateInstitutionLogoModalState(true)}
                        >
                            Update logo
                        </Button>

                        <div>
                            <h3 className='small text-muted mt-4'>Mission</h3>
                            <p>{
                                institution?.mission !== '' ? institution?.mission : 'No mission statement'
                            }</p>
                            <h3 className='small text-muted'>Vision</h3>
                            <p>{
                                institution?.vision !== '' ? institution?.vision : 'No vision statement'
                            }</p>
                        </div>
                    </Card>
                </div>
                <div className='col-md-9'>
                    <Card>
                        <h2>Information</h2>
                        <Divider type={"horizontal"} />
                        <div className='row'>
                            <div className='col-md-5'>
                                <p>
                                    <strong>Status:</strong> &nbsp;
                                    {institution?.active ? <Tag color='green'>Active</Tag> : <Tag color='red'>Inactive</Tag>}
                                </p>
                                <p><strong>Institution ID:</strong> {institution?.tenant_id}</p>
                                <p><strong>Institution code:</strong> {institution?.institution_code}</p>
                                <p><strong>Account #:</strong> <Tag>{institution?.institution_account_number}</Tag></p>
                                <p><strong>Phone number:</strong> {institution?.phone_number}</p>
                                <p><strong>Email:</strong> {institution?.email_address}</p>
                            </div>
                            <div className='col-md-4'>
                                <p><strong>Address:</strong> {institution?.address}</p>
                                <p><strong>District:</strong> {institution?.district}</p>
                                <p><strong>Province:</strong> {institution?.province}</p>
                                <p><strong>Country:</strong> {institution?.country}</p>
                                <p><strong>Zip code:</strong> {institution?.zip_code}</p>
                            </div>
                            <div className='col-md-3'>
                                <p><strong>Number of students:</strong>
                                    <Tag color='green' bordered={false}>{_students?.total_students}</Tag></p>
                                <p><strong>Students gender:</strong> {institution?.students_gender}</p>
                                <p><strong>Ownership:</strong> {institution?.ownership}</p>
                                <p><strong>Created at:</strong> {institution?.created_at}</p>
                                <p><strong>Updated at:</strong> {institution?.updated_at}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <Modal
                title='Update institution logo'
                open={updateInstitutionLogoModalState}
                onCancel={() => setUpdateInstitutionLogoModalState(false)}
                okButtonProps={{
                    className: 'd-none'
                }}
                cancelButtonProps={{
                    className: 'd-none'
                }}
                destroyOnClose={true}
            >
                <form
                    method='post'
                    encType='multipart/form-data'
                    id={`update-institution-logo`}
                    onSubmit={handleUpdateInstitutionLogo}
                >
                    <div className='mb-3'>
                        <label htmlFor='logo' className='form-label'>Logo</label>
                        <input
                            type='file'
                            className='form-control form-control-lg'
                            id='logo'
                            name='logo'
                        />

                    </div>
                    <div className='mb-3'>
                        <Button
                            type='primary'
                            htmlType='submit'
                            block={true}
                            size={"large"}
                        >
                            Update logo
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default InstitutionInformation