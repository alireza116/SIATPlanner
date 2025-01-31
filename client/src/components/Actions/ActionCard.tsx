import { DragEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Action, SwotEntry } from '@/stores/ActionStore';
import SwotChip from './SwotChip';
import { useStore } from '@/stores/StoreProvider';
import { useTheme } from '@mui/material/styles';
import { getSwotColor, SwotTheme } from '@/theme/swotTheme';

interface ActionCardProps {
  action: Action;
  isEditing: boolean;
  editingAction: { id: string; title: string; description: string; swotEntries: SwotEntry[] } | null;
  onEditStart: (action: { id: string; title: string; description: string; swotEntries: SwotEntry[] }) => void;
  onEditChange: (field: string, value: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDelete: (action: Action) => void;
  onRemoveSwotEntry: (actionId: string, swotEntryId: string, description: string) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
}

const SWOT_TYPE_ORDER = ['Strength', 'Weakness', 'Opportunity', 'Threat'] as const;

const groupSwotEntriesByType = (entries: SwotEntry[]) => {
  return entries.reduce((acc, entry) => {
    if (!acc[entry.type]) {
      acc[entry.type] = [];
    }
    acc[entry.type].push(entry);
    return acc;
  }, {} as Record<string, SwotEntry[]>);
};

const getSortedGroupedEntries = (entries: SwotEntry[]): [string, SwotEntry[]][] => {
  const grouped = entries.reduce((acc, entry) => {
    if (!acc[entry.type]) {
      acc[entry.type] = [];
    }
    acc[entry.type].push(entry);
    return acc;
  }, {} as Record<string, SwotEntry[]>);

  return SWOT_TYPE_ORDER
    .filter(type => grouped[type]?.length > 0)
    .map(type => [type, grouped[type]]);
};

const getTypeDescription = (type: string) => {
  switch (type) {
    case 'Strength':
      return 'taking advantage of';
    case 'Weakness':
      return 'addressing';
    case 'Opportunity':
      return 'pursuing';
    case 'Threat':
      return 'mitigating';
    default:
      return 'using';
  }
};

const CompactSwotChip = observer(({ 
  type, 
  count, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  type: string; 
  count: number; 
  onMouseEnter: () => void;
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  const theme = useTheme();
  
  return (
    <Chip
      label={`${type[0]}${count > 1 ? ` (${count})` : ''}`}
      size="small"
      sx={{ 
        minWidth: 32,
        backgroundColor: getSwotColor(type as keyof SwotTheme, theme).main,
        color: theme.palette.getContrastText(getSwotColor(type as keyof SwotTheme, theme).main),
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
});

const ActionCard = observer(({
  action,
  isEditing,
  editingAction,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDelete,
  onRemoveSwotEntry,
  onDragOver,
  onDragLeave,
  onDrop,
}: ActionCardProps) => {
  const { uiStore } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleActionMouseEnter = () => {
    uiStore.setHoveredActionId(
      action._id,
      action.swotEntries?.map(entry => entry._id) || []
    );
  };

  const handleActionMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    const currentTarget = e.currentTarget as HTMLElement;
    
    if (currentTarget.contains(relatedTarget)) {
      return;
    }
    
    uiStore.setHoveredActionId(null);
  };

  const handleChipMouseEnter = (entryId: string) => {
    uiStore.setHoveredSwotEntryId(entryId);
  };

  const handleChipMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    handleActionMouseEnter();
  };

  const handleCompactChipMouseEnter = (entries: SwotEntry[]) => {
    entries.forEach(entry => {
      uiStore.setHoveredSwotEntryId(entry._id);
    });
  };

  const groupedEntries = groupSwotEntriesByType(action.swotEntries || []);
  const sortedGroupedEntries = getSortedGroupedEntries(action.swotEntries || []);

  return (
    <Card
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onMouseEnter={handleActionMouseEnter}
      onMouseLeave={handleActionMouseLeave}
      sx={{ 
        position: 'relative',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        ...(uiStore.hoveredActionId === action._id && {
          boxShadow: 2,
          backgroundColor: 'action.hover'
        })
      }}
      onClick={() => !isEditing && setIsExpanded(!isExpanded)}
    >
      <CardContent>
        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              label="Title"
              value={editingAction?.title || ''}
              onChange={(e) => onEditChange('title', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={editingAction?.description || ''}
              onChange={(e) => onEditChange('description', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button size="small" onClick={onEditCancel}>Cancel</Button>
              <Button size="small" variant="contained" onClick={onEditSave}>Save</Button>
            </Box>
          </Box>
        ) : (
          <>
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
              }}>
                <Typography variant="h6" sx={{ flex: 1 }}>{action.title}</Typography>
                <Box onClick={e => e.stopPropagation()}>
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      onEditStart({
                        id: action._id,
                        title: action.title,
                        description: action.description,
                        swotEntries: action.swotEntries || []
                      });
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => onDelete(action)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                  >
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
              </Box>

              {!isExpanded && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pl: 1 }}>
                  {sortedGroupedEntries.map(([type, entries]) => (
                    <CompactSwotChip
                      key={type}
                      type={type}
                      count={entries.length}
                      onMouseEnter={() => handleCompactChipMouseEnter(entries)}
                      onMouseLeave={handleActionMouseLeave}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {isExpanded && (
              <>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Status: {action.status}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {action.swotEntries?.length > 0 && (
                    <Typography variant="body2">
                      To complete this action:
                    </Typography>
                  )}
                  {sortedGroupedEntries.map(([type, entries]) => (
                    <Box key={type} sx={{ pl: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {getTypeDescription(type)}{' '}
                        {entries.length === 1 ? 'this' : 'these'} {type.toLowerCase()}
                        {entries.length > 1 ? 's' : ''}:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pl: 2 }}>
                        {entries.map((entry) => (
                          <SwotChip
                            key={entry._id}
                            entry={entry}
                            actionId={action._id}
                            onDelete={onRemoveSwotEntry}
                            onMouseEnter={handleChipMouseEnter}
                            onMouseLeave={handleChipMouseLeave}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
                  {action.swotEntries?.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No SWOT entries associated with this action yet. 
                      Drag and drop entries from the SWOT analysis to create connections.
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
});

export default ActionCard; 