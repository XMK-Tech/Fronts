import { ReactFacebookLoginInfo } from 'react-facebook-login';
import FacebookLoginRender, {
  RenderProps,
} from 'react-facebook-login/dist/facebook-login-render-props';
import facebook from '../../../../assets/images/facebook.png';
import { FACEBOOK_API_KEY } from '../../../../environment';
import LoginButtonComponent from '../../molecules/LoginButtonComponent/LoginButtonComponent';

// chave do lucas trocar para uma da locomotiva
const clientId = FACEBOOK_API_KEY;
export default function FacebookLoginButton() {
  const responseFacebook = (response: ReactFacebookLoginInfo) => {
    console.log(response);
  };
  return (
    <FacebookLoginRender
      appId={clientId}
      autoLoad={false}
      callback={responseFacebook}
      render={(renderProps: RenderProps) => (
        <LoginButtonComponent
          iconBoxW="30%"
          iconPl="21px"
          iconSrc={facebook}
          onSubmit={renderProps.onClick}
          text="Entrar com o Facebook"
        />
      )}
    />
  );
}
