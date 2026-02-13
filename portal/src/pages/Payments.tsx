import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { getPayments, type Payment } from '../services/dashboardApi';
import { useNotification } from '../contexts/NotificationContext';
import { dashboardPalette } from '../theme/theme';
import { Dashboard as DashboardText } from '../constants';

export function Payments() {
  const { showError } = useNotification();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPayments(30, 0).then((res) => {
      setLoading(false);
      if (res.error) {
        showError(res.error);
        return;
      }
      if (res.data) {
        setPayments(res.data.payments);
      }
    });
  }, [showError]);

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return dashboardPalette.incomeColor;
      case 'pending':
        return 'warning.main';
      case 'failed':
        return dashboardPalette.expenseColor;
      default:
        return 'text.secondary';
    }
  };

  return (
    <Box>
      <Typography variant="pageTitle" component="h1">
        {DashboardText.PAYMENTS}
      </Typography>
      <Card>
        <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{DashboardText.TRANSACTION_ID}</TableCell>
              <TableCell>{DashboardText.AMOUNT}</TableCell>
              <TableCell>{DashboardText.STATUS}</TableCell>
              <TableCell>{DashboardText.PAYMENT_METHOD}</TableCell>
              <TableCell>{DashboardText.DATE}</TableCell>
              <TableCell>{DashboardText.USER_ID}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {DashboardText.LOADING}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {DashboardText.NO_PAYMENTS}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell sx={{ fontWeight: 500 }}>{payment.transactionId}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{payment.amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      size="small"
                      sx={{
                        backgroundColor:
                          payment.status === 'completed'
                            ? dashboardPalette.incomeColor + '20'
                            : payment.status === 'pending'
                              ? 'warning.main' + '20'
                              : dashboardPalette.expenseColor + '20',
                        color: getStatusColor(payment.status),
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.userId}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
