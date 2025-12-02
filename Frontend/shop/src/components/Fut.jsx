function Fut() {

    const footerStyle = {
        marginTop: "60px",
        width: "100%",
        padding: "20px 40px",
        backgroundColor: "#fff",
        color: "#333",
        textAlign: "center",
        fontFamily: "'Fragment Mono', monospace",
        boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
        borderTop: "2px solid #FF6B35",
    };



    const footerTopStyle = {
        marginBottom: "15px",
    };

    const brandStyle = {
        fontFamily: "'Unbounded', sans-serif",
        fontSize: "24px",
        fontWeight: "900",
        letterSpacing: "2px",
        display: "block",
        color: "#FF6B35",
        textShadow: "0 0 10px rgba(255, 107, 53, 0.5)",
        marginBottom: "8px",
        textTransform: "uppercase",
    };

    const sloganStyle = {
        fontSize: "14px",
        color: "#666",
        letterSpacing: "1px",
        fontFamily: "'Google Sans Flex', sans-serif",
    };

    const footerLinksStyle = {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "20px",
        margin: "20px 0",
    };

    const footerLinkStyle = {
        color: "#FF6B35",
        textDecoration: "none",
        fontSize: "14px",
        transition: "all 0.3s ease",
        fontWeight: "600",
        fontFamily: "'Google Sans Flex', sans-serif",
    };

    const footerBottomStyle = {
        fontSize: "12px",
        color: "#666",
        fontFamily: "'Google Sans Flex', sans-serif",
    };

    const copyrightStyle = {
        display: "block",
        marginTop: "10px",
    };

    return (
        <footer style={footerStyle}>
            <div style={footerTopStyle}>
                <span style={brandStyle}>SNEAKER LAB</span>
                <span style={sloganStyle}>Your pair — your style</span>
            </div>

            <div style={footerLinksStyle}>
                <a href="tel:+375291112233" style={footerLinkStyle}>📞 +375 29 111 22 33</a>
                <a href="mailto:info@sneakerLab.by" style={footerLinkStyle}>✉️ info@sneakerLab.by</a>
                <a href="https://instagram.com/sneakerLab" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>📸 Instagram</a>
                <a href="https://t.me/sneakerLab" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>💬 Telegram</a>
            </div>

            <div style={footerBottomStyle}>
                <span style={copyrightStyle}>
                    © 2025 Sneaker Lab. All rights reserved.
                </span>
            </div>
        </footer>
    );
}

export default Fut;
