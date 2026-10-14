import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Button, Spinner } from '@chakra-ui/react';
import useUserStore from '../../store/useUserStore';
import './account.css';

/*
 * Renders children only for a signed-in user. While the session is being
 * restored it shows a spinner; signed-out visitors get a prompt to log in
 * that brings them back here afterwards.
 */
const AccountGate = ({ title, message, children }) => {
    const location = useLocation();
    const sessionChecked = useUserStore((state) => state.sessionChecked);
    const isLoading = useUserStore((state) => state.isLoading);
    const user = useUserStore((state) => state.user);
    const authUser = useUserStore((state) => state.authUser);

    if (!sessionChecked || (isLoading && !user)) {
        return (
            <div className="page account account--center" aria-busy="true">
                <Spinner color="brand.500" label="Loading your account" />
            </div>
        );
    }

    if (!user && !authUser) {
        return (
            <div className="page account">
                <div className="account__prompt">
                    <h1>{title}</h1>
                    <p>{message}</p>
                    <div className="account__actions">
                        <Button as={RouterLink} to="/login" state={{ from: location.pathname }} size="lg">Log in</Button>
                        <Button as={RouterLink} to="/signup" state={{ from: location.pathname }} size="lg" variant="outline">Create an account</Button>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default AccountGate;
