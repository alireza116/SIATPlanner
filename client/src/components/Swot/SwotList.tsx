import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/stores/StoreProvider';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SwotCard from './SwotCard';
import { getSwotColor } from '@/theme/swotTheme';
import { useTheme } from '@mui/material/styles';
import MessageModal from '@/components/Common/MessageModal';


interface SwotEntry {
  _id: string;
  type: 'Strength' | 'Weakness' | 'Opportunity' | 'Threat';
  description: string;
  createdBy: string;
}

interface SwotListProps {
  category: 'Strength' | 'Weakness' | 'Opportunity' | 'Threat';
  displayText: string;
  subtitle: string;
  issueId: string;
  entries: SwotEntry[];
  highlightedEntryId?: string | null;
  headerColor?: string;
}

const SwotList = observer(({ 
  category, 
  displayText, 
  subtitle, 
  issueId, 
  entries,
  headerColor
}: SwotListProps) => {
  const { swotStore, uiStore } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [editingEntry, setEditingEntry] = useState<{ id: string; description: string } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; description: string } | null>(null);
  const theme = useTheme();

  const handleAdd = async () => {
    if (!newEntry.trim()) return;
    try {
      await swotStore.createSwotEntry({
        issueId,
        type: category,
        description: newEntry,
        createdBy: 'User'
      });
      setNewEntry('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add SWOT entry:', error);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editingEntry || !editingEntry.description.trim()) return;
    try {
      await swotStore.updateSwotEntry(id, {
        description: editingEntry.description
      });
      setEditingEntry(null);
    } catch (error) {
      console.error('Failed to update SWOT entry:', error);
    }
  };

  const handleDeleteClick = (entry: SwotEntry) => {
    setDeleteConfirmation({
      id: entry._id,
      description: entry.description
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation) return;
    
    try {
      await swotStore.deleteSwotEntry(deleteConfirmation.id);
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Failed to delete SWOT entry:', error);
    }
  };

  return (
    <Box sx={{ 
      height: { xs: 'auto', md: '100%' }, 
      display: 'flex', 
      flexDirection: 'column',
      mb: { xs: 2, md: 2 },
      flexGrow: 1
    }}>
      <Box
        sx={{
          p: 2,
          backgroundColor: headerColor || getSwotColor(category, theme).light,
          color: theme.palette.getContrastText(headerColor || getSwotColor(category, theme).light),
          borderRadius: 1,
          mb: 2,
          opacity: 1,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">{displayText}</Typography>
            <Typography variant="caption">{subtitle}</Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={() => setIsAdding(true)}
            sx={{ color: 'white' }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {isAdding && (
            <Card 
              variant="outlined"
              sx={{ 
                width: '100%',
                '&:hover': {
                  boxShadow: 1,
                  transition: 'box-shadow 0.2s'
                }
              }}
            >
              <CardContent>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={Infinity}
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  placeholder={`Add new ${displayText}`}
                  size="small"
                  variant="standard"
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Added by User
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" onClick={() => setIsAdding(false)}>Cancel</Button>
                    <Button size="small" variant="contained" onClick={handleAdd}>Add</Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {entries.map((entry) => (
            <SwotCard
              key={entry._id}
              entry={entry}
              category={category}
              isEditing={editingEntry?.id === entry._id}
              editingEntry={editingEntry}
              isHighlighted={uiStore.isSwotEntryHighlighted(entry._id)}
              onEditStart={setEditingEntry}
              onEditCancel={() => setEditingEntry(null)}
              onEditSave={() => handleEdit(editingEntry?.id!)}
              onDelete={handleDeleteClick}
              onEditChange={(description) => setEditingEntry({ 
                ...editingEntry!, 
                description 
              })}
            />
          ))}
        </Box>
      </Box>

      <MessageModal
        open={deleteConfirmation !== null}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this ${category.toLowerCase()}?${
          deleteConfirmation
            ? `\n\n"${deleteConfirmation.description.slice(0, 100)}${
                deleteConfirmation.description.length > 100 ? '...' : ''
              }"`
            : ''
        }`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmation(null)}
        severity="warning"
      />
    </Box>
  );
});

export default SwotList;
