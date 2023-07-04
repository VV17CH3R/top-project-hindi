import { createContext, useEffect, useState } from "react";
import { showErrorToast } from "../utils";
import { db } from "../utils/dbClient";

export const ProductsContext = createContext({
    productsList: [],
    loading: false,
});

const ProductsContextProvider = ( {children} ) => {

    const [productsList, setProductsList] = useState([]);

    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        async function fetchProducts(){
            const { data, error} = await db.from("product").select("*");

            if(error) {
                showErrorToast(error.message, setLoading)
            }
            setProductsList(data);
            setLoading(false);
        }
        fetchProducts();
    }, [])

    return (
        <ProductsContext.Provider
            value={{
                productsList,
                loading,
            }}
        >
            {children}
        </ProductsContext.Provider>
    )
}

export default ProductsContextProvider;