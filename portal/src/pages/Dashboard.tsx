import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  getDashboardStats,
  getRecentInvoices,
  getRevenueChart,
  type DashboardStats,
  type RecentInvoice,
  type RevenuePoint,
} from '../services/dashboardApi';
import { dashboardPalette } from '../theme/theme';
import { Dashboard as DashboardText } from '../constants';

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<RevenuePoint[]>([]);
  const [invoices, setInvoices] = useState<RecentInvoice[]>([]);

  useEffect(() => {
    getDashboardStats().then((res) => res.data && setStats(res.data));
    getRevenueChart().then((res) => res.data && setChartData(res.data));
    getRecentInvoices().then((res) => res.data && setInvoices(res.data));
  }, []);

  return (
    <Box>
      <Typography variant="pageTitle" component="h1">
        {DashboardText.HI_WELCOME_BACK}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', backgroundColor: dashboardPalette.cardGreen }}>
            <CardContent>
              <Box sx={(theme) => ({ ...theme.custom.cardIconBox, backgroundColor: dashboardPalette.cardGreenIcon })}>
                <BusinessIcon color="primary" sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="cardValue">{stats?.registeredOrganizations ?? '—'}</Typography>
              <Typography variant="body2">{DashboardText.REGISTERED_ORGANIZATIONS}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', backgroundColor: dashboardPalette.cardBlue }}>
            <CardContent>
              <Box sx={(theme) => ({ ...theme.custom.cardIconBox, backgroundColor: dashboardPalette.cardBlueIcon })}>
                <AttachMoneyIcon sx={{ color: dashboardPalette.cardBlueIconColor, fontSize: 28 }} />
              </Box>
              <Typography variant="cardValue">{stats?.totalRevenue ?? '—'}</Typography>
              <Typography variant="body2">{DashboardText.TOTAL_REVENUE}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', backgroundColor: dashboardPalette.cardYellow }}>
            <CardContent>
              <Box sx={(theme) => ({ ...theme.custom.cardIconBox, backgroundColor: dashboardPalette.cardYellowIcon })}>
                <WarningAmberIcon sx={{ color: 'warning.main', fontSize: 28 }} />
              </Box>
              <Typography variant="cardValue">{stats?.ordersProcessedToday ?? '—'}</Typography>
              <Typography variant="body2">{DashboardText.ORDERS_PROCESSED_TODAY}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={(theme) => theme.custom.cardHeader}>
              <Typography variant="sectionTitle">{DashboardText.REVENUE}</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: dashboardPalette.chartLastYear }} />
                  <Typography variant="caption">{DashboardText.LAST_YEAR_REVENUE}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  <Typography variant="caption">{DashboardText.THIS_YEAR_REVENUE}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={(theme) => theme.custom.chartCardContent}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dashboardPalette.cardBorder} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: dashboardPalette.chartAxisTick }} />
                  <YAxis
                    tick={{ fontSize: 12, fill: dashboardPalette.chartAxisTick }}
                    tickFormatter={(v) => `$${v / 1000}K`}
                  />
                  <Tooltip
                    formatter={(value: number | undefined) => [value != null ? `$${Number(value).toLocaleString()}` : '', '']}
                    labelFormatter={(label) => label}
                  />
                  <Line
                    type="monotone"
                    dataKey="lastYear"
                    name="Last Year Revenue"
                    stroke={dashboardPalette.chartLastYear}
                    strokeWidth={2}
                    dot={{ fill: dashboardPalette.chartLastYear, r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="thisYear"
                    name="This Year Revenue"
                    stroke={dashboardPalette.chartThisYear}
                    strokeWidth={2}
                    dot={{ fill: dashboardPalette.chartThisYear, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={(theme) => theme.custom.cardHeader}>
              <Typography variant="sectionTitle">{DashboardText.RECENT_INVOICES}</Typography>
              <IconButton size="small" aria-label={DashboardText.EXPAND}>
                <OpenInFullIcon fontSize="small" />
              </IconButton>
            </Box>
            <Table size="small" sx={{ flex: 1 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: dashboardPalette.tableHeaderBg }}>
                  <TableCell>{DashboardText.COMPANY_NAME}</TableCell>
                  <TableCell>{DashboardText.DATE}</TableCell>
                  <TableCell align="right">{DashboardText.AMOUNT}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.companyName}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 500,
                        color: row.type === 'income' ? dashboardPalette.incomeColor : dashboardPalette.expenseColor,
                      }}
                    >
                      {row.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
