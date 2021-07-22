import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { ProductList } from './components/ProductList';

function App() {
    return (
        <ChakraProvider>
            <ProductList />
        </ChakraProvider>
    );
}

export default App;
