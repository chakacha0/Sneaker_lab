import React, { useState } from "react";
import { titleStyle, labelStyle } from "./adminStyles";
import { buildApiUrl } from "../../config/api.js";

export default function AdminReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      let url = `${buildApiUrl('orders/reports/sales')}?`;
      if (startDate) url += `start_date=${startDate}&`;
      if (endDate) url += `end_date=${endDate}&`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Ошибка получения статистики");
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      alert(error.message || "Ошибка получения статистики");
    } finally {
      setLoading(false);
    }
  };

  const generateExcelReport = async () => {
    setIsGenerating(true);
    try {
      let url = `${buildApiUrl('orders/reports/sales/excel')}?`;
      if (startDate) url += `start_date=${startDate}&`;
      if (endDate) url += `end_date=${endDate}&`;
      
      // Убираем последний & если он есть
      if (url.endsWith("&")) {
        url = url.slice(0, -1);
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        // Пытаемся получить детальное сообщение об ошибке
        let errorMessage = "Ошибка генерации отчета";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      // Проверяем, что это действительно Excel файл
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("spreadsheet")) {
        throw new Error("Сервер вернул неверный тип файла");
      }
      
      // Получаем blob и создаем ссылку для скачивания
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error("Получен пустой файл");
      }
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `sales_report_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      // Показываем сообщение об успехе
      alert("Отчет успешно сгенерирован и скачан!");
    } catch (error) {
      console.error("Ошибка генерации отчета:", error);
      alert(error.message || "Ошибка генерации отчета. Проверьте консоль для деталей.");
    } finally {
      setIsGenerating(false);
    }
  };

  const containerStyle = {
    padding: "20px",
  };

  const formStyle = {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    alignItems: "flex-end",
    flexWrap: "wrap",
  };

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  };

  const inputStyle = {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const buttonStyle = {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    background: "#FF6B35",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const statsCardStyle = {
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #ddd",
  };

  const statRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  };

  const statLabelStyle = {
    fontSize: "16px",
    color: "#666",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  const statValueStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#FF6B35",
    fontFamily: "'Google Sans Flex', sans-serif",
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Sales Reports</h2>

      {/* Форма фильтров */}
      <div style={formStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={inputStyle}
          />
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.background = "#FF8C42";
              e.target.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.background = "#FF6B35";
              e.target.style.transform = "translateY(0)";
            }
          }}
        >
          {loading ? "Loading..." : "View Statistics"}
        </button>
        <button
          onClick={generateExcelReport}
          disabled={isGenerating}
          style={{
            ...buttonStyle,
            opacity: isGenerating ? 0.6 : 1,
            cursor: isGenerating ? "not-allowed" : "pointer",
            background: "#28a745",
          }}
          onMouseEnter={(e) => {
            if (!isGenerating) {
              e.target.style.background = "#34ce57";
              e.target.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isGenerating) {
              e.target.style.background = "#28a745";
              e.target.style.transform = "translateY(0)";
            }
          }}
        >
          {isGenerating ? "Generating..." : "Generate Excel Report"}
        </button>
      </div>

      {/* Статистика */}
      {stats && (
        <div style={statsCardStyle}>
          <h3 style={{ marginBottom: "20px", fontFamily: "'Google Sans Flex', sans-serif" }}>
            Sales Statistics
          </h3>
          <div style={statRowStyle}>
            <span style={statLabelStyle}>Total Orders:</span>
            <span style={statValueStyle}>{stats.total_orders}</span>
          </div>
          <div style={statRowStyle}>
            <span style={statLabelStyle}>Total Items Sold:</span>
            <span style={statValueStyle}>{stats.total_items_sold}</span>
          </div>
          <div style={statRowStyle}>
            <span style={statLabelStyle}>Total Revenue:</span>
            <span style={statValueStyle}>{stats.total_revenue.toFixed(2)} $</span>
          </div>
        </div>
      )}

      {!stats && !loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666", fontFamily: "'Google Sans Flex', sans-serif" }}>
          <p>Select date range and click "View Statistics" to see sales data</p>
          <p style={{ marginTop: "10px", fontSize: "14px" }}>
            Or click "Generate Excel Report" to download a full report
          </p>
        </div>
      )}
    </div>
  );
}

