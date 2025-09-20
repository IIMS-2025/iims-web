import { ResponsiveContainer, ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Line } from "recharts";
import { colors } from "../styles/colors";

const data = [
  { name: "Mon", revenue: 420, wastage: 20, forecast: 400 },
  { name: "Tue", revenue: 560, wastage: 18, forecast: 520 },
  { name: "Wed", revenue: 510, wastage: 14, forecast: 530 },
  { name: "Thu", revenue: 610, wastage: 22, forecast: 600 },
  { name: "Fri", revenue: 740, wastage: 25, forecast: 720 },
  { name: "Sat", revenue: 960, wastage: 33, forecast: 900 },
  { name: "Sun", revenue: 880, wastage: 27, forecast: 860 },
];

export default function AnalyticsPage() {
  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>Sales vs Forecast & Wastage</h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <ComposedChart data={data}>
            <CartesianGrid stroke={colors.border} />
            <XAxis dataKey="name" stroke={colors.textMuted} />
            <YAxis stroke={colors.textMuted} />
            <Tooltip />
            <Area type="monotone" dataKey="forecast" fill={colors.primary} stroke={colors.primary} opacity={0.2} />
            <Bar dataKey="revenue" barSize={18} fill={colors.success} radius={[6,6,0,0]} />
            <Line type="monotone" dataKey="wastage" stroke={colors.danger} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


