
import { useAuth } from '../contexts/AuthContext';
import { Tooltip } from 'antd';

const RoleGuard = ({ 
  children, 
  permission, 
  fallback = null, 
  showTooltip = false,
  tooltipTitle = "Bu işlem için yetkiniz bulunmamaktadır."
}) => {
  const { hasPermission } = useAuth();

  const hasAccess = permission ? hasPermission(permission) : true;

  if (!hasAccess) {
    if (showTooltip) {
      return (
        <Tooltip title={tooltipTitle}>
          <span style={{ cursor: 'not-allowed', opacity: 0.5 }}>
            {children}
          </span>
        </Tooltip>
      );
    }
    return fallback;
  }

  return children;
};

export default RoleGuard;
