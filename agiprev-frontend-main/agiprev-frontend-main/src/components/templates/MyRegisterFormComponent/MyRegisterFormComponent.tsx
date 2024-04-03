import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Stack,
  useToast,
} from '@chakra-ui/react';
import {
  PhysicalPerson,
  AgiPrevPersonType,
  savePhysicalPerson,
  useMyProfile,
} from '../../../services/PhysicalPersonService';
import { useState } from 'react';
import { useUserData } from '../../../services/LoginService';
import useStateList, {
  useCityList,
  useCountryList,
} from '../../../services/StateServices';
import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import {
  cepMask,
  cleanNumberMask,
  cpfMask,
  phoneMask,
} from '../../../utils/functions/masks';
import InputSelectComponent from '../../UI/atoms/InputSelectComponent/InputSelectComponent';
import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';
import { showToast } from '../../../utils/showToast';
import DropzoneModel from '../../UI/organisms/uploadModel/DropZoneModel';
import RadioGroupComponent from '../../UI/atoms/RadioGroupComponent/RadioGroupComponent';
import { putServer } from '../../../services/Server';
import { putOperator } from '../../../services/OperatorService';

export type ProfileFormProps = {
  showRadio: boolean;
  form: PhysicalPerson;
  setForm: React.Dispatch<React.SetStateAction<PhysicalPerson | undefined>>;
};

