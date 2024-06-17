import {Link} from "react-router-dom";
import React from "react";

import {Divider, Layout} from "antd";
const {Footer} = Layout;

const SystemFooter = () => {
    return (
        <>
            <Divider type={"horizontal"} className='m-0' />
            <Footer
                className='d-flex justify-content-center align-items-center pt-3 pb-1'
            >
                <p>
                    Brainstake Solutions E-Schools v1.0.0 &nbsp; | &nbsp;
                </p>
                <p>
                    <Link to='#'>Privacy policy</Link> &nbsp; | &nbsp;
                    <Link to='#'>Term and conditions</Link>
                </p>
            </Footer>
        </>
    )
}

export default SystemFooter;