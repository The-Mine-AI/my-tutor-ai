import AdbIcon from '@mui/icons-material/Adb';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react'

interface LogoProps {
    title: string
}

const Logo = ({ title }: LogoProps) => {
    return <Box sx={{ flexGrow: 1, display: { md: 'flex' }, alignItems: "center" }}>
      <AdbIcon sx={{ display: { md: 'flex' }, mr: 4 }} />
      <Typography
        variant="h6"
        noWrap
        component="a"
        href="/"
        sx={{
          mr: 4,
          display: { xs: 'none', md: 'flex' },
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        { title }
      </Typography>
    </Box>;
  }

export default Logo
