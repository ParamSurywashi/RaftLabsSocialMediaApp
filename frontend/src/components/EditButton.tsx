import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Button, Icon, Form, TextArea, Confirm, Modal } from 'semantic-ui-react';

import MyPopup from '../util/MyPopup.tsx';
import { useForm } from '../util/hooks.tsx';

interface EditButtonProps {
  buttonSize: 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive';
  postId: string;
  postBody: string;
}

interface FormValues {
  body: string;
}

const EditButton: React.FC<EditButtonProps> = ({ buttonSize, postId, postBody }) => {
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { values, onChange, onSubmit } = useForm<FormValues>(updatePostCallback, { body: postBody });

  function updatePostCallback() {
    updatePostMutation();
  }

  const [updatePostMutation, { loading }] = useMutation(UPDATE_POST_MUTATION, {
    update() {
      setOpenModal(false);
    },
    variables: {
      postId,
      body: values.body,
    },
  });

  const handleConfirm = () => {
    updatePostMutation();
  };

  return (
    <>
      <MyPopup content="Edit post">
        <Button
          size={buttonSize}
          onClick={() => setOpenModal(true)}
          color="blue"
          floated="right"
        >
          <Icon name="edit" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
      <Modal
        dimmer="blurring"
        size="mini"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>Edit Post</Modal.Header>
        <Modal.Content>
          <Form onSubmit={onSubmit} loading={loading}>
            <Form.Field
              control={TextArea}
              name="body"
              value={values.body}
              onChange={onChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button secondary onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button color="blue" onClick={handleConfirm}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

const UPDATE_POST_MUTATION = gql`
  mutation updatePost($postId: ID!, $body: String!) {
    updatePost(postId: $postId, body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default EditButton;
