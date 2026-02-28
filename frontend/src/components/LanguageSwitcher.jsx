import React from 'react';
import { Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

const StyledLanguageButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.wedding?.navy || '#2C3E6B',
  '&:hover': {
    color: theme.palette.wedding?.navyLight || '#4A5E8B',
    backgroundColor: 'rgba(44, 62, 107, 0.06)',
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '8px',
    marginTop: theme.spacing(1),
    minWidth: 180,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    backgroundColor: theme.palette.wedding?.warmWhite || '#FBF7F0',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '0.9rem',
  '&.Mui-selected': {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    fontWeight: 500,
    borderLeft: `3px solid ${theme.palette.wedding?.gold || '#C9A96E'}`,
  },
  '&.Mui-selected:hover': {
    backgroundColor: 'rgba(201, 169, 110, 0.25)',
  },
}));

const FlagIcon = styled('span')({
  fontSize: '1.2rem',
});

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
      
      <StyledMenu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        {languages.map((language) => (
          <StyledMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={i18n && i18n.language === language.code}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <FlagIcon>{language.flag}</FlagIcon>
            </ListItemIcon>
            <ListItemText 
              primary={language.name}
              primaryTypographyProps={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.9rem'
              }}
            />
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </Box>
  );
}
