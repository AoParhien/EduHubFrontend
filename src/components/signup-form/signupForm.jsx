import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertIcon, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import useUserStore from '../../store/useUserStore';
import { BACKEND_URL } from '../../utils/backendUrl';
import { AuthField, AuthLayout } from '../auth-layout/AuthLayout';
import PageTitle from '../page-title/PageTitle';

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Accepts 3001234567, 03001234567 or +923001234567 and returns the 10-digit form.
const normalizeMobile = (value = '') => value.replace(/\D/g, '').replace(/^92/, '').replace(/^0+/, '');

const SignUpForm = () => {
    const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm({ mode: 'onTouched' });
    const { fetchUser, setAuth } = useUserStore();
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const returnTo = location.state?.from && location.state.from !== '/signup' ? location.state.from : '/';
    const returnState = location.state?.fromState;

    const onSubmit = async (data) => {
        setFormError('');
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/auth/register`,
                {
                    email: data.email.trim(),
                    password: data.password,
                    role: 'student',
                    firstName: data.firstName.trim(),
                    lastName: data.lastName.trim(),
                    mobileNumber: normalizeMobile(data.mobileNumber),
                },
                { withCredentials: true }
            );

            // Registration also signs the new student in.
            if (response.data?.token) {
                setAuth({ token: response.data.token, user: response.data.user || null });
                await fetchUser(response.data.token);
            }

            toast({ title: `Welcome to AoParhein, ${data.firstName.trim()}`, status: 'success', duration: 4000 });
            navigate(response.data?.token ? returnTo : '/login', { replace: true, state: response.data?.token ? returnState : location.state });
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message || '';

            if (!error.response) {
                setFormError('We couldn’t reach AoParhein. Check your internet connection and try again.');
            } else if (/already exists/i.test(message)) {
                setError('email', { type: 'server', message: 'An account with this email already exists. Log in instead.' });
            } else if (/mobile number/i.test(message)) {
                setError('mobileNumber', { type: 'server', message: 'This mobile number is already registered.' });
            } else if (status === 429) {
                setFormError(message || 'Too many attempts. Wait a few minutes and try again.');
            } else if (status === 400 && message) {
                setFormError(message);
            } else {
                setFormError('Your account couldn’t be created because of a problem on our side. Try again in a moment.');
            }
        }
    };

    return (
        <AuthLayout title="Create your account" subtitle="Free for students. You’ll need it to reserve a seat.">
            <PageTitle title="Create an account" />
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="auth__fields">
                    {formError && (
                        <Alert status="error" borderRadius="md">
                            <AlertIcon />
                            <AlertDescription>{formError}</AlertDescription>
                        </Alert>
                    )}
                    <div className="auth__row">
                        <AuthField
                            label="First name"
                            name="firstName"
                            autoComplete="given-name"
                            register={register}
                            errors={errors}
                            rules={{ required: 'Enter your first name', minLength: { value: 2, message: 'Use at least 2 letters' } }}
                        />
                        <AuthField
                            label="Last name"
                            name="lastName"
                            autoComplete="family-name"
                            register={register}
                            errors={errors}
                            rules={{ required: 'Enter your last name', minLength: { value: 2, message: 'Use at least 2 letters' } }}
                        />
                    </div>
                    <AuthField
                        label="Email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        register={register}
                        errors={errors}
                        rules={{
                            required: 'Enter your email address',
                            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Enter a valid email, like name@example.com' },
                        }}
                    />
                    <AuthField
                        label="Mobile number"
                        name="mobileNumber"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="300 1234567"
                        addon="+92"
                        register={register}
                        errors={errors}
                        rules={{
                            required: 'Enter your mobile number',
                            validate: (value) => /^3\d{9}$/.test(normalizeMobile(value)) || 'Enter a Pakistani mobile number, like 300 1234567',
                        }}
                    />
                    <AuthField
                        label="Password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        helper="At least 8 characters, with an uppercase letter, a lowercase letter, a number and a symbol (@$!%*?&)."
                        register={register}
                        errors={errors}
                        rules={{
                            required: 'Create a password',
                            pattern: {
                                value: PASSWORD_RULE,
                                message: 'Use at least 8 characters, with an uppercase letter, a lowercase letter, a number and a symbol (@$!%*?&).',
                            },
                        }}
                    />
                    <AuthField
                        label="Confirm password"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        register={register}
                        errors={errors}
                        rules={{
                            required: 'Enter your password again',
                            validate: (value) => value === watch('password') || 'The passwords don’t match',
                        }}
                    />
                    <Button type="submit" size="lg" width="full" isLoading={isSubmitting} loadingText="Creating your account">
                        Create account
                    </Button>
                </div>
            </form>
            <p className="auth__switch">
                Already have an account?{' '}
                <RouterLink to="/login" state={location.state}>Log in</RouterLink>
            </p>
        </AuthLayout>
    );
};

export default SignUpForm;
