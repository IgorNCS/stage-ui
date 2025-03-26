"use client";
import CombinedBarChart from "@/app/Charts/HorizontalBarChart";
import PieChart from "@/app/Charts/PieCharts";
import AreaHTTPService from "@/app/lib/request/areaHTTPService";
import SprintHTTPService from "@/app/lib/request/sprintHTTPService";
import { Badge, Box, Button, Card, CardBody, CardFooter, Center, Divider, Flex, Heading, Icon, Image, Spacer, Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdNotificationsOff } from "react-icons/md";
import { TbMapOff, TbRoadOff } from "react-icons/tb";
import { format } from 'date-fns';
import { IoMdEye, IoIosPeople } from "react-icons/io";

import { RiAddLine } from "react-icons/ri";
import { BsFillDiagram3Fill } from "react-icons/bs";


export default function DetalhesProduto() {
    const params = useParams();
    const id = params.id;
    const [area, setArea] = useState();
    const [loading, setLoading] = useState(true);

    const [sprints, setSprints] = useState([]);

    useEffect(() => {
        getOneArea(id);
    }, [id]);

    async function getOneArea(id: any) {
        setLoading(true);
        try {
            const response = await AreaHTTPService.getOne(id);
            console.log(response.data);
            setArea(response.data);
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


    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : !area ? (
                <Box bg='gray.200' w='100%' h='100vh' p={4} color={'gray.900'}>
                    <Flex w="100%" my="6" maxW={1600} mx="auto" px="60">
                        <Box bg='gray.200' w='100%' h='100vh' p={4} color={'gray.900'}>
                            <Heading>Area</Heading>
                            <Divider my="6" borderColor="gray.700" />
                            <Flex
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Icon as={TbMapOff} boxSize={150} />
                                <Heading color={'purple.900'}>
                                    Area não encontrada
                                </Heading>
                            </Flex>
                        </Box>
                    </Flex>
                </Box>
            ) : (

                // <p>Loadinga...</p>

                <Box bg='gray.200' w='100v' height='100%' p={4} color={'gray.900'} mb={4}>
                    <Flex w="100%" my="6" maxW={1600} mx="auto" px="60">
                        <Box bg='gray.200' w='100%' height='100vh' p={4} color={'gray.900'}>
                            <Heading>Area</Heading>
                            <Divider my="6" borderColor="gray.700" />
                            {/* <pre>{JSON.stringify(area, null, 2)}</pre> */}
                            <Card
                                direction="column"
                                overflow="hidden"
                                variant="outline"
                                boxShadow="xl"
                                // maxW="md"
                                m={4}
                            >
                                <Image
                                    objectFit="cover"
                                    maxW="100%"
                                    maxH={200}
                                    src={area.url_image ?? 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'}
                                    alt={area.name}
                                />

                                <Stack>
                                    <Flex justifyContent="space-between" mt={4}>
                                        <CardBody>
                                            <Heading size="sm">{area.name}</Heading>
                                            <Text py="1">{area.description}</Text>
                                            <Heading size="xs">Responsáveis:</Heading>
                                            <Text py="1">
                                                {area.responsables.map(responsavel => responsavel.name).join(", ")}
                                            </Text>
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

                                            <Icon as={IoIosPeople} boxSize={5} />
                                            Colaboradores: {area.employers.length}
                                        </Badge>
                                    </Flex>

                                </Stack>
                            </Card>

                            <Box bg='gray.200' w='100%' p={4} color={'gray.900'}>
                                <Flex>
                                    <Box bg='gray.200' w='100%' p={4} color={'gray.900'}>
                                        <Flex>
                                            <Box w={"50%"} bgColor={'red.200'}>
                                                <Box textAlign="center"> 
                                                    <Heading mb={8}>Processos</Heading>
                                                    <Box>
                                                        {area?.processes && area?.processes.length > 0 ? (
                                                            area?.processes?.map((process, index) => (
                                                                <Box key={index} display="inline-block" mr={2}>
                                                                    <Badge
                                                                        colorScheme='blue'
                                                                        bgColor={bgStatus(process.status)}
                                                                        borderRadius={5}
                                                                        size={8}
                                                                    >
                                                                        {process.name}
                                                                    </Badge>
                                                                </Box>
                                                            ))
                                                        ) : (
                                                            <Flex direction="column" justifyContent="center" alignItems="center">
                                                                <Icon as={BsFillDiagram3Fill} boxSize={150} color={'purple.900'} opacity={0.2} />
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
                                                                    // onClick={() => setIncludeModalOpen(true)}
                                                                >
                                                                    Cadastre um novo aqui
                                                                </Button>
                                                            </Flex>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Box w={"50%"} bgColor={'green.200'} textAlign="center"> {/* Centraliza o conteúdo horizontalmente */}
                                                <Flex justifyContent={'center'} alignItems={'center'}>
                                                    <Box w="100%">
                                                        <Heading>Documentações</Heading>
                                                    </Box>
                                                </Flex>
                                            </Box>
                                        </Flex>
                                    </Box>
                                </Flex>
                            </Box>

                        </Box>
                    </Flex>
                </Box>
            )}
        </>
    );
}
