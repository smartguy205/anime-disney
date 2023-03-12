import CircleLoader from "components/atoms/CircleLoader";
import { useAppSelector } from "redux/hooks";
import AuthService from "services/auth.service";
import RegisterForm from "./RegisterForm";

export default function Register() {
  const { user } = useAppSelector((state) => state.auth);
  const loading = useAppSelector((state) => state.auth.loading);
  const handleSubmit = async (values: any) => {

    values.dob = values?.dob?.date;
    if (user) {
      AuthService.updateUser(values);
    } else {
      AuthService.signup(values);
    }
  };

  return (
    <div>
      {loading && <CircleLoader />}
      <RegisterForm onSubmit={handleSubmit} />
    </div>
  );
}
