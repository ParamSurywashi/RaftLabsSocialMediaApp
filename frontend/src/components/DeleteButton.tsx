import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Button, Icon, Confirm } from 'semantic-ui-react';

import MyPopup from '../util/MyPopup.tsx';

import { FETCH_POSTS_QUERY } from '../util/graphql.tsx';

interface DeleteButtonProps {
  buttonSize: 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive';
  postId: string;
  commentId?: string;
  callback?: () => void; 
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ buttonSize, postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        }) as { getPosts: { id: string }[] }; 
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter((p) => p.id !== postId),
          },
        });
      }
      if (callback) callback(); 
    },
    variables: {
      postId,
      commentId,
    },
  });

  const handleConfirm = (
    event: React.MouseEvent<HTMLAnchorElement>, 
    data: { [key: string]: any } 
  ) => {
    deletePostOrMutation();
  };

  return (
    <>
      <MyPopup content={`Delete ${commentId ? 'comment' : 'post'}`}>
        <Button
          size={buttonSize}
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}  
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
