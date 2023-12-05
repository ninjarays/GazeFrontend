import React from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import GazeLogin from './gazeLogin';
import OtherLogin from './otherLogin';

export const LoginTab = () => {
  return (
    <div className='login-tab'><Tabs
    defaultActiveKey="Gaze"
    id="uncontrolled-tab-example"
    className="mb-3 tab-container"
  >
    <Tab eventKey="others" title="Others">
      <OtherLogin/>
    </Tab>
    <Tab eventKey="Gaze" title="Gaze Portal">
      <GazeLogin/>
    </Tab>
  </Tabs></div>
  )
}

export default LoginTab
