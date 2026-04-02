import React, { useEffect, useState } from 'react'
import { 
  FaUserAlt, FaStore, FaChartLine, FaBullhorn, 
  FaPaintBrush, FaStethoscope, FaBoxOpen, FaGraduationCap, 
  FaPlusCircle, FaCommentDots, 
  FaArchive,
  FaHandsHelping,
  FaUserPlus
} from 'react-icons/fa';
import Loading from '../Others/Loading';
import axios from 'axios';

function HappinessFactor({user, showModalHappiness, setShowModalHappiness}) {
    const [loading, setLoading]                         = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ isNewOrRevamp: '' });

    const isNewOrRevamp = formData.isNewOrRevamp?.includes('Yes');
    const [submitMessage, setSubmitMessage]                 = useState("");
    const steps = [
        { id: 1, label: 'Background', icon: <FaUserAlt /> },
        { id: 2, label: 'Experience', icon: <FaStore /> },
        { id: 3, label: 'Operations', icon: <FaChartLine /> },
        { id: 4, label: 'Marketing', icon: <FaBullhorn /> },
        { id: 5, label: 'Design', icon: <FaPaintBrush /> },
        { id: 6, label: 'Clinic/Stock', icon: <FaStethoscope /> },
        { id: 7, label: 'Solutions', icon: <FaPlusCircle /> },
        { id: 8, label: 'Loyalty', icon: <FaArchive  /> },
        { id: 9, label: 'Additional', icon: <FaUserPlus /> },
        { id: 10, label: 'Opportunities', icon: <FaHandsHelping /> },
        { id: 11, label: 'Finalize', icon: <FaCommentDots /> },
    ];

    const currentIcon = steps.find(s => s.id === step)?.icon;

    const isStepValid = () => {
        const validationMap = {
            1: ['tenure', 'isNewOrRevamp'],
            2: isNewOrRevamp ? ['q4', 'q5', 'q6', 'q7'] : ['q8', 'q9', 'q10'],
            3: ['q11', 'q12', 'q13'],
            4: ['q14', 'q15', 'q16', 'q17'],
            5: ['q18', 'q19'],
            6: ['q20', 'q21'],
            7: ['q22', 'q23'],
            8: ['q24'], // If Yes, you'd add 'q24' dynamically here
            9: ['q25', 'q26', 'q27'],
            10: ['q30'] // Section 10/Final
        };

        const requiredFields = validationMap[step] || [];
        
        // Returns true only if EVERY required field for this step has a value
        return requiredFields.every(field => {
            const value = formData[field];
            if (Array.isArray(value)) return value.length > 0; // For multi-selects like Q16
            return value !== undefined && value !== null && value !== '';
        });
    };
    
    useEffect(() => {
        console.log(formData)
    },[formData])

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
        try{
            
            console.log(formData);
            //axios
            //setShowModalHappiness(false)
        }catch(err){    
            console.log(err);
        }
    }
  return (
    <div className="overlay-area" onClick={() => setShowModalHappiness(false)}>
        <div className="rect-modal-card" onClick={(e) => e.stopPropagation()}>
            
            {/* LEFT SIDEBAR: Minimal Dots */}
            <div className="form-sidebar-dots">
            {steps.map((s) => (
                <div key={s.id} className="dot-container">
                <div className={`dot ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`} />
                
                </div>
            ))}
            </div>

        {/* MAIN CONTENT */}
        <div className="form-content">
          <div className="step-header-area">
            <div className="section-icon-large">{currentIcon}</div>
          </div>

          <div className="step-body">
            {step === 1 && (
              <section>
                <h3>Section 1: Franchise Background</h3>
                <p>1) How long have you been part of The Local Choice?</p>
                <select className="form-select" onChange={(e) => setFormData({...formData, tenure: e.target.value})}>
                  <option value="">Select...</option>
                  <option>Less than 1 year</option>
                  <option>1 – 3 years</option>
                  <option>4 – 7 years</option>
                  <option>8 – 10 years</option>
                  <option>More than 10 years</option>
                </select>

                <p className="mt-4">2) How many of The Local Choice pharmacies do you currently operate within the network?</p>
                 <input 
                        className="form-control mt-2 fr-large" 
                        type="text"
                        placeholder="Share your thoughts here..."
                        value={formData.pharmacyOperate}
                        onChange={(e) => setFormData({...formData, pharmacyOperate: e.target.value})}
                    />

                <p className="mt-4">3) Joined or revamped in the last 12 months?</p>
                <div className="custom-radio-group">
                  <button className={`btn btn-opt mt-1 me-1 ${formData.isNewOrRevamp === 'Yes-New' ? 'active' : ''}`} onClick={() => setFormData({...formData, isNewOrRevamp: 'Yes-New'})}>Yes - New</button>
                  <button className={`btn btn-opt mt-1 me-1 ${formData.isNewOrRevamp === 'Yes-Revamp' ? 'active' : ''}`} onClick={() => setFormData({...formData, isNewOrRevamp: 'Yes-Revamp'})}>Yes - Revamp</button>
                  <button className={`btn btn-opt mt-1 me-1 ${formData.isNewOrRevamp === 'No' ? 'active' : ''}`} onClick={() => setFormData({...formData, isNewOrRevamp: 'No'})}>No</button>
                </div>
                
              </section>
            )}

            {step === 2 && (
                <section>
                    {isNewOrRevamp ? (
                        <>
                            <h3>Section 2A: New Store / Revamp Experience</h3>
                            <div className="form-area-section-x1">
                                <p>4) How well was your project managed overall?</p>
                                <RatingScale name="q4" />

                                <p>5) Communication from the project team?</p>
                                <RatingScale name="q5" />

                                <p>6) Support received from The Local Choice during the process?</p>
                                <RatingScale name="q6" />

                                <p>7) How satisfied are you with the final outcome of your revamp or store setup?</p>
                                <RatingScale name="q7" />

                                <div className="form-group mt-2">
                                    <label>Comments (Optional):</label>
                                    <textarea 
                                        className="form-control mt-2 fr-large" 
                                        rows="3"
                                        placeholder="Share your thoughts here..."
                                        value={formData.commentsSection2A}
                                        onChange={(e) => setFormData({...formData, commentsSection2A: e.target.value})}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3>Section 2B: General Franchise Experience</h3>
                            <p>8) Overall rating of your experience?</p>
                            <RatingScale name="q8" />
                            <p>9) Do you feel the value and support promised when joining The Local Choice franchise is being delivered?</p>
                            <RatingScale name="q9" />
                            <p>10) Would you recommend us?</p>
                            <div className="custom-radio-group">
                                <button className={`btn btn-opt me-1 ${formData.q10 === 'Yes' ? 'active' : ''}`} onClick={() => setFormData({...formData, q10: 'Yes'})}>Yes</button>
                                <button className={`btn btn-opt ${formData.q10 === 'No' ? 'active' : ''}`} onClick={() => setFormData({...formData, q10: 'No'})}>No</button>
                            </div>
                            <div className="form-group mt-2">
                                <label>Comments (Optional):</label>
                                <textarea 
                                    className="form-control mt-2 fr-large" 
                                    rows="3"
                                    placeholder="Share your thoughts here..."
                                    value={formData.commentsSection2B}
                                    onChange={(e) => setFormData({...formData, commentsSection2B: e.target.value})}
                                />
                            </div>
                        </>
                    )}
                </section>
            )}

            {/* Additional steps 3-8 follow same pattern... */}
            {
              step === 3 && (
                    <section>
                        <h3>Operations Support</h3>
                        <p>11) How would you rate the support received from your Opportunity Manager?</p>
                            <RatingScale name="q11" />

                        <p className="mt-2">12) Does your Opportunity Manager add value to your pharmacy operations?</p>
                        <div className="custom-radio-group">
                            <button className={`btn btn-opt me-1 ${formData.q12 === 'Yes' ? 'active' : ''}`} onClick={() => setFormData({...formData, q12: 'Yes'})}>Yes</button>
                            <button className={`btn btn-opt ${formData.q12 === 'No' ? 'active' : ''}`} onClick={() => setFormData({...formData, q12: 'No'})}>No</button>
                        </div>

                        <p className="mt-2">13) How satisfied are you with the operational support provided by The Local Choice?</p>
                            <RatingScale name="q13" />

                        <div className="form-group mt-2">
                            <label>Comments (Optional):</label>
                            <textarea 
                                className="form-control mt-2 fr-large" 
                                rows="3"
                                placeholder="Share your thoughts here..."
                                value={formData.commentsSectionOperation}
                                onChange={(e) => setFormData({...formData, commentsSectionOperation: e.target.value})}
                            />
                        </div>
                    </section>)
            }

            {
              step === 4 && (
                    <section>
                        <h3>Marketing</h3>
                        <div className="form-area-section-x1">
                            <p>14) How satisfied are you with the marketing support provided by The Local Choice?</p>
                            <RatingScale name="q14" />

                            <p className="mt-2">15) How useful are the current marketing campaigns for driving customers into your pharmacy?</p>
                            <RatingScale name="q15" />

                            <p className="mt-2">16) How satisfied are you with the operational support provided by The Local Choice?</p>    
                            <div className="custom-radio-group">
                                <button className={`btn btn-opt mb-1 me-1 ${formData.q16 === 'Very excited' ? 'active' : ''}`} onClick={() => setFormData({...formData, q16: 'Very excited'})}>Very excited</button>
                                <button className={`btn btn-opt mb-1 me-1 ${formData.q16 === 'Somewhat excited' ? 'active' : ''}`} onClick={() => setFormData({...formData, q16: 'Somewhat excited'})}>Somewhat excited</button>
                                <button className={`btn btn-opt mb-1 me-1 ${formData.q16 === 'Neutral' ? 'active' : ''}`} onClick={() => setFormData({...formData, q16: 'Neutral'})}>Neutral</button>
                                <button className={`btn btn-opt mb-1 me-1 ${formData.q16 === 'Not excited' ? 'active' : ''}`} onClick={() => setFormData({...formData, q16: 'Not excited'})}>Not excited</button> 
                                <button className={`btn btn-opt ${formData.q16 === 'Not aware of these initiatives' ? 'active' : ''}`} onClick={() => setFormData({...formData, q16: 'Not aware of these initiatives'})}>Not aware of these initiatives</button>  
                            </div>    
                            
                            <p className="mt-2">17) Which marketing channels would you like to see strengthened in the future?</p>    
                            <div className="custom-radio-group">
                                <button className={`btn btn-opt mb-1 me-1 ${formData.q17 === 'Social media' ? 'active' : ''}`} onClick={() => setFormData({...formData, q17: 'Social media'})}>Social media</button>
                                <button className={`btn btn-opt mb-1 me-1 ${formData.q17 === 'Facebook advertising' ? 'active' : ''}`} onClick={() => setFormData({...formData, q17: 'Facebook advertising'})}>Facebook advertising</button>
                                <button className={`btn btn-opt mb-1 me-1 ${formData.q17 === 'Google advertising' ? 'active' : ''}`} onClick={() => setFormData({...formData, q17: 'Google advertising'})}>Google advertising</button>
                                <button className={`btn btn-opt mb-1 me-1 ${formData.q17 === 'Radio' ? 'active' : ''}`} onClick={() => setFormData({...formData, q17: 'Radio'})}>Radio</button> 
                                <button className={`btn btn-opt ${formData.q17 === 'In-store promotions' ? 'active' : ''}`} onClick={() => setFormData({...formData, q17: 'In-store promotions'})}>In-store promotions</button>  
                            </div>

                            <div className="form-group mt-2">
                                <label>Comments (Optional):</label>
                                <textarea 
                                    className="form-control mt-2 fr-large" 
                                    rows="3"
                                    placeholder="Share your thoughts here..."
                                    value={formData.commentsSectionMarketing}
                                    onChange={(e) => setFormData({...formData, commentsSectionMarketing: e.target.value})}
                                />
                            </div>
                        </div>                        
                    </section>)
            }

            {
              step === 5 && (
                    <section>
                        <h3>Design Team & Projects</h3>
                        <p>18) How satisfied are you with the service and turnaround time from the design team?</p>
                            <RatingScale name="q18" />

                        <p className="mt-2">19) How well do the designs align with your pharmacy needs?</p>
                            <RatingScale name="q19" />
                            
                        <div className="form-group mt-2">
                            <label>Comments (Optional):</label>
                            <textarea 
                                className="form-control mt-2 fr-large" 
                                rows="3"
                                placeholder="Share your thoughts here..."
                                value={formData.commentsSectionDesignTeam}
                                onChange={(e) => setFormData({...formData, commentsSectionDesignTeam: e.target.value})}
                            />
                        </div>
                    </section>
                    )
            }

            {
              step === 6 && (
                    <section>
                        <h3>Clinic</h3>
                        <p>20) How satisfied are you with the clinic offering provided by The Local Choice?</p>
                            <RatingScale name="q20" />
                        
                        <p className="mt-2">21) Does the clinic solution add value to your pharmacy business?</p>
                        <div className="custom-radio-group">
                            <button className={`btn btn-opt mb-1 me-1 ${formData.q21 === 'Yes – significantly' ? 'active' : ''}`} onClick={() => setFormData({...formData, q21: 'Yes – significantly'})}>Yes – significantly</button>
                            <button className={`btn btn-opt mb-1 me-1 ${formData.q21 === 'Yes – somewhat' ? 'active' : ''}`} onClick={() => setFormData({...formData, q21: 'Yes – somewhat'})}>Yes – somewhat</button>
                            <button className={`btn btn-opt mb-1 me-1 ${formData.q21 === 'Neutral' ? 'active' : ''}`} onClick={() => setFormData({...formData, q21: 'Neutral'})}>Neutral</button>
                            <button className={`btn btn-opt ${formData.q21 === 'No' ? 'active' : ''}`} onClick={() => setFormData({...formData, q21: 'No'})}>No </button>
                        </div>
                                    
                        <div className="form-group mt-2">
                            <label>Comments (Optional):</label>
                            <textarea 
                                className="form-control mt-2 fr-large" 
                                rows="3"
                                placeholder="Share your thoughts here..."
                                value={formData.commentsSectionClinic}
                                onChange={(e) => setFormData({...formData, commentsSectionClinic: e.target.value})}
                            />
                        </div>
                    </section>
                    )
            }

            {
              step === 7 && (
                    <section>
                        <h3>Stockfile</h3>
                        <p>22) How satisfied are you with the stockfile provided by The Local Choice?</p>
                            <RatingScale name="q22" />

                        <p className="mt-2">23) Does the stockfile assist with purchasing efficiency and product selection?</p>
                        <div className="custom-radio-group">
                            <button className={`btn btn-opt mb-1 me-1 ${formData.q23 === 'Yes – significantly' ? 'active' : ''}`} onClick={() => setFormData({...formData, q23: 'Yes – significantly'})}>Yes – significantly</button>
                            <button className={`btn btn-opt mb-1 me-1 ${formData.q23 === 'Yes – somewhat' ? 'active' : ''}`} onClick={() => setFormData({...formData, q23: 'Yes – somewhat'})}>Yes – somewhat</button>
                            <button className={`btn btn-opt mb-1 me-1 ${formData.q23 === 'Neutral' ? 'active' : ''}`} onClick={() => setFormData({...formData, q23: 'Neutral'})}>Neutral</button>
                            <button className={`btn btn-opt ${formData.q23 === 'No' ? 'active' : ''}`} onClick={() => setFormData({...formData, q23: 'No'})}>No </button>
                        </div>
                            
                        <div className="form-group mt-2">
                            <label>Comments (Optional):</label>
                            <textarea 
                                className="form-control mt-2 fr-large" 
                                rows="3"
                                placeholder="Share your thoughts here..."
                                value={formData.commentsSectionStockfile}
                                onChange={(e) => setFormData({...formData, commentsSectionStockfile: e.target.value})}
                            />
                        </div>
                    </section>
                )
            }

            {
              step === 8 && (
                    <section>
                        <h3>LocalEd</h3>
                        <p>24) Have you enrolled staff in LocalEd training programmes?</p>
                        <div className="custom-radio-group">
                            <button className={`btn btn-opt me-1 ${formData.q24 === 'Yes' ? 'active' : ''}`} onClick={() => setFormData({...formData, q24: 'Yes'})}>Yes</button>
                            <button className={`btn btn-opt ${formData.q24 === 'No' ? 'active' : ''}`} onClick={() => setFormData({...formData, q24: 'No'})}>No</button>
                        </div>
                            
                        {
                            formData.q24 === "Yes" && <>
                                                        <p className="mt-2">25) How satisfied are you with the LocalEd training offering?</p>
                                                        <RatingScale name="q25" />
                                                      </>
                        }                        
                            
                        <div className="form-group mt-2">
                            <label>Comments (Optional):</label>
                            <textarea 
                                className="form-control mt-2 fr-large" 
                                rows="3"
                                placeholder="Share your thoughts here..."
                                value={formData.commentsSectionLocalEd}
                                onChange={(e) => setFormData({...formData, commentsSectionLocalEd: e.target.value})}
                            />
                        </div>
                    </section>
                    )
            }

            {
              step === 9 && (
                    <section>
                        <h3>Additional Franchise Solutions</h3>
                        <div className="form-area-section-x1">
                            <p>25) <strong>Loyalty Programme</strong> <br/>How satisfied are you with the loyalty programme?</p>
                                <RatingScale name="q25" />

                            <p className="mt-3">26) <strong>Own Brand Products</strong> <br/>
                                Do the own brand products meet your expectations?</p>
                                    <RatingScale name="q26" />    

                            <p className="mt-3">27) <strong>Clothing / Uniform Solution</strong> <br/>
                                Does the clothing and uniform solution meet your expectations?</p>
                                    <RatingScale name="q27" />           
                                
                            <div className="form-group mt-2">
                                <label>Comments (Optional):</label>
                                <textarea 
                                    className="form-control mt-2 fr-large" 
                                    rows="3"
                                    placeholder="Share your thoughts here..."
                                    value={formData.commentsSectionClothingUniform}
                                    onChange={(e) => setFormData({...formData, commentsSectionClothingUniform: e.target.value})}
                                />
                            </div>
                        </div>
                        
                    </section>
                    )
            }

            {
              step === 10 && (
                    <section>
                        <h3>Opportunities for Improvement</h3>
                        <div className="form-area-section-x1">
                            <p>28) Is there anything you would like The Local Choice to improve on?</p>
                                <textarea 
                                    className="form-control mt-2 fr-large" 
                                    rows="3"
                                    placeholder="Share your thoughts here..."
                                    value={formData.commentsSectionOITLCImprove}
                                    onChange={(e) => setFormData({...formData, commentsSectionOITLCImprove: e.target.value})}
                                />

                            <p className="mt-2">29) Are there any additional services or support you would like to see introduced?</p>
                                <textarea 
                                    className="form-control mt-2 fr-large" 
                                    rows="3"
                                    placeholder="Share your thoughts here..."
                                    value={formData.commentsSectionServices}
                                    onChange={(e) => setFormData({...formData, commentsSectionServices: e.target.value})}
                                />

                            <p className="mt-2">30) Overall, are you happy being part of The Local Choice franchise?</p>
                                <div className="custom-radio-group">
                                    <button className={`btn btn-opt me-1 ${formData.q30 === 'Yes' ? 'active' : ''}`} onClick={() => setFormData({...formData, q30: 'Yes'})}>Yes</button>
                                    <button className={`btn btn-opt ${formData.q30 === 'No' ? 'active' : ''}`} onClick={() => setFormData({...formData, q30: 'No'})}>No</button>
                                </div>
                            
                            <p className="mt-2">If you would like us to contact you regarding your feedback, please complete the details below?</p>
                                <label>Name of franchisee</label>
                                <input
                                    type="text" 
                                    className="form-control mt-2 " 
                                    placeholder="Share your thoughts here..."
                                    value={formData.contactOptNameFranchise}
                                    onChange={(e) => setFormData({...formData, contactOptNameFranchise: e.target.value})}
                                />
                            
                                <label className="mt-2">Name of pharmacy</label>
                                <input
                                    type="text" 
                                    className="form-control mt-2 " 
                                    placeholder="Share your thoughts here..."
                                    value={formData.contactOptPharmacy}
                                    onChange={(e) => setFormData({...formData, contactOptPharmacy: e.target.value})}
                                />
                            
                                <label className="mt-2">Name of Number/Email</label>
                                <input
                                    type="text" 
                                    className="form-control mt-2 " 
                                    placeholder="Share your thoughts here..."
                                    value={formData.contactOptNumEmail}
                                    onChange={(e) => setFormData({...formData, contactOptNumEmail: e.target.value})}
                                />
                        </div>
                        
                    </section>
                    )
            }

            {
                step === 11 && 
                <section>
                    
                    {
                        submitMessage.length === 0 ?<h3>Please Submit the form</h3> : submitMessage 
                    }

                    {
                        loading && <Loading />
                    }
                </section>
            }
          </div>

          <div className="form-footer">
            <button className="btn-back" disabled={step === 1} onClick={() => setStep(step - 1)}>
                Back
            </button>
            
            {
                step < 11 ? (
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
        </div>

        </div>
    </div>
  )
}

export default HappinessFactor