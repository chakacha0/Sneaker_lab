// Общие стили для административной панели
export const containerStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "40px 20px",
  background: "#fff",
  minHeight: "100vh",
  display: "flex",
  gap: "30px",
};

export const menuStyle = {
  width: "250px",
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  height: "fit-content",
  border: "1px solid #ddd",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

export const menuTitleStyle = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#FF6B35",
  textShadow: "0 0 10px rgba(255, 107, 53, 0.5)",
  marginBottom: "30px",
  textTransform: "uppercase",
  letterSpacing: "2px",
  borderBottom: "2px solid #FF6B35",
  paddingBottom: "10px",
  fontFamily: "'Fragment Mono', monospace",
};

export const menuItemStyle = {
  padding: "15px 20px",
  marginBottom: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  color: "#333",
  fontSize: "16px",
  fontWeight: "600",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "transparent",
  fontFamily: "'Fragment Mono', monospace",
};

export const activeMenuItemStyle = {
  ...menuItemStyle,
  background: "#FF6B35",
  color: "#fff",
  borderColor: "#FF6B35",
  boxShadow: "0 0 15px rgba(255, 107, 53, 0.3)",
};

export const contentStyle = {
  flex: 1,
  background: "#fff",
  borderRadius: "12px",
  padding: "30px",
  border: "1px solid #ddd",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

export const adminTitleStyle = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#FF6B35",
  textShadow: "0 0 15px rgba(255, 107, 53, 0.6)",
  marginBottom: "10px",
  textTransform: "uppercase",
  letterSpacing: "3px",
  fontFamily: "'Fragment Mono', monospace",
  textAlign: "center",
  padding: "20px",
  background: "linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%)",
  borderRadius: "12px",
  border: "2px solid #FF6B35",
  boxShadow: "0 0 20px rgba(255, 107, 53, 0.3)",
};

export const titleStyle = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#FF6B35",
  textShadow: "0 0 10px rgba(255, 107, 53, 0.5)",
  marginBottom: "30px",
  marginTop: "5px",
  textTransform: "uppercase",
  letterSpacing: "2px",
  borderBottom: "2px solid #FF6B35",
  paddingBottom: "10px",
  fontFamily: "'Fragment Mono', monospace",
};

export const infoItemStyle = {
  marginBottom: "20px",
  padding: "15px",
  background: "#f5f5f5",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

export const labelStyle = {
  fontSize: "12px",
  color: "#FF6B35",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "8px",
  fontWeight: "600",
};

export const valueStyle = {
  fontSize: "16px",
  color: "#333",
  fontWeight: "500",
  fontFamily: "'Fragment Mono', monospace",
};

export const logoutButtonStyle = {
  width: "100%",
  padding: "15px 20px",
  marginTop: "20px",
  borderRadius: "8px",
  cursor: "pointer",
  background: "transparent",
  borderWidth: "2px",
  borderStyle: "solid",
  borderColor: "#FF6B35",
  color: "#FF6B35",
  fontSize: "16px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "1px",
  transition: "all 0.3s ease",
  fontFamily: "'Fragment Mono', monospace",
};

export const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10000,
};

export const modalContentStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "30px",
  maxWidth: "600px",
  width: "90%",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
};

export const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
};

export const modalTitleStyle = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#FF6B35",
  textTransform: "uppercase",
  letterSpacing: "1px",
  fontFamily: "'Fragment Mono', monospace",
  margin: 0,
};

export const closeButtonStyle = {
  background: "transparent",
  border: "none",
  fontSize: "28px",
  color: "#666",
  cursor: "pointer",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const inputStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "16px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontFamily: "'Fragment Mono', monospace",
  boxSizing: "border-box",
};

export const buttonPrimaryStyle = {
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: "700",
  background: "#FF6B35",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  textTransform: "uppercase",
  letterSpacing: "1px",
  fontFamily: "'Fragment Mono', monospace",
  transition: "all 0.3s ease",
};

export const buttonSecondaryStyle = {
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: "600",
  background: "transparent",
  color: "#666",
  border: "1px solid #ddd",
  borderRadius: "8px",
  cursor: "pointer",
  fontFamily: "'Fragment Mono', monospace",
};

export const buttonDangerStyle = {
  ...buttonPrimaryStyle,
  background: "#dc3545",
};

export const messageSuccessStyle = {
  padding: "12px",
  marginBottom: "20px",
  borderRadius: "8px",
  background: "#d4edda",
  color: "#155724",
  fontSize: "14px",
  fontFamily: "'Fragment Mono', monospace",
};

export const messageErrorStyle = {
  padding: "12px",
  marginBottom: "20px",
  borderRadius: "8px",
  background: "#f8d7da",
  color: "#721c24",
  fontSize: "14px",
  fontFamily: "'Fragment Mono', monospace",
};

export const warningBoxStyle = {
  padding: "15px",
  marginBottom: "20px",
  borderRadius: "8px",
  background: "#fff3cd",
  border: "2px solid #ffc107",
  color: "#856404",
};

export const menuDividerStyle = {
  marginTop: "30px",
  marginBottom: "20px",
  borderTop: "2px solid #ddd",
  paddingTop: "20px",
};

export const customerMenuTitleStyle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#666",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "20px",
  borderBottom: "1px solid #ddd",
  paddingBottom: "10px",
  fontFamily: "'Fragment Mono', monospace",
};