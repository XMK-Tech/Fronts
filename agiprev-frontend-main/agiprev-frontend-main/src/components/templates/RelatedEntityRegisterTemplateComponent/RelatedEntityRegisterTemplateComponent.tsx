import React from 'react';
import { Center, Flex, useToast } from '@chakra-ui/react';
import RegisterStructureComponent from '../../UI/molecules/RegisterStructureComponent/RegisterStructureComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import { checkFormValue, getError } from '../../../utils/functions/utility';
import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import { showToast } from '../../../utils/showToast';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import InputSelectComponent from '../../UI/atoms/InputSelectComponent/InputSelectComponent';
import { useCities, useStates } from '../../../services/StateServices';
import FlexRegisterInputsComponent from '../../UI/atoms/FlexRegisterInputs/FlexRegisterInputsComponent';
import {
  Entities,
  EntitiesAddress,
  EntitiesResp,
  useEntitiesDetails,
} from '../../../services/EntitiesService';
import {
  cepMask,
  cleanNumberMask,
  cnpjMask,
} from '../../../utils/functions/masks';
import DropzoneModel from '../../UI/organisms/uploadModel/DropZoneModel';
import { useUserData } from '../../../services/LoginService';
import { AddressType } from '../../../services/PhysicalPersonService';
import {
  relatedEntityTypeOptions,
  saveRelatedEntity,
  useRelatedEntityId,
} from '../../../services/RelatedEntitiesService';

const defaultForm = {
  name: '',
  document: '',
  imageUrl: '',
  type: 0,
};

const formSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  document: yup.string().required('CNPJ é obrigatório'),
  type: yup.string().required('Tipo é obrigatório'),
});

const defaultAddressForm = {
  street: '',
  district: '',
  complement: '',
  zipcode: '',
  number: '',
  type: AddressType.Commercial,
  cityId: '',
  stateId: '',
  ownerId: 'RelatedEntity',
};

const addressSchema = yup.object().shape({
  street: yup.string().required('Rua é obrigatório'),
  district: yup.string().required('Bairro é obrigatório'),
  zipcode: yup.string().required('CEP é obrigatório'),
  number: yup.string().required('Número é obrigatório'),
  cityId: yup.string().required('Cidade é obrigatório'),
  stateId: yup.string().required('Estado é obrigatório'),
});

