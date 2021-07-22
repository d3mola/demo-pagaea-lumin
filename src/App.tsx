import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductList } from './components/ProductList';
import { SocialFeed } from './components/SocialFeed';

function App() {
    return (
        <ChakraProvider>
            <Header />
            <ProductList />
            <SocialFeed />
            <Footer />
        </ChakraProvider>
    );
}

export default App;
