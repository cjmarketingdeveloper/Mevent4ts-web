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
        q9: "",
        contactName: "",
        contactSurname: "",
        companyName: "",
        role: "",
        contactNumber: "",
        contactEmail: "",
    });

    const [step, setStep] = useState(1);
    const [submitMessage, setSubmitMessage] = useState("");

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
            3: ['q3'],
            4: ['q4'],
            5: ['q5'],
            6: ['q6'],
            7: ['q7'],
            8: ['q8'],
            9: ['q9'],
        };

        const requiredFields = validationMap[step] || [];

        return requiredFields.every(field => {
            const value = formData[field];
            return value !== undefined && value !== null && value !== '';
        });
    };

    const handleSubmitForm = async () => {

        try {

            setLoading(true);
            const payload = {
                q1: formData.q1,
                q2: formData.q2,
                q3: formData.q3,
                q4: formData.q4,
                q5: formData.q5,
                q6: formData.q6,
                q7: formData.q7,
                q8: formData.q8,
                q9: formData.q9,
                contactName: formData.contactName,
                contactSurname: formData.contactSurname,
                companyName: formData.companyName,
                role: formData.role,
                contactNumber: formData.contactNumber,
                contactEmail: formData.contactEmail,
            };

            console.log(payload);

            const SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 0) {

                setSubmitMessage(
                    "Thank you for taking the time to share your perspective. Your input will help us improve future conferences and collaborations."
                );

            } else {

                setSubmitMessage(
                    "Submission was not successful, please try again later."
                );
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
                                1) In a single word, how would you describe how you're feeling about CJ Distribution and The Local Choice Pharmacy after attending the conference?
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
                            <p>
                                2) What most influenced that feeling during the conference?
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
                        </section>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <section>
                            <h3>Section 3</h3>
                            <p>
                                3) Did the conference meet your expectations?
                            </p>

                            <div className="custom-radio-group">

                                {[
                                    'Did not meet expectations at all',
                                    'Somewhat did not meet expectations',
                                    'Met expectations',
                                    'Somewhat exceeded expectations',
                                    'Exceeded expectations'
                                ].map((item) => (
                                    <button
                                        key={item}
                                        className={`btn btn-opt mt-1 me-1 ${formData.q3 === item ? 'active' : ''}`}
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                q3: item
                                            })
                                        }
                                    >
                                        {item}
                                    </button>
                                ))}

                            </div>

                        </section>
                    )}

                    {/* STEP 4 */}
                    {step === 4 && (
                        <section>

                            <h3>Section 4</h3>

                            <p>
                                4) What was the most valuable topic or discussion from the conference for you?
                            </p>

                            <textarea
                                className="form-control mt-2 fr-large"
                                rows="3"
                                placeholder="Share your thoughts here..."
                                value={formData.q4}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        q4: e.target.value
                                    })
                                }
                            />

                        </section>
                    )}

                    {/* STEP 5 */}
                    {step === 5 && (
                        <section>

                            <h3>Section 5</h3>

                            <p>
                                5) After attending the conference, how would you rate your overall satisfaction with the CJ Distribution and The Local Choice as a business partner?
                            </p>

                            <div className="custom-radio-group">

                                {[
                                    'Very dissatisfied',
                                    'Dissatisfied',
                                    'Neither dissatisfied nor satisfied',
                                    'Satisfied',
                                    'Very satisfied'
                                ].map((item) => (
                                    <button
                                        key={item}
                                        className={`btn btn-opt mt-1 me-1 ${formData.q5 === item ? 'active' : ''}`}
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                q5: item
                                            })
                                        }
                                    >
                                        {item}
                                    </button>
                                ))}

                            </div>

                        </section>
                    )}

                    {/* STEP 6 */}
                    {step === 6 && (
                        <section>

                            <h3>Section 6</h3>

                            <p>
                                6) Based on your conference experience and what you heard, how confident are you in CJ Distributions’ ability to improve supply chain efficiency going forward?
                            </p>

                            <div className="custom-radio-group">

                                {[
                                    'Not confident at all',
                                    'Not confident',
                                    'Somewhat efficient',
                                    'Confident',
                                    'Very confident'
                                ].map((item) => (
                                    <button
                                        key={item}
                                        className={`btn btn-opt mt-1 me-1 ${formData.q6 === item ? 'active' : ''}`}
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                q6: item
                                            })
                                        }
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* STEP 7 */}
                    {step === 7 && (
                        <section>

                            <h3>Section 7</h3>

                            <p>
                                7) Based on your conference experience and what you heard, how confident are you in CJ Distributions and Marketing’s ability to effectively execute marketing for your products at store level?
                            </p>

                            <div className="custom-radio-group">

                                {[
                                    'Not confident at all',
                                    'Not confident',
                                    'Somewhat efficient',
                                    'Confident',
                                    'Very confident'
                                ].map((item) => (
                                    <button
                                        key={item}
                                        className={`btn btn-opt mt-1 me-1 ${formData.q7 === item ? 'active' : ''}`}
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                q7: item
                                            })
                                        }
                                    >
                                        {item}
                                    </button>
                                ))}

                            </div>

                        </section>
                    )}

                    {/* STEP 8 */}
                    {step === 8 && (
                        <section>

                            <h3>Section 8</h3>

                            <p>
                                8) How would you rate the potential for improved collaboration between your company and CJ Distribution after the conference?
                            </p>

                            <div className="custom-radio-group">

                                {[
                                    'Significantly decreased potential',
                                    'Decreased potential',
                                    'No change in potential',
                                    'Somewhat improved potential',
                                    'Significantly improved potential'
                                ].map((item) => (
                                    <button
                                        key={item}
                                        className={`btn btn-opt mt-1 me-1 ${formData.q8 === item ? 'active' : ''}`}
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                q8: item
                                            })
                                        }
                                    >
                                        {item}
                                    </button>
                                ))}

                            </div>

                        </section>
                    )}

                    {/* STEP 9 */}
                    {step === 9 && (
                        <section>

                            <h3>Section 9</h3>

                            <p>
                                9) Would you be open to being contacted for future research or collaboration opportunities?
                            </p>

                            <p className="small text-muted">
                                Participation is voluntary, and your information will be used solely for this specified purpose.
                            </p>

                            <div className="custom-radio-group mb-3">

                                <button
                                    className={`btn btn-opt mt-1 me-1 ${formData.q9 === 'Yes' ? 'active' : ''}`}
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            q9: 'Yes'
                                        })
                                    }
                                >
                                    Yes
                                </button>

                                <button
                                    className={`btn btn-opt mt-1 me-1 ${formData.q9 === 'No' ? 'active' : ''}`}
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            q9: 'No'
                                        })
                                    }
                                >
                                    No
                                </button>

                            </div>

                            {
                                formData.q9 === 'Yes' && (
                                    <div className="mt-4">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label>Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.contactName}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            contactName: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label>Surname</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.contactSurname}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            contactSurname: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label>Company Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.companyName}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            companyName: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label>Role</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.role}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            role: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label>Contact Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.contactNumber}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            contactNumber: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label>Email Address</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={formData.contactEmail}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            contactEmail: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                        </section>
                    )}

                    {/* STEP 10 */}
                    {step === 10 && (
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
                                step < 10 ? (

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
        </div>
    );
}
export default SurveyThreeWidget