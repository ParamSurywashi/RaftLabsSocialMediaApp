import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

import { AuthContext } from '../context/auth.tsx';
import { useForm } from '../util/hooks.tsx';

import { Button, Form } from 'semantic-ui-react';

interface RegisterErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface RegisterValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  const context = useContext(AuthContext);
  let navigate = useNavigate();
  const [errors, setErrors] = useState<RegisterErrors>({});

  const { onChange, onSubmit, values } = useForm<RegisterValues>(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      navigate('/');
    },
    variables: values,
  });

  function registerUser() {
    addUser();
  }

  return (
    <div className='form-container'>
      <h1>Register</h1>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <Form.Input
          label="Username"
          type="text"
          placeholder="Username.."
          name="username"
          error={!!errors.username}
          value={values.username}
          onChange={onChange}
        />
        <Form.Input
          label="Email"
          type="email"
          placeholder="Email.."
          name="email"
          error={!!errors.email}
          value={values.email}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          type="password"
          placeholder="Password.."
          name="password"
          error={!!errors.password}
          value={values.password}
          onChange={onChange}
        />
        <Form.Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password.."
          name="confirmPassword"
          error={!!errors.confirmPassword}
          value={values.confirmPassword}
          onChange={onChange}
        />
        <Button type='submit' primary>Register</Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value, idx) => (
              <li key={idx}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
