import React, { useEffect, useRef, useState } from 'react';
import './authstyle.css'
import HeaderLogo from './../assets/logo.png';
import * as CONSTANTS from "../CONSTANTS";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../reduxAuth/authSlice';
import Spinner from '../Components/Others/Spinner';
import axios from 'axios';

function AuthRegisterScreen() {
  const navigate                                        = useNavigate();
  const dispatch                                        = useDispatch();

  const {user, isLoading, isError, isSuccess, message}  = useSelector((state) => state.auth);

  const [pharmacyProcess, setPharmacyProcess]             = useState(false);
  const [typeGroup, setTypeGroup]                           = useState("franchise");
  const [pharmacyName, setPharmacyName]                   = useState("");
  const [pharmacyCode, setPharmacyCode]                   = useState("");
  const [searchWord, setSearchWord]                       = useState("");

  const [txtSearchValue, setTxtSearchValue]               = useState("");

  const nameRef                                           = useRef();
  const surnameRef                                        = useRef();
  const phoneNumberRef                                    = useRef();
  const passwordRef                                       = useRef();
  const emailRef                                          = useRef();

  const [listSearch, setListSearch]                                                      = useState([]);
 
  const timeoutRef                                        = useRef(null);

  useEffect(() => {
      if(isError){
          toast.error(message)
      }
    
      if(isSuccess || user){
        navigate('/');
      }

        dispatch(reset());
  },[user, isError, isSuccess, message, navigate, dispatch])


  const handleRegister = async (e) => {
    e.preventDefault();

      let checkTest = isValidPhoneNumber(phoneNumberRef.current.value);
      if(checkTest){

            try{

              if(passwordRef.current.value.length > 1 && 
                 nameRef.current.value.length > 1 && 
                 surnameRef.current.value.length > 1 ){
                  

                   if(pharmacyName.length === 0){
                      toast.warning("Pharmacy cannot be empty");
                      return;
                   }

                    const userData = {
                      "phonenumber": phoneNumberRef.current.value,
                      "password": passwordRef.current.value,
                      "pharmacyname": pharmacyName,
                      "pharmacycode": pharmacyCode,
                      "name": nameRef.current.value,
                      "surname": surnameRef.current.value,
                      "email": emailRef.current.value,   
                      "token": "",  
                      "apptype": "web",                      
                      "profilePic":""
                    }        
                    
                    dispatch(register(userData));
                 }else {
                    toast.error("Please fill in required fields");
                 }
                
            }catch(errorData){
              console.log(errorData);
            }
      }else {
          toast.error("Phone Number not valid");
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

  const handleUpdateSearchWord = (e) => {

    const txtSearch = e.target.value;
    setSearchWord(e.target.value);
    if(txtSearch.length > 0){      
      
      if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
      }

       // Set a new timeout
       if (txtSearch.length > 2) {
            timeoutRef.current = setTimeout(() => {
                executeSearchNow(txtSearch);
            }, 1000); // Adjust the delay (in milliseconds) as needed
        }       

    }
  }

  const executeSearchNow = async (content) =>{
    try{
      setPharmacyProcess(true);
          
          const obSearch = {
            "searching" : content
          }

          let config = {
              method: 'put',
              maxBodyLength: Infinity,
              url: CONSTANTS.API_URL +"settings/search/advanced/",
              headers: { 
                "Content-Type": "application/json"
              },
              data : obSearch
            };

          //))))))))
          const resData = await axios.request(config);
          //))))))))

          if(resData.data.length > 0){
              setListSearch(resData.data);
          }else {
            toast.error("Nothing found");
          }
          
          setPharmacyProcess(false);
      }catch(err){
        setPharmacyProcess(false);
        console.log(err);
        toast.error(err.response.data);
      }
  }

  const handleCurrentSearch = (searched) => {
        setPharmacyName(searched.title);
        setPharmacyCode(searched.code);
        
        //setTxtSearchValue(searched.short);
        setSearchWord(searched.short);
        setListSearch([])
  }

  if (isLoading) {
      return  <Spinner />
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
                      <h4 className="title-login text-center">Register</h4>
                          <form encType="multipart/form-data">
                              <div className="form-group frg">
                                  <input 
                                    type="text" className="form-control ct-content matetrial-input wide100" 
                                    ref={phoneNumberRef} 
                                    maxLength={10} 
                                    placeholder="Enter Phone Number*" required/>
                              </div>
                              <div className="form-group frg">
                                  <input type="password" 
                                    className="form-control ct-content matetrial-input wide100"  
                                    ref={passwordRef} 
                                    placeholder="Enter Password*" required/>
                              </div>
                              <div className="form-group frg">
                                  <input type="text" 
                                    className="form-control ct-content matetrial-input" 
                                    ref={nameRef} 
                                    placeholder="Enter Name*" required/>
                              </div>
                              <div className="form-group frg">
                                  <input 
                                      type="text" 
                                      className="form-control ct-content matetrial-input"  
                                      ref={surnameRef} 
                                      placeholder="Enter Surname*" required/>
                              </div>
                              <div className="form-group frg">
                                  <input type="email" 
                                    className="form-control ct-content matetrial-input"  
                                    ref={emailRef} placeholder="Enter Email Address" />
                              </div>
                                                   
                              <div className="form-group mgtop20">
                                <div className="radio-options mb-4">
                                  <label className="me-3">
                                    <input
                                      type="radio"
                                      name="pharmacyType"
                                      value="franchise"
                                      checked={typeGroup === "franchise"}
                                      onChange={() => {
                                            setTypeGroup("franchise");
                                            setPharmacyName("");
                                            setPharmacyCode("");
                                            setTxtSearchValue("");
                                          }
                                      }
                                    />
                                    <span>Franchise </span>
                                  </label>
                                  <label>
                                    <input
                                      type="radio"
                                      name="pharmacyType"
                                      value="independent"
                                      checked={typeGroup === "independent"}
                                      onChange={() => {
                                          setTypeGroup("independent");
                                            setPharmacyName("");
                                            setPharmacyCode("");
                                            setTxtSearchValue("");
                                            setSearchWord("");
                                          }
                                      }
                                    />
                                    <span>Independent</span>
                                  </label>
                                </div>    

                                {typeGroup === "franchise" && (
                                    <div className="rad-group franchise-section">
                                      <label>Search TLC Pharmacy</label>
                                
                                      <div className="form-group">
                                        <small>The Local Choice:</small>
                                        <input
                                          type="text"
                                          className="form-control ct-content matetrial-input"
                                          placeholder="Enter Pharmacy Name"
                                          value={searchWord}
                                          onChange={e => handleUpdateSearchWord(e)} 
                                          required/>
                                      </div>

                                     {
                                      listSearch && 
                                      listSearch.length > 0 && (
                                         <div className="search-listing">
                                           <ul className="special-uis">
                                           {
                                               listSearch.map((searchItem, index) => {
                                                return <li className="card" key={index} onClick={() => handleCurrentSearch(searchItem)}>
                                                          <div className="card-box layitem-reg">
                                                          {searchItem.short}
                                                          </div>
                                                        </li>
                                               })
                                            }
                                           </ul>
                                         </div>
                                      )
                                     }

                                    </div>
                                  )}

                                  {typeGroup === "independent" && (
                                    <div className="rad-group independent-section">
                                      <label>Add Independent Pharmacy</label>
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          className="form-control ct-content matetrial-input"
                                          placeholder="Enter Pharmacy Name"
                                          onChange={(e) => setPharmacyName(e.target.value)}
                                          required
                                        />
                                      </div>
                                    </div>
                                  )}
                              </div>
                              <div className="form-group mgtop20">
                                  <button 
                                      className="btn btn-mevent btn-full" 
                                      onClick={handleRegister} 
                                      disabled={isLoading}>Register
                                  </button>
                              </div>
                              <div className=" frg">
                              </div>
                          </form>
                                                    
                          <p className="mgtop20 space-flex txts12">
                              <Link to="/forgot-password"  className="link-log-text">Forgot Password?</Link>
                              <Link to="/login"  className="link-log-text">Login?</Link>
                          </p>
                          <p className="text-center smal-g">
                          { CONSTANTS.VERSION}
                          </p>
                          <div className="dot dot1" ></div>
                          <div className="dot dot2" ></div>
                  </div>
                 
        
              </div>
                {
                  pharmacyProcess && (
                    <img className="image-dispay" src={CONSTANTS.SMALLER_PROCESS} />
                  )
                }
          </div>
      </div>       
  </div>
  )
}

export default AuthRegisterScreen