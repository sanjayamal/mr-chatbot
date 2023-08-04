import { CRow, CCol, CButton } from "../common";
import { CFaFacebook, CFcGoogle } from "../../components/common/icons";
import { Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { SocialLoginProvider } from "../../constants";

const SocialLogin = () => {
  const getProvider = (provider: SocialLoginProvider) => {
    if (provider === SocialLoginProvider.FACEBOOK) {
      return CognitoHostedUIIdentityProvider.Facebook;
    }
    return CognitoHostedUIIdentityProvider.Google;
  };

  const handleLogin = (provider: SocialLoginProvider) => {
    Auth.federatedSignIn({ provider: getProvider(provider) });
  };
  return (
    <CRow>
      <CCol span={24}>
        <CButton
          style={{ width: "100%", backgroundColor: "#f5f7f7" }}
          icon={<CFcGoogle />}
          onClick={() => handleLogin(SocialLoginProvider.GOOGLE)}
        >
          Sign in with Google
        </CButton>
      </CCol>
      <CCol span={24}>
        <CButton
          style={{ width: "100%", backgroundColor: "#f5f7f7" }}
          className="margin-top-1rem "
          icon={<CFaFacebook />}
          onClick={() => handleLogin(SocialLoginProvider.FACEBOOK)}
        >
          Sign in with Facebook
        </CButton>
      </CCol>
    </CRow>
  );
};

export default SocialLogin;
