import { useProducts } from "./context/ProductContext";
import { Page, Layout, Card, DataTable, Button } from "@shopify/polaris";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function ProductList() {
  const { products, deleteProductById } = useProducts();
  const navigate = useNavigate();

  const handleDelete = (id) => {
    deleteProductById(id);
    toast.success("Product deleted successfully!");
  };

  const handleEdit = (product) => {
    navigate("/app/add-edit-product", { state: { product } });
  };

  const rows = products.map((product) => [
    <b key={product.id}>{product.title}</b>,
    product.description || "No description",
    product.images.length > 0 ? (
      <img
        key={product.id}
        src={product.images[0].originalSrc}
        alt={product.images[0].altText || "Product Image"}
        style={{ width: "50px", height: "50px", objectFit: "cover" }}
      />
    ) : (
      "No image"
    ),
    <b key={product.id}>{`₹${product.variants[0].price}`}</b>,
    product.vendor || "No vendor",
    <div
      style={{
        display: "flex",
        gap: "10px",
      }}
      key={product.id}
    >
      <Button
        size="micro"
        key={`edit-${product.id}`}
        onClick={() => handleEdit(product)}
      >
        Edit
      </Button>

      <Button
        size="micro"
        variant="primary"
        key={product.id}
        onClick={() => handleDelete(product.id)}
      >
        Delete
      </Button>
    </div>,
  ]);

  return (
    <Page title="Product List">
      <Layout>
        <Layout.Section>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button
              onClick={() => navigate("/app/add-edit-product")}
              size="large"
            >
              Add Product
            </Button>
          </div>
        </Layout.Section>
        <Layout.Section>
          <Card>
            {rows.length > 0 ? (
              <DataTable
                columnContentTypes={[
                  "text",
                  "text",
                  "text",
                  "numeric",
                  "text",
                  "text",
                  "text",
                ]}
                headings={[
                  "Title",
                  "Description",
                  "Image",
                  "Price",
                  "Vendor",
                  "Actions",
                ]}
                rows={rows}
              />
            ) : (
              "No products available"
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
