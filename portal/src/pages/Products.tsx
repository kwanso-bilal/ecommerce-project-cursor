import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import { getProducts, type Product } from '../services/dashboardApi';
import { useNotification } from '../contexts/NotificationContext';
import StarIcon from '@mui/icons-material/Star';

export function Products() {
  const { showError } = useNotification();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts(30, 0).then((res) => {
      setLoading(false);
      if (res.error) {
        showError(res.error);
        return;
      }
      if (res.data) {
        setProducts(res.data.products);
      }
    });
  }, [showError]);

  const getStockColor = (stock: number) => {
    if (stock > 50) return 'success';
    if (stock > 10) return 'warning';
    return 'error';
  };

  const getStockLabel = (stock: number) => {
    if (stock > 50) return 'In Stock';
    if (stock > 10) return 'Low Stock';
    return 'Out of Stock';
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Products
      </Typography>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Loading...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No products found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {product.thumbnail && (
                        <Avatar
                          src={product.thumbnail}
                          alt={product.title}
                          variant="rounded"
                          sx={{ width: 40, height: 40 }}
                        />
                      )}
                      <Typography sx={{ fontWeight: 500, maxWidth: 300 }} noWrap>
                        {product.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={product.category} size="small" sx={{ textTransform: 'capitalize' }} />
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Typography color="error.main" sx={{ fontWeight: 500 }}>
                      -{product.discountPercentage.toFixed(1)}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography variant="body2">{product.rating.toFixed(1)}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStockLabel(product.stock)}
                      size="small"
                      color={getStockColor(product.stock)}
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}
