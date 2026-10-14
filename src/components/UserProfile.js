import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import AccountGate from './account/AccountGate';
import PageTitle from './page-title/PageTitle';
import useUserStore from '../store/useUserStore';

const ProfileDetails = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const authUser = useUserStore((state) => state.authUser);
  const logout = useUserStore((state) => state.logout);
  const student = user?.student;

  const rows = [
    student && { label: 'Name', value: `${student.firstName} ${student.lastName || ''}`.trim() },
    authUser?.email && { label: 'Email', value: authUser.email },
    student?.mobileNumber && { label: 'Mobile', value: `+92 ${student.mobileNumber}` },
    authUser?.role && { label: 'Account type', value: authUser.role.charAt(0).toUpperCase() + authUser.role.slice(1) },
  ].filter(Boolean);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="page account">
      <PageTitle title="Profile" />
      <header className="account__header">
        <h1>Profile</h1>
        <p>The details institutes see when you reserve a seat.</p>
      </header>
      <div className="profile-card">
        <dl>
          {rows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="account__actions">
        {student && <Button as={RouterLink} to="/student">My courses</Button>}
        <Button variant="outline" onClick={handleLogout}>Log out</Button>
      </div>
    </div>
  );
};

const UserProfile = () => (
  <AccountGate title="Profile" message="Log in to see your account details.">
    <ProfileDetails />
  </AccountGate>
);

export default UserProfile;
