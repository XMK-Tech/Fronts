import LoginStructureComponent from '../../UI/molecules/LoginStructureComponent/LoginStructureComponent';
import LoginFormComponent from '../../UI/organisms/LoginFormComponent/LoginFormComponent';

export default function LoginTemplateComponent() {
  return (
    <LoginStructureComponent
      subtitle={'Bem Vindo! Acesse com suas credenciais'}
    >
      <LoginFormComponent />
    </LoginStructureComponent>
  );
}
