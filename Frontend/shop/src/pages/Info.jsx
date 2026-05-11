import React, { useState } from "react";
import { EU_FOOT_LENGTH_CM } from "../utils/shoeSizeChart";

const SIZING_IMAGE_BASE = "/images/sizing";

function SizingFigure({ fileName, caption }) {
  const src = `${SIZING_IMAGE_BASE}/${fileName}`;
  const [visible, setVisible] = useState(true);

  return (
    <figure
      style={{
        margin: "24px 0",
        maxWidth: "640px",
      }}
    >
      {visible ? (
        <img
          src={src}
          alt={caption}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: "12px",
            border: "1px solid #eee",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
          onError={() => setVisible(false)}
        />
      ) : null}
      <figcaption
        style={{
          marginTop: "10px",
          fontSize: "14px",
          color: "#666",
          fontFamily: "'Google Sans Flex', sans-serif",
          lineHeight: 1.5,
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

function Info() {
  const pageStyle = {
    fontFamily: "'Google Sans Flex', sans-serif",
    padding: "24px 40px 48px",
    color: "#333",
    maxWidth: "800px",
    margin: "0 auto",
    boxSizing: "border-box",
  };

  const h1Style = {
    fontFamily: "'Unbounded', sans-serif",
    fontSize: "28px",
    fontWeight: "700",
    color: "#FF6B35",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "12px",
    lineHeight: 1.2,
  };

  const leadStyle = {
    fontSize: "17px",
    color: "#555",
    lineHeight: 1.6,
    marginBottom: "28px",
  };

  const h2Style = {
    fontFamily: "'Unbounded', sans-serif",
    fontSize: "18px",
    fontWeight: "700",
    color: "#333",
    marginTop: "32px",
    marginBottom: "14px",
    paddingBottom: "8px",
    borderBottom: "2px solid #FF6B35",
    display: "inline-block",
  };

  const listStyle = {
    paddingLeft: "22px",
    lineHeight: 1.75,
    fontSize: "16px",
    marginBottom: "16px",
  };

  const noteStyle = {
    background: "rgba(255, 107, 53, 0.08)",
    borderLeft: "4px solid #FF6B35",
    padding: "14px 18px",
    marginTop: "20px",
    fontSize: "15px",
    lineHeight: 1.65,
    color: "#444",
    borderRadius: "0 8px 8px 0",
  };

  const tableWrapStyle = {
    overflowX: "auto",
    marginTop: "16px",
    borderRadius: "12px",
    border: "1px solid #e8e8e8",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "15px",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const thStyle = {
    textAlign: "left",
    padding: "12px 16px",
    background: "#fff5f0",
    color: "#FF6B35",
    fontWeight: "700",
    borderBottom: "2px solid #FF6B35",
    fontFamily: "'Unbounded', sans-serif",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const tdStyle = {
    padding: "11px 16px",
    borderBottom: "1px solid #eee",
  };

  return (
    <div style={pageStyle}>
      <h1 style={h1Style}>Size guide</h1>
      <p style={leadStyle}>
        Sneaker Lab lists sizes in <strong>EU</strong> on each product. Use this page to
        measure your foot in centimetres and match it to the EU size you should order.
      </p>

      <h2 style={h2Style}>How to measure your foot length</h2>
      <p style={{ fontSize: "16px", lineHeight: 1.7, marginBottom: "12px" }}>
        Measure at the end of the day, when feet are slightly swollen (same as when you
        try shoes in a store). Wear the type of socks you plan to wear with the sneakers.
      </p>
      <ol style={listStyle}>
        <li>
          Place a blank sheet of paper on a hard floor (not carpet), flush against a wall.
        </li>
        <li>
          Stand on the paper with your heel lightly touching the wall. Keep your weight on
          both feet, standing straight.
        </li>
        <li>
          Ask someone to mark the paper at the tip of your <strong>longest toe</strong>{" "}
          (this is not always the big toe). If you measure alone, bend slightly and mark
          carefully without shifting your foot.
        </li>
        <li>
          Step off and use a ruler to measure the distance from the edge of the paper that
          was at the wall (heel line) to the toe mark, in centimetres. Measure to the nearest
          millimetre (for example, 24.6&nbsp;cm).
        </li>
        <li>
          Repeat for the other foot. If one foot is longer, use that measurement when
          choosing a size.
        </li>
      </ol>

      <SizingFigure
        fileName="step1.png"
        caption="Figure 1: Heel against the wall, foot flat on paper — ready to mark the longest toe."
      />

      <SizingFigure
        fileName="step2.png"
        caption="Figure 2: Mark the longest toe with a pencil."
      />

      <SizingFigure
        fileName="step3.png"
        caption="Figure 3: Measure the straight-line distance from the heel edge to the toe mark in cm."
      />

      <div style={noteStyle}>
        <strong>Comfort tip:</strong> Sneakers usually feel best with roughly{" "}
        <strong>0.5–1&nbsp;cm</strong> of space in front of your longest toe. If your foot
        length sits between two rows in the table, choose the larger EU size, especially if
        you have a wide foot or prefer thicker socks.
      </div>

      <h2 style={h2Style}>EU size and foot length (cm)</h2>
      <p style={{ fontSize: "16px", lineHeight: 1.65, marginBottom: "8px" }}>
        The <strong>Foot length</strong> column is the approximate maximum foot length that
        typically fits that EU size on our site. Match your longer foot to this column, then
        read the EU size we show in the catalog.
      </p>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
        Brand and model shape can vary slightly; this table is a practical guide for
        ordering.
      </p>

      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>EU size (on site)</th>
              <th style={thStyle}>Foot length (cm)</th>
            </tr>
          </thead>
          <tbody>
            {EU_FOOT_LENGTH_CM.map((row) => (
              <tr key={row.eu}>
                <td style={tdStyle}>{row.eu}</td>
                <td style={tdStyle}>{row.cm.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Info;
