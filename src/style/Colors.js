const hexToRgba = (hex, opacity) => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const Colors = {
    primary: '#6366F1',
    secondary: '#ff5252',
    
    textPrimary: '#222222',
    textSecondary: '#555555',
    textTertiary: '#888888',
    white: '#ffffff',
    black: '#000000',
    
    success: '#34c759',
    warning: '#f7b731',
    info: '#2d98da',
    purple: '#a259ff',
    orange: '#fd9644',
    gray: '#888888',
    background: '#f7f7f7',
    lightBackground: '#f7f7f7',

    deleteButton: '#ff0000',
    lightPrimary: '#E9EAFE',

};

Colors.primaryWithOpacity = hexToRgba(Colors.primary, 0.3);
Colors.secondaryWithOpacity = hexToRgba(Colors.secondary, 0.3);
Colors.successWithOpacity = hexToRgba(Colors.success, 0.3);
Colors.blackWithOpacity = hexToRgba(Colors.black, 0.7);

Colors.primaryDropDownOpacity= hexToRgba(Colors.primary, 0.8)

export default Colors;