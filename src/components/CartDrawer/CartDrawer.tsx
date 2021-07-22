import { gql, QueryResult, useQuery } from '@apollo/client';
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    Text,
    Select,
    Box,
    HStack,
    List,
    ListItem,
} from '@chakra-ui/react';
import React, { ChangeEvent, Dispatch, ReactElement, ReactNode, useEffect, useState } from 'react';
import { CartAction, CartState, Product } from '../ProductList/ProductList';
import { CartItem } from './CartItem';

type CartDrawerProps = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    currentProduct: Product | null;
    cartState: CartState;
    dispatchCartAction: Dispatch<CartAction>;
    selectedCurrency: string;
    setSelectedCurrency: (selectedCurrency: string) => void;
};

export const GET_CURRENCIES = gql`
    query GetCurrencies {
        currency
    }
`;

function useCurrencies() {
    const { loading, error, data }: QueryResult = useQuery(GET_CURRENCIES);

    return {
        loading,
        error: error?.message,
        currencies: data?.currency,
    };
}

export function CartDrawer({
    isOpen,
    onOpen,
    onClose,
    currentProduct,
    cartState,
    dispatchCartAction,
    selectedCurrency,
    setSelectedCurrency,
}: CartDrawerProps) {
    const [isPersonlizationPage, setIsPersonlizationPage] = useState(false);
    const { loading, error, currencies } = useCurrencies();

    useEffect(() => {
        if (
            currentProduct &&
            currentProduct.productOptions &&
            currentProduct.productOptions.length > 1
        ) {
            setIsPersonlizationPage(true);
        }
    }, [currentProduct]);

    function getSubtotal(): number {
        let total = 0;
        cartState.products.forEach(({ price, quantity }) => {
            total += price * quantity;
        });
        return total;
    }

    function onCurrencySelect(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCurrency(event.target.value);
    }

    if (loading) {
        return <Box>loading...</Box>;
    }

    if (error) {
        return <Box>{error}</Box>;
    }

    function renderDetails(): ReactElement {
        return (
            <CartDrawer.Details>
                <DrawerCloseButton />
                <DrawerHeader>YOUR CART</DrawerHeader>

                <DrawerBody>
                    {!cartState || cartState.products.length < 1 ? (
                        <Text>There are no items in your cart.</Text>
                    ) : (
                        <Box>
                            <Select value={selectedCurrency} onChange={onCurrencySelect}>
                                {currencies.map((currency: string) => (
                                    <option key={currency} value={currency}>
                                        {currency}
                                    </option>
                                ))}
                            </Select>
                            <List>
                                {cartState.products.map((product) => (
                                    <ListItem key={product.id} p={2} pos="relative">
                                        <CartItem
                                            product={product}
                                            dispatchCartAction={dispatchCartAction}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </DrawerBody>

                <DrawerFooter>
                    <HStack justify="space-between">
                        <Text>Subtotal</Text>
                        <Text>{getSubtotal()}</Text>
                    </HStack>
                </DrawerFooter>
            </CartDrawer.Details>
        );
    }

    function renderPersonalization() {
        return (
            <CartDrawer.Personalization>
                <DrawerCloseButton />
                <DrawerBody>
                    <Text as="h4">First let's personalize.</Text>
                    <Text>
                        Products that you receive may vary according to your age bracket & skin type
                        to optimize results.
                    </Text>
                    <Text as="h5">Personalization Details</Text>
                    {currentProduct?.productOptions?.map((productOption) => (
                        <Box key={productOption.title}>
                            <Text>{productOption.title}</Text>
                            <Select>
                                {productOption.options.map(({ id, value }) => (
                                    <option key={id} value={id}>
                                        {value}
                                    </option>
                                ))}
                            </Select>
                        </Box>
                    ))}
                </DrawerBody>

                <DrawerFooter>
                    <Button
                        onClick={() => {
                            dispatchCartAction({
                                type: 'addToCart',
                                payload: currentProduct,
                            });
                            setIsPersonlizationPage(false);
                        }}
                    >
                        Add to Cart
                    </Button>
                </DrawerFooter>
            </CartDrawer.Personalization>
        );
    }

    return (
        <Box>
            <Drawer isOpen={isOpen} placement="right" size="md" onClose={onClose} isFullHeight>
                <DrawerOverlay />
                <DrawerContent bg="#f2f2ef">
                    {isPersonlizationPage ? renderPersonalization() : renderDetails()}
                </DrawerContent>
            </Drawer>
        </Box>
    );
}

CartDrawer.Personalization = CartPersonalization;
CartDrawer.Details = CartDetails;

export function CartPersonalization({ children }: { children: ReactNode }): ReactElement {
    return <>{children}</>;
}

export function CartDetails({ children }: { children: ReactNode }): ReactElement {
    return <>{children}</>;
}
