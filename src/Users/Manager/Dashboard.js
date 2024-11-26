/*!

=========================================================
* Vision UI Free Chakra - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-chakra
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-chakra/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// Chakra imports
import {
	Box,
	Button,
	CircularProgress,
	CircularProgressLabel,
	Flex,
	Grid,
	Icon,
	Progress,
	SimpleGrid,
	Spacer,
	Stack,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Table,
	Tbody,
	Text,
	Th,
	Td,
	Thead,
	Tr
} from '@chakra-ui/react';
// Styles for the circular progressbar
import medusa from 'assets/img/cardimgfree.png';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import BarChart from 'components/Charts/BarChart';
import LineChart from 'components/Charts/LineChart';
import IconBox from 'components/Icons/IconBox';
// Icons
import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon } from 'components/Icons/Icons.js';
import DashboardTableRow from 'components/Tables/DashboardTableRow';
import TimelineRow from 'components/Tables/TimelineRow';
import React from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { BiHappy } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { IoCheckmarkDoneCircleSharp, IoEllipsisHorizontal } from 'react-icons/io5';
// Data
import {
	barChartDataDashboard,
	barChartOptionsDashboard,
	lineChartDataDashboard,
	lineChartOptionsDashboard
} from 'variables/charts';
import { dashboardTableData, timelineData } from 'variables/general';

export default function Dashboard() {
	return (
		<Flex flexDirection='column' pt={{ base: '120px', md: '75px' }}>
			<SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='24px'>
				{/* MiniStatistics Card */}
				<Card>
					<CardBody>
						<Flex flexDirection='row' align='center' justify='center' w='100%'>
							<Stat me='auto'>
								<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
									Total Vendors
								</StatLabel>
								<Flex>
									<StatNumber fontSize='lg' color='#fff'>
										25
									</StatNumber>
									<StatHelpText
										alignSelf='flex-end'
										justifySelf='flex-end'
										m='0px'
										color='green.400'
										fontWeight='bold'
										ps='3px'
										fontSize='md'>
										+5%
									</StatHelpText>
								</Flex>
							</Stat>
							<IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
								<WalletIcon h={'24px'} w={'24px'} color='#fff' />
							</IconBox>
						</Flex>
					</CardBody>
				</Card>
				{/* MiniStatistics Card */}
				<Card>
					<CardBody>
						<Flex flexDirection='row' align='center' justify='center' w='100%'>
							<Stat me='auto'>
								<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
									Total Employees
								</StatLabel>
								<Flex>
									<StatNumber fontSize='lg' color='#fff' fontWeight='bold'>
										150
									</StatNumber>
									<StatHelpText
										alignSelf='flex-end'
										justifySelf='flex-end'
										m='0px'
										color='green.400'
										fontWeight='bold'
										ps='3px'
										fontSize='md'>
										+8%
									</StatHelpText>
								</Flex>
							</Stat>
							<IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
								<CartIcon h={'24px'} w={'24px'} color='#fff' />
							</IconBox>
						</Flex>
					</CardBody>
				</Card>
				{/* MiniStatistics Card */}
				<Card minH='83px'>
					<CardBody>
						<Flex flexDirection='row' align='center' justify='center' w='100%'>
							<Stat me='auto'>
								<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
									Total Inventory Items
								</StatLabel>
								<Flex>
									<StatNumber fontSize='lg' color='#fff'>
										300
									</StatNumber>
									<StatHelpText
										alignSelf='flex-end'
										justifySelf='flex-end'
										m='0px'
										color='green.400'
										fontWeight='bold'
										ps='3px'
										fontSize='md'>
										+5%
									</StatHelpText>
								</Flex>
							</Stat>
							<IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
								<GlobeIcon h={'24px'} w={'24px'} color='#fff' />
							</IconBox>
						</Flex>
					</CardBody>
				</Card>
				{/* MiniStatistics Card */}
				<Card>
					<CardBody>
						<Flex flexDirection='row' align='center' justify='center' w='100%'>
							<Stat>
								<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
									ALL Departments
								</StatLabel>
								<Flex>
									<StatNumber fontSize='lg' color='#fff'>
										5
									</StatNumber>
									<StatHelpText
										alignSelf='flex-end'
										justifySelf='flex-end'
										m='0px'
										color='red.500'
										fontWeight='bold'
										ps='3px'
										fontSize='md'>
										
									</StatHelpText>
								</Flex>
							</Stat>
							<Spacer />
							<IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
								<DocumentIcon h={'24px'} w={'24px'} color='#fff' />
							</IconBox>
						</Flex>
					</CardBody>
				</Card>
				
			</SimpleGrid>
			<Grid templateColumns={{ sm: '1fr', md: '1fr 1fr', '2xl': '2fr 1.2fr 1.5fr' }} my='26px' gap='18px'>
				{/* Welcome Card */}
				<Card
					p='0px'
					gridArea={{ md: '1 / 1 / 2 / 3', '2xl': 'auto' }}
					bgImage={medusa}
					bgSize='cover'
					bgPosition='50%'>
					<CardBody w='100%' h='100%'>
						<Flex flexDirection={{ sm: 'column', lg: 'row' }} w='100%' h='100%'>
							<Flex flexDirection='column' h='100%' p='22px' minW='60%' lineHeight='1.6'>
								<Text fontSize='sm' color='gray.400' fontWeight='bold'>
									Welcome back,
								</Text>
								<Text fontSize='28px' color='#fff' fontWeight='bold' mb='18px'>
									Mr. Manager
								</Text>
								<Text fontSize='md' color='gray.400' fontWeight='normal' mb='auto'>
									Glad to see you again! <br />
								</Text>
								<Spacer />
								<Flex align='center'>
								</Flex>
							</Flex>
						</Flex>
					</CardBody>
				</Card>
				{/* Recent Checkouts */}
				<Card gridArea={{ md: '2 / 1 / 3 / 2', '2xl': 'auto' }} p={6} boxShadow="md">
    <CardHeader mb="24px">
      <Text color="#fff" fontSize="lg" fontWeight="bold" mb="4px">
        Recent Checkouts
      </Text>
    </CardHeader>
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th color="white">Product</Th>
          <Th color="white" alignItems="center">Quantity</Th>
          <Th color="white" isNumeric>Time</Th>
        </Tr>
      </Thead>
      <Tbody>
        {/* Replace with actual data */}
        <Tr>
          <Td color="white">Product 1</Td>
          <Td color="white">Customer A</Td>
          <Td color="white" isNumeric>$45.00</Td>
        </Tr>
        <Tr>
          <Td color="white">Product 2</Td>
          <Td color="white">Customer B</Td>
          <Td color="white" isNumeric>$30.00</Td>
        </Tr>
        <Tr>
          <Td color="white">Product 3</Td>
          <Td color="white">Customer C</Td>
          <Td color="white" isNumeric>$25.00</Td>
        </Tr>
      </Tbody>
    </Table>
  </Card>

  {/* Recent Invoices */}
  <Card gridArea={{ md: '2 / 2 / 3 / 3', '2xl': 'auto' }} p={6} boxShadow="md">
    <CardHeader mb="24px">
      <Text color="#fff" fontSize="lg" fontWeight="bold" mb="4px">
        Recent Invoices
      </Text>
    </CardHeader>
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th color="white">Invoice #</Th>
          <Th color="white">Customer</Th>
          <Th color="white" isNumeric>Date</Th>
        </Tr>
      </Thead>
      <Tbody>
        {/* Replace with actual data */}
        <Tr>
          <Td color="white">#001</Td>
          <Td color="white">Customer A</Td>
          <Td color="white" isNumeric>2024-11-19</Td>
        </Tr>
        <Tr>
          <Td color="white">#002</Td>
          <Td color="white">Customer B</Td>
          <Td color="white" isNumeric>2024-11-18</Td>
        </Tr>
        <Tr>
          <Td color="white">#003</Td>
          <Td color="white">Customer C</Td>
          <Td color="white" isNumeric>2024-11-17</Td>
        </Tr>
      </Tbody>
    </Table>
  </Card>

  {/* Aging Inventory */}
  <Card gridArea={{ md: '3 / 1 / 4 / 2', '2xl': 'auto' }} p={6} boxShadow="md">
    <CardHeader mb="24px">
      <Text color="#fff" fontSize="lg" fontWeight="bold" mb="4px">
        Aging Inventory
      </Text>
    </CardHeader>
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th color="white">Item</Th>
          <Th color="white">Quantity</Th>
          <Th color="white" isNumeric>Days in Stock</Th>
        </Tr>
      </Thead>
      <Tbody>
        {/* Replace with actual data */}
        <Tr>
          <Td color="white">Item 1</Td>
          <Td color="white">100</Td>
          <Td color="white" isNumeric>45</Td>
        </Tr>
        <Tr>
          <Td color="white">Item 2</Td>
          <Td color="white">150</Td>
          <Td color="white" isNumeric>30</Td>
        </Tr>
        <Tr>
          <Td color="white">Item 3</Td>
          <Td color="white">200</Td>
          <Td color="white" isNumeric>60</Td>
        </Tr>
      </Tbody>
    </Table>
  </Card>

  {/* Low Stock Items */}
  <Card gridArea={{ md: '3 / 2 / 4 / 3', '2xl': 'auto' }} p={6} boxShadow="md">
    <CardHeader mb="24px">
      <Text color="#fff" fontSize="lg" fontWeight="bold" mb="4px">
        Low Stock Items
      </Text>
    </CardHeader>
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th color="white">Item</Th>
          <Th color="white">Quantity</Th>
          <Th color="white" isNumeric>Restock Level</Th>
        </Tr>
      </Thead>
      <Tbody>
        {/* Replace with actual data */}
        <Tr>
          <Td color="white">Item A</Td>
          <Td color="white">10</Td>
          <Td color="white" isNumeric>15</Td>
        </Tr>
        <Tr>
          <Td color="white">Item B</Td>
          <Td color="white">5</Td>
          <Td color="white" isNumeric>10</Td>
        </Tr>
        <Tr>
          <Td color="white">Item C</Td>
          <Td color="white">8</Td>
          <Td color="white" isNumeric>20</Td>
        </Tr>
      </Tbody>
    </Table>
  </Card>
			</Grid>
			<Grid
			templateColumns={{ sm: '1fr', lg: '2fr 1fr' }} // Adjusted to give the Sales Overview column more space
			maxW={{ sm: '100%', md: '100%' }}
			gap='24px'
			mb='24px'
			>
			{/* Sales Overview */}
			<Flex direction='column' gridColumn={{ lg: 'span 2' }} w='100%'> {/* Span both columns on large screens */}
				<Card p='28px 0px 0px 0px' w='100%'>
				<CardHeader mb='20px' ps='22px'>
					<Flex direction='column' alignSelf='flex-start'>
					<Text fontSize='lg' color='#fff' fontWeight='bold' mb='6px'>
						Inventory Overview
					</Text>
					<Text fontSize='md' fontWeight='medium' color='gray.400'>
						<Text as='span' color='green.400' fontWeight='bold'>
						(+5%) more
						</Text>{' '}
						in 2024
					</Text>
					</Flex>
				</CardHeader>
				<Box w='100%' minH={{ sm: '300px' }}>
					<LineChart
					lineChartData={lineChartDataDashboard}
					lineChartOptions={lineChartOptionsDashboard}
					/>
				</Box>
				</Card>
			`</Flex>
			
			</Grid>
		</Flex>
	);
}
