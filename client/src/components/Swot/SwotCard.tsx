import { observer } from 'mobx-react-lite';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getSwotColor } from '@/theme/swotTheme';
import { useTheme } from '@mui/material/styles';
import BaseCard from '../Common/BaseCard';
import { useStore } from '@/stores/StoreProvider';

interface SwotEntry {
  _id: string;
  type: 'Strength' | 'Weakness' | 'Opportunity' | 'Threat';
  description: string;
  createdBy: string;
}

interface SwotCardProps {
  entry: {
    _id: string;
    type: 'Strength' | 'Weakness' | 'Opportunity' | 'Threat';
    description: string;
    createdBy: string;
  };
  category: 'Strength' | 'Weakness' | 'Opportunity' | 'Threat';
  isEditing: boolean;
  editingEntry: { id: string; description: string } | null;
  isHighlighted: boolean;
  onEditStart: (entry: { id: string; description: string }) => void;
  onEditCancel: () => void;
  onEditSave: () => void;
  onDelete: (entry: SwotEntry) => void;
  onEditChange: (description: string) => void;
}

const SwotCard = observer(({
  entry,
  category,
  isEditing,
  editingEntry,
  isHighlighted,
  onEditStart,
  onEditCancel,
  onEditSave,
  onDelete,
  onEditChange,
}: SwotCardProps) => {
  const theme = useTheme();
  const { uiStore } = useStore();
  const accentColor = getSwotColor(category, theme).main;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: entry._id,
      type: entry.type,
      description: entry.description
    }));
  };

  const handleMouseEnter = () => {
    uiStore.setHoveredSwotEntryId(entry._id);
  };

  const handleMouseLeave = () => {
    uiStore.setHoveredSwotEntryId(null);
  };

  if (isEditing) {
    return (
      <BaseCard accentColor={accentColor}>
        <Box>
          <TextField
            fullWidth
            multiline
            value={editingEntry?.description || ''}
            onChange={(e) => onEditChange(e.target.value)}
            size="small"
            variant="standard"
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" onClick={onEditCancel}>Cancel</Button>
            <Button size="small" variant="contained" onClick={onEditSave}>Save</Button>
          </Box>
        </Box>
      </BaseCard>
    );
  }

  return (
    <BaseCard
      isHighlighted={isHighlighted}
      accentColor={accentColor}
      draggable={true}
      onDragStart={handleDragStart}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              mr: 2
            }}
          >
            {entry.description}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ display: 'block', mt: 1 }}
          >
            Added by {entry.createdBy}
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 0.5,
          ml: 1
        }}>
          <IconButton 
            size="small"
            onClick={() => onEditStart({ 
              id: entry._id, 
              description: entry.description 
            })}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => onDelete(entry)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </BaseCard>
  );
});

export default SwotCard;