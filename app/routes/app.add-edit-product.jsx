import { useProducts } from "./context/ProductContext";
import { useEffect } from "react";
import { Page, Layout, Card, TextField, Button } from "@shopify/polaris";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .typeError("Price must be a number"),
  imageUrl: Yup.string()
    .url("Image URL must be a valid URL")
    .required("Image URL is required"),
  vendor: Yup.string().required("Vendor is required"),
});

const AddEditProduct = () => {
  const { addProduct, editProduct } = useProducts();
  const navigate = useNavigate();
  const location = useLocation(); // Get the product from location state
  const product = location.state?.product; // Use optional chaining to avoid errors

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (product) {
      setValue("title", product.title);
      setValue("description", product.description);
      setValue("price", product.variants[0].price);
      setValue("imageUrl", product.images[0].originalSrc);
      setValue("vendor", product.vendor);
    }
  }, [product, setValue]);

  const onSubmit = async (data) => {
    const newProduct = {
      title: data.title,
      body_html: data.description,
      vendor: data.vendor,
      variants: [{ price: data.price }],
      images: [{ originalSrc: data.imageUrl }],
    };

    if (product) {
      await editProduct({ ...newProduct, id: product.id });
      toast.success("Product updated successfully!");
    } else {
      await addProduct(newProduct);
      toast.success("Product added successfully!");
    }

    navigate("../");
  };

  return (
    <Page title={product ? "Edit Product" : "Add Product"}>
      <Layout>
        <Layout.Section>
          <Button onClick={() => navigate("../")} size="large">
            <FaArrowLeft />
          </Button>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Title"
                    {...field}
                    autoComplete="off"
                    error={errors.title?.message}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Description"
                    {...field}
                    autoComplete="off"
                  />
                )}
              />
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Price"
                    type="number"
                    {...field}
                    autoComplete="off"
                    error={errors.price?.message}
                  />
                )}
              />
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Image URL"
                    {...field}
                    autoComplete="off"
                    error={errors.imageUrl?.message}
                  />
                )}
              />
              <Controller
                name="vendor"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Vendor"
                    {...field}
                    autoComplete="off"
                    error={errors.vendor?.message}
                  />
                )}
              />
              <div
                style={{
                  paddingTop: "10px",
                }}
              >
                <Button size="large" primary submit>
                  {product ? "Save" : "Add"}
                </Button>
              </div>
            </form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default AddEditProduct;
