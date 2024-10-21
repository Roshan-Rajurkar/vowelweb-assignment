import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import { Frame } from "@shopify/polaris";
import { ProductProvider } from "./context/ProductContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <>
      <AppProvider isEmbeddedApp apiKey={apiKey}>
        <ProductProvider>
          <Frame>
            <NavMenu>
              <Link to="/app" rel="home">
                Home
              </Link>
              <Link to="/app/add-edit-product">Add Edit Product</Link>
            </NavMenu>
            <Outlet />
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </Frame>
        </ProductProvider>
      </AppProvider>
    </>
  );
}

// Error boundary to handle Shopify errors
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
