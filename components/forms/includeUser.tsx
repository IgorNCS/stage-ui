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
import Cookies from 'js-cookie';
import UserHTTPService from '@/app/lib/request/userHTTPService';

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

type IncludeUserModalType = {
    isOpen: boolean;
    onClose: () => void;
    cliente: any
};



interface RequestType { 
    areaIds?: string[]; 
    name?: string
    birthday?: string;

    role?: string
}

function IncludeUserModal({ isOpen, onClose, cliente }: IncludeUserModalType) {
    const toast = useToast();

    // const [selectedAreas, setSelectedAreas] = useState('');

    const [area, setArea] = useState();
    const [areaOptions, setAreaOptions] = useState([]);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

    const [birthday, setBirthday] = useState(cliente?.birthday?.split('T')[0] || '');


    const [userName, setUserName] = useState('');
    const [cpf, setCpf] = useState('');

    const [selectedRole, setSelectedRole] = useState('EMPLOYEER');

    const loggedInUser = Cookies.get('user');

    const roleOptions = [
        { value: 'ADMIN', label: 'ADMIN' },
        { value: 'MANAGER', label: 'MANAGER' },
        { value: 'EMPLOYEER', label: 'EMPLOYEER' },
    ];

    const roleOptionsWithSuperAdmin =
        loggedInUser && loggedInUser.role === 'ADMIN'
            ? [...roleOptions]
            : roleOptions;


    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onTouched',
    });

    const submitForm = async (data: any) => {
        try {

            // const request = {

            //     processName: data.processName,
            //     areas: data.areas,
            //     responsables: data.responsables,
            //     tools: data.tools ? data.tools.split(",").map(tool => tool.trim()) : [],
            //     processDescription: data.processDescription,
            // };

            const request: RequestType = {
                name: userName,
                areaIds: selectedAreas?.map((area: any) => area.id),
                role: selectedRole,
            }
            if (request.areaIds && cliente.areas) {
                const clienteAreaIds = cliente.areas.map(area => area.id);
                if (request.areaIds.length === clienteAreaIds.length && request.areaIds.every(id => clienteAreaIds.includes(id))) {
                    if (request.areaIds) delete request.areaIds;
                }
            }
            console.log(data, request)
            const response = await UserHTTPService.updateUser(request, cliente.id);
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
        console.log('cliente', cliente)
        getAllArea();
        getAllProcess();
    }, [cliente]);

    useEffect(() => {
        console.log(selectedAreas)
        console.log(cliente)

    }, [area]);

    useEffect(() => {
        console.log(selectedAreas)
    }, [selectedAreas]);

    useEffect(() => {
        console.log('cliente', cliente);
        getAllArea();
        getAllProcess();
        if (cliente) {
            console.log(cliente)
            setUserName(cliente.name);
            setSelectedAreas(cliente.areas?.map((area: any) => {
                return { id: area?.id, name: area?.name };
            }) || []);

            setBirthday(cliente.birthday?.split('T')[0] || '');
            setSelectedRole(cliente.role);
            setCpf(cliente.cpf)
        }
    }, [cliente]);

    async function getAllArea() {
        try {
            console.log('aqui foi');
            const response = await AreaHTTPService.getNames();
            console.log('aqui tbm')
            console.log(response)
            setAreaOptions(response.data);
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

    const user = Cookies.get('user');
    const token = Cookies.get('token');
    const opcoesBase = [
        { value: 'EMPLOYEER', label: 'EMPLOYEER' },
        { value: 'MANAGER', label: 'MANAGER' },
        { value: 'ADMIN', label: 'ADMIN' },
    ];


    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Usuario</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                            <GridItem colSpan={1}>
                                <FormLabel>Nome do usuario</FormLabel>
                                <Input
                                    placeholder="Fulano de Tal"
                                    size="lg"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </GridItem>
                            <GridItem colSpan={1}>
                                <FormLabel>CPF</FormLabel>
                                <Input
                                    placeholder="000.000.000-00"
                                    size="lg"
                                    value={cpf}
                                    defaultValue={user?.cpf}
                                    isDisabled // Adiciona o atributo isDisabled
                                />
                            </GridItem>
                            <GridItem colSpan={1}>
                                <FormLabel>Selecione Area</FormLabel>
                                <Select
                                    placeholder="Selecione Area"
                                    {...register('areaId')}
                                    onChange={(e) => {
                                        setArea(e.target.value);
                                        if (
                                            !selectedAreas.find((area) => area.id === e.target.value) &&
                                            e.target.value !== ''
                                        ) {
                                            setSelectedAreas((areas) => [
                                                ...areas,
                                                {
                                                    id: e.target.value,
                                                    name: areaOptions.find((area) => area.id === e.target.value)!.name,
                                                },
                                            ]);
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
                                            onClick={() =>
                                                setSelectedAreas(selectedAreas.filter((e) => e.id !== selectedArea.id))
                                            }
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
                                <FormLabel>Data de Aniversário</FormLabel>
                                <Input
                                    type="date"
                                    size="lg"
                                    value={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                />
                            </GridItem>

                            <GridItem colSpan={1}>
                                <FormLabel>Selecione Role</FormLabel>
                                <Select
                                    placeholder="Selecione Role"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    isDisabled={user && user.role == 'ADMIN'}
                                >
                                    {roleOptionsWithSuperAdmin.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </Select>
                            </GridItem>
                        </Grid>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" type="submit" onClick={handleSubmit(submitForm, onError)}>
                        Atualizar Usuario
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default IncludeUserModal;