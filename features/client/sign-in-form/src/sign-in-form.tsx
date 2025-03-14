import {
  passwordValidator,
  usernameValidator,
} from "@robust-monorepo-yarn-nx-changesets/validator";

interface SignInFormProps {
  onSubmit: (username: string, password: string) => void;
}

const SignInForm = ({ onSubmit }: SignInFormProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = (event.currentTarget[0] as HTMLInputElement).value;
    const usernameValidationResult = usernameValidator(username);
    if (typeof usernameValidationResult === "string") {
      alert(usernameValidationResult);
      return;
    }

    const password = (event.currentTarget[1] as HTMLInputElement).value;
    const passwordValidationResult = passwordValidator(password);
    if (typeof passwordValidationResult === "string") {
      alert(passwordValidationResult);
      return;
    }

    onSubmit(username!, password!);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SignInForm;
