import type { ReactNode } from "react";

export default function Card({ title, children, actions }: { title?: string; children: ReactNode; actions?: ReactNode; }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      {(title || actions) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <div>{actions}</div>
        </div>
      )}
      {children}
    </div>
  );
}


