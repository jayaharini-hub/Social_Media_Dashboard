import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function getRandomChange(prev, maxChange = 50) {
  const change = Math.floor(Math.random() * maxChange);
  return Math.random() > 0.5 ? prev + change : Math.max(prev - change, 0);
}

export default function SuperLiveDashboard() {
  const [followers, setFollowers] = useState(1200);
  const [likes, setLikes] = useState(700);
  const [comments, setComments] = useState(150);

  const [followerHistory, setFollowerHistory] = useState([
    { time: "Now", value: 1200 },
  ]);
  const [likesHistory, setLikesHistory] = useState([{ time: "Now", value: 700 }]);
  const [commentsHistory, setCommentsHistory] = useState([
    { time: "Now", value: 150 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFollowers((prev) => {
        const newVal = getRandomChange(prev, 30);
        setFollowerHistory((hist) => {
          const time = new Date().toLocaleTimeString();
          const newHist = [...hist, { time, value: newVal }];
          return newHist.length > 10 ? newHist.slice(-10) : newHist;
        });
        return newVal;
      });
      setLikes((prev) => {
        const newVal = getRandomChange(prev, 40);
        setLikesHistory((hist) => {
          const time = new Date().toLocaleTimeString();
          const newHist = [...hist, { time, value: newVal }];
          return newHist.length > 10 ? newHist.slice(-10) : newHist;
        });
        return newVal;
      });
      setComments((prev) => {
        const newVal = getRandomChange(prev, 20);
        setCommentsHistory((hist) => {
          const time = new Date().toLocaleTimeString();
          const newHist = [...hist, { time, value: newVal }];
          return newHist.length > 10 ? newHist.slice(-10) : newHist;
        });
        return newVal;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const calcChange = (history) => {
    if (history.length < 2) return 0;
    const len = history.length;
    const prev = history[len - 2].value;
    const curr = history[len - 1].value;
    return (((curr - prev) / prev) * 100).toFixed(2);
  };

  return (
    <>
      <style>{`
        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        body, #root {
          margin: 0; padding: 0; height: 100vh; width: 100vw; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .app-container {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(-45deg, #3b82f6, #9333ea, #10b981, #f97316);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem;
          color: white;
        }
        .title {
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          margin-bottom: 2rem;
          text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
          user-select: none;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
          width: 100%;
          max-width: 1200px;
          margin-bottom: 3rem;
        }
        .metric-card {
          background: rgba(255 255 255 / 0.15);
          border-radius: 1rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255 255 255 / 0.18);
          padding: 2rem 1.5rem;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          user-select: none;
        }
        .metric-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
        .metric-name {
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
          text-shadow: 0 0 5px rgba(0,0,0,0.15);
        }
        .metric-value {
          font-size: 4rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          margin-bottom: 0.3rem;
          text-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        .metric-change {
          font-weight: 600;
          font-size: 1.2rem;
          display: inline-flex;
          align-items: center;
          user-select: text;
          animation: pulse 2s infinite;
        }
        .metric-change.positive {
          color: #4ade80; /* green */
          text-shadow: 0 0 8px #4ade80;
        }
        .metric-change.negative {
          color: #f87171; /* red */
          text-shadow: 0 0 8px #f87171;
        }
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
          }
        }
        .charts-container {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          width: 100%;
          max-width: 1200px;
          justify-content: center;
        }
        .chart-box {
          background: rgba(255 255 255 / 0.2);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          flex: 1 1 500px;
          min-width: 350px;
          color: #111;
          user-select: none;
        }
        .chart-title {
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: white;
          text-shadow: 0 0 5px rgba(0,0,0,0.6);
        }
        /* Tooltip custom style for Recharts */
        .recharts-default-tooltip {
          background: rgba(0, 0, 0, 0.85) !important;
          color: white !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;
          pointer-events: none !important;
          user-select: none !important;
        }
      `}</style>

      <div className="app-container" role="main">
        <h1 className="title">🔥 Google-Level Live Social Dashboard 🔥</h1>

        <div className="metrics-grid" aria-label="Social Media Metrics">
          {[
            { name: "Followers", value: followers, color: "#3b82f6", history: followerHistory },
            { name: "Likes", value: likes, color: "#ec4899", history: likesHistory },
            { name: "Comments", value: comments, color: "#10b981", history: commentsHistory },
          ].map(({ name, value, color, history }) => {
            const change = calcChange(history);
            const positive = change >= 0;
            return (
              <div className="metric-card" key={name} style={{ borderColor: color }}>
                <h2 className="metric-name">{name}</h2>
                <p className="metric-value" style={{ color }}>
                  {value.toLocaleString()}
                </p>
                <p
                  className={`metric-change ${positive ? "positive" : "negative"}`}
                  aria-live="polite"
                >
                  {positive ? "▲" : "▼"} {Math.abs(change)}%
                </p>
              </div>
            );
          })}
        </div>

        <div className="charts-container" aria-label="Social Media Analytics Charts">
          <section className="chart-box" aria-labelledby="followers-chart-title">
            <h3 id="followers-chart-title" className="chart-title">
              Followers Growth (Last 10 updates)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={followerHistory}>
                <XAxis dataKey="time" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={{ r: 6, strokeWidth: 2, fill: "#3b82f6" }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="chart-box" aria-labelledby="likes-comments-chart-title">
            <h3 id="likes-comments-chart-title" className="chart-title">
              Likes & Comments Comparison (Last 10 updates)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={likesHistory.map((d, i) => ({
                  time: d.time,
                  Likes: d.value,
                  Comments: commentsHistory[i]?.value || 0,
                }))}
              >
                <XAxis dataKey="time" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Bar dataKey="Likes" fill="#ec4899" />
                <Bar dataKey="Comments" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </section>
        </div>
      </div>
    </>
  );
}
