import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../../Others/Loading';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux'; 
import { 
  FaClinicMedical, FaFax, FaCoins, FaBullhorn, 
  FaHandsHelping, FaPeopleCarry,  
  FaPlusCircle, FaCommentDots
} from 'react-icons/fa';

function SurveyTwoWidget({user, CONSTANTS}) {
     const [loading, setLoading]                         = useState(false);
     const [formData, setFormData]                                  = useState({
             q1: "",
             
          });
          
          const [step, setStep]                                          = useState(1);
          const [submitMessage, setSubmitMessage]                        = useState("");
     
         /*
         useEffect(() => {
             console.log(formData)
         },[formData])
         */
         
         const steps = [
             { id: 1, label: 'I', icon: <FaClinicMedical /> },
             { id: 2, label: 'II', icon: <FaClinicMedical /> },
             { id: 3, label: 'III', icon: <FaFax /> },
             { id: 4, label: 'IV', icon: <FaCoins /> },
             { id: 5, label: 'V', icon: <FaBullhorn /> },
         ];
     
          const currentIcon = steps.find(s => s.id === step)?.icon;
     
         const isStepValid = () => {
             const validationMap = {
                 1: ['q1', 'q2'],
                 2: ['q2B'], 
                 3: ['q3'],
                 4: ['q4'],
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
             
   
         const handleSubmitForm = async () => {
                 try {
                     setLoading(true);
                     const payload = {
                         "kind" : user.profile.profileName === "Franchisee" ? "Franchisees" : "Others",
                         "q1": formData.q1,
                         "q2": formData.q2,
                         "q2B": formData.q2B,
                         "q3": formData.q3,
                         "q4": formData.q4,
                         optionalContactName: user.name,     
                         optionalContactSurName : user.surname,
                         optionalContactPhone : user.phonenumber,
                         optionalContactEmail: user.email,
                     };
         
                     console.log(payload);
                     console.log("++++++++++++++++++");
     
                     const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwSGMArs38paG_OHut8AEY9mnqlMMLqSxNsz78cCC02Y9kI32HD0DAn-PViRp3SWXZOSQ/exec';
                     
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
                  <h3 className="text-center">Mid Conference</h3>
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
                                              <p>2) In a word or short phrase, how would you describe how you're feeling about The Local Choice right now?</p>
                                              <textarea 
                                                  className="form-control mt-2 fr-large" 
                                                  rows="3"
                                                  placeholder="Share your thoughts here..."
                                                  value={formData.q2}
                                                  onChange={(e) => setFormData({...formData, q2: e.target.value})}
                                              />
                                          </>
                                      :
                                          <>
                                          <p>2) In a word or short phrase, how would you describe how you're feeling about The Local Choice based on what you’ve seen or heard so far?</p>
                                              <textarea 
                                                  className="form-control mt-2 fr-large" 
                                                  rows="3"
                                                  placeholder="Share your thoughts here..."
                                                  value={formData.q2}
                                                  onChange={(e) => setFormData({...formData, q2: e.target.value})}
                                              />                                                       
                                          </>
                              }
                              
                          </section>
                      )}
                      {step === 2 && (
                          <section>
                              <h3>Section 2</h3>
                              <p className="mt-3">2.2) What is driving that feeling?</p>
                              <textarea 
                                      className="form-control mt-2 fr-large" 
                                      rows="3"
                                      placeholder="Share your thoughts here..."
                                      value={formData.q2B}
                                      onChange={(e) => setFormData({...formData, q2B: e.target.value})}
                                  />
                                                                      
                          </section>
                      )}
                      {step === 3 && (
                          <section>
                              <h3>Section 3</h3>
                              <p>3) What is your immediate reaction to the new launch?</p>
                              <div className="custom-radio-group">
                                  <button className={`btn btn-opt mt-1 me-1 ${formData.q3 === 'Overwhelmed' ? 'active' : ''}`} onClick={() => setFormData({...formData, q3: 'Overwhelmed'})}>Overwhelmed</button>
                                  <button className={`btn btn-opt mt-1 me-1 ${formData.q3 === 'Sceptical' ? 'active' : ''}`} onClick={() => setFormData({...formData, q3: 'Sceptical'})}>Sceptical</button>
                                  <button className={`btn btn-opt mt-1 me-1 ${formData.q3 === 'Concerned' ? 'active' : ''}`} onClick={() => setFormData({...formData, q3: 'Concerned'})}>Concerned</button>
                                  <button className={`btn btn-opt mt-1 me-1 ${formData.q3 === 'Unsure' ? 'active' : ''}`} onClick={() => setFormData({...formData, q3: 'Unsure'})}>Unsure</button>
                                  <button className={`btn btn-opt mt-1 me-1 ${formData.q3 === 'Confident' ? 'active' : ''}`} onClick={() => setFormData({...formData, q3: 'Confident'})}>Confident</button>
                                  <button className={`btn btn-opt mt-1 me-1 ${formData.q3 === 'Curious' ? 'active' : ''}`} onClick={() => setFormData({...formData, q3: 'Curious'})}>Curious</button>
                                  <button className={`btn btn-opt mt-1 me-1 ${formData.q3 === 'Excited' ? 'active' : ''}`} onClick={() => setFormData({...formData, q3: 'Excited'})}>Excited</button>
                              </div>                                 
                          </section>
                      )}
      
                      {step === 4 && (
                          <section>
                              <h3>Section 5</h3>
                              <p className="mt-3">4) What is the one thing that excites you most or concerns you most about the launch?</p>
                              <textarea 
                                      className="form-control mt-2 fr-large" 
                                      rows="3"
                                      placeholder="Share your thoughts here..."
                                      value={formData.q4}
                                      onChange={(e) => setFormData({...formData, q4: e.target.value})}
                                  />
                          </section>
                      )}

                      {step === 5 && (
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
                              step < 5 ? (
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

export default SurveyTwoWidget