"use client";


import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Icon, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Skeleton, SkeletonCircle, Stack, Text, VStack } from "@chakra-ui/react";
import { Flex, Spacer } from '@chakra-ui/react'
import { Divider } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { useEffect, useState } from "react";
import AreaHTTPService from "../lib/request/areaHTTPService";
import { MdDeleteForever, MdEdit, MdNotificationsOff } from "react-icons/md";
import Link from "next/link";
import { IoMdMap } from "react-icons/io";
import { TbMapOff } from "react-icons/tb";
import IncludeAreaModal from "../../Components/forms/includeArea";
import { RiAddLine } from "react-icons/ri";
import Cookies from 'js-cookie';
import UserHTTPService from "../lib/request/userHTTPService";
import { BsFillDiagram3Fill, BsThreeDotsVertical } from "react-icons/bs";

import { TbBooks } from "react-icons/tb";
import { FaUsersSlash } from "react-icons/fa";
import IncludeUserModal from "../../Components/forms/includeUser";



type Response = {
    message: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
};

const UsersPage = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [initialDate, setInitialDate] = useState<string | undefined>(undefined);
    const [finalDate, setFinalDate] = useState<string | undefined>(undefined);

    const [isIncludeModalOpen, setIncludeModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(false);
    useEffect(() => {
        getAll();
    }, []);

    // async function getAll() {
    //     setLoading(true);
    //     try {
    //         const response = await UserHTTPService.getAll({ page: 100, limit: limit });
    //         // const list = response.data.list;
    //         // const newList = [...list, ...list, ...list];
    //         console.log('API Response:', response.data.list); // Verifique o valor aqui
    //         setUsers(response.data.list);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    async function getAll() {
        setLoading(true);
        try {
            console.log('aqui foi');
            const response = await UserHTTPService.getAll({ page: 1, limit: 100 });
            console.log(response)
            const list = response.data.list;
            setUsers(list);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const user = Cookies.get('user');
    const token = Cookies.get('token');

    const handleEditUser = (user: any) => {
        setSelectedUser(user);
        setIncludeModalOpen(true);
    };

    return (
        <>
            <Box bg='gray.200' w='100%' height='100vh' p={4} color={'gray.900'}>
                <Flex w="100%" my="6" maxW={1600} mx="auto" px="60">
                    <Box bg='gray.200' w='100%' height='100vh' p={4} color={'gray.900'}>
                        <Flex justifyContent="space-between" alignItems="center">
                            <Heading>Usuarios</Heading>
                            {/* {user && user.role !== 'ADMIN' ? (
                                // <Button
                                //     mt={1}
                                //     size="md"
                                //     leftIcon={<Icon as={RiAddLine} />}
                                //     bg={'blue.400'}
                                //     color="#fff"
                                //     _hover={{ bg: `blue.800` }}
                                //     onClick={() => setIncludeModalOpen(true)}
                                // >
                                //     Novos Usuarios
                                // </Button>
                            ) : null} */}
                        </Flex>

                        <Divider my="6" borderColor="gray.700" />
                        {loading ? (
                            // <p>Loading...</p>
                            <Flex wrap="wrap" justifyContent="space-between">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Card key={index} maxW='lg' m={4} boxShadow={'xl'}>
                                        <CardHeader>
                                            <Flex spacing='4'>
                                                <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                                                    <SkeletonCircle size='40px' />
                                                    <Box>
                                                        <Skeleton height='20px' width='150px' mb='8px' />
                                                        <Skeleton height='16px' width='200px' />
                                                    </Box>
                                                </Flex>
                                            </Flex>
                                        </CardHeader>
                                        <CardFooter>
                                            <Stack direction='row' spacing={4}>
                                                <Skeleton height='32px' width='120px' />
                                                <Skeleton height='32px' width='120px' />
                                                <Skeleton height='32px' width='120px' />
                                            </Stack>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </Flex>
                        ) : users?.length === 0 ? (
                            <Box textAlign="center" w="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                <FaUsersSlash size={150} color="purple.900" />
                                <Heading color={'purple.900'} ml={2}>
                                    Nenhum usuario cadastrado
                                </Heading>
                            </Box>
                        ) : (
                            <>
                                <Flex wrap="wrap" justifyContent="space-between">
                                    {users?.map((cliente, index) => (
                                        <Card maxW='lg' m={4} boxShadow={'xl'}>
                                            <CardHeader>
                                                <Flex spacing='4'>
                                                    <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                                                        <Avatar name={cliente.name} />

                                                        <Box>
                                                            <Heading size='sm'>{cliente.name}</Heading>
                                                            <Text>Nascido, {cliente.birthday
                                                                ? new Intl.DateTimeFormat('pt-BR').format(new Date(cliente.birthday))
                                                                : 'Data de nascimento não informada'}</Text>
                                                        </Box>
                                                    </Flex>

                                                    <Menu>
                                                        <MenuButton
                                                            as={IconButton}
                                                            aria-label='Options'
                                                            icon={<BsThreeDotsVertical />}
                                                            variant='outline'
                                                        />
                                                        <MenuList>
                                                            <MenuItem icon={<MdDeleteForever />} command='⌘T'>
                                                                Excluir
                                                            </MenuItem>
                                                            <MenuItem icon={<MdEdit />} command='⌘N' onClick={() => handleEditUser(cliente)}>
                                                                Editar
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>

                                                </Flex>
                                            </CardHeader>



                                            <CardFooter
                                                justify='space-between'
                                                flexWrap='wrap'
                                                sx={{
                                                    '& > button': {
                                                        minW: '136px',
                                                    },
                                                }}
                                            >
                                                <Button flex='1' variant='ghost' leftIcon={<BsFillDiagram3Fill />}>
                                                    Processos
                                                </Button>
                                                <Button flex='1' variant='ghost' leftIcon={<TbBooks />}>
                                                    Documentações
                                                </Button>
                                                <Button flex='1' variant='ghost' leftIcon={<IoMdMap />}>
                                                    Areas
                                                </Button>
                                            </CardFooter>
                                        </Card>

                                    ))}
                                    {users?.length === 0 && (
                                        <Box textAlign="center" w="100%">
                                            <IoMdMap size={150} color="purple.900" />
                                            <Heading color="purple.900">Nenhuma Área cadastrada</Heading>
                                        </Box>
                                    )}
                                </Flex>
                            </>
                        )}

                        <IncludeUserModal
                            isOpen={isIncludeModalOpen}
                            onClose={() => setIncludeModalOpen(false)}
                            cliente={selectedUser}
                        // setUpdate={() => setUpdateCreate(true)}
                        />
                    </Box>
                </Flex>
            </Box>
        </>
    );
};

export default UsersPage;


