import React, { useContext, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import { Button, Card, Form, Icon, Image, Grid } from 'semantic-ui-react';

import { gql, useMutation, useQuery } from '@apollo/client';
import { AuthContext } from '../context/auth.tsx';
import { ThemeContext } from '../context/theme.tsx';

import DeleteButton from '../components/DeleteButton.tsx';
import CardsButtons from '../components/CardsButtons.tsx';

interface Post {
  id: string;
  body: string;
  createdAt: string;
  username: string;
  user: {
    photoURL: string;
  };
  likes: { username: string }[];
  likeCount: number;
  comments: {
    id: string;
    username: string;
    createdAt: string;
    body: string;
  }[];
  commentCount: number;
}

interface FetchPostData {
  getPost: Post;
}

interface FetchPostVars {
  postId: string;
}

interface SinglePostProps {
  edit?: boolean;
}

const SinglePost: React.FC<SinglePostProps> = ({ edit = false }) => {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useContext(AuthContext);
  const { buttonSize } = useContext(ThemeContext);

  const commentInputRef = useRef<HTMLInputElement>(null);
  const [comment, setComment] = useState<string>('');
  const [updatedBody, setUpdatedBody] = useState<string>('');

  const { data: { getPost } = {} } = useQuery<FetchPostData, FetchPostVars>(FETCH_POST_QUERY, {
    variables: {
      postId: postId || '',
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      if (commentInputRef.current) {
        commentInputRef.current.blur();
      }
    },
    variables: {
      postId: postId || '',
      body: comment,
    },
  });

  const [updatePost] = useMutation(UPDATE_POST_MUTATION, {
    update() {
      navigate(`/posts/${postId}`);
    },
    variables: {
      postId: postId || '',
      body: updatedBody,
    },
  });

  const navigate = useNavigate();

  const deletePostCallback = () => {
    navigate('/');
  };

  let postMarkup;

  if (!getPost) {
    postMarkup = <h1 className="page-title">Loading post...</h1>;
  } else {
    const {
      id,
      body,
      user: { photoURL },
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    if (edit) {
      postMarkup = (
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <Card fluid>
                <Card.Content>
                  <Form>
                    <Form.TextArea
                      placeholder="Edit your post"
                      value={updatedBody || body}
                      onChange={(e) => setUpdatedBody(e.target.value)}
                    />
                    <Button
                      type="submit"
                      color="teal"
                      onClick={() => updatePost()}
                      disabled={updatedBody.trim() === ''}
                    >
                      Update Post
                    </Button>
                  </Form>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    } else {
      postMarkup = (
        <Grid columns={2} doubling stackable>
          <Grid.Row>
            <Grid.Column width={10}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>
                    <Image avatar circular src={photoURL} />
                    {username}
                  </Card.Header>
                  <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{body}</Card.Description>
                </Card.Content>
                <hr />
                <Card.Content extra>
                  <CardsButtons
                    user={{ user, username }}
                    buttonSize={buttonSize}
                    post={{ id, likes, likeCount, commentCount, body }}
                  />
                </Card.Content>
              </Card>
              {user && (
                <Card fluid>
                  <Card.Content>
                    <p>Post a comment</p>
                    <Form>
                      <div className="ui action input fluid">
                        <input
                          ref={commentInputRef}
                          type="text"
                          placeholder="Comment.."
                          name="comment"
                          value={comment}
                          onChange={(event) => setComment(event.target.value)}
                        />
                        <button
                          type="submit"
                          className="ui teal button"
                          disabled={comment.trim() === ''}
                          onClick={() => submitComment()}
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              )}
              {comments.map((comment) => (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    {user && user.username === comment.username && (
                      <DeleteButton postId={id} buttonSize={buttonSize} commentId={comment.id} />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card>
              ))}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
  }

  return postMarkup;
};

export const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      user {
        photoURL
      }
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const UPDATE_POST_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    updatePost(postId: $postId, body: $body) {
      id
      body
      createdAt
    }
  }
`;

export default SinglePost;
