import React, { useState, createContext, useContext, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { deepPurple, green } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';

const ColorModeContext = createContext({
    toggleColorMode: () => { },
    mode: 'light',
});

export const useColorMode = () => useContext(ColorModeContext);

function AppTheme({ children }) {
    const [mode, setMode] = useState('light');

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
            mode,
        }),
        [mode],
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? {
                            // palette values for light mode
                            primary: deepPurple,
                            secondary: green,
                            background: {
                                default: '#f0f2f5', // Light grey for general background
                                paper: '#ffffff',   // White for cards and paper elements
                            },
                            text: {
                                primary: 'rgba(0, 0, 0, 0.87)',
                                secondary: 'rgba(0, 0, 0, 0.6)',
                            },
                        }
                        : {
                            // palette values for dark mode
                            primary: deepPurple,
                            secondary: green,
                            background: {
                                default: '#121212', // Dark grey for general background
                                paper: '#1e1e1e',   // Slightly lighter dark grey for paper elements
                            },
                            text: {
                                primary: '#fff',
                                secondary: 'rgba(255, 255, 255, 0.7)',
                            },
                        }),
                },
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default AppTheme;