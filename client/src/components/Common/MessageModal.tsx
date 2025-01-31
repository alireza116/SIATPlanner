import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface MessageModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'info' | 'warning' | 'error';
}

const MessageModal = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  severity = 'info',
}: MessageModalProps) => {
  const getColor = () => {
    switch (severity) {
      case 'warning':
        return 'warning.main';
      case 'error':
        return 'error.main';
      default:
        return 'primary.main';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="message-modal-title"
      aria-describedby="message-modal-description"
    >
      <DialogTitle 
        id="message-modal-title"
        sx={{ color: getColor() }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="message-modal-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelLabel}</Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={severity === 'error' ? 'error' : 'primary'}
          autoFocus
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageModal; 