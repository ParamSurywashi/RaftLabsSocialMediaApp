import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, Image } from 'semantic-ui-react';
import moment from 'moment';
import { AuthContext } from '../context/auth.tsx';
import CardsButtons from './CardsButtons.tsx';
import { ThemeContext } from '../context/theme.tsx';

interface Post {
  body: string;
  createdAt: string;
  id: string;
  username: string;
  user: {
    id: string;
    photoURL: string;
  };
  likeCount: number;
  commentCount: number;
  likes: Array<{ username: string }>;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({
  post: { body, createdAt, id, username, user: postUser, likeCount, commentCount, likes },
}) => {
  const authContext = useContext(AuthContext); // AuthContext might return null
  const { isDarkTheme, buttonSize } = useContext(ThemeContext);

  return (
    <Card fluid className={isDarkTheme ? 'dark' : undefined}>
      <Card.Content>
        <Image
          as={Link}
          to={`/user/${postUser?.id}`}
          rounded
          floated="right"
          size="mini"
          src={postUser.photoURL}
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        {authContext?.user ? (
          <CardsButtons
            user={authContext.user}
            buttonSize={buttonSize}
            post={{ id, likes, likeCount, commentCount, body }}
          />
        ) : (
          <p>Please log in to interact with this post.</p>
        )}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
