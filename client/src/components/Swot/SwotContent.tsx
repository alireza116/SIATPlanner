import { Box, Typography, Divider } from '@mui/material';
import { observer } from 'mobx-react-lite';
import SwotList from './SwotList';
import { useStore } from '@/stores/StoreProvider';

interface SwotContentProps {
  issueId: string;
}

const SwotContent = observer(({ issueId }: SwotContentProps) => {
  const { swotStore, uiStore } = useStore();

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
      {/* Internal/External Headers */}
      <Box sx={{ 
        display: {xs:"none", md:"grid"},
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(2, 1fr)'
        },
        gap: 2
      }}>
        <Typography variant="h6" component="div" color="text.secondary" align="center">
          Internal Factors
        </Typography>
        <Typography variant="h6" component="div" color="text.secondary" align="center">
          External Factors
        </Typography>
        
      </Box>
      <Divider />

      {/* SWOT Lists */}
      <Box sx={{ 
        display: 'grid',
        flexGrow: 1,
        gridTemplateColumns: {
          xs: '1fr',            // Stack on mobile
          md: 'repeat(4, 1fr)'  // Four columns on desktop
        },
        gap: 2
      }}>
        {/* Strengths */}

          <SwotList
            category="Strength"
            displayText="Strengths"
            subtitle="Attributes and resources that provide an advantage"
            issueId={issueId}
            entries={swotCategories.Strength}
            highlightedEntryId={uiStore.hoveredSwotEntryId}
          />

        {/* Weaknesses */}

          <SwotList
            category="Weakness"
            displayText="Weaknesses"
            subtitle="Limitations or areas needing improvement"
            issueId={issueId}
            entries={swotCategories.Weakness}
            highlightedEntryId={uiStore.hoveredSwotEntryId}
          />


        {/* Opportunities */}

          <SwotList
            category="Opportunity"
            displayText="Opportunities"
            subtitle="Factors or trends that can be leveraged for growth"
            issueId={issueId}
            entries={swotCategories.Opportunity}
            highlightedEntryId={uiStore.hoveredSwotEntryId}
          />


        {/* Threats */}

          <SwotList
            category="Threat"
            displayText="Threats"
            subtitle="External factors that could cause challenges or risks"
            issueId={issueId}
            entries={swotCategories.Threat}
            highlightedEntryId={uiStore.hoveredSwotEntryId}
          />

      </Box>
    </Box>
  );
});

export default SwotContent; 