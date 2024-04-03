import { useState } from 'react';
import LoginStructureComponent from '../../UI/molecules/LoginStructureComponent/LoginStructureComponent';
import ChangePasswordFormComponent from '../../UI/organisms/ChangePasswordFormComponent/ChangePasswordFormComponent';
import { getChangePasswordMessage } from '../ChangePasswordTemplate/ChangePasswordTemplateComponent';

export default function CreatePasswordTemplateComponent() {
  const [tokenScreen, setTokenScreen] = useState<number>(0);
  return (
    <LoginStructureComponent subtitle={getChangePasswordMessage(tokenScreen)}>
      <ChangePasswordFormComponent
        tokenScreen={tokenScreen}
        setTokenScreen={setTokenScreen}
        termsAndConditions={true}
      />
    </LoginStructureComponent>
  );
}
