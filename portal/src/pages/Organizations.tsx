import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { getOrganizations, type Organization } from '../services/dashboardApi';
import { useNotification } from '../contexts/NotificationContext';

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
      <Typography variant="h5" sx={{ mb: 3 }}>
        Organizations
      </Typography>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Organization Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Employees</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Country</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Loading...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No organizations found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell sx={{ fontWeight: 500 }}>{org.name}</TableCell>
                  <TableCell>{org.email}</TableCell>
                  <TableCell>{org.department}</TableCell>
                  <TableCell>{org.employees?.toLocaleString() ?? 'N/A'}</TableCell>
                  <TableCell>{org.city}</TableCell>
                  <TableCell>{org.country}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}
