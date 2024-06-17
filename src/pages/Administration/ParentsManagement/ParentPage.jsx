import { useLoaderData } from "react-router-dom";
import {
    Card,
    Divider,
    Form,
    Input,
    Empty,
} from "antd";
import parentService from "../../../services/parent.service";
import BackButton from "../../../common/BackButton";


export async function parentPageLoader({ params }) {
    try {
        const parentResponse = await parentService.getParent(params?.id);
        if (parentResponse?.status === 200) {
            const parents = parentResponse.data;

            return { parents: parents };
        }
    } catch (e) {
        return { parents: [] };
    }
}

const ParentPage = () => {
    const { parents } = useLoaderData();

    return (
        <div className='mx-5'>
            <BackButton />

            <Divider className='my-3' type={"horizontal"} />

            <Form layout="vertical">
                <fieldset>
                    <legend className="text-bold">
                        <h4>Parent Information</h4>
                    </legend>

                    <div className="row">
                        <div className="col-md-3">
                            <Card>
                                <Form.Item label="First name">
                                    <Input size="large" value={parents?.user?.firstName} />
                                </Form.Item>
                                <Form.Item label="Username">
                                    <Input size="large" value={parents?.user?.username} />
                                </Form.Item>
                                <Form.Item label="Last name">
                                    <Input size="large" value={parents?.user?.lastName} />
                                </Form.Item>
                                <Form.Item label="Email">
                                    <Input size="large" value={parents?.user?.email} />
                                </Form.Item>
                                <Form.Item label="Password">
                                    <Input size="large" value={parents?.user?.password} />
                                </Form.Item>
                            </Card>
                        </div>
                        <div className="col-md-9">
                            <div className="row mb-2">
                                <div className="col-lg-6 col-md-6">
                                    <Card>
                                        <Form.Item label="Address">
                                            <Input size={"large"} value={parents?.address} />
                                        </Form.Item>
                                        <Form.Item label="Gender">
                                            <Input size="large" value={parents?.user?.gender} />
                                        </Form.Item>
                                    </Card>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <Card>
                                        <Form.Item label="Phone number">
                                            <Input
                                                size="large"
                                                value={parents?.user?.phoneNumber}
                                            />
                                        </Form.Item>
                                        <Form.Item label="NationalId">
                                            <Input size="large" placeholder="63-232257R18"
                                                value={parents?.nationalId} />
                                        </Form.Item>
                                    </Card>
                                </div>
                            </div>
                            <Card className="mt-4">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <Form.Item label="Employer Address">
                                                    <Input
                                                        size="large"
                                                        value={parents?.employer_address}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <Form.Item label="Occupation">
                                                    <Input
                                                        size="large"
                                                        value={parents?.occupation}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div className="col-md-6">
                                                <Form.Item label="Monthly income">
                                                    <Input
                                                        size="large"
                                                        value={parents?.monthlyIncome}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <Form.Item label="Parent type">
                                            <Input size="large" value={parents?.parentType} />
                                        </Form.Item>
                                        <Form.Item label="Single parent">
                                            <Input size="large" value={parents?.singleParent} />
                                        </Form.Item>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend className="text-bold mt-4">
                        <h4>Children</h4>
                    </legend>
                    <div className="row">
                        {parents?.students && parents?.students.map((student, key) =>
                            <>
                                <Card className="mb-2">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6">
                                            <Form.Item label="First name">
                                                <Input size="large" value={student?.user.firstName} />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <Form.Item label="Last name">
                                                <Input size="large" value={student?.user.lastName} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12">
                                            <Form.Item label="Username">
                                                <Input size="large" value={student?.user.username} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Card>
                            </>
                        )}

                    </div>

                </fieldset>
            </Form>
        </div>
    );
};

export default ParentPage;
