import React from 'react';
import { Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

const StyledLanguageButton = styled(IconButton)(({ theme }) => ({
  color: '#666',
  '&:hover': {
    color: '#333',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
}));

const languages = [
  {
    code: 'id',
    name: 'Bahasa Indonesia',
    flag: '🇮🇩'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  }
];

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  // Don't render if i18n is not ready
  if (!i18n) {
    return null;
  }
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (languageCode) => {
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(languageCode);
    }
    handleClose();
  };

  const getCurrentLanguage = () => {
    if (!i18n || !i18n.language) return languages[0];
    return languages.find(lang => lang.code === i18n.language) || languages[0];
  };

  return (
    <Box>
      <StyledLanguageButton
        onClick={handleClick}
        size="small"
        aria-label={t('common.changeLanguage') || 'Change language'}
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <LanguageIcon />
      </StyledLanguageButton>
      
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            mt: 1,
            minWidth: 180,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={i18n && i18n.language === language.code}
            sx={{
              fontSize: '0.9rem',
              '&.Mui-selected': {
                backgroundColor: 'rgba(0,0,0,0.08)',
                fontWeight: 500,
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <span style={{ fontSize: '1.2rem' }}>{language.flag}</span>
            </ListItemIcon>
            <ListItemText 
              primary={language.name}
              primaryTypographyProps={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '0.9rem'
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}