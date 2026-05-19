import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../../Others/Loading';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux'; 
import {
    FaClinicMedical,
    FaComments,
    FaClipboardList,
    FaStar,
    FaTruck,
    FaBullhorn,
    FaHandshake,
    FaUserCheck,
    FaCheckCircle
} from 'react-icons/fa';

function SurveyThreeWidget({user, CONSTANTS}) {
    const [loading, setLoading]                         = useState(false);
    const [formData, setFormData] = useState({
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: "",
        q6: "",
        q7: "",
        q8: "",
        contactName: user.name,
        contactSurname: user.surname,
        contactNumber: user.phonenumber,
        contactEmail: user.email,
    });

    const [step, setStep] = useState(1);
    const [submitMessage, setSubmitMessage] = useState("");

    useEffect(() => {
        console.log(formData)
    },[formData])

    const steps = [
        { id: 1, label: 'I', icon: <FaClinicMedical /> },
        { id: 2, label: 'II', icon: <FaComments /> },
        { id: 3, label: 'III', icon: <FaClipboardList /> },
        { id: 4, label: 'IV', icon: <FaStar /> },
        { id: 5, label: 'V', icon: <FaTruck /> },
        { id: 6, label: 'VI', icon: <FaBullhorn /> },
        { id: 7, label: 'VII', icon: <FaHandshake /> },
        { id: 8, label: 'VIII', icon: <FaHandshake /> },
        { id: 9, label: 'IX', icon: <FaUserCheck /> },
        { id: 10, label: 'X', icon: <FaCheckCircle /> },
    ];

    const currentIcon = steps.find(s => s.id === step)?.icon;

    const isStepValid = () => {

        const validationMap = {
            1: ['q1'],
            2: ['q2'],
            3: ['q3', 'q3B'],
            4: ['q4'],
            5: ['q5'],
            6: ['q6'],
            7: ['q7'],
            8: ['q8'],
        };

        const requiredFields = validationMap[step] || [];

        return requiredFields.every(field => {
            const value = formData[field];
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
                kind: user.profile.profileName === "Franchisee" ? "Franchisees" : "Others",
                q1: formData.q1,
                q2: formData.q2,
                q3: formData.q3,
                q3B: formData.q3B,
                q4: formData.q4,
                q5: formData.q5,
                q6: formData.q6,
                q7: formData.q7,
                q8: formData.q8,
                contactName: formData.contactName,
                contactSurname: formData.contactSurname,
                contactNumber: formData.contactNumber,
                contactEmail: formData.contactEmail,
            };

            console.log(payload);

            const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwoWalNzXAROZhMr-L3S3W-kBh5yYdANvd-Gk6G0GyeLk_5HtsqmpNR9AlGT_pkl0lI4g/exec';

            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log(response);

            if (response.status === 0) {
                setSubmitMessage("Thank you for taking the time to share your perspective. Your input will help us improve future conferences and collaborations.");

            } else {
                setSubmitMessage("Submission was not successful, please try again later.");
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
                        <div
                            className={`dot ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}
                        />
                    </div>
                ))}
            </div>

            <div className="form-content">
                <h3 className="text-center">Post Conference</h3>
                <div className="step-header-area">
                    <div className="section-icon-large">
                        {currentIcon}
                    </div>
                </div>

                <div className="step-body">
                    {/* STEP 1 */}
                    {step === 1 && (
                        <section>
                            <h3>Section 1</h3>
                            <p>
                                1) Which best describes your current relationship with The Local Choice franchise?
                            </p>
                            <textarea
                                className="form-control mt-2 fr-large"
                                rows="3"
                                placeholder="Share your thoughts here..."
                                value={formData.q1}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        q1: e.target.value
                                    })
                                }
                            />
                        </section>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <section>

                            <h3>Section 2</h3>
                            {
                                user.profile.profileName === "Franchisee" ? 
                                <>
                                    <p>
                                        2) After attending the conference, how confident do you feel about your pharmacy’s success within The Local Choice over the next 12 months?
                                    </p>    
                                    <textarea
                                        className="form-control mt-2 fr-large"
                                        rows="3"
                                        placeholder="Share your thoughts here..."
                                        value={formData.q2}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                q2: e.target.value
                                            })
                                        }
                                    />
                                </> 
                                : 
                                <>
                                    <p>
                                        2) After attending the conference, how confident do you feel about your pharmacy’s success over the next 12 months, if you would join The Local Choice?
                                    </p>    
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

                    {/* STEP 3 */}
                    {step === 3 && (
                        <section>
                            <h3>Section 3</h3>
                            <p> 3.1) In a word or short phrase, how would you describe how you're feeling about The Local Choice after attending the conference?</p>
                                <textarea
                                    className="form-control mt-2 fr-large"
                                    rows="3"
                                    placeholder="Share your thoughts here..."
                                    value={formData.q3}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            q3: e.target.value
                                        })
                                    }
                                />
                            <p className="mt-3">
                                3.2) What most influenced that feeling during the conference?
                            </p>
                            <textarea
                                className="form-control mt-2 fr-large"
                                rows="3"
                                placeholder="Share your thoughts here..."
                                value={formData.q3B}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        q3B: e.target.value
                                    })
                                }
                            />
                        </section>
                    )}

                    {/* STEP 4 */}
                    {step === 4 && (
                        <section>

                            <h3>Section 4</h3>
                            {
                                user.profile.profileName === "Franchisee" ? 
                                <>
                                    <p>
                                        4) What was the most valuable topic or discussion from the conference for you?
                                    </p>
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
                                    <p>
                                        4) Based on your interactions so far, how appealing compelling do you find the value offered by The Local Choice?
                                    </p>
                                    <div className="custom-radio-group">
                                        <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Not compelling appealing at all' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Not compelling appealing at all'})}>Not compelling appealing at all</button>
                                        <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Not appealing' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Not appealing'})}>Not appealing</button>
                                        <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Neither appealing or unappealing' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Neither appealing or unappealing'})}>Neither appealing or unappealing</button>
                                        <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Appealing' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Appealing'})}>Appealing</button>
                                        <button className={`btn btn-opt mt-1 me-1 ${formData.q4 === 'Very appealing' ? 'active' : ''}`} onClick={() => setFormData({...formData, q4: 'Very appealing'})}>Very appealing</button>
                                    </div>
                                </>
                            }
                        </section>
                    )}

                    {/* STEP 5 */}
                    {step === 5 && (
                        <section>

                            <h3>Section 5</h3>

                            <p>
                                5) How has attending the conference changed your perception of The Local Choice?
                            </p>
                            <div className="custom-radio-group">
                                <button className={`btn btn-opt mt-1 me-1 ${formData.q5 === 'Significantly more negative' ? 'active' : ''}`} onClick={() => setFormData({...formData, q5: 'Significantly more negative'})}>Significantly more negative</button>
                                <button className={`btn btn-opt mt-1 me-1 ${formData.q5 === 'Slightly more negative' ? 'active' : ''}`} onClick={() => setFormData({...formData, q5: 'Slightly more negative'})}>Slightly more negative</button>
                                <button className={`btn btn-opt mt-1 me-1 ${formData.q5 === 'No change' ? 'active' : ''}`} onClick={() => setFormData({...formData, q5: 'No change'})}>No change</button>
                                <button className={`btn btn-opt mt-1 me-1 ${formData.q5 === 'Slightly more positive' ? 'active' : ''}`} onClick={() => setFormData({...formData, q5: 'Slightly more positive'})}>Slightly more positive</button>
                                <button className={`btn btn-opt mt-1 me-1 ${formData.q5 === 'Significantly more positive' ? 'active' : ''}`} onClick={() => setFormData({...formData, q5: 'Significantly more positive'})}>Significantly more positive</button>
                            </div>

                        </section>
                    )}

                    {/* STEP 6 */}
                    {step === 6 && (
                        <section>
                            <h3>Section 6</h3>
                            <p>
                                6) What was the most valuable topic or discussion from the conference for you?
                            </p>
                            <textarea
                                className="form-control mt-2 fr-large"
                                rows="3"
                                placeholder="Share your thoughts here..."
                                value={formData.q6}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        q6: e.target.value
                                    })
                                }
                            />

                           
                        </section>
                    )}

                    {/* STEP 7 */}
                    {step === 7 && (
                        <section>

                            <h3>Section 7</h3>
                            <p>
                                7) How likely are you to recommend The Local Choice franchise to another independent pharmacy owner?
                            </p>
                            <RatingScale name="q7" /> 
                              <div className="ct-range-part">
                                    <div className="lk-info">[1 Not likely</div>
                                    <div className="lk-info"> 5 likely]</div>
                                </div>   
                        </section>
                    )}

                    {/* STEP 8 */}
                    {step === 8 && (
                        <section>

                            <h3>Section 8</h3>
                            <p>
                                We are forming a network of pharmacy owners to be part of future research and to be thought partners in collaborative discussions on future ideas, when needed. Participation is voluntary, and your information will be used solely for this specified purpose.
                            </p>
                            <p>
                                8) How would you rate the potential for improved collaboration between your company and CJ Distribution after the conference?
                            </p>

                            <div className="custom-radio-group">
                                <button className={`btn btn-opt mt-1 me-1 ${formData.q8 === 'Yes' ? 'active' : ''}`} onClick={() => setFormData({...formData, q8: 'Yes'})}>Yes</button>
                                <button className={`btn btn-opt mt-1 me-1 ${formData.q8 === 'No' ? 'active' : ''}`} onClick={() => setFormData({...formData, q8: 'No'})}>No</button>
                            </div>   

                            {
                                formData.q8 === 'Yes' && <>
                                        <p className="mt-3">Please share your details below</p>
                                                <label>Name</label>
                                                <input
                                                    type="text" 
                                                    className="form-control mt-2 " 
                                                    placeholder="Share your thoughts here..."
                                                    value={formData.contactName}
                                                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                                                />
                                                
                                                <label className="mt-3">Surname</label>
                                                <input
                                                    type="text" 
                                                    className="form-control mt-2 " 
                                                    placeholder="Share your thoughts here..."
                                                    value={formData.contactSurname}
                                                    onChange={(e) => setFormData({...formData, contactSurname: e.target.value})}
                                                />
                                            
                                                <label className="mt-3">Phone Number</label>
                                                <input
                                                    type="text" 
                                                    className="form-control mt-2 " 
                                                    placeholder="Share your thoughts here..."
                                                    value={formData.contactNumber}
                                                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                                                />
                                                
                                                <label className="mt-3">Email</label>
                                                <input
                                                    type="text" 
                                                    className="form-control mt-2 " 
                                                    placeholder="Share your thoughts here..."
                                                    value={formData.contactEmail}
                                                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                                                />
                                 </>
                            }
                        </section>
                    )}

                    {/* STEP 9 */}
                    {step === 9 && (
                        <section>

                            {
                                submitMessage.length === 0
                                    ? <h3>Please Submit the form</h3>
                                    : <div className="success-message">{submitMessage}</div>
                            }

                            {
                                loading && <Loading />
                            }

                        </section>
                    )}

                </div>

                {
                    submitMessage.length === 0 && (

                        <div className="form-footer">

                            <button
                                className="btn-back"
                                disabled={step === 1}
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </button>

                            {
                                step < 9 ? (

                                    <button
                                        className={`btn-next ${!isStepValid() ? 'btn-disabled' : ''}`}
                                        disabled={!isStepValid()}
                                        onClick={() => setStep(step + 1)}
                                    >
                                        Next Step
                                    </button>

                                ) : (

                                    <button
                                        className="btn btn-mevent btn-submit"
                                        onClick={() => handleSubmitForm()}
                                        disabled={loading}
                                    >
                                        Submit
                                    </button>
                                )
                            }
                        </div>
                    )
                }
            </div>
            <br/><br/>
        </div>
    );
}
export default SurveyThreeWidget