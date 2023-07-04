import { faker } from "@faker-js/faker";

const fakeProducts = [];

Array.from({length:10}).forEach(() => {
    fakeProducts.push({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        price: faker.number.int({
            min: 50,
            max: 100,
        }),
        image: faker.image.url(),
        description: faker.commerce.productDescription(),
        stock: faker.number.int({
            min: 10,
            max: 100,
        }),
    });
});

export default function handler(req, res) {
    res.status(200).json(fakeProducts);
};