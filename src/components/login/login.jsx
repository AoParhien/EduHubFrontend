import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertIcon, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import useUserStore from '../../store/useUserStore';
import { BACKEND_URL } from '../../utils/backendUrl';
import { AuthField, AuthLayout } from '../auth-layout/AuthLayout';
import PageTitle from '../page-title/PageTitle';

const describeLoginError = (error) => {
    const status = error.response?.status;
    if (!error.response) return 'We couldn’t reach AoParhein. Check your internet connection and try again.';
    if (status === 400 || status === 401) return 'That email and password don’t match. Check them and try again.';
    if (status === 429) return error.response.data?.message || 'Too many attempts. Wait a few minutes and try again.';
    return 'Logging in failed because of a problem on our side. Try again in a moment.';
};

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: 'onTouched' });
    const { fetchUser, setAuth } = useUserStore();
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    // Pages such as checkout send people here and expect them back afterwards.
    const returnTo = location.state?.from && location.state.from !== '/login' ? location.state.from : '/';
    const returnState = location.state?.fromState;

    const onSubmit = async ({ email, password }) => {
        setFormError('');
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/auth/login`,
                { email: email.trim(), password },
                { withCredentials: true }
            );

            if (!response.data?.token) {
                setFormError('Logging in failed because of a problem on our side. Try again in a moment.');
                return;
            }

            setAuth({ token: response.data.token, user: response.data.user || null });
            const profile = await fetchUser(response.data.token);
            const name = profile?.student?.firstName;
            toast({ title: name ? `Welcome back, ${name}` : 'You’re logged in', status: 'success', duration: 3000 });
            navigate(returnTo, { replace: true, state: returnState });
        } catch (error) {
            setFormError(describeLoginError(error));
        }
    };

    return (
        <AuthLayout title="Log in" subtitle="Welcome back. Log in to reserve seats and see your classes.">
            <PageTitle title="Log in" />
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="auth__fields">
                    {formError && (
                        <Alert status="error" borderRadius="md">
                            <AlertIcon />
                            <AlertDescription>{formError}</AlertDescription>
                        </Alert>
                    )}
                    <AuthField
                        label="Email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        register={register}
                        errors={errors}
                        rules={{ required: 'Enter your email address' }}
                    />
                    <AuthField
                        label="Password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        register={register}
                        errors={errors}
                        rules={{ required: 'Enter your password' }}
                    />
                    <Button type="submit" size="lg" width="full" isLoading={isSubmitting} loadingText="Logging in">
                        Log in
                    </Button>
                </div>
            </form>
            <p className="auth__switch">
                New to AoParhein?{' '}
                <RouterLink to="/signup" state={location.state}>Create an account</RouterLink>
            </p>
        </AuthLayout>
    );
};

export default LoginForm;