export default function MyRegisterFormComponent(props: ProfileFormProps) {
  const toast = useToast();
  const [profileUrl, setProfileUrl] = useState(props.form.profilePicUrl);
  const user = useUserData();
  const myProfile = useMyProfile();
  const personType = myProfile.data?.agiPrevPersonType;
  const { data: countries } = useCountryList();
  const { data: states } = useStateList(
    props.form?.addresses[0].countryId || ''
  );
  const { data: cities } = useCityList(props.form?.addresses[0].stateId || '');
  const optionsEdit =
    personType?.toString() === AgiPrevPersonType.Operator
      ? [
          { id: AgiPrevPersonType.Null, name: 'Editar Pessoa' },
          { id: AgiPrevPersonType.Operator, name: 'Editar Operadora' },
        ]
      : [
          { id: AgiPrevPersonType.Null, name: 'Editar Pessoa' },
          { id: AgiPrevPersonType.Server, name: 'Editar Servidor' },
        ];
  const options =
    personType?.toString() === AgiPrevPersonType.Null ? [] : optionsEdit;

  return (
    <Box backgroundColor={'white'}>
      <Flex flexDirection={'column'} mb={'30px'}>
        <TitleTextComponent>
          {props.form.id ? 'Meu Cadastro' : 'Cadastrar pessoa'}
        </TitleTextComponent>
        <TitleTextComponent subTitle>
          {props.form.id
            ? 'Você pode editar suas informações pessoais de cadastro'
            : 'Crie uma nova pessoa'}
        </TitleTextComponent>
      </Flex>
      {props.showRadio && (
        <Flex>
          <RadioGroupComponent
            onChange={(value) => {
              props.setForm({
                ...props.form,
                agiPrevPersonType: value as AgiPrevPersonType,
              });
            }}
            value={String(props.form.agiPrevPersonType)}
            margin={'5px 0 26px 0'}
            options={options}
            direction={'row'}
          />
        </Flex>
      )}
      <Flex>
        <Stack spacing={5} width={'90%'} marginRight={'5%'}>
          <TitleTextComponent subTitle>Informações pessoais</TitleTextComponent>
          <InputComponent
            value={props.form.firstName}
            onChange={(input) =>
              props.setForm({
                ...props.form,
                firstName: input.target.value,
              })
            }
            label="Nome"
            placeholder="Digite o nome"
          />
          <InputComponent
            value={props.form.lastName}
            onChange={(input) =>
              props.setForm({
                ...props.form,
                lastName: input.target.value,
              })
            }
            label="Sobrenome"
            placeholder="Digite o sobrenome"
          />
          <InputComponent
            value={props.form.displayName}
            onChange={(input) =>
              props.setForm({
                ...props.form,
                displayName: input.target.value,
              })
            }
            label="Apelido"
            placeholder="Digite o nome fantasia"
          />
          <InputComponent
            value={props.form.document}
            onChange={(input) =>
              props.setForm({
                ...props.form,
                document: cpfMask(input.target.value),
              })
            }
            label="CPF"
            placeholder="000.000.000-00"
          />
          <InputComponent
            value={props.form.date}
            onChange={(input) =>
              props.setForm({ ...props.form, date: input.target.value })
            }
            type="date"
            label="Data de Nascimento"
            placeholder="00/00/00000"
          />
          <FormControl>
            <InputSelectComponent
              defaultValue={String(props.form.gender)}
              options={[
                { id: '1', name: 'Masculino' },
                { id: '2', name: 'Feminino' },
              ]}
              onChange={(input) =>
                props.setForm({
                  ...props.form,
                  gender: Number(input.target.value),
                })
              }
              label="Gênero"
              placeholder="Selecione o seu gênero"
            />
          </FormControl>
          <InputComponent
            value={props.form.phones[0].number}
            onChange={(input) =>
              props.setForm({
                ...props.form,
                phones: [
                  {
                    ...props.form.phones[0],
                    number: phoneMask(input.target.value),
                  },
                ],
              })
            }
            label="Celular"
            placeholder="(XX) 9 XXXX-XXXX"
          />
          <Flex alignItems={'center'}>
            <FormLabel>Foto</FormLabel>
            <DropzoneModel
              setProfilePicUrl={(url) => {
                setProfileUrl(url);
              }}
              fileUrl={props.form.profilePicUrl}
              type="profile"
            />
          </Flex>
        </Stack>
        <Stack spacing={5} width={'100%'}>
          <TitleTextComponent subTitle>
            Informações de endereço
          </TitleTextComponent>
          <InputComponent
            value={props.form.addresses[0].zipcode}
            onChange={(input) =>
              props.setForm({
                ...props.form,
                addresses: [
                  {
                    ...props.form.addresses[0],
                    zipcode: cepMask(input.target.value),
                  },
                ],
              })
            }
            label="CEP"
            placeholder="00.000-000"
          />
          <InputComponent
            value={props.form.addresses[0].street}
            onChange={(input) =>
              props.setForm({
                ...props.form,
                addresses: [
                  {
                    ...props.form.addresses[0],
                    street: input.target.value,
                  },
                ],
              })
            }
            label="Rua"
            placeholder="Digite a rua"
          />
          <InputComponent
            value={props.form.addresses[0].complement}
            onChange={(input) =>
              props.setForm({
                ...props.form,
                addresses: [
                  {
                    ...props.form.addresses[0],
                    complement: input.target.value,
                  },
                ],
              })
            }
            label="Número"
            placeholder="Digite o número"
          />
          <InputComponent
            value={props.form.addresses[0].district}
            onChange={(input) =>
              props.setForm({
                ...props.form,
                addresses: [
                  {
                    ...props.form.addresses[0],
                    district: input.target.value,
                  },
                ],
              })
            }
            label="Bairro"
            placeholder="Digite o bairro"
          />
          <FormControl>
            <InputSelectComponent
              defaultValue={props.form.addresses[0].countryId}
              onChange={(input) =>
                props.setForm({
                  ...props.form,
                  addresses: [
                    {
                      ...props.form.addresses[0],
                      countryId: input.target.value,
                    },
                  ],
                })
              }
              options={countries}
              placeholder="Selecione o País"
              label="País"
            />
          </FormControl>
          <FormControl>
            <InputSelectComponent
              defaultValue={props.form.addresses[0].stateId}
              onChange={(input) =>
                props.setForm({
                  ...props.form,
                  addresses: [
                    {
                      ...props.form.addresses[0],
                      stateId: input.target.value,
                    },
                  ],
                })
              }
              options={states}
              placeholder="Selecione o estado"
              label="Estado"
            />
          </FormControl>
          <FormControl>
            <InputSelectComponent
              defaultValue={props.form.addresses[0].cityId}
              options={cities}
              onChange={(input) =>
                props.setForm({
                  ...props.form,
                  addresses: [
                    {
                      ...props.form.addresses[0],
                      cityId: input.target.value,
                    },
                  ],
                })
              }
              label="Cidade"
              placeholder="Selecione uma cidade"
            />
          </FormControl>
          <InputComponent
            margin={'0 0 10px 0'}
            value={props.form.user.email}
            onChange={(input) =>
              props.setForm({
                ...props.form,
                user: { ...props.form.user, email: input.target.value },
              })
            }
            label="email"
            placeholder="example@lll.com"
          />
        </Stack>
      </Flex>

      <Flex justifyContent={'end'}>
        <ButtonComponent
          margin={'0 20px 0 20px'}
          variant="solid"
          onSubmit={() => {
            if (props.form.agiPrevPersonType === AgiPrevPersonType.Operator)
              putOperator(
                {
                  ...props.form.serverOrOperator,
                },
                user?.personId ? user.personId : ''
              );
            else if (props.form.agiPrevPersonType === AgiPrevPersonType.Server)
              putServer(
                {
                  ...props.form.serverOrOperator,
                },
                user?.personId ? user.personId : ''
              );
            else
              savePhysicalPerson({
                ...props.form,
                document: cleanNumberMask(props.form.document),
                name: `${props.form.firstName} ${props.form.lastName}`,
                phones: [
                  {
                    ...props.form.phones[0],
                    number: cleanNumberMask(props.form.phones[0].number),
                  },
                ],
                addresses: [
                  {
                    ...props.form.addresses[0],
                    zipcode: cleanNumberMask(props.form.addresses[0].zipcode),
                  },
                ],
                profilePicUrl: profileUrl,
                user: {
                  ...props.form.user,
                  username: !props.form.id
                    ? props.form.user.email
                    : props.form.user.username,
                  entities: [user?.entity || ''],
                },
              }).then((res) => {
                showToast({
                  toast,
                  status: 'success',
                  title: 'Sucesso',
                  description: 'Salvo com sucesso',
                });
              });
          }}
        >
          Salvar
        </ButtonComponent>
      </Flex>
    </Box>
  );
}
