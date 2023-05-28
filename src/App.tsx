import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import SceneEditor from './SceneEditor';

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <SceneEditor />
      </div>
    </ApolloProvider>
  );
};

export default App;