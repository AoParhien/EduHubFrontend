import React, { useEffect } from 'react';
import useUserStore from '../store/useUserStore';

function UserProfile() {
  // Access user state, loading state, and actions from the store
  const { user, accessToken, isLoading, error, fetchUser, clearUser, isBootstrapping } = useUserStore();

  const logout = async () => {
    try {
      const authUrl = process.env.REACT_APP_AUTH_SERVICE_URL;
      await fetch(`${authUrl}/api/auth/logout`, { 
        method: 'POST',
        credentials: 'include',
      });
      clearUser();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  useEffect(() => {
    fetchUser(); // Fetch user data when the component mounts
  }, [fetchUser, accessToken]);
  if (isLoading || isBootstrapping) return <p>Loading user data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Profile</h1>
      {user?.student ? (
        <div>
          <p><strong>Name:</strong> {user.student.firstName}</p>
          <p><strong>Mobile:</strong> {user.student.mobileNumber}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
}

export default UserProfile;
