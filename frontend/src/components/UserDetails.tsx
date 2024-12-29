import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, Form, Icon, Image, Label, Container } from 'semantic-ui-react';
import { useForm } from '../util/hooks.tsx';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../util/firestore';
import { useMutation } from '@apollo/client';
import moment from 'moment';
import { FETCH_POSTS_QUERY, UPDATE_USER_MUTATION } from '../util/graphql.tsx';
import { AuthContext } from '../context/auth.tsx';

interface User {
  id: string;
  username: string;
  email: string;
  photoURL: string;
  createdAt: string;
}

interface UserDetailsProps {
  user: User;
  auth?: boolean;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, auth = false }) => {
  const [newPhoto, setNewPhoto] = useState<string>(user?.photoURL);
  const [file, setFile] = useState<File | null>(null);
  const { login } = useContext(AuthContext);
  const { values, onChange, onSubmit } = useForm(updateProfileCallback, {
    photoURL: newPhoto,
  });

  useEffect(() => {
    if (user?.photoURL !== newPhoto) {
      updateUserMutation();
    }
  }, [newPhoto]);

  const [updateUserMutation, { loading }] = useMutation(UPDATE_USER_MUTATION, {
    variables: {
      userId: user?.id,
      photoURL: newPhoto,
    },
    refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    update(store, { data: { updateUser } }) {
      localStorage.removeItem('jwtToken');
      localStorage.setItem('jwtToken', updateUser.token);

      login(updateUser);
      setFile(null);

      values.photoURL = '';
    },
  });

  function updateProfileCallback() {
    uploadImage();
  }

  const uploadImage = async () => {
    if (!file) return;

    const imageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setNewPhoto(url);
      });
    });
  };

  return (
    <Container textAlign="center">
      <h1>User Profile</h1>
      <Card centered>
        <Image src={newPhoto} />
        {auth && (
          <Form loading={loading} onSubmit={onSubmit}>
            <Form.Field>
              <Button as="label" className="choose-file-btn" htmlFor="file" type="button">
                Choose file
              </Button>
              <input
                accept="image/*"
                type="file"
                id="file"
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              />
              <Button primary type="submit">
                Upload image
              </Button>
            </Form.Field>
            {file?.name && (
              <Form.Field className="form-field-file">
                <Label className="form-selected-file">
                  <Icon name="file" />
                  {file.name}
                  <Button basic size="small" inverted icon="delete" onClick={() => setFile(null)} />
                </Label>
              </Form.Field>
            )}
          </Form>
        )}
        <Card.Content>
          <Card.Header>{user?.username}</Card.Header>
          <Card.Meta>Joined {moment(user?.createdAt).fromNow()}</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name="user" />
            {user?.email}
          </a>
        </Card.Content>
      </Card>
    </Container>
  );
};

export default UserDetails;
