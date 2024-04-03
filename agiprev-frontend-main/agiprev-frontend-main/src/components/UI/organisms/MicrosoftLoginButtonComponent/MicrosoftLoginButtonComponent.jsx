import MicrosoftLogin from 'react-microsoft-login';
import microsoft from '../../../../assets/images/microsoft.png';
import { MICROSOFT_API_KEY } from '../../../../environment';
import LoginButtonComponent from '../../molecules/LoginButtonComponent/LoginButtonComponent';

const clientId = MICROSOFT_API_KEY;
export default function MicrosoftLoginButtonComponent() {
  const responseMicrosoft = (err, data) => {
    console.log(err, data);
  };
  return (
    <>
      <MicrosoftLogin
        clientId={clientId}
        authCallback={responseMicrosoft}
        buttonTheme="light"
      >
        <LoginButtonComponent
          iconBoxW="30%"
          iconPl="21px"
          iconSrc={microsoft}
          onSubmit={() => {}}
          text="Entrar com a Microsoft"
        />
      </MicrosoftLogin>
    </>
  );
}
