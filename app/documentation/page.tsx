"use client";


import { AbsoluteCenter, Avatar, Badge, Box, Button, Card, CardBody, CardFooter, CardHeader, FormControl, FormLabel, GridItem, Icon, IconButton, Image, Input, Select, Skeleton, SkeletonCircle, SkeletonText, Stack, Text, VStack } from "@chakra-ui/react";
import { Flex, Spacer } from '@chakra-ui/react'
import { Divider } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { useEffect, useState } from "react";
import AreaHTTPService from "../../lib/request/areaHTTPService";
import { MdNotificationsOff } from "react-icons/md";
import Link from "next/link";
import { TbBooksOff, TbFilter } from "react-icons/tb";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

import * as commands from "@uiw/react-md-editor/commands"
import { RiAddLine } from "react-icons/ri";
import IncludeDocumentationModal from "../../Components/forms/includeDocumentation";
import DocumentationHTTPService from "../../lib/request/documentationHTTPService";


import { IoMdEye } from "react-icons/io";
import ViewDocumentationModal from "../../Components/forms/modalViewDocumentation";
import MarkdownRenderer from "../../Components/markdownrender";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

const DocumentPage = () => {
    const [loading, setLoading] = useState(true);
    const [documentations, setDocumentations] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [initialDate, setInitialDate] = useState<string | undefined>(undefined);
    const [finalDate, setFinalDate] = useState<string | undefined>(undefined);

    const [isIncludeModalOpen, setIncludeModalOpen] = useState(false);

    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [selectedDocumentation, setSelectedDocumentation] = useState(false);


    const [area, setArea] = useState();
    const [areaOptions, setAreaOptions] = useState([]);
    const [value, setValue] = useState("**Documente aqui!!!**");

    useEffect(() => {
        getAll(page);
    }, []);

    useEffect(() => {
        console.log(value)
    }, [value]);

    async function getAll(page: number) {
        setLoading(true);
        try {
            const response = await DocumentationHTTPService.getAll();
            const list = response.data;
            setDocumentations(list);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function getAllArea() {
        try {
            const response = await AreaHTTPService.getNames();
            setAreaOptions(response.data);
        } catch (error) {
            console.log(error);
        } finally {

        }
    }
    const handleViewDocumentation = (documentation: any) => {
        setSelectedDocumentation(documentation);
        setViewModalOpen(true);
    };

    return (
        <>
            <Box bg='gray.200' w='100%' height='100vh' p={4} color={'gray.900'}>
                <Flex w="100%" my="6" maxW={1600} mx="auto" px="60">
                    <Box bg='gray.200' w='100%' height='100vh' p={4} color={'gray.900'}>
                        <Flex justifyContent="space-between" alignItems="center">
                            <Heading>Documentações</Heading>
                            <Button
                                mt={1}
                                size="md"
                                leftIcon={<Icon as={RiAddLine} />}
                                bg={'gray.900'}
                                color="#fff"
                                _hover={{
                                    bg: `gray.900`,
                                }}
                                onClick={() => setIncludeModalOpen(true)}
                            >
                                Cadastre um novo aqui
                            </Button>
                        </Flex>
                        <Divider my="6" borderColor="gray.700" />

                        {/* <MDEditor value={value} onChange={setValue} /> */}

                        {loading ? (
                            // <p>Loading...</p>
                            <Box>
                                <Card>
                                    <CardHeader mb={-2}>
                                        <Flex justifyContent="space-between" alignItems="center">
                                            <Skeleton w="150px" h="40px" />
                                        </Flex>
                                    </CardHeader>
                                    <Flex>
                                        <CardBody flex={1}>
                                            <FormControl>
                                                <FormLabel>
                                                    <SkeletonText noOfLines={1} w="50px" />
                                                </FormLabel>
                                                <Skeleton h="40px" />
                                            </FormControl>
                                        </CardBody>
                                        <CardBody flex={1}>
                                            <FormControl>
                                                <FormLabel>
                                                    <SkeletonText noOfLines={1} w="80px" />
                                                </FormLabel>
                                                <Skeleton h="40px" />
                                            </FormControl>
                                        </CardBody>
                                        <CardBody flex={1}>
                                            <FormControl>
                                                <FormLabel>
                                                    <SkeletonText noOfLines={1} w="80px" />
                                                </FormLabel>
                                                <Skeleton h="40px" />
                                            </FormControl>
                                        </CardBody>
                                        <CardBody flex={1}>
                                            <GridItem colSpan={1}>
                                                <FormLabel>
                                                    <SkeletonText noOfLines={1} w="120px" />
                                                </FormLabel>
                                                <Skeleton h="40px" />
                                            </GridItem>
                                        </CardBody>
                                    </Flex>
                                </Card>
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
                            </Box>
                        ) : documentations?.length === 0 ? (
                            <Box>
                                <Box textAlign="center" w="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                    <TbBooksOff size={150} color="purple.900" />
                                    <Heading color={'purple.900'}>
                                        Nenhuma Documentação cadastrada
                                    </Heading>
                                </Box>

                            </Box>
                        ) : (
                            <>
                                <Box>
                                    <Card>
                                        <CardHeader mb={-2}>
                                            <Flex justifyContent="space-between" alignItems="center">
                                                <Heading size='md'>
                                                    <Icon as={TbFilter} mr={2} /> Adicione os filtros
                                                </Heading>
 
                                            </Flex>
                                        </CardHeader>
                                        <Flex >
                                            <CardBody flex={1}>
                                                <FormControl>

                                                    <FormLabel>Area</FormLabel>
                                                    <Select placeholder='Area' onChange={(e) => setArea(e.target.value)}>
                                                        {areaOptions.map((area) => (
                                                            <option key={area.id} value={area.id}>
                                                                {area.name}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </CardBody>
                                            <CardBody flex={1} >
                                                <FormControl>
                                                    <FormLabel>Responsavel</FormLabel>
                                                    <Select placeholder='Responsavel' onChange={(e) => setArea(e.target.value)}>
                                                        {areaOptions.map((area) => (
                                                            <option key={area.id} value={area.id}>
                                                                {area.name}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </CardBody>

                                            <CardBody flex={1}>
                                                <FormControl>
                                                    <FormLabel>Processo</FormLabel>
                                                    <Select placeholder='Processo' onChange={(e) => setArea(e.target.value)}>
                                                        {areaOptions.map((area) => (
                                                            <option key={area.id} value={area.id}>
                                                                {area.name}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </CardBody>

                                            <CardBody flex={1}>
                                                <GridItem colSpan={1}>
                                                    <FormLabel>Nome da ferrmenta</FormLabel>
                                                    <Input
                                                        placeholder="Nome do Processo"
                                                        size="lg"
                                                        type="text"
                                                    />
                                                </GridItem>
                                            </CardBody>
                                        </Flex>
                                    </Card>
                                </Box>
                                <Flex wrap="wrap" justifyContent="center" mt={8}>
                                    {documentations && documentations.map((documentation, index) => (
                                        <Box key={index} w={{ base: "100%", md: "45%", lg: "45%" }} m={4}>


                                            <Card maxW='md' boxShadow={'xl'}>
                                                <CardHeader>
                                                    <Flex spacing='4'>
                                                        <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                                                            <Avatar name={documentation?.user?.name} />

                                                            <Box>
                                                                <Heading size='sm'>{documentation.name}</Heading>
                                                                <Text>Criador, {documentation?.user?.name}	</Text>
                                                            </Box>
                                                        </Flex>
                                                        {/* <IconButton
                                                            variant='ghost'
                                                            colorScheme='gray'
                                                            aria-label='See menu'
                                                            icon={<BsThreeDotsVertical />}
                                                        /> */}
                                                    </Flex>
                                                </CardHeader>
                                                <Flex>
                                                    <CardBody flex="1" >
                                                        <Heading size="xs">Tools:</Heading>
                                                        <Text>
                                                            <Stack direction="row" wrap="wrap" spacing={1}>
                                                                {documentation.tools?.map((tool, index) => (
                                                                    <Badge
                                                                        key={index}
                                                                        variant="subtle"
                                                                        colorScheme="gray"

                                                                        borderRadius="md"
                                                                    >
                                                                        {tool}
                                                                    </Badge>
                                                                ))}
                                                            </Stack>
                                                        </Text>
                                                    </CardBody>
                                                    <CardBody flex="1">
                                                        <Heading size="xs">Areas:</Heading>
                                                        <Text>
                                                            <Stack direction="row" wrap="wrap">
                                                                {documentation.areas?.map((area, index) => (
                                                                    <Badge
                                                                        key={index}
                                                                        variant="subtle"
                                                                        colorScheme="purple"
                                                                        borderRadius="md"
                                                                    >
                                                                        {area.name}
                                                                    </Badge>
                                                                ))}

                                                            </Stack>
                                                        </Text>
                                                    </CardBody>
                                                    <CardBody flex="1">
                                                        <Heading size="xs">Processos:</Heading>
                                                        <Text>
                                                            <Stack direction="row" wrap="wrap">
                                                                {documentation.processes?.map((process, index) => (
                                                                    <Badge
                                                                        key={index}
                                                                        variant="subtle"
                                                                        colorScheme="green"
                                                                        borderRadius="md"
                                                                    >
                                                                        {process.name}
                                                                    </Badge>
                                                                ))}
                                                            </Stack>
                                                        </Text>
                                                    </CardBody>
                                                </Flex>
                                                <Box position='relative' padding='2'>
                                                    <Divider borderColor='blackAlpha.500' />
                                                    <AbsoluteCenter bg='white' px='4'>
                                                        Documentação
                                                    </AbsoluteCenter>
                                                </Box>
                                                <CardBody>
                                                    <MarkdownRenderer content={documentation.documentText.length > 200 ? `${documentation.documentText.substring(0, 200)}...` : documentation.documentText} />
                                                </CardBody>
                                                <CardFooter
                                                    justify='space-between'
                                                    flexWrap='wrap'
                                                    sx={{
                                                        '& > button': {
                                                            minW: '136px',
                                                        },
                                                    }}
                                                >
                                                    <Button flex='1' variant='ghost' leftIcon={<IoMdEye />} bgColor={'gray.500'} onClick={() => handleViewDocumentation(documentation)} >
                                                        Ler documentação
                                                    </Button>

                                                </CardFooter>
                                            </Card>
                                        </Box>
                                    ))}
                                    {documentations?.length === 0 && (
                                        <Box textAlign="center" w="100%">
                                            <MdNotificationsOff size={50} color="purple.900" />
                                            <Heading color="purple.900">Nenhuma Documentacao cadastrada</Heading>
                                        </Box>
                                    )}
                                </Flex>
                            </>
                        )}

                        <IncludeDocumentationModal
                            isOpen={isIncludeModalOpen}
                            onClose={() => setIncludeModalOpen(false)}
                        // setUpdate={() => setUpdateCreate(true)}
                        />
                        <ViewDocumentationModal
                            isOpen={isViewModalOpen}
                            onClose={() => setViewModalOpen(false)}
                            documentation={selectedDocumentation}
                        // setUpdate={() => setUpdateCreate(true)}
                        />
                    </Box>
                </Flex >
            </Box >
        </>
    );
};

export default DocumentPage;


