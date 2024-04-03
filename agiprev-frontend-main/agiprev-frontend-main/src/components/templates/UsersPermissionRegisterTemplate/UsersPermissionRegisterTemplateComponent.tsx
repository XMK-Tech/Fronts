import React from 'react';
import { Flex, Stack, useToast } from '@chakra-ui/react';
import RegisterStructureComponent from '../../UI/molecules/RegisterStructureComponent/RegisterStructureComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessProfilePermissionsResp } from '../../../services/AccessProfileService';
import {
  putUserPermission,
  useUserPermission,
} from '../../../services/PermissionService';
import { showToast } from '../../../utils/showToast';
import PermissionCheckFormComponent from '../../UI/organisms/PermissionCheckFormComponent/PermissionCheckFormComponent';
import { useUserData } from '../../../services/LoginService';
import TextComponent from '../../UI/atoms/TextComponent/TextComponent';
import { useUserId } from '../../../services/userService';
import { cpfMask, phoneMask } from '../../../utils/functions/masks';
import { formatDate } from '../../../utils/functions/formatDate';

export default function UsersPermissionRegisterTemplateComponent() {
  const toast = useToast();
  const navigate = useNavigate();
  const user = useUserData();
  const params = useParams<{ id: string }>();
  const [permissions, setPermissions] = React.useState<
    AccessProfilePermissionsResp[]
  >([]);
  const userPermissions = useUserPermission(params.id ?? '');
  const userDetails = useUserId(params.id ?? '');
  React.useEffect(() => {
    if (userPermissions.data) {
      if (user?.permissions) {
        setPermissions(
          user.permissions.map((item) => ({
            ...item,
            name: item.permissionName,
            isSelected: userPermissions.data.some((pe) => pe.id === item.id),
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
  }, [userPermissions.data, user?.permissions]);
  return (
    <RegisterStructureComponent
      title={'Editar permissões do usuário'}
      subTitle="Você pode editar as informações "
      buttonTitle={'Editar'}
      goBack="access-profile"
      onSubmit={() => {
        putUserPermission({
          userId: params?.id ?? '',
          franchiseId: null,
          entityId: user?.entity ?? '',
          permissionsId: permissions
            .filter((item) => item.isSelected)
            .map((item) => item.id),
        }).then((res) => {
          showToast({
            toast,
            status: 'success',
            title: 'Sucesso',
            description: 'Permissões editadas com sucesso',
          });
          navigate('/user');
        });
      }}
      content={
        <Flex flexDirection={'column'} w={'100%'}>
          <Flex
            background={'#F3F3F3'}
            padding={'10px'}
            rounded={'10px'}
            direction={'column'}
          >
            <TextComponent fontWeight={'bold'}>
              Informações do Usuário
            </TextComponent>
            <Flex
              justifyContent={'space-between'}
              paddingRight={'10%'}
              marginTop={'10px'}
            >
              <Stack direction={'column'}>
                <TextComponent color={'gray'}>Nome</TextComponent>
                <TextComponent color={'gray'}>CPF</TextComponent>
              </Stack>
              <Stack direction={'column'}>
                <TextComponent>{userDetails.data?.fullname}</TextComponent>
                <TextComponent>
                  {cpfMask(userDetails.data?.document)}
                </TextComponent>
              </Stack>
              <Stack direction={'column'}>
                <TextComponent color={'gray'}>Criado em</TextComponent>
                <TextComponent color={'gray'}>Telefone</TextComponent>
              </Stack>
              <Stack direction={'column'}>
                <TextComponent>
                  {formatDate(userDetails.data?.createdAt)}
                </TextComponent>
                <TextComponent>
                  {phoneMask(userDetails.data?.phoneNumber)}
                </TextComponent>
              </Stack>
            </Flex>
          </Flex>
          <PermissionCheckFormComponent
            permissions={permissions}
            setPermissions={setPermissions}
          />
        </Flex>
      }
    />
  );
}
