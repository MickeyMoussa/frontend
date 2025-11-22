import React from "react";
import AdminLayout from "./AdminLayout.jsx";

export default function ManageAppeals() {
  //hardcoded list of appeals used for demonstration
  const appeals = React.useMemo(
    () => [
      { id: "A102", user: "Ali Ahmed", date: "2025-10-10", reason: "Account suspension", status: "Pending" },
      { id: "A103", user: "Sara Khan", date: "2025-10-09", reason: "Incorrect data flag", status: "Approved" },
      { id: "A104", user: "Yazeed Faris", date: "2025-10-08", reason: "Appeal for late submission", status: "Rejected" },
      { id: "A105", user: "Fatimah Al-Salem", date: "2025-10-07", reason: "Spam report", status: "Pending" },
      { id: "A106", user: "Mohamed Al-Otaibi", date: "2025-10-06", reason: "Copyright dispute", status: "Approved" },
    ],
    []
  );
  const [query, setQuery] = React.useState("");
  //filter appeals by query across id, user and reason
  const filtered = appeals.filter((a) => {
    const q = query.toLowerCase();
    return (
      a.id.toLowerCase().includes(q) ||
      a.user.toLowerCase().includes(q) ||
      a.reason.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout active="manage">
      <h2 style={{ margin: "0 0 16px", fontSize: 24, fontWeight: 700 }}>Manage Appeals</h2>
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          aria-label="Search appeals"
          style={{
            width: "100%",
            maxWidth: 280,
            height: 40,
            border: "1px solid #d1d5db",
            borderRadius: 8,
            padding: "0 12px",
            fontSize: 14,
          }}
        />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            minWidth: 600,
          }}
        >
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              {[
                "Appeal ID",
                "User Name",
                "Submission Date",
                "Reason",
                "Status",
              ].map((title) => (
                <th
                  key={title}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: 16, textAlign: "center", color: "#6b7280", fontSize: 14 }}
                >
                  No appeals found.
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{a.id}</td>
                  <td style={{ padding: "12px" }}>{a.user}</td>
                  <td style={{ padding: "12px" }}>{a.date}</td>
                  <td style={{ padding: "12px" }}>{a.reason}</td>
                  <td style={{ padding: "12px" }}>
                    <StatusBadge status={a.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}


function StatusBadge({ status }) {
  let bg = "#e5e7eb";
  let fg = "#374151";
  if (status === "Pending") {
    bg = "#d1fae5";
    fg = "#065f46";
  } else if (status === "Approved") {
    bg = "#dbeafe";
    fg = "#1e40af";
  } else if (status === "Rejected") {
    bg = "#fee2e2";
    fg = "#b91c1c";
  }
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color: fg,
      }}
    >
      {status}
    </span>
  );
}
