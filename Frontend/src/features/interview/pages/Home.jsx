import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import Navbar from '../../../components/Navbar.jsx'

export const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [selectedFileName, setSelectedFileName] = useState(null)
    const [errorMessage, setErrorMessage] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFileName(e.target.files[0].name)
        }
    }

    const handleGenerateReport = async () => {
        setErrorMessage("")
        if (!jobDescription.trim()) {
            setErrorMessage("Target Job Description is required.")
            return
        }

        const resumeFile = resumeInputRef.current?.files?.[0]
        if (!resumeFile && !selfDescription.trim()) {
            setErrorMessage("Please upload a resume or provide a short self-description.")
            return
        }

        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            if (data && data._id) {
                navigate(`/interview/${data._id}`)
            }
        } catch (err) {
            setErrorMessage("Something went wrong while generating strategy. Please try again.")
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <main className='loading-screen'>
                    <div className="spinner"></div>
                    <h2>Generating your personalized interview strategy...</h2>
                    <p>Our Gemini AI is analyzing the job description, evaluating resume alignment, and preparing custom technical & behavioral questions.</p>
                </main>
            </>
        )
    }

    return (
        <div className='home-page-wrapper'>
            <Navbar />
            <div className='home-container'>
                {/* Page Header */}
                <header className='page-header'>
                    <h1>AI Resume Analyzer & <span className='highlight'>Interview Strategist</span></h1>
                    <p>Get instant ATS feedback, tailored technical & behavioral interview questions, and a customized day-by-day preparation roadmap.</p>
                </header>

                {errorMessage && (
                    <div className="error-alert">
                        <span>⚠️ {errorMessage}</span>
                    </div>
                )}

                {/* Main Card */}
                <div className='interview-card'>
                    <div className='interview-card__body'>

                        {/* Left Panel - Job Description */}
                        <div className='panel panel--left'>
                            <div className='panel__header'>
                                <span className='panel__icon'>💼</span>
                                <h2>Target Job Description</h2>
                                <span className='badge badge--required'>Required</span>
                            </div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className='panel__textarea'
                                placeholder={`Paste full job description here...\ne.g., "Full Stack Developer at Tech Corp requires React, Node.js, and MongoDB..."`}
                                maxLength={5000}
                            />
                            <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                        </div>

                        {/* Vertical Divider */}
                        <div className='panel-divider' />

                        {/* Right Panel - Profile */}
                        <div className='panel panel--right'>
                            <div className='panel__header'>
                                <span className='panel__icon'>👤</span>
                                <h2>Your Profile</h2>
                            </div>

                            {/* Upload Resume */}
                            <div className='upload-section'>
                                <label className='section-label'>
                                    Upload Resume
                                    <span className='badge badge--best'>Recommended</span>
                                </label>
                                <label className={`dropzone ${selectedFileName ? 'dropzone--selected' : ''}`} htmlFor='resume'>
                                    <span className='dropzone__icon'>📄</span>
                                    {selectedFileName ? (
                                        <p className='dropzone__title font-bold'>{selectedFileName}</p>
                                    ) : (
                                        <>
                                            <p className='dropzone__title'>Click to upload PDF resume</p>
                                            <p className='dropzone__subtitle'>PDF file format supported</p>
                                        </>
                                    )}
                                    <input
                                        ref={resumeInputRef}
                                        onChange={handleFileChange}
                                        hidden
                                        type='file'
                                        id='resume'
                                        name='resume'
                                        accept='.pdf'
                                    />
                                </label>
                            </div>

                            {/* OR Divider */}
                            <div className='or-divider'><span>OR</span></div>

                            {/* Quick Self-Description */}
                            <div className='self-description'>
                                <label className='section-label' htmlFor='selfDescription'>Quick Self-Description (3-4 lines)</label>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    id='selfDescription'
                                    name='selfDescription'
                                    className='panel__textarea panel__textarea--short'
                                    placeholder="e.g. Frontend developer with 2+ years experience in React, TypeScript and Redux. Passionate about building sleek user interfaces."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className='interview-card__footer'>
                        <span className='footer-info'>⚡ Powered by Gemini 2.5 Flash</span>
                        <button onClick={handleGenerateReport} className='generate-btn'>
                            Analyze & Generate Strategy 🚀
                        </button>
                    </div>
                </div>

                {/* Recent Reports List */}
                {reports && reports.length > 0 && (
                    <section className='recent-reports'>
                        <h2>Recent Interview & Resume Reports</h2>
                        <div className='reports-grid'>
                            {reports.map(report => (
                                <div key={report._id} className='report-card' onClick={() => navigate(`/interview/${report._id}`)}>
                                    <div className="report-card-header">
                                        <h3>{report.jobDescription ? (report.jobDescription.substring(0, 45) + '...') : 'Untitled Strategy'}</h3>
                                        <span className={`match-badge ${report.matchScore >= 75 ? 'badge--high' : report.matchScore >= 50 ? 'badge--mid' : 'badge--low'}`}>
                                            {report.matchScore}% Match
                                        </span>
                                    </div>
                                    <p className='report-meta'>Created: {new Date(report.createdAt).toLocaleDateString()}</p>
                                    {report.resumeRating?.overallScore && (
                                        <p className="resume-score">Resume Score: <strong>{report.resumeRating.overallScore}/100</strong></p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}

export default Home