import { loginAction } from "@/app/(actions)/form-actions";
import AuthForm from "../AuthForm";

const Login = () => {
  return (
    <div>
      <AuthForm isSignup={false} action={loginAction} />
    </div>
  );
};
export default Login;
