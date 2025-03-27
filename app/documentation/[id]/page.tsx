// app/produtos/[id]/page.js
"use client";
import CombinedBarChart from "@/Components/Charts/HorizontalBarChart";
import PieChart from "@/Components/Charts/PieCharts";
import AreaHTTPService from "@/app/(lib)/request/areaHTTPService";
import SprintHTTPService from "@/app/(lib)/request/sprintHTTPService";
import { Badge, Box, Button, Card, CardBody, CardFooter, Divider, Flex, Heading, Icon, Image, Progress, Spacer, Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdNotificationsOff } from "react-icons/md";
import { TbMapOff, TbRoadOff, TbNotebookOff } from "react-icons/tb";
import { format } from 'date-fns';
import { IoMdEye } from "react-icons/io";
import IncludeProcessModal from "@/app/(components)/forms/includeProcess";
import { RiAddLine } from "react-icons/ri";
import IncludeDocumentationModal from "@/app/(components)/forms/includeDocumentation";



export default function SprintDetail() {
    const params = useParams();
    const id = params.id;
    const [sprint, setSprint] = useState();
    const [loading, setLoading] = useState(true);

    const [sprints, setSprints] = useState([]);

    const [isIncludeModalOpen, setIncludeModalOpen] = useState(false);

    useEffect(() => {
        getOneSprint(id);
        // getAllSprint(id)
    }, [id]);

    async function getOneSprint(id: any) {
        setLoading(true);
        try {
            const response = await SprintHTTPService.getOne(id);
            console.log(response.data);
            setSprint(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function getAllProcess(id: string) {
        setLoading(true);
        try {
            const response = await SprintHTTPService.getAll(1, 10, undefined, undefined, id);
            setSprints(response.data.list);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const bgStatus = (status: string) => {
        if (status === "AWAITING") {
            return "blue.400";
        }
        if (status === "STARTED") {
            return "yellow.400";
        }
        if (status === "COMPLETED") {
            return "green.400";
        }
        if (status === "CANCELLED") {
            return "red.400";
        }
    }

    // const openModal = (transaction: any) => {
    //     onOpen();
    //   };

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : !sprint ? (
                <Box bg='gray.200' w='100%' h='100vh' p={4} color={'gray.900'}>
                    <Flex w="100%" my="6" maxW={1600} mx="auto" px="60">
                        <Box bg='gray.200' w='100%' h='100vh' p={4} color={'gray.900'}>
                            <Heading>Documentação</Heading>
                            <Divider my="6" borderColor="gray.700" />
                            <Flex
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Icon as={TbMapOff} boxSize={150} />
                                <Heading color={'purple.900'}>
                                    Documentation não encontrada
                                </Heading>
                            </Flex>
                        </Box>
                    </Flex>
                </Box>
            ) : (

                <Box bg='gray.200' w='100v' height='100%' p={4} color={'gray.900'} mb={4}>
                    <Flex w="100%" my="6" maxW={1600} mx="auto" px="60">
                        <Box bg='gray.200' w='100%' height='100vh' p={4} color={'gray.900'}>
                            <Heading>Documentação</Heading>
                            <Divider my="6" borderColor="gray.700" />
                            <Card
                                direction="column"
                                overflow="hidden"
                                variant="outline"
                                boxShadow="xl"
                                // maxW="md"
                                m={4}
                            >
                                <Box
                                    bg="gray.900"
                                    w="100%"
                                    h={200}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Heading size="2xl" color="gray.100">{sprint.name}</Heading>
                                </Box>

                                <Stack>
                                    <Flex justifyContent="space-between" mt={4}>
                                        <CardBody>
                                            <Heading size="sm">{sprint.name}</Heading>
                                            <Text py="1">{sprint.description}</Text>
                                            <Flex justifyContent='space-between' mt={1}>
                                                <Flex direction='column' align='center'>
                                                    <Text fontSize='2xs' fontWeight='bold' color='gray.600'>
                                                        Início
                                                    </Text>
                                                    <Text fontSize='xs'>
                                                        {format(new Date(sprint.startDate), 'dd/MM/yyyy')}
                                                    </Text>
                                                </Flex>
                                                <Flex direction='column' align='center'>
                                                    <Text fontSize='2xs' fontWeight='bold' color='gray.600'>
                                                        Final
                                                    </Text>
                                                    <Text fontSize='xs'>
                                                        {format(new Date(sprint.endDate), 'dd/MM/yyyy')}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </CardBody>
                                        <Badge
                                            alignSelf="flex-end"
                                            colorScheme='blue'
                                            // fontSize='2xs'
                                            rounded='sm'
                                            bgColor={'blue.400'}
                                            borderRadius={5}
                                            mr={2}
                                            size={8}
                                        >

                                            {/* <Icon as={IoIosPeople} boxSize={5} /> */}
                                            {/* Colaboradores: {sprint?.area.employers.length} */}
                                        </Badge>
                                    </Flex>
                                    <Progress
                                        hasStripe
                                        value={Math.round(
                                            (new Date().getTime() - new Date(sprint.startDate).getTime()) /
                                            (new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) * 100
                                        )}
                                    />

                                </Stack>
                            </Card>
                            <Box bg='gray.200' w='100%' p={4} color={'gray.900'}>
                                <Flex justifyContent="center">
                                    <Heading >Processos Total </Heading>
                                </Flex>
                                <Flex gap={4} alignItems="center">
                                    <Box w="50%">

                                        <PieChart
                                            DRAFT={100}
                                            PENDING={50}
                                            ACTIVE={200}
                                            ON_HOLD={100}
                                            COMPLETED={300}
                                            CANCELLED={100}
                                            FAILED={50}
                                            REVIEW={50}
                                            options={{ maintainAspectRatio: true }}
                                        />
                                    </Box>
                                    <Box w="50%">
                                        Ultimos 10 meses
                                        <CombinedBarChart
                                            one={10}
                                            two={20}
                                            three={30}
                                            four={200}
                                            five={150}
                                            six={160}
                                            seven={170}
                                            eight={150}
                                            nine={90}
                                            ten={100}
                                            options={{ maintainAspectRatio: true }}
                                        />
                                    </Box>
                                </Flex>
                            </Box>

                            <Box bg='gray.200' w='100%' p={4} color={'gray.900'}>
                                <Flex justifyContent="center">
                                    <Heading >Processos </Heading>
                                </Flex>
                                <Divider my="6" borderColor="gray.700" />
                                <Flex gap={4} alignItems="center">
                                    <Box w="100%">
                                        {
                                            sprint?.processes.length == 0 ? (
                                                <Box bg='gray.200' w='100%' h='100vh' p={4} color={'gray.900'}>
                                                    <Flex w="100%" my="6" maxW={1600} mx="auto" px="60">
                                                        <Box bg='gray.200' w='100%' h='100vh' p={4} color={'gray.900'}>

                                                            <Flex direction="column" justifyContent="center" alignItems="center">
                                                                <Icon as={TbNotebookOff} boxSize={150} color={'purple.900'} bgColor={'gray.200'} />
                                                                <Heading color={'purple.900'}>
                                                                    Nenhum Processo Encontrado
                                                                </Heading>
                                                                <Button
                                                                    mt={1}
                                                                    size="md"
                                                                    leftIcon={<Icon as={RiAddLine} />}
                                                                    bg={'gray.500'}
                                                                    color="#fff"
                                                                    _hover={{
                                                                        bg: `gray.900`,
                                                                    }}
                                                                    onClick={() => setIncludeModalOpen(true)}
                                                                >
                                                                    Cadastre um novo aqui
                                                                </Button>
                                                            </Flex>
                                                        </Box>
                                                    </Flex>

                                                </Box>
                                            ) : (
                                                sprint?.processes?.map((sprint, index) => (
                                                    <Card
                                                        direction={{ base: 'column', sm: 'row' }}
                                                        overflow='hidden'
                                                        variant='outline'
                                                        boxShadow='sm'
                                                        mt={6}
                                                        size='sm'
                                                    >
                                                        <Image
                                                            objectFit='cover'
                                                            maxW={{ base: '100%', sm: '150px' }}
                                                            src={sprint.url_image ?? 'https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'}
                                                            alt={sprint.name}
                                                            borderRadius='md'
                                                        />

                                                        <Stack spacing={2} p={3} flex={1}>
                                                            <Flex justifyContent='space-between' alignItems='center'>
                                                                <Heading size='xs' mr={2}>
                                                                    {sprint.name}
                                                                </Heading>
                                                                <Badge
                                                                    colorScheme='blue'
                                                                    fontSize='2xs'
                                                                    rounded='sm'
                                                                >
                                                                    {sprint.processes.length} processos
                                                                </Badge>
                                                            </Flex>

                                                            <Text
                                                                color='gray.600'
                                                                noOfLines={1}
                                                                fontSize='xs'
                                                            >
                                                                {sprint.description}
                                                            </Text>

                                                            <Flex gap={1} mt={1}>
                                                                <Badge
                                                                    variant='solid'
                                                                    size='sm'
                                                                    bgColor={bgStatus(sprint.status)}
                                                                    fontSize='2xs'
                                                                >
                                                                    {sprint.status}
                                                                </Badge>
                                                                <Badge
                                                                    variant='solid'
                                                                    size='sm'
                                                                    colorScheme={sprint.active ? 'green' : 'red'}
                                                                    fontSize='2xs'
                                                                >
                                                                    {sprint.active ? 'Ativo' : 'Inativo'}
                                                                </Badge>
                                                            </Flex>

                                                            <Flex justifyContent='space-between' mt={1}>
                                                                <Flex direction='column' align='center'>
                                                                    <Text fontSize='2xs' fontWeight='bold' color='gray.600'>
                                                                        Início
                                                                    </Text>
                                                                    <Text fontSize='xs'>
                                                                        {format(new Date(sprint.startDate), 'dd/MM/yyyy')}
                                                                    </Text>
                                                                </Flex>
                                                                <Flex direction='column' align='center'>
                                                                    <Text fontSize='2xs' fontWeight='bold' color='gray.600'>
                                                                        Final
                                                                    </Text>
                                                                    <Text fontSize='xs'>
                                                                        {format(new Date(sprint.endDate), 'dd/MM/yyyy')}
                                                                    </Text>
                                                                </Flex>
                                                            </Flex>

                                                            <Flex justifyContent='flex-end' mt={1}>
                                                                <Link href={`/sprint/${sprint.id}`}>
                                                                    <Button
                                                                        colorScheme='blue'
                                                                        size='xs'
                                                                        rightIcon={<IoMdEye />}
                                                                    >
                                                                        Detalhes
                                                                    </Button>
                                                                </Link>
                                                            </Flex>
                                                        </Stack>
                                                    </Card>

                                                ))
                                            )
                                        }

                                    </Box>

                                </Flex>
                            </Box>
                            <IncludeDocumentationModal
                                isOpen={isIncludeModalOpen}
                                onClose={() => setIncludeModalOpen(false)}
                            // setUpdate={() => setUpdateCreate(true)}
                            />
                        </Box>
                    </Flex>
                </Box>



            )}
        </>
    );
}
