import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify';
import Spinner from '../Components/Others/Spinner';
import { Link } from 'react-router-dom';
import HeaderLogo from './../assets/logo.png';
import * as CONSTANTS from "../CONSTANTS";
import axios from 'axios';

function AuthForgotScreen() {

    const [isLoading, setIsLoading]                         = useState(false);
    const phoneNumberRef                                    = useRef();
    const smsCodeResetRef                                   = useRef();
    
    const [newPassword, setNewPassword]                     = useState("");
    const [confirmNewPassword, setConfirmNewPassword]       = useState("")

    const [showResetPass, setShowResetPass]                 = useState(false);

    const handleForgotPassword = async (e) => {
      e.preventDefault();

       try{

        let checkTest = isValidPhoneNumber(phoneNumberRef.current.value);  
        if(checkTest){
            const userData = {
                "phonenumber": phoneNumberRef.current.value
              }        
                         
              setIsLoading(true);
              const passRespond = await axios.put(CONSTANTS.API_URL +"auth/password/reset/sms", userData);

              console.log(passRespond);
              setShowResetPass(true);
              setIsLoading(false);
              toast.success("Your going to receive an sms code to use to reset your password.")
        }else {
            toast.error("Phone Number not valid");
            setIsLoading(false);
        }

       }catch(error){
        console.log(error);
        setIsLoading(false);
        toast.error("Something went wrong, please try again later.")
       }
    }

    function isValidPhoneNumber(cell){
        if (!cell) {
          return false; // Handle empty input
        }
      
        // Remove any non-digit characters (e.g., spaces, hyphens, parentheses)
        const cleanedPhoneNumber = cell.replace(/\D/g, '');
        // Check if the cleaned number is exactly 10 digits
        return /^\d{10}$/.test(cleanedPhoneNumber);
    }
    
    if (isLoading) {
          return  <Spinner />
    }

    const handleUpdateForgotPassword = async (e) => {
          e.preventDefault();
           
            if(newPassword.length > 5){
                if(newPassword === confirmNewPassword){

                    const userData = {
                        "code": smsCodeResetRef.current.value,
                        "password": newPassword
                      }        
                      
                      setIsLoading(true);
                      const response = await axios.put(CONSTANTS.API_URL +"auth/paswordsreset", userData);
                      
                      //console.log(response);
                      setIsLoading(false);
                      
                   toast.success("Your password has been updated, please login.")
                }else {
                    toast.error("Passwords don't match");
                }
            }else {
                toast.error("Password should be at least six characters long.");
            }
    }

  return (
    <div className="logo-base flexlog">
      <div className="log-start">
          
          <div className="main-login-data">
            <div className="reg-header ">
                <img src={HeaderLogo} className="logo-one" alt="The Local Choice" />         
            </div>
              <div className="form-card ">
                  <div className="frm-log-area">
                      <h4 className="title-login text-center">Forgot Password</h4>
                      {
                          showResetPass === false ? 
                          <>
                            <form encType="multipart/form-data">
                                <div className="form-group frg">
                                    <input type="text" className="form-control ct-content matetrial-input wide100" ref={phoneNumberRef} maxLength={10} placeholder="Enter Phone Number" required/>
                                </div>
                                <div className="form-group mgtop20">
                                    <button className="btn btn-mevent btn-full" onClick={handleForgotPassword} disabled={isLoading}>Submit</button>
                                </div>
                                <div className=" frg">
                                </div>
                            </form>   
                          </>
                          :
                            <div className="reset-role">
                                <p className="text-center"><strong>Reset your password</strong> </p>
                               
                                <form encType="multipart/form-data">
                                    <div className="form-group frg">
                                    <p>Enter the code sent to your phone and set a new password</p>
                                        <input type="text" 
                                            className="form-control ct-content matetrial-input wide100" 
                                            ref={smsCodeResetRef} 
                                            placeholder="Enter SMS Code" 
                                            required/>
                                    </div>
                                    <div className="form-group frg">
                                        <p>New Password</p>
                                        <input type="text" 
                                            className="form-control ct-content matetrial-input wide100" 
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter Password" 
                                            required/>
                                    </div>
                                    <div className="form-group frg">
                                        <p>Confirm New Password</p>
                                        <input type="text" 
                                            className="form-control ct-content matetrial-input wide100" 
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            placeholder="Confirm Enter Password" 
                                            required/>
                                    </div>
                              
                                    <div className="form-group mgtop20">
                                        <button className="btn btn-mevent btn-full" onClick={handleUpdateForgotPassword} disabled={isLoading}>Submit</button>
                                    </div>
                                       
                                    <div className=" frg">
                                    </div>
                                </form>  
                            </div> 
                      }
                                                
                          
                          {
                            /*
                            <p className="mgtop20 space-flex txts12">
                              <Link to="/login"  className="link-log-text">Login?</Link>
                              <Link to="/register"  className="link-log-text">Register?</Link>
                          </p>
                            */
                          }
                          <p className="mgtop20 txts12">
                              <Link to="/login"  className="link-log-text">Login?</Link>
                          </p>
                          <p className="text-center smal-g">
                          { CONSTANTS.VERSION}
                          </p>
                          <div className="dot dot1" ></div>
                          <div className="dot dot2" ></div>
                  </div>
              </div>
          
          </div>
      </div>       
  </div>
  )
}

export default AuthForgotScreen