import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Header, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth.tsx';
import PostCard from '../components/PostCard.tsx';
import { FETCH_POSTS_QUERY } from '../util/graphql.tsx';

interface PostUser {
  id: string;
  photoURL: string;
}

interface Post {
  id: string;
  body: string;
  createdAt: string;
  username: string;
  user: PostUser;
  likeCount: number;
  commentCount: number;
  likes: Array<{ username: string }>;
}

interface FetchPostsData {
  getPosts: Post[];
}

const Home: React.FC = () => {
  const { loading, data } = useQuery<FetchPostsData>(FETCH_POSTS_QUERY);
  const posts = data?.getPosts;

  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: '2rem' }}>
      <Header as="h1" textAlign="center" style={{ marginBottom: '2rem', color: 'white' }}>
        Recent Posts
      </Header>
      <Grid stackable doubling>
        {loading ? (
          <Grid.Row centered>
            <Header as="h3" style={{ color: 'white' }}>Loading posts...</Header>
          </Grid.Row>
        ) : (
          <Transition.Group as={Grid.Row} duration={400}>
            {posts?.map((post) => (
              <Grid.Column key={post.id} width={16} style={{ marginBottom: '1.5rem' }}>
                <PostCard post={post} />
              </Grid.Column>
            ))}
          </Transition.Group>
        )}
      </Grid>
    </div>
  );
};

export default Home;
