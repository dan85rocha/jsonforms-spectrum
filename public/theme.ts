import { Theme } from '@react-types/provider';
import { defaultTheme } from '@adobe/react-spectrum';
import "./medium.css";

const AppTheme: Theme = {
    ...defaultTheme,
    medium: {
        spectrum: 'spectrum-global',
        ...defaultTheme.medium
    }
};

export default AppTheme;