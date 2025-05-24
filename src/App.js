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

export default function ThemeSwitcherDashboard() {
  const [isDark, setIsDark] = useState(false);

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
      const time = new Date().toLocaleTimeString();

      const updateMetric = (prev, max, setter, historySetter) => {
        const newVal = getRandomChange(prev, max);
        setter(newVal);
        historySetter((hist) => {
          const newHist = [...hist, { time, value: newVal }];
          return newHist.length > 10 ? newHist.slice(-10) : newHist;
        });
      };

      updateMetric(followers, 30, setFollowers, setFollowerHistory);
      updateMetric(likes, 40, setLikes, setLikesHistory);
      updateMetric(comments, 20, setComments, setCommentsHistory);
    }, 4000);
    return () => clearInterval(interval);
  }, [followers, likes, comments]);

  const calcChange = (history) => {
    if (history.length < 2) return 0;
    const len = history.length;
    const prev = history[len - 2].value;
    const curr = history[len - 1].value;
    return (((curr - prev) / prev) * 100).toFixed(2);
  };

  // Define colors depending on theme
  const backgroundColor = isDark ? "#000000" : "#ffffff";
  const textColor = isDark ? "#eeeeee" : "#111111";
  const positiveColor = isDark ? "#4ade80" : "#16a34a"; // green shades
  const negativeColor = isDark ? "#f87171" : "#dc2626"; // red shades
  const cardBackground = isDark
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.05)";
  const chartStroke = isDark ? "#eeeeee" : "#111111";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        * {
          box-sizing: border-box;
        }
        body, #root {
          margin: 0; padding: 0; height: 100vh; width: 100vw;
          background-color: ${backgroundColor};
          color: ${textColor};
          font-family: 'Inter', sans-serif;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 2rem 1rem;
          transition: background-color 0.4s ease, color 0.4s ease;
          user-select: none;
        }
        .container {
          max-width: 1000px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: center;
        }
        h1 {
          font-weight: 700;
          font-size: 2.8rem;
          margin: 0;
          user-select: none;
        }
        button.toggle-btn {
          padding: 0.5rem 1.2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          background-color: ${isDark ? "#eee" : "#222"};
          color: ${isDark ? "#111" : "#fff"};
          border: none;
          align-self: flex-end;
          transition: background-color 0.3s ease, color 0.3s ease;
          user-select: none;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(280px,1fr));
          gap: 1.8rem;
          width: 100%;
        }
        .card {
          background: ${cardBackground};
          border-radius: 12px;
          padding: 1.8rem 2rem;
          box-shadow: ${isDark
            ? "0 4px 12px rgba(255,255,255,0.1)"
            : "0 4px 12px rgba(0,0,0,0.1)"};
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          user-select: none;
        }
        .metric-name {
          font-weight: 700;
          font-size: 1.2rem;
          margin-bottom: 0.6rem;
        }
        .metric-value {
          font-size: 3.8rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
          user-select: text;
        }
        .metric-change {
          font-weight: 600;
          font-size: 1.2rem;
          user-select: none;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .metric-change.positive {
          color: ${positiveColor};
        }
        .metric-change.negative {
          color: ${negativeColor};
        }
        .charts-container {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          width: 100%;
          justify-content: center;
        }
        .chart-box {
          background: ${cardBackground};
          border-radius: 12px;
          padding: 1.5rem 2rem;
          box-shadow: ${isDark
            ? "0 4px 12px rgba(255,255,255,0.1)"
            : "0 4px 12px rgba(0,0,0,0.1)"};
          flex: 1 1 460px;
          min-width: 300px;
          user-select: none;
          color: ${textColor};
        }
        .chart-title {
          font-weight: 700;
          font-size: 1.4rem;
          margin-bottom: 1rem;
          user-select: none;
        }
        /* Tooltip Override */
        .recharts-default-tooltip {
          background: ${isDark ? "#222" : "#fff"} !important;
          color: ${isDark ? "#eee" : "#111"} !important;
          border-radius: 6px !important;
          padding: 8px 12px !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          box-shadow: 0 3px 8px rgba(0,0,0,0.2) !important;
          pointer-events: none !important;
          user-select: none !important;
        }
      `}</style>

      <div className="container" role="main" aria-label="Live social media dashboard with theme switcher">
        <button
          aria-pressed={isDark}
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
          className="toggle-btn"
          onClick={() => setIsDark((d) => !d)}
        >
          {isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        </button>

        <h1 tabIndex={-1}>Live Social Media Dashboard</h1>

        <section className="metrics-grid" aria-label="Social media metrics">
          {[
            { name: "Followers", value: followers, history: followerHistory },
            { name: "Likes", value: likes, history: likesHistory },
            { name: "Comments", value: comments, history: commentsHistory },
          ].map(({ name, value, history }) => {
            const change = calcChange(history);
            const positive = change >= 0;
            return (
              <article
                className="card"
                key={name}
                aria-label={`${name} metric card with value and percentage change`}
              >
                <h2 className="metric-name">{name}</h2>
                <p className="metric-value" tabIndex={0}>
                  {value.toLocaleString()}
                </p>
                <p
                  className={`metric-change ${positive ? "positive" : "negative"}`}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {positive ? "▲" : "▼"} {Math.abs(change)}%
                </p>
              </article>
            );
          })}
        </section>

        <section className="charts-container" aria-label="Social media data charts">
          <div className="chart-box" aria-label="Follower count over time">
            <h3 className="chart-title">Followers Over Time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={followerHistory}>
                <XAxis
                  dataKey="time"
                  stroke={chartStroke}
                  tick={{ fill: textColor }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke={chartStroke}
                  tick={{ fill: textColor }}
                  domain={["dataMin", "dataMax"]}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box" aria-label="Likes and comments over time">
            <h3 className="chart-title">Likes & Comments Over Time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={likesHistory.map((d, i) => ({
                time: d.time,
                Likes: d.value,
                Comments: commentsHistory[i]?.value || 0,
              }))}>
                <XAxis
                  dataKey="time"
                  stroke={chartStroke}
                  tick={{ fill: textColor }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke={chartStroke}
                  tick={{ fill: textColor }}
                  domain={["dataMin", "dataMax"]}
                />
                <Tooltip />
                <Bar dataKey="Likes" fill="#ec4899" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Comments" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </>
  );
}
