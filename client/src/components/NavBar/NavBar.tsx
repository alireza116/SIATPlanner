import { usePathname } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/stores/StoreProvider';
import {
  AppBar,
  Toolbar,
  Typography,
  Breadcrumbs,
  Box,
} from '@mui/material';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const NavBar = observer(() => {
  const pathname = usePathname();
  const { issueStore } = useStore();
  
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    // Home
    breadcrumbs.push({
      label: <HomeIcon sx={{ fontSize: 20 }} />,
      href: '/',
    });

    // Issues section
    if (paths[0] === 'issues') {
      if (paths.length === 1) {
        breadcrumbs.push({
          label: 'Issues',
          href: '/issues',
        });
      } else if (paths.length > 1) {
        breadcrumbs.push({
          label: 'Issues',
          href: '/issues',
        });
        
        // Issue detail
        if (issueStore.currentIssue && paths[2] === 'swot') {
          breadcrumbs.push({
            label: issueStore.currentIssue.title,
            href: `/issues/${paths[1]}/swot`,
          });
        }
      }
    }

    return breadcrumbs;
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box sx={{ flex: 1 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            {getBreadcrumbs().map((crumb) => (
              <Link key={crumb.href} href={crumb.href} passHref>
                <Typography
                  component="span"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.primary',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {crumb.label}
                </Typography>
              </Link>
            ))}
          </Breadcrumbs>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default NavBar; 