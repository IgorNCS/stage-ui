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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MultiSelect } from 'chakra-multiselect';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import AreaHTTPService from '@/app/lib/request/areaHTTPService';
import ProcessHTTPService from '@/app/lib/request/processHTTPService';

type IncludeProcessModalType = {
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

function IncludeProcessModal({ isOpen, onClose }: IncludeProcessModalType) {
    const toast = useToast();
    const [area, setArea] = useState();
    const [areaOptions, setAreaOptions] = useState([]);
    const [employers, setEmployers] = useState();
    const [employersOptions, setEmployersOptions] = useState([]);

    const [process, setProcess] = useState();
    const [processOptions, setProcessOptions] = useState([]);

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onTouched',
        defaultValues: INITIAL_VALUES,
    });

    const submitForm = async (data: any) => {
        try {
            const request = {
                name: data.processName,
                description: data.processDescription,
                systems_tools: data.tools ? data.tools.split(",").map((tool: string) => tool.trim()) : [],
                documentation: data.documentation,
                responsible_people: [employers],
                process_parent: process,
                // responsible_people
            };
            console.log(request)
            const response = await ProcessHTTPService.create(data.areaId, request);
            // return

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
    }, []);

    useEffect(() => {
        getAllProcess();
    }, [area]);

    useEffect(() => {
        getAllEmployers();
    }, [area]);
    async function getAllArea() {
        try {
            const response = await AreaHTTPService.getNames();
            setAreaOptions(response.data);
            console.log(response.data)
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
            console.log(area)
            if (areaId === '') return
            const response = await ProcessHTTPService.getAll(area)
            console.log(response)
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
                <ModalHeader>Incluir Processo</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                            <GridItem colSpan={1}>
                                <FormLabel>Nome do Processo</FormLabel>
                                <Input
                                    placeholder="Nome do Processo"
                                    size="lg"
                                    {...register('processName')}
                                />
                            </GridItem>
                            <GridItem colSpan={1}>
                                <FormLabel>Selecione Area</FormLabel>
                                <Select placeholder='Selecione Area' {...register('areaId')} onChange={(e) => setArea(e.target.value)}>
                                    {areaOptions.map((area) => (
                                        <option key={area.id} value={area.id}>
                                            {area.name}
                                        </option>
                                    ))}
                                </Select>
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
                            <GridItem colSpan={1}>
                                <FormLabel>Processo Pai</FormLabel>
                                <Select placeholder='Selecione Processo Pai' {...register('processId')} onChange={(e) => setProcess(e.target.value)}>
                                    {processOptions.map((process) => (
                                        <option key={process.id} value={process.id}>
                                            {process.name}
                                        </option>
                                    ))}
                                </Select>
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
                                <FormLabel>Documentação</FormLabel>
                                <Input
                                    placeholder="Documentação"
                                    size="lg"
                                    {...register('documentation')}
                                />

                            </GridItem>
                            <GridItem colSpan={2}>
                                <FormLabel>Descrição do Processo</FormLabel>
                                <Textarea
                                    placeholder="Descrição do Processo"
                                    size="lg"
                                    {...register('processDescription')}
                                />
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
                        Incluir Processo
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default IncludeProcessModal;