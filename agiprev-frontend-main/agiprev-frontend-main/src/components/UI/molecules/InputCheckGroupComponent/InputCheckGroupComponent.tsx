import React from 'react';
import { Box, FormLabel, Stack } from '@chakra-ui/react';
import InputCheckComponent from '../../atoms/InputCheckComponent/InputCheckComponent';
import { AccessProfilePermissionsResp } from '../../../../services/AccessProfileService';
import { PermissionNames } from '../../../../services/PermissionService';

export type InputCheckGroupProps = {
  title: string;
  selectedPermission: PermissionNames;
  permissions: AccessProfilePermissionsResp[];
  setPermissions: React.Dispatch<
    React.SetStateAction<AccessProfilePermissionsResp[]>
  >;
};

export default function InputCheckGroupComponent(props: InputCheckGroupProps) {
  const permPrefix = 'agiprev-pasep-';
  const readPerm = props.permissions?.find(
    (item) => item.name === `${permPrefix}${props.selectedPermission}-read`
  );
  const addPerm = props.permissions?.find(
    (item) => item.name === `${permPrefix}${props.selectedPermission}-add`
  );
  const editPerm = props.permissions?.find(
    (item) => item.name === `${permPrefix}${props.selectedPermission}-edit`
  );
  const deletePerm = props.permissions?.find(
    (item) => item.name === `${permPrefix}${props.selectedPermission}-delete`
  );
  return (
    <Box fontWeight={'bold'} width={'50%'} my={'10px'}>
      <FormLabel mb={'0'}>{props.title}</FormLabel>
      <Stack direction="row" spacing={10}>
        <InputCheckComponent
          disabled={!readPerm}
          isChecked={readPerm?.isSelected}
          onChange={() => {
            if (readPerm)
              props.setPermissions([
                ...props.permissions.filter((item) => item.id !== readPerm.id),
                { ...readPerm, isSelected: !readPerm.isSelected },
              ]);
          }}
        >
          Ler
        </InputCheckComponent>
        <InputCheckComponent
          disabled={!addPerm}
          isChecked={addPerm?.isSelected}
          onChange={() => {
            if (addPerm)
              props.setPermissions([
                ...props.permissions.filter((item) => item.id !== addPerm.id),
                { ...addPerm, isSelected: !addPerm.isSelected },
              ]);
          }}
        >
          Cadastrar
        </InputCheckComponent>
        <InputCheckComponent
          disabled={!editPerm}
          isChecked={editPerm?.isSelected}
          onChange={() => {
            if (editPerm)
              props.setPermissions([
                ...props.permissions.filter((item) => item.id !== editPerm.id),
                { ...editPerm, isSelected: !editPerm.isSelected },
              ]);
          }}
        >
          Editar
        </InputCheckComponent>
        <InputCheckComponent
          disabled={!deletePerm}
          isChecked={deletePerm?.isSelected}
          onChange={() => {
            if (deletePerm)
              props.setPermissions([
                ...props.permissions.filter(
                  (item) => item.id !== deletePerm.id
                ),
                { ...deletePerm, isSelected: !deletePerm.isSelected },
              ]);
          }}
        >
          Excluir
        </InputCheckComponent>
      </Stack>
    </Box>
  );
}
