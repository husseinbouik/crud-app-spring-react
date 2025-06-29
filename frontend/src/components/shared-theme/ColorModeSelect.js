import React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from './AppTheme';

function ColorModeSelect(props) {
    const { mode, toggleColorMode } = useColorMode();

    return (
        <IconButton onClick={toggleColorMode} color="inherit" {...props}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
    );
}

export default ColorModeSelect;