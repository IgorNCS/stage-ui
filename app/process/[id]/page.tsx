"use client";
import CombinedBarChart from "@/Components/Charts/HorizontalBarChart";
import PieChart from "@/Components/Charts/PieCharts";
// import AreaHTTPService from "@/app/lib/request/processHTTPService";
import SprintHTTPService from "@/app/(lib)/request/sprintHTTPService";
import { Badge, Box, Button, Card, CardBody, CardFooter, CardHeader, Center, Container, Divider, Flex, Grid, Heading, Icon, Image, Spacer, Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdNotificationsOff } from "react-icons/md";
import { TbBooks } from "react-icons/tb";


import { RiAddLine } from "react-icons/ri";
import { BsFillDiagram3Fill } from "react-icons/bs";
import ProcessHTTPService from "@/app/(lib)/request/processHTTPService";
import DragHandleNode from "@/app/components/node/DragHandleNode";
import { ReactFlow } from "@xyflow/react";

import React from 'react';

import '@xyflow/react/dist/style.css';


export default function DetalhesProduto() {
    const params = useParams();
    const id = params.id;
    const [process, setProcess] = useState();
    const [loading, setLoading] = useState(true);

    const [sprints, setSprints] = useState([]);

    useEffect(() => {
        getOneArea(id);
    }, [id]);

    async function getOneArea(id: any) {
        setLoading(true);
        try {
            const response = await ProcessHTTPService.getOne(id);
            console.log(response.data);
            setProcess(response.data);
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
            ) : !process ? (
                <Box bg='gray.200' w='100%' h='100vh' p={4} color={'gray.900'}>
                    <Flex w="100%" my="6" maxW={1600} mx="auto" px="60">
                        <Box bg='gray.200' w='100%' h='100vh' p={4} color={'gray.900'}>
                            <Heading>Processo</Heading>
                            <Divider my="6" borderColor="gray.700" />
                            <Flex
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Icon as={BsFillDiagram3Fill} boxSize={150} opacity={0.2} />
                                <Heading color={'purple.900'}>
                                    Processo não encontrado
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
                            <Heading>Processo</Heading>
                            <Divider my="6" borderColor="gray.700" />
                            {/* <pre>{JSON.stringify(process, null, 2)}</pre> */}

                            <Card
                                direction="column"
                                overflow="hidden"
                                variant="outline"
                                boxShadow="xl"
                                // maxW="md"
                                m={4}
                            >
                                <Box
                                    width="100%"
                                    height="200px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    position="relative" // Adicionando position relative para overlay
                                >
                                    <Box
                                        position="absolute"
                                        top="0"
                                        left="0"
                                        width="100%"
                                        height="100%"
                                        bgImage={process.url_image ?? 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'}
                                        backgroundSize="cover"
                                        backgroundPosition="center"
                                        _before={{
                                            content: '""',
                                            position: 'absolute',
                                            top: '0',
                                            left: '0',
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        }}
                                    />
                                    <CardHeader position="relative" zIndex={1}>
                                        <Heading
                                            borderRadius={15}
                                            p={5}
                                            color="white"
                                            fontSize="6xl"
                                            fontWeight="bold"
                                            textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)"
                                            textAlign="center"
                                        >
                                            {process.name}
                                        </Heading>
                                    </CardHeader>
                                </Box>

                                <Stack m={0} p={0}>
                                    <Flex justifyContent="space-between" >

                                        <CardBody>
                                            <Heading size="xs">Descrição:</Heading>
                                            <Text >{process.description}</Text>
                                            <Heading size="xs">Responsáveis:</Heading>
                                            <Text py="1">
                                                {process.responsible_people.map(responsavel => responsavel.name).join(", ")}
                                            </Text>
                                        </CardBody>
                                        <CardBody>
                                            <Heading size="xs">Ferramentas:</Heading>
                                            <Text py="1">
                                                {process.systems_tools.map(ferramentas => (
                                                    <Badge
                                                        key={ferramentas}
                                                        colorScheme='blue'
                                                        // fontSize='2xs'
                                                        rounded='sm'
                                                        bgColor={'green.400'}
                                                        borderRadius={5}
                                                        size={8}
                                                        m={1}
                                                    >
                                                        {ferramentas}
                                                    </Badge>
                                                ))}
                                            </Text>
                                            <Heading size="xs">Area:</Heading>
                                            <Text >{process?.area?.name}</Text>
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
                                            mb={2}
                                        >

                                            <Icon as={TbBooks} boxSize={5} />
                                            : {process.documentations.length}
                                        </Badge>
                                    </Flex>

                                </Stack>
                            </Card>

                            <Box width="100%" height="600px" boxShadow="xl" borderRadius={15} bgColor={'rgba(163, 195, 255, 0.2)'}> {/* Defina uma altura fixa ou ajuste conforme necessário */}
                                <DragHandleNode process={process} />
                            </Box>


                        </Box >
                    </Flex >
                </Box >
            )
            }
        </>
    );
}
