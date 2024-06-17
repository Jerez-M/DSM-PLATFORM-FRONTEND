import {Avatar, Card} from "antd";
import studentPlaceholder from "../../../Assets/images/student-placeholder.png";
import Meta from "antd/es/card/Meta";

const ChildCard = ({student, onClick}) => {
  return (
      <Card
          hoverable={true}
          onClick={() => onClick()}
          className="m-1"
          style={{minWidth: 300}}
      >
          <Meta
              avatar={<Avatar
                  src={studentPlaceholder}
                  size={100}
                  // style={{backgroundColor: "#e1e1e1"}}
              />}
              title={`${student.user?.firstName} ${student.user?.lastName}`}
              description={<div className="mt-3">
                  <span className="d-block">Level: <strong>{student.level?.name}</strong></span>
                  <span className="d-block">Reg-number: <strong>{student.user?.username}</strong></span>
              </div>}
          />
      </Card>
  )
}

export default ChildCard;