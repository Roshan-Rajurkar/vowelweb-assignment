import React, { createContext, useContext, useEffect, useState } from "react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../apis/index";

const ProductContext = createContext();

export const useProducts = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const addProduct = async (newProduct) => {
    const createdProduct = await createProduct(newProduct);
    setProducts((prev) => [...prev, createdProduct]);
  };

  const editProduct = async (updatedProduct) => {
    const updatedShopifyProduct = await updateProduct(
      updatedProduct.id,
      updatedProduct,
    );
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedShopifyProduct : product,
      ),
    );
  };

  const deleteProductById = async (id) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  useEffect(() => {
    // Fetch products on component mount
    const loadProducts = async () => {
      const productsFromShopify = await fetchProducts();
      setProducts(productsFromShopify);
    };
    loadProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, addProduct, deleteProductById, editProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};
