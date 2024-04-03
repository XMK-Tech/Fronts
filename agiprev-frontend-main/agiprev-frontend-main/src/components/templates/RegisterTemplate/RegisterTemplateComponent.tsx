import LoginStructureComponent from '../../UI/molecules/LoginStructureComponent/LoginStructureComponent';
import RegisterFormComponent from '../../UI/organisms/RegisterFormComponent/RegisterFormComponent';

export default function RegisterTemplateComponent() {
  return (
    <LoginStructureComponent subtitle={'Bem Vindo! Digite seus dados'}>
      <RegisterFormComponent />
    </LoginStructureComponent>
  );
}
