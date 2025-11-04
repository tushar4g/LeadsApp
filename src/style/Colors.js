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

    card1:'#CEE8F1',
    card2:'#FBECDD',
    card3:'#D1F9E7',
    card4:'#FFE7F7',
    card5: '#F4E6FF',
    card6: '#E6E6FA',
    card7: '#DDFFFC',
    card8: '#8fe4f1',
    card9: '#7eff9cff',
    card11:'#e2f3f9ff',

};

Colors.primaryWithOpacity = hexToRgba(Colors.primary, 0.3);
Colors.profileOpacity = hexToRgba(Colors.primary, 0.5);
Colors.secondaryWithOpacity = hexToRgba(Colors.secondary, 0.3);
Colors.successWithOpacity = hexToRgba(Colors.success, 0.3);
Colors.blackWithOpacity = hexToRgba(Colors.black, 0.7);

Colors.primaryDropDownOpacity= hexToRgba(Colors.primary, 0.8)

export default Colors;