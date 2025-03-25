import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Grid,
    GridItem,
    useToast,
    Textarea,
    Select,
    FormHelperText,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Badge,
    Td,
    Stack,
    Box,
    Text,
    Flex,
    Avatar,
    Heading,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MultiSelect } from 'chakra-multiselect';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import AreaHTTPService from '@/app/lib/request/areaHTTPService';
import ProcessHTTPService from '@/app/lib/request/processHTTPService';

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import MarkdownRenderer from '../markdownrender';


const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

export interface IDocumentationProps {
    id: string;
    name: string;
    documentText: string;
    tools: string[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    active: boolean;
    user?: {
        id: string;
        cpf: string;
        name: string;
        email: string;
        birthday: string;
        role: string;
        password: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        active: boolean;
    };
    areas?: {
        id: string;
        name: string;
        description: string;
        urlImage: string | null;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        active: boolean;
    }[];
    processes?: {
        id: string;
        name: string;
        description: string;
        systemsTools: string[];
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        active: boolean;
        status: string;
    }[];
}

type ViewDocumentationModalType = {
    isOpen: boolean;
    onClose: () => void;
    documentation: IDocumentationProps | null
};

function ViewDocumentationModal({ isOpen, onClose, documentation }: ViewDocumentationModalType) {
    const toast = useToast();
    const [area, setArea] = useState();
    const [areaOptions, setAreaOptions] = useState([]);
    const [employers, setEmployers] = useState();
    const [employersOptions, setEmployersOptions] = useState([]);

    const [process, setProcess] = useState();
    const [processOptions, setProcessOptions] = useState([]);

    const [document, setDocument] = useState("**Documente aqui!!!**");

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onTouched',
    });

    const submitForm = async (data: any) => {
        try {
            const request = {
                processName: data.processName,
                areas: data.areas,
                responsables: data.responsables,
                tools: data.tools ? data.tools.split(",").map(tool => tool.trim()) : [],
                processDescription: data.processDescription,
            };
            console.log(data, request)
            return
            // const response = await DevolutionHTTPService.create(request);

            toast({
                title: 'Processo incluído com sucesso!',
                position: 'top-right',
                isClosable: false,
                description: 'Processo incluído com sucesso!',
                status: 'success',
            });

            onClose();
        } catch (error: AxiosError | any) {
            const display = error.response?.data?.message || 'Erro ao incluir processo.';
            toast({
                title: display,
                position: 'top-right',
                isClosable: false,
                description: 'Processo não incluído!',
                status: 'error',
            });
        }
    };

    useEffect(() => {
        getAllArea();
        getAllProcess();
        console.log(JSON.stringify(document))
    }, [document]);

    useEffect(() => {
        getAllEmployers();
    }, [area]);
    async function getAllArea() {
        try {
            const response = await AreaHTTPService.getNames();
            setAreaOptions(response.data);
        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    async function getAllEmployers() {
        try {
            const areaId = area || '';
            if (areaId === '') return
            const response = await AreaHTTPService.getEmployees(areaId);
            setEmployersOptions(response.data);
        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    async function getAllProcess() {
        try {
            const areaId = area || '';
            if (areaId === '') return
            const response = await ProcessHTTPService.getAll()
            setProcessOptions(response.data.list);
        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    const onError = () => {
        toast({
            title: 'Verificação do formulário',
            description:
                'Alguns campos estão incompletos ou inválidos. Por favor, verifique e tente novamente.',
            status: 'error',
            position: 'top-right',
            isClosable: true,
            duration: 5000,
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered

            finalFocusRef={'finalFocusRef'}

            scrollBehavior={'inside'}
        >
            <ModalOverlay
                backdropFilter='blur(1px)' />
            <ModalContent>
                <ModalHeader> {documentation?.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Areas</Th>
                                <Th>Processos</Th>
                                <Th>Ferramentas</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td overflowX="auto" whiteSpace="nowrap">
                                    {documentation.tools?.map((tool, index) => (
                                        <Badge
                                            key={index}
                                            variant="subtle"
                                            colorScheme="gray"
                                            borderRadius="md"
                                            mr={2}
                                            mb={2}
                                            flexShrink={0}
                                        >
                                            {tool}
                                        </Badge>
                                    ))}
                                </Td>
                                <Td overflowX="auto" whiteSpace="nowrap">
                                    {documentation.areas?.map((area, index) => (
                                        <Badge
                                            key={index}
                                            variant="subtle"
                                            colorScheme="purple"
                                            borderRadius="md"
                                            mr={2}
                                            mb={2}
                                            flexShrink={0}
                                        >
                                            {area.name}
                                        </Badge>
                                    ))}
                                </Td>
                                <Td overflowX="auto" whiteSpace="nowrap">
                                    {documentation.processes?.map((process, index) => (
                                        <Badge
                                            key={index}
                                            variant="subtle"
                                            colorScheme="green"
                                            borderRadius="md"
                                            mr={2}
                                            mb={2}
                                            flexShrink={0}
                                        >
                                            {process.name}
                                        </Badge>
                                    ))}
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                    <Box mt={4} p={4} borderWidth={1} borderRadius="md" overflowY="auto" maxHeight="400px">
                            <MarkdownRenderer content={documentation?.documentText} />
                      
                    </Box>

                </ModalBody>
                <ModalFooter>
                    <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                        <Avatar name={documentation?.user?.name} />

                        <Box>
                            <Text>Criado por, {documentation?.user?.name}	</Text>
                        </Box>
                    </Flex>
                    <Button
                        colorScheme="blue"
                        type="submit"
                        onClick={handleSubmit(submitForm, onError)}
                    >
                        Editar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ViewDocumentationModal;