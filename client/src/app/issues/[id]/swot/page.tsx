'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/stores/StoreProvider';
import SwotContent from '@/components/Swot/SwotContent';
import ActionList from '@/components/Actions/ActionList';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MobileTabs from '@/components/Common/MobileTabs';

const SwotPage = observer(() => {
  const { id } = useParams();
  const { issueStore, swotStore, actionStore } = useStore();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          issueStore.fetchIssue(id as string),
          swotStore.fetchSwotEntries(id as string),
          actionStore.fetchActions(id as string)
        ]);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      fetchData();
    }
  }, [id, issueStore, swotStore, actionStore, isClient]);

  if (!isClient) return null;
  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!issueStore.currentIssue) return <Alert severity="error">Issue not found</Alert>;

  const IssueInfo = (
    <>
      <Typography variant="h4" component="div" gutterBottom>
        {issueStore.currentIssue.title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {issueStore.currentIssue.description}
      </Typography>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Box sx={{ flex: 1 }}>
          <MobileTabs labels={['SWOT Analysis', 'Actions']}>
            {[
              <SwotContent key="swot" issueId={id as string} />,
              <ActionList key="actions" issueId={id as string} />
            ]}
          </MobileTabs>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'flex',
          flexGrow:1
        }}>
          {/* Left Side - SWOT Analysis */}
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
          }}>
            {/* SWOT Content */}
            <Box sx={{
              p:4,
              borderBottom: 1,
              borderColor: 'divider',
              marginBottom: 2
            }}>
              {IssueInfo}
            </Box>
            <Box sx={{
              pr:4,
              pl:4,
              flexGrow: 1
            }}>
              <SwotContent issueId={id as string} />
            </Box>
 

          </Box>

          {/* Right Side - Actions */}
          <Box sx={{ 
            width: 400,
            borderLeft: 1,
            borderColor: 'divider',
            p: 4,
          }}>
            <ActionList issueId={id as string} />
          </Box>
        </Box>
      )}
    </>
  );
});

export default SwotPage; 