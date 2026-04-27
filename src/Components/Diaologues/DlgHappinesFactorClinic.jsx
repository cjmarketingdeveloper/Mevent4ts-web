import React, { useEffect, useState } from 'react'
import { 
  FaClinicMedical, FaFax, FaCoins, FaBullhorn, 
  FaHandsHelping, FaPeopleCarry,  
  FaPlusCircle, FaCommentDots
} from 'react-icons/fa';
import Loading from '../Others/Loading';
import axios from 'axios';
import * as CONSTANTS from "../../CONSTANTS";

function DlgHappinesFactorClinic({user, showModalHappinessClinic, setShowModalHappinessClinic, setIndicateHappinessClinic}) {
        const [loading, setLoading]                 = useState(false);
        const [step, setStep]                       = useState(1);
        const [submitMessage, setSubmitMessage]     = useState("");
        const [formData, setFormData]               = useState({
            tenure: '',
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
        const [isCustomNursingCategory, setIsCustomNursingCategory] = useState(false);

        useEffect(() => {
            console.log(formData)
        },[formData])

        const handleOtherClickNursingCategory = () => {
            setIsCustomNursingCategory(true);
            setFormData({ ...formData, q1: '' }); // Clear it to let them type fresh
        };

        const handleOptionClickNursingCategory = (val) => {
            setIsCustomNursingCategory(false);
            setFormData({ ...formData, q1: val });
        };

        
     const isStepValid = () => {
        const validationMap = {
            1: ['q1', 'tenure'],
            2: ['q3', 'q4'],
            3: ['q5', 'localedTopicsTrainingAdd'],
            4: ['q7', 'q8'],
            5: ['q9', 'q10'],
            6: ['q11'],
            7: ['opportunityImprovement', 'suggestionFeedback'],
        };

        const requiredFields = validationMap[step] || [];
        
        // Returns true only if EVERY required field for this step has a value
        return requiredFields.every(field => {
            const value = formData[field];
            if (Array.isArray(value)) return value.length > 0; // For multi-selects like Q16
            return value !== undefined && value !== null && value !== '';
        });
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
                events: user.events
            };

            const response = await axios.post(CONSTANTS.API_URL + "settings/happiness/factor/clinic/v1", payload, {
                headers: { token: "Bearer " + user.accessToken }
            });

            setSubmitMessage(response.data.message);
            
            setLoading(false);
            if(response.status === 201){
                setIndicateHappinessClinic(false);
            }
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
                        {step === 1 && (
                            <section>
                                {/* Header Information from Image */}
                                <h3>Section 1: Clinic Background</h3>
                                <p>1) What is your nursing category?</p>
                                {/* Standard Options */}
                                    {['Professional Nurse', 'Enrolled Nurse', 'Nursing Assistant'].map((role) => (
                                    <button
                                        key={role}
                                        className={`btn btn-opt mb-1 me-1 ${formData.q1 === role && !isCustomNursingCategory ? 'active' : ''}`}
                                        onClick={() => handleOptionClickNursingCategory(role)}
                                    >
                                        {role}
                                    </button>
                                    ))}

                                    {/* The "Other" Button */}
                                    <button
                                        className={`btn btn-opt mb-1 me-1 ${isCustomNursingCategory ? 'active' : ''}`}
                                        onClick={handleOtherClickNursingCategory}
                                        >
                                        Other
                                    </button>

                                    {/* Conditional Text Input */}
                                    {isCustomNursingCategory && (
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Please specify your role"
                                            value={formData.q1}
                                            onChange={(e) => setFormData({ ...formData, q1: e.target.value })}
                                        autoFocus
                                        />
                                    </div>
                                    )}
                                    
                                    <p className="mt-4">2) How long have you been part of The Local Choice?</p>
                                    <select className="form-select" onChange={(e) => setFormData({...formData, tenure: e.target.value})}>
                                        <option value="">Select...</option>
                                        <option>Less than 1 year</option>
                                        <option>1 – 3 years</option>
                                        <option>4 – 7 years</option>
                                        <option>More than 8 years</option>
                                    </select>
                            </section>
                        )}
                        {step === 2 && (
                            <section>
                                <h3>Section 2: Operational Support</h3>
                                <p>3) How would you rate the support received from your Clinic Advisor?</p>
                                <RatingScale name="q3" />

                                <p className="mt-4">4) Does your Clinic Advisor add value to your clinic operations?</p>
                                <div className="custom-radio-group">
                                    <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Yes – significantly' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Yes – significantly'})}>Yes – significantly</button>
                                    <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Yes – somewhat' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Yes – somewhat'})}>Yes - Revamp</button>
                                    <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Neutral' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Neutral'})}>Neutral</button>
                                    <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'No' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'No'})}>No</button>
                                </div>
                                
                                <div className="form-group mt-2">
                                    <label>Comments (Optional):</label>
                                    <textarea 
                                        className="form-control mt-2 fr-large" 
                                        rows="3"
                                        placeholder="Share your thoughts here..."
                                        value={formData.commentsOperationSupport}
                                        onChange={(e) => setFormData({...formData, commentsOperationSupport: e.target.value})}
                                    />
                                </div>
                            </section>
                        )}

                        {step === 3 && (
                            <section>
                                <h3>Section 3: LocalEd Training</h3>
                                <p className="mt-4">5) Have you enrolled in the LocalEd programme?</p>
                                <div className="custom-radio-group">
                                    <button className={`btn btn-opt mt-1 me-1 ${formData.q5 === 'Yes' ? 'active' : ''}`} onClick={() => setFormData({...formData, q5: 'Yes'})}>Yes</button>
                                    <button className={`btn btn-opt mt-1 me-1 ${formData.q5 === 'No' ? 'active' : ''}`} onClick={() => setFormData({...formData, q5: 'No'})}>No</button>
                                </div>

                                <div className="form-group mt-2">
                                    <label>6) Which topics or training would you like to see added?</label>
                                    <textarea 
                                        className="form-control mt-2 fr-large" 
                                        rows="3"
                                        placeholder="Share your thoughts here..."
                                        value={formData.localedTopicsTrainingAdd}
                                        onChange={(e) => setFormData({...formData, localedTopicsTrainingAdd: e.target.value})}
                                    />
                                </div>
                            </section>
                        )}

                        {step === 4 && (
                            <section>
                                <h3>Section 4: Communication from Head Office</h3>
                                <p>7) Do you feel communication from Head Office is sufficient?</p>
                                    <RatingScale name="q7" />

                                <p className="mt-4">8) Which communication platform do you prefer?</p>
                                <div className="custom-radio-group">
                                    <button className={`btn btn-opt mt-1 me-1 ${formData.q8 === 'WhatsApp' ? 'active' : ''}`} onClick={() => setFormData({...formData, q8: 'WhatsApp'})}>WhatsApp</button>
                                    <button className={`btn btn-opt mt-1 me-1 ${formData.q8 === 'Email' ? 'active' : ''}`} onClick={() => setFormData({...formData, q8: 'Email'})}>Email</button>
                                    <button className={`btn btn-opt mt-1 me-1 ${formData.q8 === 'Both' ? 'active' : ''}`} onClick={() => setFormData({...formData, q8: 'Both'})}>Both</button>

                                </div>
                                <div className="form-group mt-2">
                                    <label>Comments (Optional):</label>
                                    <textarea 
                                        className="form-control mt-2 fr-large" 
                                        rows="3"
                                        placeholder="Share your thoughts here..."
                                        value={formData.commentCommunicationHeadOffice}
                                        onChange={(e) => setFormData({...formData, commentCommunicationHeadOffice: e.target.value})}
                                    />
                                </div>
                            </section>
                        )}

                        {step === 5 && (
                            <section>
                                <h3>Section 5: Team Integration & Culture</h3>
                                <p>9) Do you feel part of your store team?</p>
                                    <RatingScale name="q9" />
                                
                                <p className="mt-4">10) Do you feel part of The Local Choice "family"?</p>
                                    <RatingScale name="q10" />

                                <div className="form-group mt-2">
                                    <label>Comments (Optional):</label>
                                    <textarea 
                                        className="form-control mt-2 fr-large" 
                                        rows="3"
                                        placeholder="Share your thoughts here..."
                                        value={formData.commentTeamIntegration}
                                        onChange={(e) => setFormData({...formData, commentTeamIntegration: e.target.value})}
                                    />
                                </div>
                            </section>
                        )}

                        {step === 6 && (
                            <section>
                                <h3>Section 6: Overall Clinic Experience</h3>
                                <p>11) Overall, how happy are you in your clinic role within The Local Choice?</p>
                                    <RatingScale name="q11" />
                            
                            </section>
                        )}

                        {step === 7 && (
                            <section>
                                <h3>Section 7: Opportunities for Improvement</h3>  
                                <div className="form-area-section-x1">
                                    <div className="form-group mt-2">
                                        <label>12) What can The Local Choice do to better support you in your clinic role?</label>
                                            <textarea 
                                                className="form-control mt-2 fr-large" 
                                                rows="3"
                                                placeholder="Share your thoughts here..."
                                                value={formData.opportunityImprovement}
                                                onChange={(e) => setFormData({...formData, opportunityImprovement: e.target.value})}
                                            />
                                        </div>
                                        <div className="form-group mt-2">
                                            <label>13) Any additional suggestions or feedback?</label>
                                            <textarea 
                                                className="form-control mt-2 fr-large" 
                                                rows="3"
                                                placeholder="Share your thoughts here..."
                                                value={formData.suggestionFeedback}
                                                onChange={(e) => setFormData({...formData, suggestionFeedback: e.target.value})}
                                            />
                                        </div>

                                        <p className="mt-2">Optional Contact Details</p>
                                        <label>Name</label>
                                            <input
                                                type="text" 
                                                className="form-control mt-2 " 
                                                placeholder="Share your thoughts here..."
                                                value={formData.optionalContactName}
                                                onChange={(e) => setFormData({...formData, optionalContactName: e.target.value})}
                                            />
                                        
                                            <label className="mt-2">Pharmacy</label>
                                            <input
                                                type="text" 
                                                className="form-control mt-2 " 
                                                placeholder="Share your thoughts here..."
                                                value={formData.optionalContactPharmacy}
                                                onChange={(e) => setFormData({...formData, optionalContactPharmacy: e.target.value})}
                                            />
                                        
                                            <label className="mt-2">Name of Number/Email</label>
                                            <input
                                                type="text" 
                                                className="form-control mt-2 " 
                                                placeholder="Share your thoughts here..."
                                                value={formData.optionalContactEmail}
                                                onChange={(e) => setFormData({...formData, optionalContactEmail: e.target.value})}
                                            />    
                                </div>
                            </section>
                        )}

                        {step === 8 && (
                            <section>
                                {
                                    submitMessage.length === 0 ?<h3>Please Submit the form</h3> : <div className="success-message">{submitMessage}</div> 
                                }

                                {
                                    loading && <Loading />
                                }
                            </section>
                        )}
                    </div>

                    {
                        submitMessage.length === 0 && <div className="form-footer">
                            <button className="btn-back" disabled={step === 1} onClick={() => setStep(step - 1)}>
                                Back
                            </button>
                            
                            {
                                step < 8 ? (
                                    <button 
                                            className={`btn-next ${!isStepValid() ? 'btn-disabled' : ''}`} 
                                            disabled={!isStepValid()}
                                            onClick={() => setStep(step + 1)}
                                        >
                                        Next Step
                                    </button>
                                ) : (
                                    <button className="btn btn-mevent btn-submit" onClick={() => handleSubmitForm()} disabled={loading}>Submit</button>
                                )
                            }
                        </div>
                    }

                </div>
            </div>        
        </div>
    )
}

export default DlgHappinesFactorClinic