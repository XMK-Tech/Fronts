import { GoogleLogin } from 'react-google-login';
import { useGoogleLogin } from '../../../../services/LoginService';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';
import google from '../../../../assets/images/google.png';
import LoginButtonComponent from '../../molecules/LoginButtonComponent/LoginButtonComponent';
import { GOOGLE_API_KEY } from '../../../../environment';

const clientId = GOOGLE_API_KEY;
export default function GoogleLoginButton() {
  const { login } = useGoogleLogin();
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId,
        scope: 'email',
      });
    }

    gapi.load('client:auth2', start);
  }, []);
  return (
    <GoogleLogin
      clientId={clientId}
      responseType="code"
      buttonText="Entrar com o Google"
      render={({ onClick }) => (
        <LoginButtonComponent
          iconBoxW="20%"
          iconSrc={google}
          onSubmit={onClick}
          text="Entrar com o Google"
        />
      )}
      onSuccess={(res) => {
        console.log({ res });
        const { code } = res;
        if (!code) return;
        login({ code });
      }}
      onFailure={(err) => {
        console.error(err);
      }}
      cookiePolicy={'single_host_origin'}
    />
  );
}
