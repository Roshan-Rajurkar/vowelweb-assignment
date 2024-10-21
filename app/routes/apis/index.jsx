import axios from "axios";

const SHOPIFY_STORE_URL = "https://quickstart-cc1a0754.myshopify.com";
const API_VERSION = "2024-10";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const shopifyApi = axios.create({
  baseURL: `${SHOPIFY_STORE_URL}/admin/api/${API_VERSION}`,
  headers: {
    "X-Shopify-Access-Token": ACCESS_TOKEN,
    "Content-Type": "application/json",
  },
});

export const fetchProducts = async () => {
  const response = await shopifyApi.get("/products.json");
  return response.data.products;
};

export const createProduct = async (product) => {
  const response = await shopifyApi.post("/products.json", {
    product,
  });
  return response.data.product;
};

export const updateProduct = async (productId, updatedProduct) => {
  const response = await shopifyApi.put(`/products/${productId}.json`, {
    product: updatedProduct,
  });
  return response.data.product;
};

export const deleteProduct = async (productId) => {
  await shopifyApi.delete(`/products/${productId}.json`);
};
