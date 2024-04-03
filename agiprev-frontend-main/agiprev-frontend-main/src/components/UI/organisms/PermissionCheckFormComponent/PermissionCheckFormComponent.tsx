import React from 'react';
import { AccessProfilePermissionsResp } from '../../../../services/AccessProfileService';
import FlexRegisterInputsComponent from '../../atoms/FlexRegisterInputs/FlexRegisterInputsComponent';
import InputCheckGroupComponent from '../../molecules/InputCheckGroupComponent/InputCheckGroupComponent';

export type PermissionCheckFormProps = {
  permissions: AccessProfilePermissionsResp[];
  setPermissions: React.Dispatch<
    React.SetStateAction<AccessProfilePermissionsResp[]>
  >;
};

export default function PermissionCheckFormComponent(
  props: PermissionCheckFormProps
) {
  return (
    <>
      <FlexRegisterInputsComponent>
        <InputCheckGroupComponent
          title={'Cadastro de Pessoas'}
          selectedPermission={'person'}
          permissions={props.permissions}
          setPermissions={props.setPermissions}
        />
        <InputCheckGroupComponent
          title={'Cadastro de Usuários'}
          selectedPermission={'users'}
          permissions={props.permissions}
          setPermissions={props.setPermissions}
        />
      </FlexRegisterInputsComponent>
      <FlexRegisterInputsComponent>
        <InputCheckGroupComponent
          title={'Cadastro de Índices'}
          selectedPermission={'index'}
          permissions={props.permissions}
          setPermissions={props.setPermissions}
        />
        <InputCheckGroupComponent
          title={'Cadastro de Rúbricas'}
          selectedPermission={'rubric'}
          permissions={props.permissions}
          setPermissions={props.setPermissions}
        />
      </FlexRegisterInputsComponent>
      <FlexRegisterInputsComponent>
        <InputCheckGroupComponent
          title={'Cadastro de Entidades'}
          selectedPermission={'relatedentity'}
          permissions={props.permissions}
          setPermissions={props.setPermissions}
        />
        <InputCheckGroupComponent
          title={'Cadastro de Receitas'}
          selectedPermission={'revenue'}
          permissions={props.permissions}
          setPermissions={props.setPermissions}
        />
      </FlexRegisterInputsComponent>
      <FlexRegisterInputsComponent>
        <InputCheckGroupComponent
          title={'Cadastro de Recolhimentos'}
          selectedPermission={'collection'}
          permissions={props.permissions}
          setPermissions={props.setPermissions}
        />
        <InputCheckGroupComponent
          title={'Cadastro de Despesas'}
          selectedPermission={'expense'}
          permissions={props.permissions}
          setPermissions={props.setPermissions}
        />
      </FlexRegisterInputsComponent>
      <FlexRegisterInputsComponent>
        <InputCheckGroupComponent
          title={'Cadastro de Apurações'}
          selectedPermission={'verification'}
          permissions={props.permissions}
          setPermissions={props.setPermissions}
        />
      </FlexRegisterInputsComponent>
    </>
  );
}
