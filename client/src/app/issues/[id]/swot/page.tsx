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
    <Box sx={{ 
      p: 4,
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      <Typography variant="h4" component="div" gutterBottom>
        {issueStore.currentIssue.title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {issueStore.currentIssue.description}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Issue Information - shown in both mobile and desktop */}
      {IssueInfo}

      {isMobile ? (
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
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
          flex: 1,
          flexGrow: 1
        }}>
          {/* Left Side - SWOT Analysis */}
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* SWOT Content */}
            <Box sx={{ 
              flex: 1,
              overflow: 'auto',
              p: 4,
              flexGrow: 1
            }}>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                height: '100%'
              }}>
                <SwotContent issueId={id as string} />
              </Box>
            </Box>
          </Box>

          {/* Right Side - Actions */}
          <Box sx={{ 
            width: 400,
            borderLeft: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            padding: 3,
            height: '100%',
            overflow: 'auto'
          }}>
            <ActionList issueId={id as string} />
          </Box>
        </Box>
      )}
    </Box>
  );
});

export default SwotPage; 