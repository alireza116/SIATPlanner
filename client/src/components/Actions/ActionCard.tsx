import { DragEvent, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { Action } from '@/stores/ActionStore';
import { SwotEntry } from '@/stores/SwotStore';
import {SwotChip, CompactSwotChip} from './SwotChip';
import { useStore } from '@/stores/StoreProvider';
import { useTheme } from '@mui/material/styles';
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
  onOpenDetail: () => void;
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
  onOpenDetail
}: ActionCardProps) => {
  const theme = useTheme();
  const { uiStore } = useStore();
  const [isExpanded, setIsExpanded] = useState(true);
  // const [isHovered, setIsHovered] = useState(false);
  const actionRef = useRef<HTMLDivElement | null>(null);

  const handleActionMouseEnter = () => {
    // setIsHovered(true);
    uiStore.setHoveredActionId(action._id, action.swotEntries?.map(entry => entry._id) || []);
  };

  const handleActionMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget as Node | null;
    // const currentTarget = event.currentTarget;

    if (!actionRef.current || !relatedTarget) {
      // setIsHovered(false);
      uiStore.clearHoveredIds();
      return;
    }

    if (!(relatedTarget instanceof Node)) {
      // setIsHovered(false);
      uiStore.clearHoveredIds();
      return;
    }

    if (!actionRef.current.contains(relatedTarget)) {
      // setIsHovered(false);
      uiStore.clearHoveredIds();
    }
  };

  const handleSwotChipMouseEnter = (entryId: string) => {
    uiStore.setHoveredSwotEntryId(entryId);
  };

  const handleSwotChipMouseLeave = () => {
    handleActionMouseEnter(); // Revert to showing all entries for this action
  };

  const handleCompactChipMouseEnter = (entries: SwotEntry[]) => {
    uiStore.setHoveredSwotEntryIds(entries.map(entry => entry._id));
  };

  const handleCompactChipMouseLeave = () => {
    handleActionMouseEnter(); // Revert to showing all entries for this action
  };

  const handleClick = (e: React.MouseEvent) => {
    // If clicking on a button or chip, don't toggle expansion
    if (
      e.target instanceof Element && 
      (e.target.closest('button') || e.target.closest('.MuiChip-root'))
    ) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent expansion toggle
    onOpenDetail();
  };

  const renderSwotChips = () => {
    if (!action.swotEntries?.length) return  <Typography sx={{ mt:2 }} variant="body2" color="text.secondary">Drag and drop a SWOT cards here</Typography>;

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
                    onMouseEnter={handleSwotChipMouseEnter}
                    onMouseLeave={handleSwotChipMouseLeave}
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
              // entries={entries} 
              onMouseEnter={() => handleCompactChipMouseEnter(entries)}
              onMouseLeave={handleCompactChipMouseLeave}
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
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" onClick={onEditCancel}>Cancel</Button>
            <Button size="small" variant="contained" onClick={onEditSave}>Save</Button>
          </Box>

      </BaseCard>
    );
  }

  return (
    <BaseCard
      ref={actionRef}
      onClick={handleClick}
      onMouseEnter={handleActionMouseEnter}
      onMouseLeave={handleActionMouseLeave}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2
        }
      }}
    >

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

        {!isExpanded && renderCompactChips()}

        {isExpanded && (
          <>
            <Typography 
              variant="body1" 
              sx={{ 
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                mr: 2,
                mb: 1.5
              }}
            >
              {action.description}
            </Typography>
            <hr />
            {renderSwotChips()}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 1.5
            }}>
              <Typography 
                variant="caption" 
                color="text.secondary"
              >
                Added by {action.createdBy}
              </Typography>
              <Button
                color="inherit"
                onClick={handleDetailClick}
                startIcon={<OpenInFullIcon />}
                size="small"
              >
                Details
              </Button>
            </Box>
          </>
        )}

    </BaseCard>
  );
});

export default ActionCard; 