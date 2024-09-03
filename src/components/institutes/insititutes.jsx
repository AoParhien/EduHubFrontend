import { React, useState } from 'react'
import './institutes.css'
import TabBar from '../TabBar/TabBar';
import InstituteCard from '../institute-card/instituteCard';
// import { Flex, Button, IconButton } from '@chakra-ui/react';
// import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
// import { Card, CardBody, Image, Heading, Stack, Flex, Icon, Text, Box } from '@chakra-ui/react'


const Insititutes = () => {
    const tabs = ['O\'Levels', 'A\'Levels', 'Edexcel', 'Matric', 'Inter', 'ECAT', 'MCAT', 'BCOM'];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);

    const handleTabSelect = (tab) => {
        setSelectedTab(tab);
        console.log(selectedTab)
    };

    return (
        <div className='eduhub__institutes section__padding'>
            <div className='eduhub__institutes-content'>
                <h1>Insitutes On Board</h1>
            </div>
            <div className='eduhub__institutes-tabbar'>
                <TabBar tabs={tabs} onSelect={handleTabSelect} />
            </div>
            <div>
                <div className='eduhub__institutes-cards'>
                    <InstituteCard />
                    <InstituteCard />
                    <InstituteCard />
                    <InstituteCard />
                    <InstituteCard />
                </div>
            </div>

        </div>
    )
}

export default Insititutes
