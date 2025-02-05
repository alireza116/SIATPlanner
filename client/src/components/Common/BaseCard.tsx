import { Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/material/styles';
import { forwardRef } from 'react';

interface BaseCardProps {
  children: React.ReactNode;
  isHighlighted?: boolean;
  accentColor?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  sx?: SxProps<Theme>;
  ref?: React.RefObject<HTMLDivElement>;
}

const BaseCard = forwardRef<HTMLDivElement, BaseCardProps>(({
  children,
  isHighlighted,
  accentColor,
  onClick,
  className,
  onMouseEnter,
  onMouseLeave,
  onDragOver,
  onDragLeave,
  onDrop,
  draggable,
  onDragStart,
}, ref) => {
  const theme = useTheme();

  return (
    <Card
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      draggable={draggable}
      onDragStart={onDragStart}
      sx={{
        borderLeft: 3,
        borderColor: accentColor || 'primary.main',
        backgroundColor: isHighlighted 
          ? alpha(accentColor || theme.palette.primary.main, 0.08)
          : 'background.paper',
        transition: 'background-color 0.2s ease',
        cursor: onClick ? 'pointer' : draggable ? 'grab' : 'default',
      }}
    >
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
});

BaseCard.displayName = 'BaseCard';

export default BaseCard; 