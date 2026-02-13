import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { getOrganizations, type Organization } from '../services/dashboardApi';
import { useNotification } from '../contexts/NotificationContext';
import { Dashboard as DashboardText } from '../constants';

export function Organizations() {
  const { showError } = useNotification();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrganizations(30, 0).then((res) => {
      setLoading(false);
      if (res.error) {
        showError(res.error);
        return;
      }
      if (res.data) {
        setOrganizations(res.data.organizations);
      }
    });
  }, [showError]);

  return (
    <Box>
      <Typography variant="pageTitle" component="h1">
        {DashboardText.ORGANIZATIONS}
      </Typography>
      <Card>
        <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{DashboardText.ORGANIZATION_NAME}</TableCell>
              <TableCell>{DashboardText.EMAIL}</TableCell>
              <TableCell>{DashboardText.DEPARTMENT}</TableCell>
              <TableCell>{DashboardText.EMPLOYEES}</TableCell>
              <TableCell>{DashboardText.CITY}</TableCell>
              <TableCell>{DashboardText.COUNTRY}</TableCell>
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
            ) : organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {DashboardText.NO_ORGANIZATIONS}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell sx={{ fontWeight: 500 }}>{org.name}</TableCell>
                  <TableCell>{org.email}</TableCell>
                  <TableCell>{org.department}</TableCell>
                  <TableCell>{org.employees?.toLocaleString() ?? DashboardText.N_A}</TableCell>
                  <TableCell>{org.city}</TableCell>
                  <TableCell>{org.country}</TableCell>
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
