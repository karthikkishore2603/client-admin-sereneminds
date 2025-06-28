import React, { useState } from "react";
import CountUp from "react-countup";
import "./Dashboard.css";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("6M");
  const [hoveredStat, setHoveredStat] = useState(null);
  const [selectedMoodFilter, setSelectedMoodFilter] = useState("all");

  // Enhanced mental health focused data
  const mentalHealthStats = [
    {
      title: "Students Monitored",
      value: "2,847",
      numericValue: 2847,
      change: "+12.5%",
      icon: "👥",
      color: "#2ad2c9",
      gradient: "linear-gradient(135deg, #2ad2c9 0%, #1e9b8f 100%)",
      trend: "up",
      detail: "Mental health tracking active",
    },
    {
      title: "Positive Mood",
      value: "1,923",
      numericValue: 1923,
      change: "+18.2%",
      icon: "😊",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      trend: "up",
      detail: "Happy & engaged students",
    },
    {
      title: "Needs Attention",
      value: "324",
      numericValue: 324,
      change: "-8.5%",
      icon: "😔",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      trend: "down",
      detail: "Requires support",
    },
    {
      title: "Critical Cases",
      value: "42",
      numericValue: 42,
      change: "-15.3%",
      icon: "🚨",
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      trend: "down",
      detail: "Immediate intervention needed",
    },
  ];

  const emotionalZones = [
    {
      name: "Green Zone",
      count: 1923,
      percentage: 67.5,
      color: "#10b981",
      icon: "🟢",
      description: "Happy & Productive",
    },
    {
      name: "Yellow Zone",
      count: 324,
      percentage: 11.4,
      color: "#f59e0b",
      icon: "🟡",
      description: "Stressed & Anxious",
    },
    {
      name: "Orange Zone",
      count: 156,
      percentage: 5.5,
      color: "#f97316",
      icon: "🟠",
      description: "Frustrated & Overwhelmed",
    },
    {
      name: "Red Zone",
      count: 42,
      percentage: 1.5,
      color: "#ef4444",
      icon: "🔴",
      description: "Critical & Distressed",
    },
    {
      name: "Blue Zone",
      count: 402,
      percentage: 14.1,
      color: "#3b82f6",
      icon: "🔵",
      description: "Sad & Withdrawn",
    },
  ];

  const topEmotions = [
    {
      emotion: "Happy",
      count: 892,
      percentage: 31.3,
      color: "#10b981",
      trend: "+12%",
    },
    {
      emotion: "Anxious",
      count: 456,
      percentage: 16.0,
      color: "#f59e0b",
      trend: "-8%",
    },
    {
      emotion: "Stressed",
      count: 324,
      percentage: 11.4,
      color: "#f97316",
      trend: "-15%",
    },
    {
      emotion: "Sad",
      count: 298,
      percentage: 10.5,
      color: "#3b82f6",
      trend: "-5%",
    },
    {
      emotion: "Angry",
      count: 156,
      percentage: 5.5,
      color: "#ef4444",
      trend: "-20%",
    },
  ];

  const recentMoodUpdates = [
    {
      id: 1,
      student: "Sarah Johnson",
      grade: "10th Grade",
      mood: "Happy",
      emotion: "Excited",
      zone: "Green",
      time: "2 minutes ago",
      avatar: "SJ",
      note: "Excited about upcoming science project",
    },
    {
      id: 2,
      student: "Mike Chen",
      grade: "9th Grade",
      mood: "Anxious",
      emotion: "Worried",
      zone: "Yellow",
      time: "15 minutes ago",
      avatar: "MC",
      note: "Concerned about math test tomorrow",
    },
    {
      id: 3,
      student: "Emma Davis",
      grade: "11th Grade",
      mood: "Stressed",
      emotion: "Overwhelmed",
      zone: "Orange",
      time: "1 hour ago",
      avatar: "ED",
      note: "Feeling overwhelmed with assignments",
    },
    {
      id: 4,
      student: "Alex Rodriguez",
      grade: "8th Grade",
      mood: "Sad",
      emotion: "Lonely",
      zone: "Blue",
      time: "2 hours ago",
      avatar: "AR",
      note: "Missing friends during lunch break",
    },
    {
      id: 5,
      student: "Jordan Smith",
      grade: "12th Grade",
      mood: "Critical",
      emotion: "Distressed",
      zone: "Red",
      time: "3 hours ago",
      avatar: "JS",
      note: "Needs immediate counselor support",
    },
  ];

  const quickActions = [
    {
      title: "Mood Check-in",
      icon: "😊",
      color: "#2ad2c9",
      description: "Record student mood",
    },
    {
      title: "Zone Assessment",
      icon: "🎯",
      color: "#6366f1",
      description: "Evaluate emotional zone",
    },
    {
      title: "Emotion Tracking",
      icon: "📊",
      color: "#f59e0b",
      description: "Monitor emotional states",
    },
    {
      title: "Alert System",
      icon: "🚨",
      color: "#ef4444",
      description: "Critical case alerts",
    },
  ];

  const moodTrendData = [
    { month: "Jan", happy: 65, anxious: 20, stressed: 10, sad: 3, critical: 2 },
    { month: "Feb", happy: 68, anxious: 18, stressed: 9, sad: 3, critical: 2 },
    { month: "Mar", happy: 70, anxious: 16, stressed: 8, sad: 4, critical: 2 },
    { month: "Apr", happy: 72, anxious: 15, stressed: 7, sad: 4, critical: 2 },
    { month: "May", happy: 75, anxious: 14, stressed: 6, sad: 3, critical: 2 },
    { month: "Jun", happy: 78, anxious: 12, stressed: 5, sad: 3, critical: 2 },
  ];

  const periodOptions = [
    { value: "1M", label: "1 Month" },
    { value: "3M", label: "3 Months" },
    { value: "6M", label: "6 Months" },
    { value: "1Y", label: "1 Year" },
  ];

  const moodFilters = [
    { value: "all", label: "All Moods" },
    { value: "positive", label: "Positive" },
    { value: "negative", label: "Needs Attention" },
    { value: "critical", label: "Critical" },
  ];

  return (
    <div className="dashboard">
      {/* Enhanced Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <div className="title-badge">
            <span className="badge-icon">🧠</span>
            <span>Mental Health Dashboard</span>
          </div>
          <h1>Student Emotional Wellness Tracker</h1>
          <p>
            Monitor and support student mental health across your education
            system.
          </p>
        </div>
        <div className="dashboard-controls">
          <div className="date-display">
            <div className="date-icon">📅</div>
            <div className="date-content">
              <span className="date-main">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="date-year">{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mental Health Stats Cards */}
      <div className="stats-grid">
        {mentalHealthStats.map((stat, index) => (
          <div
            key={index}
            className={`stat-card ${hoveredStat === index ? "hovered" : ""}`}
            onMouseEnter={() => setHoveredStat(index)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div
              className="stat-background"
              style={{ background: stat.gradient }}
            ></div>
            <div className="stat-content">
              <div className="stat-header">
                <div
                  className="stat-icon"
                  style={{ background: stat.color + "20" }}
                >
                  <span>{stat.icon}</span>
                </div>
                <div className="stat-trend">
                  <span className={`trend-icon ${stat.trend}`}>
                    {stat.trend === "up" ? "↗" : "↘"}
                  </span>
                  <span className="trend-value">{stat.change}</span>
                </div>
              </div>
              <div className="stat-main">
                <h3>
                  <CountUp
                    start={0}
                    end={stat.numericValue}
                    duration={2}
                    separator=","
                  />
                </h3>
                <p>{stat.title}</p>
                <span className="stat-detail">{stat.detail}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Emotional Zones Chart */}
        <div className="chart-section">
          <div className="section-header">
            <div className="header-left">
              <h2>Emotional Zones Distribution</h2>
              <p className="section-subtitle">
                Student emotional states across different zones
              </p>
            </div>
            <div className="header-controls">
              <div className="period-selector">
                {periodOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`period-btn ${
                      selectedPeriod === option.value ? "active" : ""
                    }`}
                    onClick={() => setSelectedPeriod(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="zones-container">
            <div className="zones-chart">
              {emotionalZones.map((zone, index) => (
                <div key={index} className="zone-item">
                  <div className="zone-info">
                    <div className="zone-icon" style={{ color: zone.color }}>
                      {zone.icon}
                    </div>
                    <div className="zone-details">
                      <h4>{zone.name}</h4>
                      <p>{zone.description}</p>
                    </div>
                    <div className="zone-stats">
                      <span className="zone-count">{zone.count}</span>
                      <span className="zone-percentage">
                        {zone.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="zone-bar">
                    <div
                      className="zone-progress"
                      style={{
                        width: `${zone.percentage}%`,
                        backgroundColor: zone.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Mood Updates */}
        <div className="activities-section">
          <div className="section-header">
            <div className="header-left">
              <h2>Recent Mood Updates</h2>
              <p className="section-subtitle">
                Latest student emotional check-ins
              </p>
            </div>
            <div className="mood-filters">
              {moodFilters.map((filter) => (
                <button
                  key={filter.value}
                  className={`mood-filter-btn ${
                    selectedMoodFilter === filter.value ? "active" : ""
                  }`}
                  onClick={() => setSelectedMoodFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mood-updates-list">
            {recentMoodUpdates.map((update) => (
              <div
                key={update.id}
                className={`mood-update-item zone-${update.zone.toLowerCase()}`}
              >
                <div className="mood-avatar">
                  <span>{update.avatar}</span>
                </div>
                <div className="mood-content">
                  <div className="mood-header">
                    <div className="student-info">
                      <p className="student-name">{update.student}</p>
                      <span className="student-grade">{update.grade}</span>
                    </div>
                    <div className="mood-indicators">
                      <span
                        className={`mood-badge ${update.mood.toLowerCase()}`}
                      >
                        {update.mood}
                      </span>
                      <span
                        className={`zone-badge zone-${update.zone.toLowerCase()}`}
                      >
                        {update.zone} Zone
                      </span>
                    </div>
                  </div>
                  <div className="mood-details">
                    <p className="emotion-text">
                      Feeling: <strong>{update.emotion}</strong>
                    </p>
                    <p className="mood-note">{update.note}</p>
                    <span className="mood-time">{update.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Emotions & Quick Actions */}
      <div className="bottom-grid">
        {/* Top Emotions */}
        <div className="emotions-section">
          <div className="section-header">
            <div className="header-left">
              <h2>Top Emotions</h2>
              <p className="section-subtitle">Most common emotional states</p>
            </div>
          </div>

          <div className="emotions-list">
            {topEmotions.map((emotion, index) => (
              <div key={index} className="emotion-item">
                <div className="emotion-rank">#{index + 1}</div>
                <div className="emotion-info">
                  <h4>{emotion.emotion}</h4>
                  <div className="emotion-stats">
                    <span className="emotion-count">
                      {emotion.count} students
                    </span>
                    <span className="emotion-percentage">
                      {emotion.percentage}%
                    </span>
                  </div>
                </div>
                <div className="emotion-trend">
                  <span
                    className={`trend-badge ${
                      emotion.trend.startsWith("+") ? "positive" : "negative"
                    }`}
                  >
                    {emotion.trend}
                  </span>
                </div>
                <div
                  className="emotion-color"
                  style={{ backgroundColor: emotion.color }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="section-header">
            <div className="header-left">
              <h2>Quick Actions</h2>
              <p className="section-subtitle">Mental health management tools</p>
            </div>
          </div>

          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div key={index} className="action-card">
                <div
                  className="action-background"
                  style={{ background: action.color + "08" }}
                ></div>
                <div className="action-content">
                  <div
                    className="action-icon"
                    style={{ background: action.color + "15" }}
                  >
                    <span style={{ color: action.color }}>{action.icon}</span>
                  </div>
                  <div className="action-text">
                    <h3>{action.title}</h3>
                    <p>{action.description}</p>
                  </div>
                  <div className="action-arrow">
                    <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
