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
    Image,
    Skeleton,
    Box,
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
import { url } from 'inspector';
import UserHTTPService from '@/app/lib/request/userHTTPService';


const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

type IncludeAreaModalType = {
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

function IncludeAreaModal({ isOpen, onClose }: IncludeAreaModalType) {
    const toast = useToast();
    const [employers, setEmployers] = useState();
    const [employersOptions, setEmployersOptions] = useState([]);


    const [area, setArea] = useState();

    const [urlImage, setUrlImage] = useState();

    const [areas, setAreas] = useState([]);

    const [responsablesOptions, setResponsablesOptions] = useState([]);
    const [selectedResponsables, setSelectedResponsables] = useState<string[]>([]);


    const [document, setDocument] = useState("**Documente Aqui!**");

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onTouched',
    });

    const submitForm = async (data: any) => {
        try {
            const request = {

                name: data.areaName,
                url: data.areas,
                description: data.description,
                responsables: selectedResponsables.map(responsable => responsable.id),
                url_image: urlImage
            };

            await AreaHTTPService.create(request);
            toast({
                title: 'Criação de área com sucesso!',
                position: 'top-right',
                isClosable: false,
                description: 'Criação de área com sucesso!',
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
        getAllManager();
        getAllAreas();
    }, []);

    async function getAllAreas() {
        try {

            const response = await AreaHTTPService.getAll();
            console.log(response)
            setAreas(response.data.list);
            onClose();
        } catch (error: AxiosError | any) {
            console.log(error)
            const display = error.response?.data?.message || 'Erro ao buscar area.';
            toast({
                title: display,
                position: 'top-right',
                isClosable: false,
                description: 'Falha na busca de area!',
                status: 'error',
            });
        }
    }





    async function getAllManager() {
        try {
            const response = await UserHTTPService.getAll(); // Correção aqui
            setResponsablesOptions(response.data.list);
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
                <ModalHeader>Incluir nova area</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                            <GridItem colSpan={1}>
                                <FormLabel>Nome da Area</FormLabel>
                                <Input
                                    placeholder="Nome da Area"
                                    size="lg"
                                    {...register('areaName')}
                                />
                            </GridItem>
                            <GridItem colSpan={1}>
                                <FormLabel>Imagem da Area</FormLabel>
                                <Input
                                    onChange={(e) => {
                                        setUrlImage(e.target.value);
                                    }}
                                    placeholder="URL completa da imagem"
                                    size="lg"
                                // {...register('url_image')}
                                />
                                <FormHelperText fontSize="sm" color="gray.500">
                                    * url completa da imagem
                                </FormHelperText>
                            </GridItem>
                            <GridItem colSpan={1}>
                                <FormLabel>Descrição da Area</FormLabel>
                                <Input
                                    placeholder="Breve descrição da area"
                                    size="lg"
                                    {...register('description')}
                                />
                            </GridItem>

                            <GridItem colSpan={1}>
                                <FormLabel>Selecione Responsaveis</FormLabel>
                                <Select placeholder='Selecione Responsaveis' {...register('responsablesIds')}
                                    onChange={(e) => {
                                        setArea(e.target.value);
                                        if (!selectedResponsables.find((responsable) => responsable.id === e.target.value) && e.target.value !== '') {
                                            setSelectedResponsables((responsables) => [...responsables, { id: e.target.value, name: responsablesOptions.find((responsable) => responsable.id === e.target.value)!.name }]);
                                        }
                                    }}
                                >
                                    {responsablesOptions.map((responsable) => (
                                        <option key={responsable.id} value={responsable.id}>
                                            {responsable.name}
                                        </option>
                                    ))}
                                </Select>
                                {selectedResponsables.map((selectedResponsable) => (
                                    <Tag
                                        key={selectedResponsable.id}
                                        size="sm"
                                        borderRadius="full"
                                        variant="solid"
                                        colorScheme="blue"
                                    >
                                        <Text fontSize="xs">{selectedResponsable.name}</Text>
                                        <IconButton
                                            size="s"
                                            ml={2}
                                            icon={<IoMdCloseCircleOutline />}
                                            backgroundColor={'none'}
                                            background={'none'}
                                            // color={ownerTheme.backgroundColor}
                                            onClick={() => setSelectedResponsables(selectedResponsables.filter((e) => e.id !== selectedResponsable.id))}
                                            aria-label={`Remove ${selectedResponsable.name}`}
                                            _hover={{
                                                background: 'none',
                                                color: 'red.500',
                                            }}
                                        />
                                    </Tag>
                                ))}
                            </GridItem>

                            <GridItem colSpan={2}>
                                {urlImage ? (
                                    <Image
                                        src={urlImage}
                                        alt="Imagem da Area"
                                        width="100%"
                                        objectFit="cover"
                                        maxHeight={'300px'}
                                    />
                                ) : (
                                    <Box>
                                        <Text textAlign="center" mb={2}>
                                            Selecione uma imagem
                                        </Text>
                                        <Skeleton height="300px">
                                            <div>Conteúdo de espaço reservado</div>
                                        </Skeleton>
                                    </Box>
                                )}
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
        </Modal >
    );
}

export default IncludeAreaModal;