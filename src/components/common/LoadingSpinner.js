import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = '#FF9933', text = 'Loading...' }) => {
    
    const getSize = () => {
        switch(size) {
            case 'small':
                return {
                    spinner: '20px',
                    container: '30px',
                    fontSize: '12px'
                };
            case 'large':
                return {
                    spinner: '50px',
                    container: '80px',
                    fontSize: '18px'
                };
            default: // medium
                return {
                    spinner: '35px',
                    container: '60px',
                    fontSize: '14px'
                };
        }
    };

    const dimensions = getSize();

    return (
        <div style={styles.container}>
            <div style={styles.spinnerContainer}>
                <div style={{
                    ...styles.spinner,
                    width: dimensions.spinner,
                    height: dimensions.spinner,
                    borderTopColor: color,
                    borderLeftColor: color
                }}></div>
            </div>
            {text && <p style={{...styles.text, fontSize: dimensions.fontSize}}>{text}</p>}
        </div>
    );
};

// Full page loader
export const FullPageLoader = ({ text = 'Loading...' }) => {
    return (
        <div style={styles.fullPage}>
            <LoadingSpinner size="large" text={text} />
        </div>
    );
};

// Inline loader for buttons
export const ButtonLoader = ({ color = 'white' }) => {
    return (
        <div style={styles.buttonLoader}>
            <div style={{
                ...styles.buttonSpinner,
                borderTopColor: color,
                borderLeftColor: color
            }}></div>
        </div>
    );
};

// Skeleton loader for content
export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
    
    const renderSkeleton = () => {
        switch(type) {
            case 'card':
                return (
                    <div style={styles.skeletonCard}>
                        <div style={styles.skeletonImage}></div>
                        <div style={styles.skeletonLine}></div>
                        <div style={styles.skeletonLine}></div>
                        <div style={{...styles.skeletonLine, width: '60%'}}></div>
                    </div>
                );
            case 'text':
                return (
                    <div style={styles.skeletonText}>
                        <div style={styles.skeletonLine}></div>
                        <div style={styles.skeletonLine}></div>
                        <div style={{...styles.skeletonLine, width: '80%'}}></div>
                    </div>
                );
            case 'table':
                return (
                    <div style={styles.skeletonTable}>
                        <div style={styles.skeletonTableHeader}></div>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} style={styles.skeletonTableRow}></div>
                        ))}
                    </div>
                );
            default:
                return <div style={styles.skeletonLine}></div>;
        }
    };

    return (
        <div style={styles.skeletonContainer}>
            {[...Array(count)].map((_, i) => (
                <div key={i}>{renderSkeleton()}</div>
            ))}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    },
    spinnerContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    spinner: {
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #FF9933',
        borderLeft: '3px solid #FF9933',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    text: {
        marginTop: '15px',
        color: '#666',
        fontSize: '14px'
    },
    fullPage: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255,255,255,0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
    },
    buttonLoader: {
        display: 'inline-block',
        marginLeft: '8px'
    },
    buttonSpinner: {
        width: '16px',
        height: '16px',
        border: '2px solid rgba(255,255,255,0.3)',
        borderTop: '2px solid white',
        borderLeft: '2px solid white',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
    },
    skeletonContainer: {
        width: '100%'
    },
    skeletonCard: {
        background: 'white',
        borderRadius: '10px',
        padding: '15px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '15px'
    },
    skeletonImage: {
        width: '100%',
        height: '150px',
        background: '#f0f0f0',
        borderRadius: '8px',
        marginBottom: '15px',
        animation: 'pulse 1.5s infinite'
    },
    skeletonLine: {
        height: '12px',
        background: '#f0f0f0',
        borderRadius: '6px',
        marginBottom: '10px',
        animation: 'pulse 1.5s infinite'
    },
    skeletonText: {
        padding: '10px'
    },
    skeletonTable: {
        width: '100%'
    },
    skeletonTableHeader: {
        height: '40px',
        background: '#f0f0f0',
        borderRadius: '5px',
        marginBottom: '10px',
        animation: 'pulse 1.5s infinite'
    },
    skeletonTableRow: {
        height: '30px',
        background: '#f0f0f0',
        borderRadius: '3px',
        marginBottom: '8px',
        animation: 'pulse 1.5s infinite'
    }
};

// Add global animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
    }
`;
document.head.appendChild(styleSheet);

export default LoadingSpinner;