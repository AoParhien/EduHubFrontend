import React, { useState } from 'react';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel, IconButton, Input, InputGroup, InputLeftAddon, InputRightElement } from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './AuthLayout.css';

export const AuthLayout = ({ title, subtitle, children }) => (
    <div className="auth">
        <aside className="auth__panel" aria-hidden="true">
            <div className="auth__panel-inner">
                <p className="auth__panel-title">Classes, timetables and fees from institutes across Pakistan, in one place.</p>
                <ul>
                    <li>Compare batches and class times before you join</li>
                    <li>Reserve your seat online, no queues</li>
                    <li>Pay the institute on your first day</li>
                </ul>
            </div>
        </aside>
        <section className="auth__form">
            <div className="auth__form-inner">
                <h1>{title}</h1>
                {subtitle && <p className="auth__subtitle">{subtitle}</p>}
                {children}
            </div>
        </section>
    </div>
);

export const AuthField = ({ label, name, register, rules, errors, helper, addon, type = 'text', ...rest }) => {
    const [isVisible, setIsVisible] = useState(false);
    const isPassword = type === 'password';
    const error = errors[name];

    return (
        <FormControl isInvalid={Boolean(error)}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <InputGroup size="lg">
                {addon && <InputLeftAddon fontSize="md">{addon}</InputLeftAddon>}
                <Input
                    id={name}
                    type={isPassword && isVisible ? 'text' : type}
                    fontSize="md"
                    {...register(name, rules)}
                    {...rest}
                />
                {isPassword && (
                    <InputRightElement>
                        <IconButton
                            variant="ghost"
                            size="sm"
                            borderRadius="md"
                            aria-label={isVisible ? 'Hide password' : 'Show password'}
                            icon={isVisible ? <FiEyeOff /> : <FiEye />}
                            onClick={() => setIsVisible((value) => !value)}
                        />
                    </InputRightElement>
                )}
            </InputGroup>
            {error ? (
                <FormErrorMessage>{error.message}</FormErrorMessage>
            ) : (
                helper && <FormHelperText color="muted">{helper}</FormHelperText>
            )}
        </FormControl>
    );
};
