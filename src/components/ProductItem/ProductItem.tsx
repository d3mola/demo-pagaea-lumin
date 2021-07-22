import { Box, Text, Button, Image, VStack, Flex } from '@chakra-ui/react';
import React, { Dispatch, ReactElement } from 'react';
import { CartAction, Product } from '../ProductList/ProductList';

interface ProductItemProps extends Product {
    onOpen: () => void;
    setCurrentProduct: React.Dispatch<React.SetStateAction<Product | null>>;
    dispatchCartAction: Dispatch<CartAction>;
}

function formatPrice(price: number): string {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    // USD 2,500.00
    return `USD ${formatter.format(price).slice(1)}`;
}

export function ProductItem(props: ProductItemProps): ReactElement {
    const {
        imageUrl,
        title,
        price,
        productOptions,
        id,
        onOpen,
        setCurrentProduct,
        dispatchCartAction,
    } = props;

    function onAddToCartClick() {
        setCurrentProduct({
            imageUrl,
            title,
            price,
            productOptions,
            id,
        });
        if (productOptions.length < 2) {
            dispatchCartAction({
                type: 'addToCart',
                payload: { imageUrl, title, price, productOptions, id },
            });
        }

        onOpen();
    }

    return (
        <VStack py={[4]} px={[2]}>
            <Flex
                direction="column"
                align="center"
                data-testid="product-item"
                maxH="300px"
                flex="1 1 0%"
            >
                <Flex direction="column" justify="center" alignItems="center" flex="1 1 0%">
                    <Image
                        src={imageUrl}
                        alt={title}
                        h="170px"
                        maxW={['127px', '324px']}
                        objectFit="contain"
                    />
                    <Text textAlign="center" fontSize="13px">
                        {title}
                    </Text>
                </Flex>
                <Text mt="2" textAlign="center" fontSize="13px">
                    {formatPrice(price)}
                </Text>
                <Button
                    aria-label={`Add ${title} to Cart`}
                    colorScheme="teal"
                    onClick={onAddToCartClick}
                    mt="4"
                    w={['127px', '127px', '190px']}
                    borderRadius="0"
                    h="52px"
                    px={[4]}
                    bg="rgb(75, 85, 72)"
                    color="rgb(252, 252, 249)"
                    _hover={{
                        background: 'rgb(43, 46, 43)',
                    }}
                >
                    Add to Cart
                </Button>
            </Flex>
        </VStack>
    );
}
