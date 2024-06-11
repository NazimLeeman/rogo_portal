import React, { useEffect } from 'react';
import { Steps } from 'antd';
import { useFile } from '../../context/FileContext';



let description = 'This is a description.';
const Step: React.FC = () => {


        return (
    
    <Steps
direction="vertical"
current={1}
items={[
    {
        title: "Pending",
    description,
},
{
    title: 'Wating',
description,
},
{
    title: 'Waiting',
description,
},
]}
/>
);
}

export default Step;