import { Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';

interface MobileTabsProps {
  children: React.ReactNode[];
  labels: string[];
}

export default function MobileTabs({ children, labels }: MobileTabsProps) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange}
          variant="fullWidth"
          aria-label="content tabs"
        >
          {labels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Box>
      {children.map((child, index) => (
        <Box
          key={index}
          role="tabpanel"
          hidden={value !== index}
          sx={{ 
            p: 2,
            display: value !== index ? 'none' : 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            overflow: 'hidden'
          }}
        >
          {child}
        </Box>
      ))}
    </Box>
  );
} 