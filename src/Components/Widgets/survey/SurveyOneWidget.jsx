import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { 
  FaClinicMedical, FaFax, FaCoins, FaBullhorn, 
  FaHandsHelping, FaPeopleCarry,  
  FaPlusCircle, FaCommentDots
} from 'react-icons/fa';
import Loading from '../../Others/Loading';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux'; 


function SurveyOneWidget({user, CONSTANTS}) {
     const [loading, setLoading]                                    = useState(false);
     const [formData, setFormData]                                  = useState({
        q1: "",
        optionalContactName: user.name,     
        optionalContactSurName : user.surname,
        optionalContactPhone : user.phonenumber,
        optionalContactEmail: user.email,
     });
     const [step, setStep]                                          = useState(1);
     const [submitMessage, setSubmitMessage]                        = useState("");

    useEffect(() => {
        console.log(formData)
    },[formData])
    
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

    const isStepValid = () => {
        const validationMap = {
            1: ['q1', 'q2'],
            2: ['q3', 'q3B'], 
            3: ['q4'],
            4: ['q5', 'q6'],
            5: ['q7'],
            6: ['q8'],
            7: ['q9'],
        };

        const requiredFields = validationMap[step] || [];
        
        // Returns true only if EVERY required field for this step has a value
        return requiredFields.every(field => {
            const value = formData[field];
            if (Array.isArray(value)) return value.length > 0; // For multi-selects like Q16
            return value !== undefined && value !== null && value !== '';
        });
    }

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
        
    const handleMultiSelect = (value) => {
        // Convert current string to an array, filtering out empty values
        const currentSelections = formData.q6 ? formData.q6.split(',') : [];

        if (currentSelections.includes(value)) {
            // 1. Remove if already selected (toggle off)
            const updated = currentSelections.filter((item) => item !== value);
            setFormData({ ...formData, q6: updated.join(',') });
        } else {
            // 2. Add if under the limit of 3
            if (currentSelections.length < 3) {
            const updated = [...currentSelections, value];
            setFormData({ ...formData, q6: updated.join(',') });
            } else {
            // Optional: Alert the user they've reached the limit
                toast.warning("You can only select up to 3 options.");
            }
        }
    };

    const handleSubmitForm = async () => {
            try {
                setLoading(true);
                const payload = {
                    "kind" : user.profile.profileName === "Franchisee" ? "franchisee" : "main",
                    "q1": formData.q1,
                    "q2": formData.q2,
                    "q3": formData.q3,
                    "q3B": formData.q3B,
                    "q4": formData.q4,
                    "q5": formData.q5,
                    "q6": formData.q6,
                    "q7": formData.q7,
                    "q8": formData.q8,                    
                    "q9": formData.q9,
                    "optionalContactName": formData.optionalContactName ,     
                    "optionalContactSurName" : formData.optionalContactSurName ,
                    "optionalContactPhone" : formData.optionalContactPhone,
                    "optionalContactEmail": formData.optionalContactEmail,
                };
    
                console.log(payload);
                console.log("++++++++++++++++++");

                const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzzAKodjDJx6S6mZIeJ7CxiL7V9jEyoYCw_zzg9lhw30x3RO_mmBWcWd7mVga2Lzuvd/exec';
                //const SCRIPT_URL = 'https://script.google.com/macros/library/d/1fmITqgW2V3-k3de5xe0l4Yd3GWg7Da6UGKlVnOQNCkkvahRQbIkFXAa3/1';
                
                const response = await fetch(SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors', // standard for Apps Script to avoid pre-flight issues
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });
    
              
                if(response.status === 0){
                    setSubmitMessage("Thank you for taking the time to share your perspective, we really appreciate your input. We're looking forward to seeing you at the conference and working together to shape the future of The Local Choice franchise.");
                }else {
                    setSubmitMessage("Submission was not successfully, please try again later.");
                }
                                
                setLoading(false);
                                
            } catch (err) {    
                console.log(err);
                setLoading(false);
                toast.error("Something went wrong, please try again later.");
            }
    };
    
    if (loading) return <Loading />;

  return (
    <div className="survey-lane">
        <div className="form-sidebar-dots dots-zama">
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
                                        <h3>Section 1</h3>
                                        <p>1) Which best describes your current relationship with The Local Choice franchise?</p>
                                        <div className="custom-radio-group mb-3">
                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q1 === 'I am a franchisee' ? 'active' : ''}`} onClick={() => setFormData({...formData, q1: 'I am a franchisee'})}>I am a franchisee</button>
                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q1 === 'I am in discussions / considering joining' ? 'active' : ''}`} onClick={() => setFormData({...formData, q1: 'I am in discussions / considering joining'})}>I am in discussions / considering joining</button>
                                        </div>
                                         {
                                            user.profile.profileName === "Franchisee" ? <>
                                                        <p>2) How confident do you feel about your pharmacy’s success within The Local Choice over the next 12 months?</p>
                                                        <div className="custom-radio-group">
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q2 === 'Very concerned' ? 'active' : ''}`} onClick={() => setFormData({...formData, q2: 'Very concerned'})}>Very concerned</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q2 === 'Somewhat concerned' ? 'active' : ''}`} onClick={() => setFormData({...formData, q2: 'Somewhat concerned'})}>Somewhat concerned</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q2 === 'Neither concerned or confident' ? 'active' : ''}`} onClick={() => setFormData({...formData, q2: 'Neither concerned or confident'})}>Neither concerned or confident</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q2 === 'Somewhat confident' ? 'active' : ''}`} onClick={() => setFormData({...formData, q2: 'Somewhat confident'})}>Somewhat confident</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q2 === 'Very confident' ? 'active' : ''}`} onClick={() => setFormData({...formData, q2: 'Very confident'})}>Very confident</button>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                    <p>2) How confident do you feel about your pharmacy’s success over the next 12 months?</p>
                                                        <div className="custom-radio-group">
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q2 === 'Very concerned' ? 'active' : ''}`} onClick={() => setFormData({...formData, q2: 'Very concerned'})}>Very concerned</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q2 === 'Somewhat concerned' ? 'active' : ''}`} onClick={() => setFormData({...formData, q2: 'Somewhat concerned'})}>Somewhat concerned</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q2 === 'Neither concerned or confident' ? 'active' : ''}`} onClick={() => setFormData({...formData, q2: 'Neither concerned or confident'})}>Neither concerned or confident</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q2 === 'Somewhat confident' ? 'active' : ''}`} onClick={() => setFormData({...formData, q2: 'Somewhat confident'})}>Somewhat confident</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q2 === 'Very confident' ? 'active' : ''}`} onClick={() => setFormData({...formData, q2: 'Very confident'})}>Very confident</button>
                                                        </div>                                                        
                                                    </>
                                        }
                                    </section>
                                )}
                                {step === 2 && (
                                    <section>
                                        <h3>Section 2</h3>
                                        {
                                            user.profile.profileName === "Franchisee" ? <>
                                                        <p>3.1) In a word or short phrase, how would you describe how you're feeling about The Local Choice right now?</p>
                                                        <textarea 
                                                            className="form-control mt-2 fr-large" 
                                                            rows="3"
                                                            placeholder="Share your thoughts here..."
                                                            value={formData.q3}
                                                            onChange={(e) => setFormData({...formData, q3: e.target.value})}
                                                        />
                                                    </>
                                                    :
                                                    <>
                                                    <p>3.1) In a word or short phrase, how would you describe how you're feeling about The Local Choice based on what you’ve seen or heard so far?</p>
                                                        <textarea 
                                                            className="form-control mt-2 fr-large" 
                                                            rows="3"
                                                            placeholder="Share your thoughts here..."
                                                            value={formData.q3}
                                                            onChange={(e) => setFormData({...formData, q3: e.target.value})}
                                                        />                                                        
                                                    </>

                                        }
                                                
                                        <div className="form-group mt-2">
                                            <label>3.2) What is driving that feeling?</label>
                                            <textarea 
                                                className="form-control mt-2 fr-large" 
                                                rows="3"
                                                placeholder="Share your thoughts here..."
                                                value={formData.q3B}
                                                onChange={(e) => setFormData({...formData, q3B: e.target.value})}
                                            />
                                        </div>                                        
                                    </section>
                                )}
                                {step === 3 && (
                                    <section>
                                        <h3>Section 3</h3>
                                         {
                                            user.profile.profileName === "Franchisee" ? <>
                                                        <p className="mt-3">4) Do you feel the value and support promised when joining The Local Choice franchise is being delivered?</p>
                                                        <div className="custom-radio-group">
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Very dissatisfied' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Very dissatisfied'})}>Very dissatisfied</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Dissatisfied' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Dissatisfied'})}>Dissatisfied</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Neither dissatisfied or satisfied' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Neither dissatisfied or satisfied'})}>Neither dissatisfied or satisfied</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Satisfied' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Satisfied'})}>Satisfied</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Very satisfied' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Very satisfied'})}>Very satisfied</button>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                    <p className="mt-3">4) Based on your interactions so far, how appealing compelling do you find the value offered by The Local Choice?</p>
                                                        <div className="custom-radio-group">
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Not compelling appealing at all' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Not compelling appealing at all'})}>Not compelling appealing at all</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Not appealing' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Not appealing'})}>Not appealing</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Neither appealing or unappealing' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Neither appealing or unappealing'})}>Neither appealing or unappealing</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Appealing' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Appealing'})}>Appealing</button>
                                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Very appealing compelling' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Very appealing compelling'})}>Very appealing</button>
                                                        </div>                                             
                                                    </>
                                        }                                   
                                    </section>
                                )}
                
                                {step === 4 && (
                                    <section>
                                        <h3>Section 5</h3>
                                        {
                                            user.profile.profileName === "Franchisee" ? <>
                                                <p className="mt-3">5) In your day-to-day operations, what is the single biggest challenge you experience as a pharmacy owner?</p>
                                                    <textarea 
                                                        className="form-control mt-2 fr-large" 
                                                        rows="3"
                                                        placeholder="Share your thoughts here..."
                                                        value={formData.q5}
                                                        onChange={(e) => setFormData({...formData, q5: e.target.value})}
                                                    />
                                                </>
                                                :
                                                <>
                                                <p className="mt-3">5) Based on what you've seen so far, what is one thing you would like to see improved or clarified about The Local Choice?</p>
                                                    <textarea 
                                                        className="form-control mt-2 fr-large" 
                                                        rows="3"
                                                        placeholder="Share your thoughts here..."
                                                        value={formData.q5}
                                                        onChange={(e) => setFormData({...formData, q5: e.target.value})}
                                                    />                                         
                                                </>
                                        }

                                        <p className="mt-3">6) Which of the following do you most wish took less time or effort in your pharmacy?</p>
                                        (Select up to 3)
                                        <div className="custom-radio-group">
                                        {
                                            [
                                                'Admin', 
                                                'Compliance & regulations', 
                                                'Customer-related issues', 
                                                'Franchise communication', 
                                                'Pricing & promotions', 
                                                'Reporting', 
                                                'Staff management', 
                                                'Stock & supply management / supply', 
                                                'Systems & technology'
                                            ].map((option) => (
                                                <button
                                                key={option}
                                                className={`btn btn-opt mt-1 me-1 ${formData.q6?.split(',').includes(option) ? 'active' : ''}`}
                                                onClick={() => handleMultiSelect(option)}
                                                >
                                                {option}
                                                </button>
                                            ))
                                            }
                                        </div> 
                                    </section>
                                )}
        
                                {step === 5 && (
                                    <section>
                                        <h3>Section 6</h3>
                                        <p>7) What is the one topic or challenge you would most like to see addressed at this year's conference?</p>
                                            <textarea 
                                                className="form-control mt-2 fr-large" 
                                                rows="3"
                                                placeholder="Share your thoughts here..."
                                                value={formData.q7}
                                                onChange={(e) => setFormData({...formData, q7: e.target.value})}
                                            />                                                                                  
                                    </section>
                                )}
        
                                {step === 6 && (
                                    <section>
                                        <h3>Section 6</h3>
                                        <p>8) How likely are you to recommend The Local Choice franchise to another independent pharmacy owner</p>
                                            <RatingScale name="q8" /> 

                                              
                                            <div className="ct-range-part">
                                                <div className="lk-info">[1 Not likely</div>
                                                <div className="lk-info"> 5 likely]</div>
                                            </div>                                    
                                    </section>
                                )}
        
                                {step === 7 && (
                                    <section>
                                        <h3>Section 7</h3>
                                        <p>We are forming a network of pharmacy owners to be part of future research and to be thought partners in collaborative discussions on future ideas, when needed. Participation is voluntary, and your information will be used solely for this specified purpose.</p> 
                                        <p>Would you be open to being contacted for future research or collaboration opportunities?</p>
                                        <div className="custom-radio-group">
                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q9 === 'Yes' ? 'active' : ''}`} onClick={() => setFormData({...formData, q9: 'Yes'})}>Yes</button>
                                            <button className={`btn btn-opt mt-1 me-1 ${formData.q9 === 'No' ? 'active' : ''}`} onClick={() => setFormData({...formData, q9: 'No'})}>No</button>
                                        </div>   

                                        {
                                            formData.q9 === 'Yes' && <>
                                                                <p className="mt-3">Please share your details below</p>
                                                                        <label>Name</label>
                                                                        <input
                                                                            type="text" 
                                                                            className="form-control mt-2 " 
                                                                            placeholder="Share your thoughts here..."
                                                                            value={formData.optionalContactName}
                                                                            onChange={(e) => setFormData({...formData, optionalContactName: e.target.value})}
                                                                        />
                                                                     
                                                                        <label className="mt-3">Surname</label>
                                                                        <input
                                                                            type="text" 
                                                                            className="form-control mt-2 " 
                                                                            placeholder="Share your thoughts here..."
                                                                            value={formData.optionalContactSurName}
                                                                            onChange={(e) => setFormData({...formData, optionalContactSurName: e.target.value})}
                                                                        />
                                                                    
                                                                        <label className="mt-3">Phone Number</label>
                                                                        <input
                                                                            type="text" 
                                                                            className="form-control mt-2 " 
                                                                            placeholder="Share your thoughts here..."
                                                                            value={formData.optionalContactPhone}
                                                                            onChange={(e) => setFormData({...formData, optionalContactPhone: e.target.value})}
                                                                        />
                                                                        
                                                                        <label className="mt-3">Email</label>
                                                                        <input
                                                                            type="text" 
                                                                            className="form-control mt-2 " 
                                                                            placeholder="Share your thoughts here..."
                                                                            value={formData.optionalContactEmail}
                                                                            onChange={(e) => setFormData({...formData, optionalContactEmail: e.target.value})}
                                                                        />
                                                                     </>
                                        }
                                       
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
  )
}

export default SurveyOneWidget