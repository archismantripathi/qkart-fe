import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import "./Products.css";
import { useHistory } from "react-router-dom";

// Definition of Data Structures used
/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [isBusyLoading, setIsBusyLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchBox, setSearchBox] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const username = window.localStorage.getItem("username");
  const token = window.localStorage.getItem("token");
  const history = useHistory();

  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try {
      const res = await axios.get(config.endpoint + "/products");
      if (res.status === 200) {
        return res.data;
      } else
        enqueueSnackbar("Something is not right!", {
          variant: "warning",
          duration: 6000,
        });
    } catch (error) {
      if (error.response)
        enqueueSnackbar(error.response.data.message, {
          variant: "error",
          duration: 6000,
        });
      else
        enqueueSnackbar("Server is not reachable.", {
          variant: "error",
          duration: 6000,
        });
    }
    return [];
  };

  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const res = await axios.get(
        config.endpoint + "/products/search?value=" + text
      );
      if (res.status === 200) {
        return res.data;
      } else
        enqueueSnackbar("Something is not right!", {
          variant: "warning",
          duration: 6000,
        });
    } catch (error) {
      if (error.response.status === 404) setProducts([]);
      else if (error.response)
        enqueueSnackbar(error.response.data.message, {
          variant: "error",
          duration: 6000,
        });
      else
        enqueueSnackbar("Server is not reachable.", {
          variant: "error",
          duration: 6000,
        });
    }
    return [];
  };

  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timer = setTimeout(() => {
      performSearch(event.target.value).then((data) => setProducts(data));
    }, 500);
    setDebounceTimeout(timer);
  };

  useEffect(() => {
    performAPICall().then((data) => {
      setIsBusyLoading(false);
      setProducts(data);
    });
    fetchCart(token).then((data) => {
      setCart(data);
    });
  }, []);

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      const res = await axios.get(
        config.endpoint + "/cart", { 
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {};

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      history.push("/login");
      return;
    }

    if (options.preventDuplicate && items.find(item => item.productId === productId))
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        }
      );

    try {
      const res = await axios.post(
        config.endpoint + "/cart", {
          productId,
          qty
          
        }, 
        { headers: {
            "Authorization": "Bearer " + token
          }
        }
      );
      setCart(res.data);
      if (res.status !== 200)
        enqueueSnackbar("Something is not right!", {
          variant: "warning",
          duration: 6000,
        });
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  return (
    <div>
      <Header>
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                onClick={() =>
                  performSearch(searchBox).then((data) => setProducts(data))
                }
              >
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          value={searchBox}
          onKeyPress={(e) => {
            if (e.key === "Enter") performSearch(searchBox);
          }}
          onChange={(e) => {
            setSearchBox(e.target.value);
            debounceSearch(e, debounceTimeout);
          }}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="end"
              onClick={() =>
                performSearch(searchBox).then((data) => setProducts(data))
              }
            >
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        sx={{ marginBottom: "2px" }}
        value={searchBox}
        onKeyPress={(e) => {
          if (e.key === "Enter") performSearch(searchBox);
        }}
        onChange={(e) => {
          setSearchBox(e.target.value);
          debounceSearch(e, debounceTimeout);
        }}
      />
      <Stack direction={{ md: "row" }}>
        <Grid container>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
          {isBusyLoading ? (
            <Box className="loading">
              <CircularProgress />
              <p>Loading Products...</p>
            </Box>
          ) : products.length > 0 ? (
            <Grid container spacing={2} marginY={1} paddingX={1}>
              {products.map((product) => (
                <Grid item xs={6} md={3} key={product._id}>
                  <ProductCard product={product} handleAddToCart={()=>{addToCart(token, cart, products, product._id, 1, { preventDuplicate: true })}} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box className="loading">
              <SentimentDissatisfied />
              <p>No products found</p>
            </Box>
          )}
        </Grid>
        { username ? 
          <Box md={3} xs={12} backgroundColor="#E9F5E1">
            <Cart products={products} items={cart} handleQuantity={(productId, qty) => {addToCart(token, cart, products, productId, qty)}}/> 
          </Box> : '' }
      </Stack>
      <Footer />
    </div>
  );
};

export default Products;
