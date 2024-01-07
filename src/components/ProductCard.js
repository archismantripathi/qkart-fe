import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia>
        <img src={product.image} className="card-image" alt={product.name} />
      </CardMedia>
      <CardContent>
        <Typography variant="body1" gutterBottom>{product.name}</Typography>
        <Typography variant="body1" gutterBottom><b>${product.cost}</b></Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions className="card-actions">
        <Button
          startIcon={<AddShoppingCartOutlined />}
          className="card-button"
          sx={{ width: 1 }}
          variant="contained">
            Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
