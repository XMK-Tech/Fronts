import React from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import RegisterStructureComponent from '../../UI/molecules/RegisterStructureComponent/RegisterStructureComponent';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import { checkFormValue } from '../../../utils/functions/utility';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import FlexRegisterInputsComponent from '../../UI/atoms/FlexRegisterInputs/FlexRegisterInputsComponent';
import saveAccessProfile, {
  AccessProfile,
  AccessProfilePermissionsResp,
  useAccessProfileDetails,
} from '../../../services/AccessProfileService';
import { showToast } from '../../../utils/showToast';
import PermissionCheckFormComponent from '../../UI/organisms/PermissionCheckFormComponent/PermissionCheckFormComponent';
import { useUserData } from '../../../services/LoginService';
const defaultForm = {
  id: '',
  name: '',
  description: '',
  ownerProfileId: null,
  permissionsId: [],
};

const formSchema = yup.object().shape({
  name: yup.string().required('Perfil é obrigatório'),
  description: yup.string().required('Descrição é obrigatório'),
});

export default function AccessProfileRegisterTemplateComponent() {
  const toast = useToast();
  const user = useUserData();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const isEditMode = !!params.id;
  const [form, setForm] = React.useState<AccessProfile>({ ...defaultForm });
  const [permissions, setPermissions] = React.useState<
    AccessProfilePermissionsResp[]
  >([]);
  const accessProfile = useAccessProfileDetails(params.id ?? '');
  React.useEffect(() => {
    if (accessProfile.data) {
      setForm({
        id: accessProfile.data.id,
        name: accessProfile.data.name,
        description: accessProfile.data.description,
        ownerProfileId: null,
        permissionsId: [],
      });
      if (user?.permissions) {
        setPermissions(
          user.permissions.map((item) => ({
            ...item,
            name: item.permissionName,
            isSelected: accessProfile.data.permissions.some(
              (pe) => pe.id === item.id
            ),
          }))
        );
      }
    } else {
      if (user?.permissions) {
        setPermissions(
          user.permissions.map((item) => ({
            ...item,
            name: item.permissionName,
          }))
        );
      }
    }
  }, [accessProfile.data, user?.permissions]);
  return (
    <RegisterStructureComponent
      title={!isEditMode ? 'Cadastro de Perfil' : 'Editar permissões do perfil'}
      subTitle="Você pode editar as informações "
      buttonTitle={!isEditMode ? 'Cadastrar' : 'Editar'}
      goBack="access-profile"
      onSubmitGoBack={() => {
        setForm({ ...defaultForm });
      }}
      disabledButton={!formSchema.isValidSync(form)}
      onSubmit={() => {
        saveAccessProfile({
          ...form,
          permissionsId: permissions
            .filter((item) => item.isSelected)
            .map((item) => item.id),
        }).then((res) => {
          showToast({
            toast,
            status: 'success',
            title: 'Sucesso',
            description: !isEditMode
              ? 'Perfil criado com sucesso'
              : 'Perfil editado com sucesso',
          });
          navigate('/access-profile');
        });
      }}
      content={
        <Flex flexDirection={'column'} w={'100%'}>
          <FlexRegisterInputsComponent>
            <InputComponent
              marginRight={8}
              label="Perfil"
              placeholder="Digite o perfil"
              value={form.name}
              error={checkFormValue(form, formSchema, 'name')}
              onChange={(input) => {
                setForm({ ...form, name: input.target.value });
              }}
            />
            <InputComponent
              marginRight={8}
              label="Descrição"
              placeholder="Digite a descrição"
              value={form.description}
              error={checkFormValue(form, formSchema, 'description')}
              onChange={(input) => {
                setForm({ ...form, description: input.target.value });
              }}
            />
          </FlexRegisterInputsComponent>
          <PermissionCheckFormComponent
            permissions={permissions}
            setPermissions={setPermissions}
          />
        </Flex>
      }
    />
  );
}