export default function RelatedEntityRegisterTemplateComponent() {
  const user = useUserData();
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const [form, setForm] = React.useState<Entities>({ ...defaultForm });
  const [address, setAddress] = React.useState<EntitiesAddress>({
    ...defaultAddressForm,
  });
  const states = useStates();
  const entity = useRelatedEntityId(params?.id || '');
  const cities = useCities(address.stateId);
  const responsibleData = useEntitiesDetails(user?.entity);
  const [responsible, setResponsible] = React.useState<EntitiesResp>();
  React.useEffect(() => {
    if (entity.data) {
      setForm({
        id: entity.data.id,
        name: entity.data.name,
        document: cnpjMask(entity.data.document),
        imageUrl: entity.data.imageUrl,
        type: entity.data.type,
      });
      if (entity.data.address) {
        setAddress({
          id: entity.data.address.id,
          street: entity.data.address.street,
          district: entity.data.address.district,
          complement: entity.data.address.complement,
          zipcode: entity.data.address.zipcode,
          number: entity.data.address.number,
          type: AddressType.Commercial,
          cityId: entity.data.address.cityId,
          stateId: entity.data.address.stateId,
          ownerId: 'RelatedEntity',
        });
      }
    }
    if (responsibleData.data) {
      setResponsible(responsibleData.data);
    } else {
      setResponsible(undefined);
    }
  }, [entity.data, responsibleData.data]);
  return (
    <RegisterStructureComponent
      title={!params.id ? 'Cadastro de entidade' : 'Editar entidade'}
      subTitle="preencha os dados para realizar o cadastro "
      buttonTitle={!params.id ? 'Cadastrar' : 'Editar'}
      goBack="entities"
      disabledButton={!formSchema.isValidSync(form)}
      onSubmit={() => {
        saveRelatedEntity({
          ...form,
          address: { ...address, zipcode: cleanNumberMask(address.zipcode) },
        })
          .then((res) => {
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: !params.id
                ? 'Entidade criada com sucesso'
                : 'Entidade editada com sucesso',
            });
            navigate('/entities');
          })
          .catch((err) => {
            console.error(err);
            showToast({
              toast,
              status: 'error',
              title: 'Error',
              description: getError(err),
            });
          });
      }}
      content={
        <Flex flexDirection={'column'} w={'100%'}>
          <TitleTextComponent mb={2} subTitle>
            Dados
          </TitleTextComponent>
          <FlexRegisterInputsComponent>
            <InputComponent
              marginRight={8}
              label="Nome"
              placeholder="Digite o nome"
              value={form.name}
              error={checkFormValue(form, formSchema, 'name')}
              onChange={(input) => {
                setForm({ ...form, name: input.target.value });
              }}
            />
            <InputComponent
              marginRight={8}
              label="CNPJ"
              placeholder="Digite o CNPJ"
              value={form.document}
              error={checkFormValue(form, formSchema, 'document')}
              onChange={(input) => {
                setForm({ ...form, document: cnpjMask(input.target.value) });
              }}
            />
            <InputSelectComponent
              marginRight={8}
              label="Tipo de entidade"
              placeholder="Selecione o tipo"
              options={relatedEntityTypeOptions}
              defaultValue={form.type?.toString()}
              error={checkFormValue(form, formSchema, 'type')}
              onChange={(input) => {
                setForm({ ...form, type: Number(input.target.value) });
              }}
            />
          </FlexRegisterInputsComponent>
          <FlexRegisterInputsComponent>
            <InputComponent
              disabled
              marginRight={8}
              label="CNPJ Vinculado"
              placeholder="Digite o CNPJ Vinculado"
              value={cnpjMask(responsible?.document)}
            />
            <InputComponent
              disabled
              value={responsible?.name}
              marginRight={8}
              label="Nome"
              placeholder="Digite o nome"
            />
            <InputComponent
              disabled
              value={responsible?.typeDescription}
              marginRight={8}
              label="Tipo de entidade"
              placeholder="Selecione o tipo"
            />
          </FlexRegisterInputsComponent>
          <TitleTextComponent mb={2} subTitle>
            Endereço
          </TitleTextComponent>
          <FlexRegisterInputsComponent>
            <InputComponent
              marginRight={8}
              label="CEP"
              placeholder="Digite o CEP"
              value={address.zipcode}
              error={checkFormValue(address, addressSchema, 'zipcode')}
              onChange={(input) => {
                setAddress({
                  ...address,
                  zipcode: cepMask(input.target.value),
                });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Rua"
              placeholder="Digite o rua"
              value={address.street}
              error={checkFormValue(address, addressSchema, 'street')}
              onChange={(input) => {
                setAddress({ ...address, street: input.target.value });
              }}
            />
            <InputSelectComponent
              marginRight={8}
              label="Estado"
              placeholder="Selecione o estado"
              defaultValue={address.stateId}
              options={states.data}
              error={checkFormValue(address, addressSchema, 'stateId')}
              onChange={(input) => {
                setAddress({ ...address, stateId: input.target.value });
              }}
            />
          </FlexRegisterInputsComponent>
          <FlexRegisterInputsComponent>
            <InputSelectComponent
              marginRight={8}
              label="Cidade"
              placeholder="Selecione a cidade"
              defaultValue={address.cityId}
              options={cities.data}
              error={checkFormValue(address, addressSchema, 'cityId')}
              onChange={(input) => {
                setAddress({ ...address, cityId: input.target.value });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Número"
              placeholder="Digite o número"
              value={address.number}
              error={checkFormValue(address, addressSchema, 'number')}
              onChange={(input) => {
                setAddress({ ...address, number: input.target.value });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Complemento"
              placeholder="Digite o Complemento"
              value={address.complement}
              onChange={(input) => {
                setAddress({ ...address, complement: input.target.value });
              }}
            />
          </FlexRegisterInputsComponent>
          <TitleTextComponent mb={2} subTitle>
            Logo
          </TitleTextComponent>
          <FlexRegisterInputsComponent>
            <Center>
              <DropzoneModel
                type={'profile'}
                fileUrl={form.imageUrl}
                setProfilePicUrl={(response) =>
                  setForm({ ...form, imageUrl: response })
                }
              />
            </Center>
          </FlexRegisterInputsComponent>
        </Flex>
      }
    />
  );
}
