import { Divider } from '@chakra-ui/react';
import React from 'react';

const LeaderBoard = () => {
    const iframeStyle = {
        borderBottom: '15px double black', // Adjust the border size as needed
      };
  return (
    <div style={{ margin: 0, padding: 0, height: '100vh' }}>
      <h1 style={{ fontSize: '45px', marginBottom: '20px' }}>Teams Data</h1>

      {/* First iframe */}
      <iframe
        title="Teams"
        width="100%"
        height="100%"
        src="https://lookerstudio.google.com/embed/reporting/0ad5dbb0-0a87-4a2f-af37-02b1e72f7ad1/page/RzxYD"
        style={iframeStyle}
      ></iframe>
        <br/><br/>
      {/* Second iframe */}
      <h1 style={{ fontSize: '45px', marginBottom: '20px' }}>User Data</h1>
      <iframe
        title="Users"
        width="100%"
        height="100%"
        src="https://lookerstudio.google.com/embed/reporting/dcc4f819-c042-4ad6-a046-80933ff444a8/page/6N3YD"
      ></iframe>
    </div>
  );
};

export default LeaderBoard;
