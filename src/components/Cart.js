import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

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

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  return cartData.map((item) => {
    const product = productsData.find(
      (product) => product._id === item.productId
    );
    return {
      name: product.name,
      qty: item.qty,
      category: product.category,
      cost: product.cost,
      rating: product.rating,
      image: product.image,
      productId: product._id,
    };
  });
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */

export const getTotalCartValue = (items) => {
  return items.reduce((acc, item) => acc + item.cost * item.qty, 0);
};

/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {
  return items.reduce((acc, item) => acc + item.qty, 0);
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 *
 */
const ItemQuantity = ({ value, handleAdd, handleDelete, isReadOnly }) => {
  if (isReadOnly)
    return (
      <Typography p={1} data-testid="item-qty">
        Qty: {value}
      </Typography>
    );
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ products, items = [], handleQuantity, isReadOnly }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(generateCartItemsFrom(items, products));
  }, [items]);

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        <Stack sx={{ pt: "0.5rem" }}>
          {cart.map((item) => (
            <Box
              className="cart-row"
              sx={{ mt: "0.5rem", mx: "1rem" }}
              key={item.productId}
            >
              <Box className="image-container">
                <img
                  src={item.image}
                  alt={item.name}
                  height="100%"
                  width="100%"
                />
              </Box>
              <Stack sx={{ ml: "0.5rem" }}>
                <Typography variant="body1" sx={{ ml: "0.5rem" }}>
                  {item.name}
                </Typography>
                <Box className="cart-row">
                  <ItemQuantity
                    value={item.qty}
                    handleAdd={() =>
                      handleQuantity(item.productId, item.qty + 1)
                    }
                    handleDelete={() =>
                      handleQuantity(item.productId, item.qty - 1)
                    }
                    isReadOnly={isReadOnly}
                  />
                  <Typography variant="body1">
                    <b>${item.cost}</b>
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(cart)}
          </Box>
        </Box>

        {isReadOnly ? (
          ""
        ) : (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Link to="/checkout">
              <Button
                color="primary"
                variant="contained"
                startIcon={<ShoppingCart />}
                className="checkout-btn"
              >
                Checkout
              </Button>
            </Link>
          </Box>
        )}
      </Box>
      {isReadOnly ? (
        <Box className="cart" my="-0.5rem">
          <Stack sx={{ py: "1.5rem", m: "1rem" }}>
            <Typography variant="h5" mb="1rem"><b>Order Details</b></Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: "0.5rem" }}>
              <Typography variant="body1">Products</Typography>
              <Typography variant="body1">{getTotalItems(cart)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: "0.5rem" }}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">${getTotalCartValue(cart)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: "0.5rem" }}>
              <Typography variant="body1">Shipping Charges</Typography>
              <Typography variant="body1">$0</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: "0.5rem" }}>
              <Typography variant="h6"><b>Total</b></Typography>
              <Typography variant="h6"><b>${getTotalCartValue(cart)}</b></Typography>
            </Box>
          </Stack>
        </Box>
      ) : (
        ""
      )}
    </>
  );
};

export default Cart;
