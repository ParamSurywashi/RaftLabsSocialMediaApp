import React from 'react';
import LikeButton from './LikeButton.tsx';
import DeleteButton from './DeleteButton.tsx';
import EditButton from './EditButton.tsx';
import CommentButton from './CommentButton.tsx';

interface Like {
  username: string;
}

interface Post {
  id: string;
  likeCount: number;
  commentCount: number;
  body: string;
  likes: Like[];
}

interface User {
  user: string;
  username: string;
  isAdmin?: boolean;
}

interface CardsButtonsProps {
  user: User;
  buttonSize: 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive';
  post: Post;
}

const CardsButtons: React.FC<CardsButtonsProps> = ({ user, buttonSize, post }) => {
  const { id, likes, likeCount, commentCount, body } = post;
  const { username } = user;

  return (
    <>
      <LikeButton buttonSize={buttonSize} user={user} post={{ id, likes, likeCount }} />
      <CommentButton buttonSize={buttonSize} post={{ id, commentCount }} />
      {(user?.isAdmin || user?.username === username) && (
        <>
          <DeleteButton buttonSize={buttonSize} postId={id} />
          <EditButton buttonSize={buttonSize} postId={id} postBody={body} />
        </>
      )}
    </>
  );
};

export default CardsButtons;
