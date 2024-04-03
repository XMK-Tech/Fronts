import { useState } from 'react';
import LoginStructureComponent from '../../UI/molecules/LoginStructureComponent/LoginStructureComponent';
import ChangePasswordFormComponent from '../../UI/organisms/ChangePasswordFormComponent/ChangePasswordFormComponent';

export function getChangePasswordMessage(tokenScreen: number) {
  if (tokenScreen === 0) return 'Digite o token enviado em seu email';
  if (tokenScreen === 1) return 'Crie uma nova senha para acessar';
  return 'Você precisa ler e aceitar os termos para finalizar seu cadastro';
}

export default function ChangePasswordTemplateComponent() {
  const [tokenScreen, setTokenScreen] = useState<number>(0);
  return (
    <LoginStructureComponent subtitle={getChangePasswordMessage(tokenScreen)}>
      <ChangePasswordFormComponent
        tokenScreen={tokenScreen}
        setTokenScreen={setTokenScreen}
        termsAndConditions={false}
      />
    </LoginStructureComponent>
  );
}
