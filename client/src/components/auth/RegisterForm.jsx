import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { nameRules, emailRules, passwordRules } from '../../utils/validators';

export default function RegisterForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Input
        label="Name"
        type="text"
        placeholder="Your name"
        error={errors.name?.message}
        autoComplete="name"
        {...register('name', nameRules)}
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        autoComplete="email"
        {...register('email', emailRules)}
      />
      <Input
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        error={errors.password?.message}
        autoComplete="new-password"
        {...register('password', passwordRules)}
      />
      <Button type="submit" isLoading={isLoading} className="w-full mt-2">
        Create account
      </Button>
    </form>
  );
}
