import { Box, useTheme, useMediaQuery } from '@mui/material';
import { observer } from 'mobx-react-lite';
import SwotList from './SwotList';
import { useStore } from '@/stores/StoreProvider';

interface SwotContentProps {
  issueId: string;
}

const SwotContent = observer(({ issueId }: SwotContentProps) => {
  const { swotStore, uiStore } = useStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',            // One column on mobile
        sm: 'repeat(2, 1fr)', // Two columns on tablet
        md: 'repeat(4, 1fr)'  // Four columns on desktop
      },
      gap: 2,
    }}>
      {/* Strengths */}
      <Box>
        <SwotList
          category="Strength"
          displayText="Strengths"
          subtitle="Attributes and resources that provide an advantage"
          issueId={issueId}
          entries={swotCategories.Strength}
          highlightedEntryId={uiStore.hoveredSwotEntryId}
        />
      </Box>

      {/* Weaknesses */}
      <Box>
        <SwotList
          category="Weakness"
          displayText="Weaknesses"
          subtitle="Limitations or areas needing improvement"
          issueId={issueId}
          entries={swotCategories.Weakness}
          highlightedEntryId={uiStore.hoveredSwotEntryId}
        />
      </Box>

      {/* Opportunities */}
      <Box>
        <SwotList
          category="Opportunity"
          displayText="Opportunities"
          subtitle="Factors or trends that can be leveraged for growth"
          issueId={issueId}
          entries={swotCategories.Opportunity}
          highlightedEntryId={uiStore.hoveredSwotEntryId}
        />
      </Box>

      {/* Threats */}
      <Box>
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