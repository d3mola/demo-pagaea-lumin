/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';
import { getByAltText, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import React from 'react';

import { ProductList, PRODUCT_LIST } from './ProductList';

const mockResponse = {
    products: [
        {
            __typename: 'Product',
            id: 3,
            title: 'Premium-Grade Moisturizing Balm',
            image_url:
                'https://d1b929y2mmls08.cloudfront.net/luminskin/img/new-landing-page/moisturizing-balm.png',
            price: 29,
            product_options: [
                {
                    __typename: 'ProductOption',
                    title: 'Age Bracket',
                    prefix: 'Age',
                    suffix: null,
                    options: [
                        {
                            __typename: 'ProductOptionValue',
                            id: 99,
                            value: '13-24',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 100,
                            value: '25-34',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 101,
                            value: '35-45',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 102,
                            value: '46-55',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 103,
                            value: '56+',
                        },
                    ],
                },
                {
                    __typename: 'ProductOption',
                    title: 'Skin Type',
                    prefix: null,
                    suffix: 'Skin',
                    options: [
                        {
                            __typename: 'ProductOptionValue',
                            id: 96,
                            value: 'Dry',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 97,
                            value: 'Combination',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 98,
                            value: 'Oily',
                        },
                    ],
                },
                {
                    __typename: 'ProductOption',
                    title: 'Frequency',
                    prefix: null,
                    suffix: null,
                    options: [
                        {
                            __typename: 'ProductOptionValue',
                            id: 181,
                            value: 'One Month',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 220,
                            value: 'One Month Supply',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 182,
                            value: 'Two Month',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 221,
                            value: 'Two Month Supply',
                        },
                    ],
                },
            ],
        },
        {
            __typename: 'Product',
            id: 2,
            title: 'No-Nonsense Charcoal Cleanser',
            image_url:
                'https://d1b929y2mmls08.cloudfront.net/luminskin/img/new-landing-page/charcoal-cleanser.png',
            price: 16,
            product_options: [
                {
                    __typename: 'ProductOption',
                    title: 'Age Bracket',
                    prefix: 'Age',
                    suffix: null,
                    options: [
                        {
                            __typename: 'ProductOptionValue',
                            id: 89,
                            value: '13-24',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 90,
                            value: '25-34',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 91,
                            value: '35-45',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 92,
                            value: '46-55',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 93,
                            value: '56+',
                        },
                    ],
                },
                {
                    __typename: 'ProductOption',
                    title: 'Skin Type',
                    prefix: null,
                    suffix: 'Skin',
                    options: [
                        {
                            __typename: 'ProductOptionValue',
                            id: 86,
                            value: 'Dry',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 87,
                            value: 'Combination',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 88,
                            value: 'Oily',
                        },
                    ],
                },
                {
                    __typename: 'ProductOption',
                    title: 'Frequency',
                    prefix: null,
                    suffix: null,
                    options: [
                        {
                            __typename: 'ProductOptionValue',
                            id: 179,
                            value: 'One Month',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 218,
                            value: 'One Month Supply',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 180,
                            value: 'Two Month',
                        },
                        {
                            __typename: 'ProductOptionValue',
                            id: 219,
                            value: 'Two Month Supply',
                        },
                    ],
                },
            ],
        },
        {
            __typename: 'Product',
            id: 42,
            title: 'Clarifying Body Wash',
            image_url:
                'https://i.shgcdn.com/b44f5ef8-6bc0-4a4a-8eef-1f7ced30503d/-/format/auto/-/preview/3000x3000/-/quality/lighter/',
            price: 10,
            product_options: [],
        },
    ],
};

const mocks = [
    {
        request: {
            query: PRODUCT_LIST,
            variables: {"currency":"USD"}
        },
        result: {
            data: mockResponse,
        },
    },
    {
        request: {
            query: PRODUCT_LIST,
            variables: {"currency":"USD"}
        },
        error: new Error('An error occured'),
    },
    {
        request: {
            query: PRODUCT_LIST,
            variables: {"currency":"USD"}
        },
        result: {
            data: { products: [] },
        },
    },
];

describe('ProductList Component', (): void => {
    it('should render without crashing', (): void => {
        expect((): void => {
            render(
                <MockedProvider mocks={mocks} addTypename={false}>
                    <ProductList />
                </MockedProvider>
            );
        }).not.toThrow();
    });

    describe('When a user visits the product list page', (): void => {
        it('they should see a loader', async (): Promise<void> => {
            render(
                <MockedProvider mocks={mocks} addTypename={false}>
                    <ProductList />
                </MockedProvider>
            );

            expect(screen.getByText('loading...')).toBeInTheDocument();
        });

        it('they should see an error if it exits', async (): Promise<void> => {
            render(
                <MockedProvider mocks={[mocks[1]]} addTypename={false}>
                    <ProductList />
                </MockedProvider>
            );

            expect(await screen.findByText('An error occured')).toBeInTheDocument();
        });

        it('they should see a message about no products if none exist', async (): Promise<void> => {
            render(
                <MockedProvider mocks={[mocks[2]]} addTypename={false}>
                    <ProductList />
                </MockedProvider>
            );

            expect(await screen.findByText('No products at this time')).toBeInTheDocument();
        });

        it('they should see a list of products', async (): Promise<void> => {
            render(
                <MockedProvider mocks={mocks} addTypename={false}>
                    <ProductList />
                </MockedProvider>
            );

            expect(await screen.findAllByTestId('product-item')).toHaveLength(3);
        });

        it('they should see a list of products with images', async (): Promise<void> => {
            render(
                <MockedProvider mocks={mocks} addTypename={false}>
                    <ProductList />
                </MockedProvider>
            );

            expect(await screen.findAllByRole('img')).toHaveLength(3);
        });

        it('they should see a list of products with names', async (): Promise<void> => {
            render(
                <MockedProvider mocks={mocks} addTypename={false}>
                    <ProductList />
                </MockedProvider>
            );

            expect(await screen.findByText('Premium-Grade Moisturizing Balm')).toBeInTheDocument();
            expect(await screen.findByText('No-Nonsense Charcoal Cleanser')).toBeInTheDocument();
            expect(await screen.findByText('Clarifying Body Wash')).toBeInTheDocument();
        });

        it('they should see a list of products with product prices', async (): Promise<void> => {
            render(
                <MockedProvider mocks={mocks} addTypename={false}>
                    <ProductList />
                </MockedProvider>
            );

            expect(await screen.findByText(/USD 29.00/)).toBeInTheDocument();
            expect(await screen.findByText(/USD 16.00/)).toBeInTheDocument();
            expect(await screen.findByText(/USD 10.00/)).toBeInTheDocument();
        });

        it('they should see a list of products with "add to cart" button', async (): Promise<void> => {
            render(
                <MockedProvider mocks={mocks} addTypename={false}>
                    <ProductList />
                </MockedProvider>
            );

            expect(
                await screen.findByRole('button', {
                    name: /Add Premium-Grade Moisturizing Balm to Cart/i,
                })
            ).toBeInTheDocument();
            expect(
                await screen.findByRole('button', {
                    name: /Add No-Nonsense Charcoal Cleanser to Cart/i,
                })
            ).toBeInTheDocument();
            expect(
                await screen.findByRole('button', {
                    name: /Premium-Grade Moisturizing Balm/i,
                })
            ).toBeInTheDocument();
            expect(
                await screen.findAllByRole('button', {
                    name: /^add [\w\s-]+ to cart$/im,
                })
            ).toHaveLength(3);
        });
    });

    describe('When a user clicks "add to cart" button on a product once', () => {
        it.skip('should open the cart sidebar and add the item in', async (): Promise<void> => {
            render(
                <MockedProvider mocks={mocks} addTypename={false}>
                    <ProductList />
                </MockedProvider>
            );

            // click add to cart btn
            const addToCartBtn = await screen.findByRole('button', {
                name: /Add Premium-Grade Moisturizing Balm to Cart/i,
            });
            userEvent.click(addToCartBtn);

            // TODO: mock currencies req / resp

            // open drawer
            // expect(await screen.findByText(/your cart./i)).toBeInTheDocument();

            // TODO: maybe
            // select option and add to cart
            // check that item is in cart

            // add product to cart
            // TODO: continue from here
        });

        it.todo('should increment the product quantity if product already exists in cart');
    });

    describe('When a user clicks "+" or "-" buttons in the cart', () => {
        it.todo('the quantity should increase or decrease accordingly');
        it.todo('if the quantity is 1 and the "-" button is pressed, it should remove the item.');
        it.todo('if the quantity is 1 and the "-" button is pressed, quantity should be zero.');
        it.todo(
            'It should sum the items in the cart and display them in the correct selected currency.'
        );
        it.todo(
            '- It should sum the items in the cart and display them in the correct selected currency.'
        );
    });
});
