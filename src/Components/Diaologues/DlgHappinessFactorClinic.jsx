import React, { useEffect, useState } from 'react'
import { 
  FaClinicMedical, FaFax, FaCoins, FaBullhorn, 
  FaHandsHelping, FaPeopleCarry,  
  FaPlusCircle, FaCommentDots,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import Loading from '../Others/Loading';
import axios from 'axios';
import * as CONSTANTS from "../../CONSTANTS";

function DlgHappinessFactorClinic({user, showModalHappinessClinic, setShowModalHappinessClinic}) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [submitMessage, setSubmitMessage] = useState("");
    const [formData, setFormData] = useState({
        nursingCategory: '',
        tenure: '',
        advisorRating: '',
        advisorValue: '',
        advisorComments: '',
        enrolledLocalEd: '',
        trainingTopics: '',
        commSufficient: '',
        commPlatform: '',
        commComments: '',
        storeTeamPart: '',
        familyPart: '',
        cultureComments: '',
        overallHappiness: '',
        improvementSupport: '',
        additionalFeedback: '',
        contactName: '',
        contactPharmacy: '',
        contactDetails: ''
    });

    const steps = [
        { id: 1, label: 'Info', icon: <FaClinicMedical /> },
        { id: 2, label: 'Background', icon: <FaClinicMedical /> },
        { id: 3, label: 'Operational', icon: <FaFax /> },
        { id: 4, label: 'LocalLed', icon: <FaCoins /> },
        { id: 5, label: 'Communication', icon: <FaBullhorn /> },
        { id: 6, label: 'Team', icon: <FaHandsHelping /> },
        { id: 7, label: 'Experience', icon: <FaPeopleCarry /> },
        { id: 8, label: 'Finalize', icon: <FaCommentDots /> },
    ];

    const currentIcon = steps.find(s => s.id === step)?.icon;

    // Validation logic for each step
    const isStepValid = () => {
        const validationMap = {
            2: ['nursingCategory', 'tenure'],
            3: ['advisorRating', 'advisorValue'],
            // ... rest of your map
        };

        const requiredFields = validationMap[step] || [];
        
        // Basic check for required fields
        const fieldsFilled = requiredFields.every(field => formData[field] && formData[field] !== '');

        // SPECIAL CASE: Nursing Category "Other"
        if (step === 1 && formData.nursingCategory === 'Other') {
            if (!formData.otherNursingCategory || formData.otherNursingCategory.trim() === '') {
                return false;
            }
        }

        return fieldsFilled;
    };

    const RatingScale = ({ name }) => (
        <div className="rating-row">
            {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="rating-pill">
                    <input 
                        type="radio" 
                        name={name} 
                        value={num} 
                        checked={formData[name] == num}
                        onChange={(e) => setFormData({...formData, [name]: e.target.value})} 
                    />
                    <span>{num}</span>
                </label>
            ))}
        </div>
    );

    const handleSubmitForm = async () => {
        try {
            setLoading(true);
            const payload = {
                ...formData,
                userId: user._id,
                formType: 'Clinic Happiness'
            };
            
            const response = await axios.put(CONSTANTS.API_URL + "settings/happiness/factor/clinic/v1", payload, {
                headers: { token: "Bearer " + user.accessToken }
            });

            setSubmitMessage(response.data.message);
            setLoading(false);
            // Optionally close after a delay
        } catch (err) {    
            console.error(err);
            setLoading(false);
        }
    };



    if (!showModalHappinessClinic) return null;

    return (
        <div className="overlay-area" onClick={() => setShowModalHappinessClinic(false)}>
            <div className="rect-modal-card" onClick={(e) => e.stopPropagation()}>
                
                {/* SIDEBAR DOTS */}
                <div className="form-sidebar-dots">
                    {steps.map((s) => (
                        <div key={s.id} className="dot-container">
                            <div className={`dot ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`} />
                        </div>
                    ))}
                </div>

                <div className="form-content">
                    <div className="step-header-area">
                        <div className="section-icon-large">{currentIcon}</div>
                    </div>

                    <div className="step-body">
                        {loading ? <Loading /> : (
                            <>
                                {step === 1 && (
                                    <section>
                                        {/* Header Information from Image */}
                                        <div className="form-intro-header mb-4">
                                            {/* <h2 className="text-primary">The Local Choice</h2> */}
                                            <h4 className="fw-bold">Clinic Happiness Factor Questionnaire</h4>
                                            <p className="small text-muted">
                                                Thank you for taking the time to complete this questionnaire. Your feedback is essential in 
                                                helping us improve clinic support, training, and integration within The Local Choice pharmacy network.
                                            </p>
                                            <div className="rating-guide p-2 bg-light rounded">
                                                <small><strong>Rating Scale:</strong> 1=Very Poor, 2=Poor, 3=Average, 4=Good, 5=Excellent</small>
                                            </div>
                                        </div>
                                    </section>
                                )}
                                {step === 2 && (
                                    <section>
                                        {/* <hr /> */}

                                        <h3>Section 1: Clinic Background</h3>
                                        <p>1) What is your nursing category?</p>
                                        <select 
                                            className="form-select" 
                                            value={formData.nursingCategory} 
                                            onChange={(e) => setFormData({...formData, nursingCategory: e.target.value})}
                                        >
                                            <option value="">Select...</option>
                                            <option>Professional Nurse</option>
                                            <option>Enrolled Nurse</option>
                                            <option>Nursing Assistant</option>
                                            <option>Other</option>
                                        </select>

                                        {/* COMPULSORY "OTHER" BOX */}
                                        {formData.nursingCategory === 'Other' && (
                                            <div className="mt-2 animate__animated animate__fadeIn">
                                                <label className="text-danger small fw-bold">* Please specify your category:</label>
                                                <input 
                                                    type="text"
                                                    className="form-control mt-1 border-danger"
                                                    placeholder="Type your category here..."
                                                    value={formData.otherNursingCategory || ''}
                                                    onChange={(e) => setFormData({...formData, otherNursingCategory: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        )}

                                        <p className="mt-4">2) How long have you been part of The Local Choice Pharmacy?</p>
                                        <select 
                                            className="form-select" 
                                            value={formData.tenure} 
                                            onChange={(e) => setFormData({...formData, tenure: e.target.value})}
                                        >
                                            <option value="">Select...</option>
                                            <option>Less than 1 year</option>
                                            <option>1 – 3 years</option>
                                            <option>4 – 7 years</option>
                                            <option>8+ years</option>
                                        </select>
                                    </section>
                                )}

                                {step === 3 && (
                                    <section>
                                        <h3>Section 2: Operational Support</h3>
                                        <p>3) Rate the support received from your Clinic Advisor:</p>
                                        <RatingScale name="advisorRating" />

                                        <p className="mt-4">4) Does your Clinic Advisor add value to operations?</p>
                                        <div className="custom-radio-group">
                                            {['Yes – significantly', 'Yes – somewhat', 'Neutral', 'No'].map(opt => (
                                                <button key={opt} className={`btn btn-opt mt-1 me-1 ${formData.advisorValue === opt ? 'active' : ''}`} onClick={() => setFormData({...formData, advisorValue: opt})}>{opt}</button>
                                            ))}
                                        </div>
                                        <textarea className="form-control mt-3 fr-large" placeholder="Comments..." value={formData.advisorComments} onChange={(e) => setFormData({...formData, advisorComments: e.target.value})} />
                                    </section>
                                )}

                                {step === 4 && (
                                    <section>
                                        <h3>Section 3: LocalEd Training</h3>
                                        <p>5) Have you enrolled in the LocalEd programme?</p>
                                        <div className="custom-radio-group">
                                            <button className={`btn btn-opt me-1 ${formData.enrolledLocalEd === 'Yes' ? 'active' : ''}`} onClick={() => setFormData({...formData, enrolledLocalEd: 'Yes'})}>Yes</button>
                                            <button className={`btn btn-opt ${formData.enrolledLocalEd === 'No' ? 'active' : ''}`} onClick={() => setFormData({...formData, enrolledLocalEd: 'No'})}>No</button>
                                        </div>
                                        <p className="mt-4">6) Which topics/training would you like to see added?</p>
                                        <textarea className="form-control fr-large" value={formData.trainingTopics} onChange={(e) => setFormData({...formData, trainingTopics: e.target.value})} />
                                    </section>
                                )}

                                {step === 5 && (
                                    <section>
                                        <h3>Section 4: Communication from Head Office</h3>
                                        <p>7) Is communication from Head Office sufficient?</p>
                                        <RatingScale name="commSufficient" />
                                        <p className="mt-4">8) Preferred communication platform?</p>
                                        <div className="custom-radio-group">
                                            {['WhatsApp', 'Email', 'Both'].map(opt => (
                                                <button key={opt} className={`btn btn-opt me-1 ${formData.commPlatform === opt ? 'active' : ''}`} onClick={() => setFormData({...formData, commPlatform: opt})}>{opt}</button>
                                            ))}
                                        </div>
                                        <textarea className="form-control mt-3 fr-large" placeholder="Comments..." value={formData.commComments} onChange={(e) => setFormData({...formData, commComments: e.target.value})} />
                                    </section>
                                )}

                                {step === 6 && (
                                    <section>
                                        <h3>Section 5: Team & Culture</h3>
                                        <p>9) Do you feel part of your store team?</p>
                                        <RatingScale name="storeTeamPart" />
                                        <p className="mt-4">10) Do you feel part of The Local Choice "family"?</p>
                                        <RatingScale name="familyPart" />
                                        <textarea className="form-control mt-3 fr-large" placeholder="Comments..." value={formData.cultureComments} onChange={(e) => setFormData({...formData, cultureComments: e.target.value})} />
                                    </section>
                                )}

                                {step === 7 && (
                                    <section>
                                        <h3>Section 6: Overall Experience</h3>
                                        <p>11) Overall, how happy are you in your clinic role within The Local Choice?</p>
                                        <RatingScale name="overallHappiness" />
                                    </section>
                                )}

                                {step === 8 && (
                                    <section>
                                        <h3>Section 7: Opportunities for Improvement</h3>
                                        <p>12) What can The Local Choice do to better support you in your clinic role?</p>
                                        <textarea className="form-control fr-large" value={formData.improvementSupport} onChange={(e) => setFormData({...formData, improvementSupport: e.target.value})} />
                                        <p>13) 13. Any additional suggestions or feedback?</p>
                                        <textarea className="form-control fr-large" value={formData.feedbackSupport} onChange={(e) => setFormData({...formData, feedbackSupport: e.target.value})} />
                                        <h4 className="mt-4">Optional Contact Details</h4>
                                        <p>(if you would like us to follow up on your feedback)</p>
                                        <input className="form-control mt-2" placeholder="Name" value={formData.contactName} onChange={(e) => setFormData({...formData, contactName: e.target.value})} />
                                        <input className="form-control mt-2" placeholder="Pharmacy" value={formData.contactPharmacy} onChange={(e) => setFormData({...formData, contactPharmacy: e.target.value})} />
                                        <input className="form-control mt-2" placeholder="Contact Details" value={formData.contactDetails} onChange={(e) => setFormData({...formData, contactDetails: e.target.value})} />
                                        
                                        {submitMessage && <div className="alert alert-success mt-3">{submitMessage}</div>}
                                    </section>
                                )}
                            </>
                        )}
                    </div>

                    <div className="step-footer mt-4">
                        {step > 1 && <button className="btn btn-secondary me-2" onClick={() => setStep(step - 1)}><FaChevronLeft /> Back</button>}
                        {step < steps.length ? (
                            <button className="btn btn-primary" disabled={!isStepValid()} onClick={() => setStep(step + 1)}>Next <FaChevronRight /></button>
                        ) : (
                            <button className="btn btn-success" onClick={handleSubmitForm} disabled={loading}>Submit Feedback</button>
                        )}
                    </div>
                </div>
            </div>        
        </div>
    )
}

export default DlgHappinessFactorClinic;