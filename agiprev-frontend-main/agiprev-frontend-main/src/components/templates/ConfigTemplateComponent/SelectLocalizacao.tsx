import { ChangeEvent, FC, useEffect, useState } from 'react';
import { FormControl, FormErrorMessage, FormLabel, Select, Stack, Text } from '@chakra-ui/react';
import { useEstados } from '../../../hooks/MunicipioUFConfig/useEstados';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';

type SelectLocalizacaoProps = {
    onEstadoChange: (estadoNome: string) => void;
    onMunicipioChange: (municipioNome: string) => void;
    errorEstado?: string;
    errorMunicipio?: string;
    selectedEstadoSigla?: string;
    selectedMunicipioNome?: string;
};

export const SelectLocalizacao: FC<SelectLocalizacaoProps> = ({
    onEstadoChange,
    onMunicipioChange,
    errorEstado,
    errorMunicipio,
    selectedEstadoSigla, 
    selectedMunicipioNome,
}) => {
    const { estados } = useEstados();
    const [selectedEstado, setSelectedEstado] = useState<string>(selectedEstadoSigla || '');
    const [selectedMunicipio, setSelectedMunicipio] = useState<string>(selectedMunicipioNome || '');

    useEffect(() => {
        onEstadoChange(selectedEstado || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedEstado]);

    useEffect(() => {
        onMunicipioChange(selectedMunicipio || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMunicipio]);

    const handleEstadoChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const estadoSigla = e.target.value;
        const estado = estados.find((e) => e.sigla === estadoSigla);
        setSelectedEstado(estado?.sigla || '');
        setSelectedMunicipio('');
    };

    const handleMunicipioChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputMunicipio = e.target.value;

        if (inputMunicipio.trim() !== '' || inputMunicipio === '') {
            setSelectedMunicipio(inputMunicipio);
        }
    };

    return (
        <Stack direction={'row'} spacing={4} width={'100%'}>
            <FormControl isInvalid={!!errorEstado}>
                <FormLabel>Estado</FormLabel>
                <Select
                    placeholder="Selecione um estado"
                    onChange={handleEstadoChange}
                    value={selectedEstado || selectedEstadoSigla || ''}
                >
                    {estados.sort((a, b) => a.nome.localeCompare(b.nome)).map((estado) => (
                        <option key={estado.id} value={estado.sigla}>
                            {estado.nome}
                        </option>
                    ))}
                </Select>
                {errorEstado && <FormErrorMessage mt={0}>{errorEstado}</FormErrorMessage>}
            </FormControl>

            <FormControl>
                <FormLabel>Município</FormLabel>
                <InputComponent
                    marginRight={8}
                    placeholder="Escreva o município"
                    value={selectedMunicipio || selectedMunicipioNome || ''}
                    error={errorMunicipio}
                    onChange={handleMunicipioChange}
                />
            </FormControl>
        </Stack>
    );
};
