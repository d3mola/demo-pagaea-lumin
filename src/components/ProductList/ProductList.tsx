import { gql, QueryResult, useQuery } from '@apollo/client';
import { Box, SimpleGrid } from '@chakra-ui/layout';
import { useDisclosure } from '@chakra-ui/react';
import React, { ReactElement, useEffect, useReducer, useState } from 'react';
import { ProductCollectionInfo } from '../ProductCollectionInfo';
import { ProductItem } from '../ProductItem';
import { CartDrawer } from '../CartDrawer';

export const PRODUCT_LIST = gql`
    query GetProducts($currency: Currency!) {
        products {
            id
            title
            image_url
            price(currency: $currency)
            product_options {
                title
                prefix
                suffix
                options {
                    id
                    value
                }
            }
        }
    }
`;

export type Product = {
    id: string;
    imageUrl: string;
    price: number;
    title: string;
    productOptions: ProductOption[];
};

export type ProductOption = {
    title: string;
    prefix: string;
    suffix: string;
    options: { id: string; value: string };
};

type UseProducts = {
    loading: boolean;
    error: string | undefined;
    products: Product[] | undefined;
};

/**
 * Fetches a list of products
 * @param filter : conditon to filter products by;
 */
function useProducts(filter: { currency: string }): UseProducts {
    const { loading, error, data }: QueryResult = useQuery(PRODUCT_LIST, {
        variables: { currency: filter.currency },
    });

    function transformProducts(products: any) {
        if (!products || products.length < 1) {
            return [];
        }

        return products.map((product) => {
            const {
                id,
                title,
                image_url: imageUrl,
                price,
                product_options: productOptions,
            } = product;

            return {
                id,
                title,
                imageUrl,
                price,
                productOptions,
            };
        });
    }

    const transformedProducts = transformProducts(data?.products);

    return {
        loading,
        error: error?.message,
        products: transformedProducts,
    };
}

export type CartState = {
    products: (Product & { quantity: number })[];
};

export type CartAction = {
    type: string;
    payload: any;
};

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'addToCart':
            const existingProductIndex = state.products.findIndex(
                (product: Product & { quantity: number }) => product.id === action.payload.id
            );
            if (existingProductIndex === -1) {
                const newProduct = action.payload;
                newProduct.quantity = 1;
                return { products: [...state.products, newProduct] };
            }

            let existingProduct = { ...state.products[existingProductIndex] };
            existingProduct.quantity += 1;

            return {
                products: [
                    ...state.products.slice(0, existingProductIndex),
                    existingProduct,
                    ...state.products.slice(existingProductIndex + 1),
                ],
            };
        case 'removeFromCart':
            const filteredProducts = state.products.filter(
                (product: Product & { quantity: number }) => product.id !== action.payload
            );
            return { products: filteredProducts };
        case 'incrementQuantity':
            const productToIncrementIndex = state.products.findIndex(
                (product: Product & { quantity: number }) => product.id === action.payload
            );
            const incrementedProduct = { ...state.products[productToIncrementIndex] };
            incrementedProduct.quantity += 1;

            return {
                products: [
                    ...state.products.slice(0, productToIncrementIndex),
                    incrementedProduct,
                    ...state.products.slice(productToIncrementIndex + 1),
                ],
            };
        case 'decrementQuantity':
            const productToDecrementIndex = state.products.findIndex(
                (product: Product & { quantity: number }) => product.id === action.payload
            );

            const decrementedProduct = { ...state.products[productToDecrementIndex] };
            decrementedProduct.quantity -= 1;

            return {
                products: [
                    ...state.products.slice(0, productToDecrementIndex),
                    decrementedProduct,
                    ...state.products.slice(productToDecrementIndex + 1),
                ],
            };
        default:
            throw new Error();
    }
}

function getInitialCartState() {
    const localStorageCart = localStorage.getItem('pangae-lumia-user-cart');
    if (localStorageCart) {
        return JSON.parse(localStorageCart);
    }

    return {
        products: [],
    };
}

export function ProductList(): ReactElement {
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const { loading, error, products }: UseProducts = useProducts({ currency: selectedCurrency });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [cartState, dispatchCartAction] = useReducer(cartReducer, getInitialCartState());

    useEffect(() => {
        localStorage.setItem('pangae-lumia-user-cart', JSON.stringify(cartState));
    }, [cartState]);

    if (loading) {
        return <Box>loading...</Box>;
    }

    if (error) {
        return <Box>{error}</Box>;
    }

    if (!products || products.length < 1) {
        return <Box>No products at this time</Box>;
    }

    return (
        <Box>
            <ProductCollectionInfo />
            <SimpleGrid
                columns={[2, 2, 3]}
                spacing={[4, 4, 24]}
                bg="rgb(226, 230, 227)"
                paddingY={[6, 6, 12]}
                paddingX={[0, 0, '70px']}
            >
                {products.map((product) => {
                    return (
                        <ProductItem
                            key={product.id}
                            id={product.id}
                            imageUrl={product.imageUrl}
                            price={product.price}
                            title={product.title}
                            productOptions={product.productOptions}
                            onOpen={onOpen}
                            setCurrentProduct={setCurrentProduct}
                            dispatchCartAction={dispatchCartAction}
                        />
                    );
                })}
            </SimpleGrid>
            <CartDrawer
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                currentProduct={currentProduct}
                cartState={cartState}
                dispatchCartAction={dispatchCartAction}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
            />
        </Box>
    );
}
