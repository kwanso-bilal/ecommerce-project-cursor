import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import { getReviews, type Review } from '../services/dashboardApi';
import { useNotification } from '../contexts/NotificationContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { dashboardPalette } from '../theme/theme';

export function Reviews() {
  const { showError } = useNotification();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews(30, 0).then((res) => {
      setLoading(false);
      if (res.error) {
        showError(res.error);
        return;
      }
      if (res.data) {
        setReviews(res.data.reviews);
      }
    });
  }, [showError]);

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .map((s) => s[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Reviews
      </Typography>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reviewer</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Likes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Loading...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No reviews found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          backgroundColor: dashboardPalette.sidebarBorder,
                          color: 'text.primary',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {getInitials(review.fullName)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {review.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{review.userName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 500 }}>{review.body}</TableCell>
                  <TableCell>#{review.productId}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FavoriteIcon sx={{ fontSize: 16, color: dashboardPalette.expenseColor }} />
                      <Typography variant="body2">{review.likes}</Typography>
                    </Box>
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
