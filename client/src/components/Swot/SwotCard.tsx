import { DragEvent } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/stores/StoreProvider';

interface SwotEntry {
  _id: string;
  type: 'Strength' | 'Weakness' | 'Opportunity' | 'Threat';
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface SwotCardProps {
  entry: SwotEntry;
  category: string;
  isEditing: boolean;
  editingEntry: { id: string; description: string } | null;
  isHighlighted: boolean;
  onEditStart: (entry: { id: string; description: string }) => void;
  onEditCancel: () => void;
  onEditSave: (id: string) => void;
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
  const { uiStore } = useStore();

  if (!entry) {
    return null;
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: entry._id,
      type: category,
      description: entry.description
    }));
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('dragging');
  };

  return (
    <Card 
      variant="outlined"
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => uiStore.setHoveredSwotEntryId(entry._id)}
      onMouseLeave={() => uiStore.setHoveredSwotEntryId(null)}
      sx={{ 
        width: '100%',
        mb: 1,
        '&:hover': {
          boxShadow: 1,
          transition: 'box-shadow 0.2s'
        },
        '&.dragging': {
          opacity: 0.5,
          boxShadow: 3,
        },
        cursor: isEditing ? 'default' : 'grab',
        '&:active': {
          cursor: isEditing ? 'default' : 'grabbing'
        },
        ...(isHighlighted && {
          boxShadow: 3,
          border: 2,
          borderColor: 'primary.main',
          backgroundColor: 'action.hover'
        }),
        transition: 'all 0.2s ease'
      }}
    >
      <CardContent>
        {isEditing ? (
          <>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={Infinity}
              value={editingEntry?.description}
              onChange={(e) => onEditChange(e.target.value)}
              size="small"
              variant="standard"
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Added by {entry.createdBy}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" onClick={onEditCancel}>Cancel</Button>
                <Button size="small" variant="contained" onClick={() => onEditSave(entry._id)}>Save</Button>
              </Box>
            </Box>
          </>
        ) : (
          <>
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
          </>
        )}
      </CardContent>
    </Card>
  );
});

export default SwotCard;