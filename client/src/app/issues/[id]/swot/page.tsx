'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/stores/StoreProvider';
import SwotList from '@/components/Swot/SwotList';
import ActionList from '@/components/Actions/ActionList';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';

const SwotPage = observer(() => {
  const { id } = useParams();
  const { issueStore, swotStore, actionStore, uiStore } = useStore();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const categorizeSwotEntries = () => {
    return {
      Strength: swotStore.entries.filter(entry => entry.type === 'Strength'),
      Weakness: swotStore.entries.filter(entry => entry.type === 'Weakness'),
      Opportunity: swotStore.entries.filter(entry => entry.type === 'Opportunity'),
      Threat: swotStore.entries.filter(entry => entry.type === 'Threat'),
    };
  };

  const swotCategories = categorizeSwotEntries();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="div" gutterBottom>
          {issueStore.currentIssue.title}
        </Typography>
        <Typography variant="body1" component="div" color="text.secondary" paragraph>
          {issueStore.currentIssue.description}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Internal Factors Section */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" component="div" color="text.secondary" align="center" gutterBottom>
              Internal Factors
            </Typography>
            <Divider />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <SwotList
                category="Strength"
                displayText="Strengths"
                subtitle="Attributes and resources that provide an advantage"
                issueId={id as string}
                entries={swotCategories.Strength}
                highlightedEntryId={uiStore.hoveredSwotEntryId}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <SwotList
                category="Weakness"
                displayText="Weaknesses"
                subtitle="Limitations or areas needing improvement"
                issueId={id as string}
                entries={swotCategories.Weakness}
                highlightedEntryId={uiStore.hoveredSwotEntryId}
              />
            </Box>
          </Box>
        </Box>

        {/* External Factors Section */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" component="div" color="text.secondary" align="center" gutterBottom>
              External Factors
            </Typography>
            <Divider />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <SwotList
                category="Opportunity"
                displayText="Opportunities"
                subtitle="Factors or trends that can be leveraged for growth"
                issueId={id as string}
                entries={swotCategories.Opportunity}
                highlightedEntryId={uiStore.hoveredSwotEntryId}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <SwotList
                category="Threat"
                displayText="Threats"
                subtitle="External factors that could cause challenges or risks"
                issueId={id as string}
                entries={swotCategories.Threat}
                highlightedEntryId={uiStore.hoveredSwotEntryId}
              />
            </Box>
          </Box>
        </Box>

        {/* Actions Section */}
        <Box sx={{ flex: 1 }}>
          <ActionList issueId={id as string} />
        </Box>
      </Box>
    </Container>
  );
});

export default SwotPage; 