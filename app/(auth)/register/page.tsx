import { signupAction } from "@/app/(actions)/form-actions";
import AuthForm from "../AuthForm";

const Signup = () => {
  return (
    <div>
      <AuthForm isSignup action={signupAction} />
    </div>
  );
};

export default Signup;
