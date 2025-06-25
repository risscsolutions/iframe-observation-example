import {createContext, ReactNode, useContext, useState} from 'react';

export type Product = {
    id: number,
    name: string,
    draft: string,
    price: number,
    color: string,
    size: string,
    imageSrc: string,
    imageAlt: string,

    inStock: boolean
}
const BasketContext = createContext<{
    products: Array<Product>,
    addProduct: (product: Product) => void
}>({
    products: [],
    addProduct: (product?: Product) => console.debug(product)
});

export function BasketProvider({children}: { children: ReactNode }) {
    const [products, setProducts] = useState<Array<Product>>([]);

    function addProduct(product: Product) {
        setProducts([
            ...products,
            product
        ]);
    }

    return (
        <BasketContext.Provider value={{products, addProduct}}>{children}</BasketContext.Provider>
    );
}

export function useBasket() {
    return useContext(BasketContext);
}
