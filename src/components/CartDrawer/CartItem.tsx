import { Box, Button, HStack, Text, Image, Flex } from '@chakra-ui/react';
import React, { Dispatch, ReactElement } from 'react';
import { CartAction, Product } from '../ProductList/ProductList';

type CartItemProps = {
    product: Product & {
        quantity: number;
    };
    dispatchCartAction: Dispatch<CartAction>;
};

export function CartItem(props: CartItemProps): ReactElement {
    const { product, dispatchCartAction } = props;
    const { id, imageUrl, title, price, quantity, productOptions } = product;

    return (
        <HStack bg="#fff" pos="relative" padding="15px" justify="space-between">
            <Flex w="65%" justify="space-between">
                <Box mt="10px" alignItems="center" w="100%">
                    <Text
                        as="h5"
                        color="#1e2d2b"
                        mb="0"
                        fontSize="13px"
                        letterSpacing=".03px"
                        padding="0"
                        lineHeight="1.5"
                        fontWeight="bold"
                    >
                        {title}
                    </Text>
                    <Button
                        onClick={() =>
                            dispatchCartAction({
                                type: 'removeFromCart',
                                payload: id,
                            })
                        }
                        pos="absolute"
                        right="9px"
                        top="6px"
                        padding="0"
                        bg="transparent"
                        _hover={{
                            bg: 'transparent',
                        }}
                    >
                        X
                    </Button>
                    {productOptions[0] && productOptions.length && (
                        <Text>
                            {productOptions[0].title} | {productOptions[0]?.options[0]?.value}
                        </Text>
                    )}
                    <Flex justify="space-between">
                        <HStack>
                            <HStack justify="center">
                                <span aria-label="decrease quantity">
                                    <Button
                                        onClick={() => {
                                            if (quantity > 1) {
                                                dispatchCartAction({
                                                    type: 'decrementQuantity',
                                                    payload: id,
                                                });
                                            }
                                        }}
                                        padding="0"
                                        bg="transparent"
                                        _hover={{
                                            bg: 'transparent',
                                        }}
                                    >
                                        -
                                    </Button>
                                </span>
                                <span>{quantity}</span>
                                <span>
                                    <Button
                                        onClick={() =>
                                            dispatchCartAction({
                                                type: 'incrementQuantity',
                                                payload: id,
                                            })
                                        }
                                        aria-label="increase quantity"
                                        padding="0"
                                        bg="transparent"
                                        _hover={{
                                            bg: 'transparent',
                                        }}
                                    >
                                        +
                                    </Button>
                                </span>
                            </HStack>
                        </HStack>
                        <Box>{price * quantity}</Box>
                    </Flex>
                </Box>
            </Flex>
            <Flex w="35%" justify="center">
                <Image src={imageUrl} alt={title} width="20" height="20" />
            </Flex>
        </HStack>
    );
}
