import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

const graphqlUri =
  import.meta.env.VITE_GRAPHQL_URI ?? 'http://localhost:3000/graphql';

const httpLink = new HttpLink({ uri: graphqlUri });

const authLink = new ApolloLink((operation, forward) => {
  const token = import.meta.env.VITE_AUTH_TOKEN ?? localStorage.getItem('auth_token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {},
      },
    },
  }),
});
