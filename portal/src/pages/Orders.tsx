import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { getOrders, type Order } from '../services/dashboardApi';
import { useNotification } from '../contexts/NotificationContext';
import { dashboardPalette } from '../theme/theme';
import { Dashboard as DashboardText } from '../constants';

export function Orders() {
  const { showError } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders(30, 0).then((res) => {
      setLoading(false);
      if (res.error) {
        showError(res.error);
        return;
      }
      if (res.data) {
        setOrders(res.data.orders);
      }
    });
  }, [showError]);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {DashboardText.ORDERS}
      </Typography>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{DashboardText.ORDER_NUMBER}</TableCell>
              <TableCell>{DashboardText.DESCRIPTION}</TableCell>
              <TableCell>{DashboardText.STATUS}</TableCell>
              <TableCell>{DashboardText.CUSTOMER_ID}</TableCell>
              <TableCell>{DashboardText.DATE}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {DashboardText.LOADING}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {DashboardText.NO_ORDERS}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell sx={{ fontWeight: 500 }}>{order.orderNumber}</TableCell>
                  <TableCell sx={{ maxWidth: 400 }}>{order.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      size="small"
                      sx={{
                        backgroundColor:
                          order.status === 'completed'
                            ? dashboardPalette.incomeColor + '20'
                            : 'warning.main' + '20',
                        color: order.status === 'completed' ? dashboardPalette.incomeColor : 'warning.main',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>{order.customerId}</TableCell>
                  <TableCell>{order.date}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}
