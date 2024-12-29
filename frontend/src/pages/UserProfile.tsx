import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { AuthContext } from '../context/auth.tsx';
import UserDetails from '../components/UserDetails.tsx';

import { GET_USER_QUERY } from '../util/graphql.tsx';

interface User {
  id: string;
  username: string;
  email?: string;
  [key: string]: any;
}

interface GetUserQueryData {
  getUser: User;
}

interface GetUserQueryVars {
  userId: string;
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useContext(AuthContext);

  // Always call the useQuery hook at the top level
  const { loading, data } = useQuery<GetUserQueryData, GetUserQueryVars>(GET_USER_QUERY, {
    variables: {
      userId: userId || '', // Default to an empty string to avoid undefined
    },
  });

  // If the logged-in user is the same as the user profile being viewed
  if (user && user.id === userId) {
    return <UserDetails user={user} auth={user} />;
  }

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (data?.getUser) {
    return <UserDetails user={data.getUser} />;
  }

  return <p>User not found.</p>;
};

export default UserProfile;
