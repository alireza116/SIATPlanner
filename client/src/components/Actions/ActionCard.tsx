import { DragEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
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
import BaseCard from '../Common/BaseCard';

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
  onMouseEnter?: () => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  isHighlighted?: boolean;
}

const SWOT_TYPE_ORDER = ['Strength', 'Weakness', 'Opportunity', 'Threat'] as const;



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

const getTypePlural = (type: string) => {
  switch (type) {
    case 'Opportunity':
      return 'opportunities';
    case 'Threat':
      return 'threats';
    case 'Weakness':
      return 'weaknesses';
    case 'Strength':
      return 'strengths';
    default:
      return `${type.toLowerCase()}s`;


  }
};

const CompactSwotChip = observer(({ 
  type, 
  count, 
  entries,
  onMouseEnter,
  onMouseLeave 
}: { 
  type: string; 
  count: number;
  entries: SwotEntry[];
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
  isHighlighted
}: ActionCardProps) => {
  const theme = useTheme();
  const { uiStore } = useStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleActionMouseEnter = () => {
    uiStore.setHoveredActionId(
      action._id,
      action.swotEntries?.map(entry => entry._id) || []
    );
  };

  const handleActionMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    const currentTarget = e.currentTarget as HTMLElement;
    
    if (relatedTarget && currentTarget.contains(relatedTarget)) {
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


  const renderSwotChips = () => {
    if (!action.swotEntries?.length) return null;

    const groupedEntries = action.swotEntries.reduce((acc, entry) => {
      if (!acc[entry.type]) {
        acc[entry.type] = [];
      }
      acc[entry.type].push(entry);
      return acc;
    }, {} as Record<string, SwotEntry[]>);

    return (
      <Box sx={{ mt: 2 }}>
        {SWOT_TYPE_ORDER.map(type => {
          const entries = groupedEntries[type];
          if (!entries?.length) return null;

          const description = getTypeDescription(type);

          return (
            <Box key={type} sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {description} {entries.length === 1 ? 'this' : 'these'} {entries.length > 1 ? getTypePlural(type) : type.toLowerCase()}:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
          );
        })}
      </Box>
    );
  };

  const renderCompactChips = () => {
    if (!action.swotEntries?.length) return null;

    const groupedEntries = action.swotEntries.reduce((acc, entry) => {
      if (!acc[entry.type]) {
        acc[entry.type] = [];
      }
      acc[entry.type].push(entry);
      return acc;
    }, {} as Record<string, SwotEntry[]>);

    return (
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        {SWOT_TYPE_ORDER.map(type => {
          const entries = groupedEntries[type];
          if (!entries?.length) return null;
          
          return (
            <CompactSwotChip
              key={type}
              type={type}
              count={entries.length}
              entries={entries}
              onMouseEnter={() => {
                entries.forEach(entry => {
                  uiStore.setHoveredSwotEntryId(entry._id);
                });
              }}
              onMouseLeave={handleActionMouseEnter}
            />
          );
        })}
      </Box>
    );
  };

  if (isEditing) {
    return (
      <BaseCard 
        accentColor={theme.palette.grey[400]}
        className="action-card"
      >
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
      </BaseCard>
    );
  }

  return (
    <BaseCard
      className="action-card"
      isHighlighted={isHighlighted}
      accentColor={theme.palette.grey[400]}
      onMouseEnter={handleActionMouseEnter}
      onMouseLeave={handleActionMouseLeave}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => setIsExpanded(!isExpanded)}
      sx={{ cursor: 'pointer' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 1
          }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'medium',
                flex: 1,
                mr: 1
              }}
            >
              {action.title}
            </Typography>
            
            <Box sx={{ 
              display: 'flex',
              gap: 0.5,
              alignItems: 'center',
              ml: 'auto'
            }}>
              <IconButton size="small" onClick={(e) => {
                e.stopPropagation();
                onEditStart({ 
                  id: action._id, 
                  title: action.title, 
                  description: action.description,
                  swotEntries: action.swotEntries || []
                })
              }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={(e) => {
                e.stopPropagation();
                onDelete(action)
              }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}>
                {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>
            </Box>
          </Box>

          {isExpanded ? (
            <>
              <Typography 
                variant="body1" 
                sx={{ 
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  mr: 2
                }}
              >
                {action.description}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'block', mt: 1 }}
              >
                Added by {action.createdBy}
              </Typography>
              {renderSwotChips()}
            </>
          ) : (
            renderCompactChips()
          )}
        </Box>
      </Box>
    </BaseCard>
  );
});

export default ActionCard; 