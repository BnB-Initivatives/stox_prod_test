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
import LineChart from 'components/Charts/LineChart';
import IconBox from 'components/Icons/IconBox';
// Icons
import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon } from 'components/Icons/Icons.js';
import React ,{useState, useEffect}from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { BiHappy } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { IoCheckmarkDoneCircleSharp, IoEllipsisHorizontal } from 'react-icons/io5';
// Data
import {
	lineChartDataDashboard,
	lineChartOptionsDashboard
} from 'variables/charts';
import { dashboardTableData, timelineData } from 'variables/general';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
export default function Dashboard() {
	const [vendorCount, setVendorCount] = useState(0); // Initialize state as an empty array
	const [employeeCount, setEmployeeCount] = useState(0);
	const [itemCount, setItemCount] = useState(0);
	const [departmentCount, setDepartmentCount] = useState(0);
	const [loading, setLoading] = useState(true);  // State to store the vendor count
	
	useEffect(() => {
		// Fetch vendor data from the backend
		const API_URL = process.env.REACT_APP_API_URL;
		console.log(API_URL);
		console.log(`${API_URL}/vendors/`);
	
		fetch(`${API_URL}/vendors/`)
			.then(response => response.json())
			.then(data => {
				console.log('Fetched Data:', data);  // Log the fetched data
	
				// Check if the data is an array and if vendor_id is present
				if (Array.isArray(data) && data.length > 0) {
					// Extract vendor_ids from the data
					const vendorIds = data.map(user => user.vendor_id);
					console.log('Extracted Vendor IDs:', vendorIds);  // Log the vendor_ids
	
					// Create a Set to get unique vendor_ids
					const uniqueVendors = new Set(vendorIds); 
	
					// Check the size of the Set
					console.log('Unique Vendor Count:', uniqueVendors.size);
	
					// Set the unique vendor count
					setVendorCount(uniqueVendors.size); // Use size of the Set for unique count
				} else {
					console.log('No vendors data or invalid format');
					setVendorCount(0);
				}
			})
			.catch(error => {
				console.error('Error fetching vendors:', error);
				setVendorCount(0); // Set to 0 in case of error
			});
			
			fetch(`${API_URL}/employees/`)
			.then((response) => response.json())
			.then((data) => {
			  if (Array.isArray(data) && data.length > 0) {
				setEmployeeCount(data.length);
			  } else {
				setEmployeeCount(0);
			  }
			})
			.catch((error) => {
			  console.error('Error fetching employees:', error);
			  setEmployeeCount(0);
			});
			
			fetch(`${API_URL}/items/`)
			.then((response) => response.json())
			.then((data) => {
				if (Array.isArray(data)) {
				setItemCount(data.length);
				} else {
				setItemCount(0);
				}
			})
			.catch((error) => {
				console.error('Error fetching items:', error);
				setItemCount(0);
			});

			fetch(`${API_URL}/departments/`)
				.then((response) => response.json())
				.then((data) => {
					if (Array.isArray(data)) {
					setDepartmentCount(data.length); // Set department count
					} else {
					setDepartmentCount(0);
					}
				})
				.catch((error) => {
					console.error('Error fetching departments:', error);
					setDepartmentCount(0);
				});
	}, []);
	
	// const vendorCount = userData.length;
	console.log(vendorCount);
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
										{vendorCount}
									</StatNumber>
									<StatHelpText
										alignSelf='flex-end'
										justifySelf='flex-end'
										m='0px'
										color='green.400'
										fontWeight='bold'
										ps='3px'
										fontSize='md'>
									
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
						<Flex flexDirection="row" align="center" justify="center" w="100%">
						<Stat me="auto">
							<StatLabel fontSize="sm" color="gray.400" fontWeight="bold" pb="2px">
							Total Employees
							</StatLabel>
							<Flex>
							<StatNumber fontSize="lg" color="#fff" fontWeight="bold">
								{employeeCount} 
							</StatNumber>
							</Flex>
						</Stat>
						<IconBox as="box" h={'45px'} w={'45px'} bg="brand.200">
							<CartIcon h={'24px'} w={'24px'} color="#fff" />
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
										{itemCount}
									</StatNumber>									
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
								<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px' whiteSpace="nowrap">
									ALL Departments
								</StatLabel>
								<Flex>
									<StatNumber fontSize='lg' color='#fff'>
										{departmentCount}
									</StatNumber>
									
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
									Mr. Harrison
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
				{/* Satisfaction Rate */}
				<Card gridArea={{ md: '2 / 1 / 3 / 2', '2xl': 'auto' }}>
					<CardHeader mb='24px'>
						<Flex direction='column'>
							<Text color='#fff' fontSize='lg' fontWeight='bold' mb='4px'>
								Recent Checkouts
							</Text>
						</Flex>
					</CardHeader>
				</Card>
				{/* Inter-Store transfers */}
				<Card gridArea={{ md: '2 / 2 / 3 / 3', '2xl': 'auto' }}>
					<Flex direction='column'>
						<Flex justify='space-between' align='center' mb='40px'>
							<Text color='#fff' fontSize='lg' fontWeight='bold'>
							Recent Invoices
							</Text>	
						</Flex>						
						</Flex>
				</Card>
				
				<Card gridArea={{ md: '3 / 1 / 4 / 2', '2xl': 'auto' }} p={6} boxShadow="md">
					<CardHeader mb="24px">
					<Flex direction="column">
						<Text color="#fff" fontSize="lg" fontWeight="bold" mb="4px">
						Department Specific Inventory
						</Text>
					</Flex>
					</CardHeader>
				</Card>
				
				<Card gridArea={{ md: '4 / 1 / 5 / 2', '2xl': 'auto' }} p={6} boxShadow="md">
					<CardHeader mb="24px">
					<Flex direction="column">
						<Text color="#fff" fontSize="lg" fontWeight="bold" mb="4px">
						Aging Inventory
						</Text>
						
					</Flex>
					</CardHeader>
				</Card>

				{/* Additional Card 2 */}
				<Card gridArea={{ md: '4 / 2 / 5 / 3', '2xl': 'auto' }} p={6} boxShadow="md">
					<CardHeader mb="24px">
					<Flex direction="column">
						<Text color="#fff" fontSize="lg" fontWeight="bold" mb="4px">
						Vendor Performance
						</Text>
						
					</Flex>
					</CardHeader>
				</Card>

				{/* Inter-Store Transfers */}
				<Card gridArea={{ md: '3 / 2 / 4 / 3', '2xl': 'auto' }} p={6} boxShadow="md">
					<Flex direction="column">
					<Flex justify="space-between" align="center" mb="40px">
						<Text color="#fff" fontSize="lg" fontWeight="bold">
						Low Stock Items
						</Text>
					</Flex>
					</Flex>
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