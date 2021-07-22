export class Cart {
    basket = [];
    constructor() {}

    addItem(items) {
        basket.push(items);
    }

    removeItem(item) {}
}

const cart = new Cart();
const items = [{}, {}];
cart.addItems(items);
