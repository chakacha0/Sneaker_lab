function Fut() {

    const footerStyle = {
        marginTop: "auto",       // прижимает футер вниз при flex-верстке
        padding: "30px 20px",
        backgroundColor: "#111",
        color: "#fff",
        textAlign: "center",
        fontFamily: "'Archivo Black', sans-serif",
        boxShadow: "0 -2px 6px rgba(0,0,0,0.2)", // лёгкая тень сверху
    };

    const footerTopStyle = {
        marginBottom: "15px",
    };

    const brandStyle = {
        fontSize: "20px",
        fontWeight: "700",
        letterSpacing: "1px",
        display: "block",
    };

    const sloganStyle = {
        fontSize: "14px",
        color: "#aaa",
    };

    const footerLinksStyle = {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "20px",
        margin: "20px 0",
    };

    const footerLinkStyle = {
        color: "#ff661fff",
        textDecoration: "none",
        fontSize: "14px",
        transition: "color 0.3s",
    };

    const footerBottomStyle = {
        fontSize: "12px",
        color: "#777",
    };

    const copyrightStyle = {
        display: "block",
        marginTop: "10px",
    };

    return (
        <footer style={footerStyle}>
            <div style={footerTopStyle}>
                <span style={brandStyle}>SNEAKER LAB</span>
                <span style={sloganStyle}>Твоя пара — твой стиль</span>
            </div>

            <div style={footerLinksStyle}>
                <a href="tel:+375291112233" style={footerLinkStyle}>📞 +375 29 111 22 33</a>
                <a href="mailto:info@sneakerLab.by" style={footerLinkStyle}>✉️ info@sneakerLab.by</a>
                <a href="https://instagram.com/sneakerLab" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>📸 Instagram</a>
                <a href="https://t.me/sneakerLab" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>💬 Telegram</a>
            </div>

            <div style={footerBottomStyle}>
                <span style={copyrightStyle}>
                    © 2025 Sneaker Lab. Все права защищены.
                </span>
            </div>
        </footer>
    );
}

export default Fut;
