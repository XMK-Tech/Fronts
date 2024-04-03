import apple from '../../../../assets/images/apple.png';
import AppleLogin from 'react-apple-login';
import LoginButtonComponent from '../../molecules/LoginButtonComponent/LoginButtonComponent';
import { APPLE_API_KEY } from '../../../../environment';

const clientId = APPLE_API_KEY;
// @ts-ignore
export default function AppleLoginButton() {
  return (
    <>
      {/* @ts-ignore */}
      <AppleLogin
        clientId={clientId}
        autoLoad={false}
        responseType="code"
        // colocar nome do site
        redirectURI="/login"
        usePopup={true}
        render={({ onClick }) => (
          <LoginButtonComponent
            iconBoxW="22%"
            iconPl="5px"
            iconSrc={apple}
            onSubmit={onClick}
            text="Entrar com o Appleid"
          />
        )}
      />
    </>
  );
}
