// import  { useEffect, useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext.tsx';
// import { getProducts } from '../services/api.ts';
import {Button} from "@/components/ui/button.tsx";

// interface Product {
//     id: number;
//     name: string;
// }

const ProductsTests = () => {
    // const { state } = useContext(AuthContext)!;
    // const [products, setProducts] = useState<Product[]>([]);
    //
    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const data = await getProducts(state.token!);
    //             setProducts(data);
    //         } catch (error) {
    //             console.error('Failed to fetch products', error);
    //         }
    //     };
    //
    //     fetchProducts();
    // }, [state.token]);

    return (
        // <div>
        //     <h2>Product List</h2>
        //     <ul>
        //         {products.map((product) => (
        //             <li key={product.id}>{product.name}</li>
        //         ))}
        //     </ul>
        // </div>
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
            </div>
            <div
                className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
                x-chunk="dashboard-02-chunk-1"
            >
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        You have no products
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        You can start selling as soon as you add a product.
                    </p>
                    <Button className="mt-4 ">Add Product</Button>

                </div>
            </div>
        </>
)
    ;
};

export default ProductsTests;
