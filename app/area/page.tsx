"use client";


import { Box, Button, Card, CardBody, CardFooter, Icon, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { Flex, Spacer } from '@chakra-ui/react'
import { Divider } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { useEffect, useState } from "react";
import AreaHTTPService from "../../lib/request/areaHTTPService";
import { MdNotificationsOff } from "react-icons/md";
import Link from "next/link";
import { IoMdMap } from "react-icons/io";
import { TbMapOff } from "react-icons/tb";
import IncludeAreaModal from "../components/forms/includeArea";
import { RiAddLine } from "react-icons/ri";
import Cookies from 'js-cookie';

type Response = {
    message: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
};

const AreaPage = () => {
    const [loading, setLoading] = useState(false);
    const [areas, setAreas] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [initialDate, setInitialDate] = useState<string | undefined>(undefined);
    const [finalDate, setFinalDate] = useState<string | undefined>(undefined);

    const [isIncludeModalOpen, setIncludeModalOpen] = useState(false);

    useEffect(() => {
        getAll(page);
    }, []);

    async function getAll(page: number) {
        setLoading(true);
        try {
            const response = await AreaHTTPService.getAll(page, limit, initialDate, finalDate);
            const list = response.data.list;
            setAreas(list);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const user = Cookies.get('user');
    const token = Cookies.get('token');

    return (
        <>
            <Box bg='gray.200' w='100%' height='100vh' p={4} color={'gray.900'}>
                <Flex w="100%" my="6" maxW={1600} mx="auto" px="60">
                    <Box bg='gray.200' w='100%' height='100vh' p={4} color={'gray.900'}>
                        <Flex justifyContent="space-between" alignItems="center">
                            <Heading>Areas</Heading>
                            {user && user.role !== 'ADMIN' ? (
                                <Button
                                    mt={1}
                                    size="md"
                                    leftIcon={<Icon as={RiAddLine} />}
                                    bg={'purple.400'}
                                    color="#fff"
                                    _hover={{ bg: `purple.800` }}
                                    onClick={() => setIncludeModalOpen(true)}
                                >
                                    Nova Area
                                </Button>
                            ) : null}
                        </Flex>

                        <Divider my="6" borderColor="gray.700" />
                        {loading ? (
                            <p>Loading...</p>
                        ) : areas?.length === 0 ? (
                            <Box textAlign="center" w="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                <TbMapOff size={150} color="purple.900" />
                                <Heading color={'purple.900'} ml={2}>
                                    Nenhuma Area cadastrado
                                </Heading>
                            </Box>
                        ) : (
                            <>
                                <Flex wrap="wrap" justifyContent="space-between">
                                    {areas?.map((area, index) => (
                                        <Card
                                            key={index}
                                            direction="column"
                                            overflow="hidden"
                                            variant="outline"
                                            boxShadow="xl"
                                            maxW="md"
                                            m={4}
                                        >
                                            <Image
                                                objectFit="cover"
                                                maxW="100%"
                                                src={area.url_image ?? 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'}
                                                alt={area.name}
                                            />

                                            <Stack>
                                                <CardBody>
                                                    <Heading size="sm">{area.name}</Heading>
                                                    <Text py="1">{area.description}</Text>
                                                    <Heading size="xs">Responsáveis:</Heading>
                                                    <Text py="1">
                                                        {area.responsables.map(responsavel => responsavel.name).join(", ")}
                                                    </Text>
                                                </CardBody>
                                                <CardFooter>
                                                    <Link href={`/area/${area.id}`}>
                                                        <Button variant="link" colorScheme="blue" mr={4}>
                                                            Ir para
                                                        </Button>
                                                    </Link>

                                                    <Spacer />

                                                    <Button variant="link" colorScheme="blue">
                                                        Processos
                                                    </Button>
                                                </CardFooter>
                                            </Stack>
                                        </Card>
                                    ))}
                                    {areas?.length === 0 && (
                                        <Box textAlign="center" w="100%">
                                            <IoMdMap size={150} color="purple.900" />
                                            <Heading color="purple.900">Nenhuma Área cadastrada</Heading>
                                        </Box>
                                    )}
                                </Flex>
                            </>
                        )}
                        <IncludeAreaModal
                            isOpen={isIncludeModalOpen}
                            onClose={() => setIncludeModalOpen(false)}
                        // setUpdate={() => setUpdateCreate(true)}
                        />
                    </Box>
                </Flex>
            </Box>
        </>
    );
};

export default AreaPage;


