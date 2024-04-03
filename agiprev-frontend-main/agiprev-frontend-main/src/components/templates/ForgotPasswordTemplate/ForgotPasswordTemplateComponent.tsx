import { useLocation } from 'react-router-dom';
import LoginStructureComponent from '../../UI/molecules/LoginStructureComponent/LoginStructureComponent';
import ForgotPasswordFormComponent from '../../UI/organisms/ForgotPasswordFormComponent/ForgotPasswordFormComponent';

export default function ForgotPasswordTemplateComponent() {
  const location = useLocation();
  return (
    <LoginStructureComponent
      subtitle={
        location.pathname.includes('first')
          ? 'Digite seu email de cadastro'
          : 'Digite um email para enviarmos o link de recuperação'
      }
    >
      <ForgotPasswordFormComponent
        isFirstAccess={location.pathname.includes('first')}
      />
    </LoginStructureComponent>
  );
}
