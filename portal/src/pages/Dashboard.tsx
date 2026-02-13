import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  getDashboardStats,
  getRevenueChart,
  getRecentInvoices,
  type DashboardStats,
  type RevenuePoint,
  type RecentInvoice,
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
      <Typography variant="h5" sx={{ mb: 3 }}>
        {DashboardText.HI_WELCOME_BACK}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <Card sx={{ flex: '1 1 200px', minWidth: 200, backgroundColor: dashboardPalette.cardGreen }}>
          <CardContent>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: dashboardPalette.cardGreenIcon,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <BusinessIcon color="primary" sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="cardValue">{stats?.registeredOrganizations ?? '—'}</Typography>
            <Typography variant="body2">{DashboardText.REGISTERED_ORGANIZATIONS}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', minWidth: 200, backgroundColor: dashboardPalette.cardBlue }}>
          <CardContent>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: dashboardPalette.cardBlueIcon,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <AttachMoneyIcon sx={{ color: dashboardPalette.cardBlueIconColor, fontSize: 28 }} />
            </Box>
            <Typography variant="cardValue">{stats?.totalRevenue ?? '—'}</Typography>
            <Typography variant="body2">{DashboardText.TOTAL_REVENUE}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', minWidth: 200, backgroundColor: dashboardPalette.cardYellow }}>
          <CardContent>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: dashboardPalette.cardYellowIcon,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <WarningAmberIcon sx={{ color: 'warning.main', fontSize: 28 }} />
            </Box>
            <Typography variant="cardValue">{stats?.ordersProcessedToday ?? '—'}</Typography>
            <Typography variant="body2">{DashboardText.ORDERS_PROCESSED_TODAY}</Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
        <Box sx={{ flex: '1 1 50%', minWidth: 0 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
                p: 2,
                borderBottom: `1px solid ${dashboardPalette.cardBorder}`,
              }}
            >
              <Typography variant="sectionTitle">{DashboardText.REVENUE}</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
            <Box sx={{ p: 2, height: 320, flex: 1 }}>
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
                  <Legend wrapperStyle={{ display: 'none' }} formatter={() => ''} />
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
        </Box>
        <Box sx={{ flex: '1 1 50%', minWidth: 0 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderBottom: `1px solid ${dashboardPalette.cardBorder}`,
              }}
            >
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
                    <TableCell align="right" sx={{ fontWeight: 500, color: row.type === 'income' ? dashboardPalette.incomeColor : dashboardPalette.expenseColor }}>
                      {row.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
