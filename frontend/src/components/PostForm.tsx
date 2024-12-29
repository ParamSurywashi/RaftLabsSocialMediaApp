import { gql, useMutation } from '@apollo/client';
import React, { FC } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useForm } from '../util/hooks.tsx';
import { FETCH_POSTS_QUERY } from '../util/graphql.tsx';

interface PostFormValues {
  body: string;
}

interface CreatePostResponse {
  createPost: {
    id: string;
    body: string;
    createdAt: string;
    username: string;
    likes: {
      id: string;
      username: string;
      createdAt: string;
    }[];
    likeCount: number;
    comments: {
      id: string;
      body: string;
      username: string;
      createdAt: string;
    }[];
    commentCount: number;
  };
}

interface GetPostsResponse {
  getPosts: CreatePostResponse['createPost'][];
}

const PostForm: FC = () => {
  const { values, onChange, onSubmit } = useForm(createPostCallback, { body: '' });

  const [createPost, { error }] = useMutation<CreatePostResponse, PostFormValues>(
    CREATE_POST_MUTATION,
    {
      variables: values,
      update(proxy, result) {
        const data = proxy.readQuery<GetPostsResponse>({
          query: FETCH_POSTS_QUERY,
        });

        if (data && result.data) {
          proxy.writeQuery({
            query: FETCH_POSTS_QUERY,
            data: {
              getPosts: [result.data.createPost, ...data.getPosts],
            },
          });
        }

        values.body = '';
      },
    }
  );

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit} id='PostForm'>
        <h5 className="page-title">Create a post:</h5>
        <Form.Field>
          <Form.Input
            placeholder="Write Something New !!!!!!!!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={!!error}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: '20px' }}>
          <ul className="list">
            <li>{error.graphQLErrors[0]?.message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default PostForm;

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
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
