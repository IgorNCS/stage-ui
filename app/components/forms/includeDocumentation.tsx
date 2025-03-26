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
    Tag,
    IconButton,
    Text,
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
import { IoMdCloseCircleOutline } from 'react-icons/io';
import DocumentationHTTPService, { IDocumentCreate } from '@/app/lib/request/documentationHTTPService';


const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

type IncludeDocumentationModalType = {
    isOpen: boolean;
    onClose: () => void;
};

const INITIAL_VALUES = {
    processName: '',
    areaId: '',
    responsables: '',
    ferramentas: '',
    processDescription: '',
};

function IncludeDocumentationModal({ isOpen, onClose }: IncludeDocumentationModalType) {
    const toast = useToast();
    const [employers, setEmployers] = useState();
    const [employersOptions, setEmployersOptions] = useState([]);

    // const [selectedAreas, setSelectedAreas] = useState('');

    const [area, setArea] = useState();
    const [areaOptions, setAreaOptions] = useState([]);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

    const [process, setProcess] = useState();
    const [processOptions, setProcessOptions] = useState([]);
    const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);


    const [document, setDocument] = useState("**Documente Aqui!**");

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onTouched',
    });

    const submitForm = async (data: any) => {
        try {
            const teste = {
                "name": "Documentação API",
                "documentText": "# Lorem Ipsum Dolor Sit Amet\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labor| Linha 3, ",
                "areas": ["1d22fe9e-b1eb-4e79-b119-8aedcd41d94c"],
                "userId": "c3f60119-2937-44d5-af8b-d5007b5b294a",
                "tools": ["Teclado", "Mouse"],
                "processes": ["d0090bd5-7c58-40ed-95de-05edb9bc5663"],
                "active": true
            }
            const request:IDocumentCreate = {
                // name: string,
                // documentText: string,
                // userId: string,
                // url_image?: string,
                // tools?: string[],
                // areas?: string[],
                // processes?: string[]
                
                name: data.documentName,
                documentText:JSON.stringify(document),
                userId:data.employersId,
                url_image:data.url_image,
                areas: selectedAreas.map((area: any) => area.id),
                tools: data.tools ? data.tools.split(",").map(tool => tool.trim()) : [],
                processes:selectedProcesses.map((process: any) => process.id),
                // responsables: data.documentName,
                // processDescription: data.processDescription,

            };
            
            const response = await DocumentationHTTPService.create(request);

            toast({
                title: 'Processo incluído com sucesso!',
                position: 'top-right',
                isClosable: false,
                description: 'Processo incluído com sucesso!',
                status: 'success',
            });

            onClose();
        } catch (error: AxiosError | any) {
            console.log(error)
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
        getAllEmployers();
    }, []);

    useEffect(() => {
        getAllProcess()
        getAllEmployers();
    }, [area]);

    useEffect(() => {
        getAllProcess()
        getAllEmployers();
    }, [selectedAreas]);



    async function getAllArea() {
        try {
            const response = await AreaHTTPService.getNames();
            console.log(response)
            setAreaOptions(response.data);
        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    async function getAllEmployers() {
        try {
            const areaId = area || '';
            console.log('employer',areaId)
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
            console.log(selectedAreas)
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
        <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Incluir Documentação</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                            <GridItem colSpan={1}>
                                <FormLabel>Nome da Documentação</FormLabel>
                                <Input
                                    placeholder="Nome da documentação"
                                    size="lg"
                                    {...register('documentName')}
                                />
                            </GridItem>
                            <GridItem colSpan={1}>
                                <FormLabel>Ferramentas Utilizadas</FormLabel>
                                <Input
                                    placeholder="Ferramentas utilizadas"
                                    size="lg"
                                    {...register('tools')}
                                />
                                <FormHelperText fontSize="sm" color="gray.500">
                                    * Separe cada ferramenta por vírgula
                                </FormHelperText>
                            </GridItem>
                            <GridItem colSpan={1}>
                                <FormLabel>Selecione Area</FormLabel>
                                <Select placeholder='Selecione Area' {...register('areaId')}
                                    onChange={(e) => {
                                        setArea(e.target.value);
                                        if (!selectedAreas.find((area) => area.id === e.target.value) && e.target.value !== '') {
                                            setSelectedAreas((areas) => [...areas, { id: e.target.value, name: areaOptions.find((area) => area.id === e.target.value)!.name }]);
                                        }
                                    }}
                                >
                                    {areaOptions.map((area) => (
                                        <option key={area.id} value={area.id}>
                                            {area.name}
                                        </option>
                                    ))}
                                </Select>
                                {selectedAreas.map((selectedArea) => (
                                    <Tag
                                        key={selectedArea.id}
                                        size="sm"
                                        borderRadius="full"
                                        variant="solid"
                                        colorScheme="blue"
                                    >
                                        <Text fontSize="xs">{selectedArea.name}</Text>
                                        <IconButton
                                            size="s"
                                            ml={2}
                                            icon={<IoMdCloseCircleOutline />}
                                            backgroundColor={'none'}
                                            background={'none'}
                                            // color={ownerTheme.backgroundColor}
                                            onClick={() => setSelectedAreas(selectedAreas.filter((e) => e.id !== selectedArea.id))}
                                            aria-label={`Remove ${selectedArea.name}`}
                                            _hover={{
                                                background: 'none',
                                                color: 'red.500',
                                            }}
                                        />
                                    </Tag>
                                ))}
                            </GridItem>

                            <GridItem colSpan={1}>
                                <FormLabel>Selecione Processos</FormLabel>
                                <Select placeholder='Selecione Processos' {...register('processesId')}
                                    onChange={(e) => {
                                        setArea(e.target.value);
                                        if (!selectedProcesses.find((process) => process.id === e.target.value) && e.target.value !== '') {
                                            setSelectedProcesses((processes) => [...processes, { id: e.target.value, name: processOptions.find((process) => process.id === e.target.value)!.name }]);
                                        }
                                    }}
                                >
                                    {processOptions.map((process) => (
                                        <option key={process.id} value={process.id}>
                                            {process.name}
                                        </option>
                                    ))}
                                </Select>
                                {selectedProcesses.map((selectedProcess) => (
                                    <Tag
                                        key={selectedProcess.id}
                                        size="sm"
                                        borderRadius="full"
                                        variant="solid"
                                        colorScheme="blue"
                                    >
                                        <Text fontSize="xs">{selectedProcess.name}</Text>
                                        <IconButton
                                            size="s"
                                            ml={2}
                                            icon={<IoMdCloseCircleOutline />}
                                            backgroundColor={'none'}
                                            background={'none'}
                                            // color={ownerTheme.backgroundColor}
                                            onClick={() => setSelectedAreas(selectedProcesses.filter((e) => e.id !== selectedProcess.id))}
                                            aria-label={`Remove ${selectedProcess.name}`}
                                            _hover={{
                                                background: 'none',
                                                color: 'red.500',
                                            }}
                                        />
                                    </Tag>
                                ))}
                            </GridItem>
                            <GridItem colSpan={1}>
                                <FormLabel>Responsável</FormLabel>
                                <Select placeholder='Selecione Responsavel' {...register('employersId')} onChange={(e) => setEmployers(e.target.value)}>
                                    {employersOptions.map((employers) => (
                                        <option key={employers.id} value={employers.id}>
                                            {employers.name}
                                        </option>
                                    ))}
                                </Select>
                            </GridItem>

                            <GridItem colSpan={2}>
                                <FormLabel>Documente o processo</FormLabel>
                                <div data-color-mode="light">
                                    <MDEditor value={document} onChange={setDocument} bgColor="white" />
                                </div>
                            </GridItem>
                        </Grid>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        type="submit"
                        onClick={handleSubmit(submitForm, onError)}
                    >
                        Incluir Documentação
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    );
}

export default IncludeDocumentationModal;