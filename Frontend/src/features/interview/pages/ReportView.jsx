import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview';
import Navbar from '../../../components/Navbar';
import '../style/reportView.scss';

export const ReportView = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const { getReportById, getResumePdf } = useInterview();
    const [reportData, setReportData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            const res = await getReportById(interviewId);
            if (res) setReportData(res);
        };
        fetchReport();
    }, [interviewId]);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await getResumePdf(interviewId);
        } finally {
            setDownloading(false);
        }
    };

    if (!reportData) {
        return (
            <div className="report-loading-wrapper">
                <Navbar />
                <div className="loading-state">
                    <div className="spinner"></div>
                    <h2>Generating Report...</h2>
                </div>
            </div>
        );
    }

    const { matchScore, resumeRating, technicalQuestion, behaviouralQuestion, skillGaps, preprationPlan } = reportData;

    return (
        <div className="report-view-wrapper">
            <Navbar />
            
            <main className="report-container">
                {/* 1. Header Bar directly below Navbar */}
                <header className="report-header">
                    <div className="header-left">
                        <button className="back-btn" onClick={() => navigate('/')}>
                            ← Back to Dashboard
                        </button>
                        <h1 className="report-title">AI Candidate Evaluation & Interview Strategy</h1>
                    </div>
                    <button className="export-btn" onClick={handleDownload} disabled={downloading}>
                        {downloading ? 'Exporting...' : 'Export Full Report'}
                    </button>
                </header>

                {/* 2. Three Cards Grid: Job Compatibility, Resume Rating, Targeted Skill Gaps */}
                <section className="top-metrics-grid">
                    
                    {/* Card 1: Job Compatibility */}
                    <div className="metric-card compatibility-card">
                        <h3 className="card-title">Job Compatibility</h3>
                        <div className="compatibility-body">
                            <div className="score-badge">{matchScore || 0}%</div>
                            <div className="compatibility-text">
                                <span className="status-label">
                                    {matchScore >= 75 ? 'High Alignment' : matchScore >= 50 ? 'Moderate Alignment' : 'Low Alignment'}
                                </span>
                                <p className="status-sub">Based on job description match</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Resume Rating */}
                    <div className="metric-card rating-card">
                        <div className="rating-header">
                            <h3 className="card-title">Resume Rating</h3>
                            <span className="rating-score">{resumeRating?.overallScore || 0}<span>/100</span></span>
                        </div>
                        <div className="rating-bars">
                            <div className="bar-row">
                                <span className="bar-label">Formatting</span>
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${resumeRating?.formattingScore || 0}%` }}></div>
                                </div>
                                <span className="bar-val">{resumeRating?.formattingScore || 0}%</span>
                            </div>
                            <div className="bar-row">
                                <span className="bar-label">Impact & Metrics</span>
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${resumeRating?.impactScore || 0}%` }}></div>
                                </div>
                                <span className="bar-val">{resumeRating?.impactScore || 0}%</span>
                            </div>
                            <div className="bar-row">
                                <span className="bar-label">ATS Readability</span>
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${resumeRating?.atsCompatibilityScore || 0}%` }}></div>
                                </div>
                                <span className="bar-val">{resumeRating?.atsCompatibilityScore || 0}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Targeted Skill Gaps */}
                    <div className="metric-card gaps-card">
                        <h3 className="card-title">Targeted Skill Gaps</h3>
                        <div className="gaps-list">
                            {skillGaps && skillGaps.length > 0 ? (
                                skillGaps.map((sg, idx) => (
                                    <div key={idx} className={`gap-item priority-${sg.severity}`}>
                                        <span className="gap-name">{sg.skill}</span>
                                        <span className="priority-badge">{sg.severity.toUpperCase()}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="no-gaps">No critical skill gaps identified.</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* 3. Section below metrics: Navigation Tabs & Tab Content */}
                <section className="analysis-tabs-section">
                    <nav className="tab-navigation">
                        <button 
                            className={activeTab === 'overview' ? 'tab-link active' : 'tab-link'} 
                            onClick={() => setActiveTab('overview')}
                        >
                            Resume Analysis
                        </button>
                        <button 
                            className={activeTab === 'technical' ? 'tab-link active' : 'tab-link'} 
                            onClick={() => setActiveTab('technical')}
                        >
                            Technical ({technicalQuestion?.length || 0})
                        </button>
                        <button 
                            className={activeTab === 'behavioral' ? 'tab-link active' : 'tab-link'} 
                            onClick={() => setActiveTab('behavioral')}
                        >
                            Behavioral ({behaviouralQuestion?.length || 0})
                        </button>
                        <button 
                            className={activeTab === 'roadmap' ? 'tab-link active' : 'tab-link'} 
                            onClick={() => setActiveTab('roadmap')}
                        >
                            Prep Roadmap
                        </button>
                    </nav>

                    <div className="tab-pane-container">
                        {/* TAB 1: RESUME ANALYSIS */}
                        {activeTab === 'overview' && (
                            <div className="pane-content overview-pane">
                                {resumeRating && (
                                    <div className="feedback-grid">
                                        <div className="feedback-card card-strengths">
                                            <h4>Resume Strengths</h4>
                                            <ul>
                                                {resumeRating.strengths?.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="feedback-card card-weaknesses">
                                            <h4>Weaknesses & Gaps</h4>
                                            <ul>
                                                {resumeRating.weaknesses?.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="feedback-card card-improvements">
                                            <h4>Key Actionable Improvements</h4>
                                            <ul>
                                                {resumeRating.keyImprovements?.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: TECHNICAL QUESTIONS */}
                        {activeTab === 'technical' && (
                            <div className="pane-content questions-pane">
                                <div className="pane-header">
                                    <h3>Technical Interview Questions</h3>
                                    <p>Questions tailored to role requirements and candidate experience.</p>
                                </div>
                                <div className="questions-list">
                                    {technicalQuestion?.map((q, idx) => (
                                        <div key={idx} className="question-card">
                                            <div className="q-head">
                                                <span className="q-number">Q{idx + 1}</span>
                                                <h5>{q.question}</h5>
                                            </div>
                                            <div className="q-body">
                                                <p className="q-intention"><strong>Intention:</strong> {q.intention}</p>
                                                <div className="q-guide">
                                                    <strong>Suggested Answer Approach:</strong>
                                                    <p>{q.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 3: BEHAVIORAL QUESTIONS */}
                        {activeTab === 'behavioral' && (
                            <div className="pane-content questions-pane">
                                <div className="pane-header">
                                    <h3>Behavioral Questions</h3>
                                    <p>Evaluates teamwork, problem-solving, and communication skills.</p>
                                </div>
                                <div className="questions-list">
                                    {behaviouralQuestion?.map((q, idx) => (
                                        <div key={idx} className="question-card">
                                            <div className="q-head">
                                                <span className="q-number q-number-alt">Q{idx + 1}</span>
                                                <h5>{q.question}</h5>
                                            </div>
                                            <div className="q-body">
                                                <p className="q-intention"><strong>Intention:</strong> {q.intention}</p>
                                                <div className="q-guide">
                                                    <strong>Suggested Answer Approach:</strong>
                                                    <p>{q.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 4: PREP ROADMAP */}
                        {activeTab === 'roadmap' && (
                            <div className="pane-content roadmap-pane">
                                <div className="pane-header">
                                    <h3>Preparation Roadmap</h3>
                                    <p>Daily focus areas and recommended preparation steps.</p>
                                </div>
                                <div className="roadmap-list">
                                    {preprationPlan?.map((plan, idx) => (
                                        <div key={idx} className="roadmap-item">
                                            <div className="day-tag">Day {plan.day}</div>
                                            <div className="day-info">
                                                <h5>Focus: {plan.focus}</h5>
                                                <ul>
                                                    {plan.tasks?.map((task, tIdx) => (
                                                        <li key={tIdx}>{task}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ReportView;
