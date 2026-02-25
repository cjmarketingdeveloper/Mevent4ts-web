import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../../../Components/Others/Loading';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux'; 
import { updateUserLocal } from '../../../reduxAuth/authSlice';

function ClinicRsvp({user, CONSTANTS}) {

    const [myDietary, setMyDietary]                     = useState([]);
    const [loading, setLoading]                         = useState(false);

    const [editSection, setEditSection]                   = useState(null);

    const [updatedName, setUpdatedName]                   = useState(user.name);
    const [updatedSurname, setUpdatedSurname]             = useState(user.surname);
    const [updateProfession, setUpdateProfession]         = useState(user.profession);
    
    //////////////Events
    //local: Live:57987
    const clinicEventCode  = "57987";
    const userEvents = user.events || [];
    const initialClinic = user.pcdt && userEvents.includes(clinicEventCode);
    const [updatedClinic, setUpdatedClinic] = useState(initialClinic);
    const [updatedPcdt, setUpdatedPcdt] = useState(user.pcdt);
    /////////////////////Dietary & Allergies
    const [listDietary, setListDietary]                     = useState([]);
    const [updatedDietary, setUpdatedDietary]                 = useState(user.dietary || "");
    const [updatedAllergies, setUpdatedAllergies] = useState(user.allergies || []);
    const [allergyInput, setAllergyInput] = useState("");

    // Helper to add an allergy
    const addAllergy = () => {
        if (allergyInput.trim() && !updatedAllergies.includes(allergyInput.trim())) {
            setUpdatedAllergies([...updatedAllergies, allergyInput.trim()]);
            setAllergyInput(""); // Clear input
        }
    };

    // Helper to remove an allergy
    const removeAllergy = (indexToRemove) => {
        setUpdatedAllergies(updatedAllergies.filter((_, index) => index !== indexToRemove));
    };
    /////////////////////Pharmacy
    const [pharmacy, setPharmacy]                               = useState(null);
    const [updatedPharmacyCode, setUpdatedPharmacyCode]         = useState(user.pharmacycode || "");
    const [validPharmacyCode, setValidPharmacyCode]             = useState(false);
    /////////////////////Accomodation
    const [accommodationData, setAccommodationData]             = useState(null);
    const [loadingAccommodation, setLoadingAccommodation]       = useState(false);

    // Editable states
    const [updatedRequireAccommodation, setUpdatedRequireAccommodation] = useState(false);
    const [updatedAccommodationType, setUpdatedAccommodationType] = useState("");
    const [updatedAdditionalArrangements, setUpdatedAdditionalArrangements] = useState("");
    const [updatedUserAccommodationNote, setUpdatedUserAccommodationNote] = useState(user.accommodation || "");
    ////////////////////Flight
    const [flightData, setFlightData] = useState(null);
    const [loadingFlight, setLoadingFlight] = useState(false);
    const [airportList, setAirportList]                = useState([]);
    // Editable fields
    const [updatedAirport, setUpdatedAirport] = useState("");
    const [hasFlight, setHasFlight]           = useState(false);

    //reset user
    const dispatch                                        = useDispatch();

    useEffect(() => {
        getMyDietaryType();
        listTheDietaries();
        getCurrentPharmacy();
        getAccommodation();
        getFlight();
        getAirports();
    },[])

    const getFlight = async () => {
        try {
            
            const result = await axios.get(CONSTANTS.API_URL +"flights/single/flight/v1/" + user._id,  {
                headers: {
                    token: "Bearer "+ user.accessToken
                }
            });

            if (result.data.length > 0) {
              setHasFlight(true);
              setFlightData(result.data[0]);
            }
            setLoadingFlight(false);
        } catch (error) {
          setLoadingFlight(false);
            console.log("Error fetching airports", error);
        }
    }

    const getAirports = async () => {
        try {
            
            const result = await axios.get(CONSTANTS.API_URL +"flights/airports/collect/list/v1");
            if (result.data) {
              setAirportList(result.data);
            }
        } catch (error) {
            console.log("Error fetching airports", error);
        }
    }

    const getMyDietaryType = async () => {
        try{
            
            const diet = await axios.get(CONSTANTS.API_URL +"settings/single/dietary/type/v1/" + user.dietary);
            
            if(diet.data && Object.keys(diet.data).length > 0){
                setMyDietary(diet.data);
            }

        }catch(errorData){
            console.log(errorData);
        }
    }

    const listTheDietaries = async () => {
        try{

            const diet = await axios.get(CONSTANTS.API_URL +"settings/list/dietaries/v2");
    
            if(diet.data.length > 0){
                setListDietary(diet.data);
            }
        }catch(errorData){
            console.log(errorData);
        }
    }

    const getCurrentPharmacy = async () => {
        try
            {                         
                const response = await axios.get(CONSTANTS.API_URL +"settings/pharmacy/item/v1/" + user.pharmacycode);
                setPharmacy(response.data); 
        }catch(err){
            console.log(err);
            toast.error("Something went wrong, please try again later!");
        }
    }

    const getAccommodation = async () => {
      try {

        setLoadingAccommodation(true);

        const result = await axios.get(CONSTANTS.API_URL + "users/accomodation/item/by-user/" + user._id);
        if (result.data) {
          setAccommodationData(result.data[0]);
          setUpdatedRequireAccommodation(result.data[0].requireAccommodation);
          setUpdatedAccommodationType(result.data[0].accomodationType);
          setUpdatedAdditionalArrangements(result.data[0].additionalArrangements);
        }

        setLoadingAccommodation(false);
      } catch (error) {
        setLoadingAccommodation(false);
        console.log(error);
      }
    };

    const handlePersonalSave = async () => {
        try {

          const updateData = {};

          if (updatedName !== user.name) {
            updateData.name = updatedName;
          }

          if (updatedSurname !== user.surname) {
            updateData.surname = updatedSurname;
          }
           

          if (Object.keys(updateData).length === 0) {
            toast.info("No changes detected");
            return;
          }

          const userUpdate = {
            id: user._id,
            data: updateData
          };

          setLoading(true);
          
          const result = await axios.put(CONSTANTS.API_URL + "users/update/rsvp/details/v1/",
            userUpdate
          );

          toast.success(result.data.message);
          setEditSection(null);
          setLoading(false);
          
          // --- UPDATE REDUX & LOCAL STORAGE HERE ---
          // Pass the updated user object from the response
          dispatch(updateUserLocal(result.data.user));

        } catch (error) {
          toast.error("Update failed");
           setLoading(false);
        }
    };

   const handleEventsSave = async () => {
      try {
        const updateData = {};
        let updatedEventsArray = [...(user.events || [])];

        // 1. Sync Clinic Event Code based on PCDT status
        const currentlyHasClinic = updatedEventsArray.includes(clinicEventCode);

        if (updatedPcdt && !currentlyHasClinic) {
          // Add it if they are PCDT and it's missing
          updatedEventsArray.push(clinicEventCode);
        } 

        // 2. Build updateData object
        if (updatedEventsArray.join(',') !== (user.events || []).join(',')) {
          updateData.events = updatedEventsArray;
        }
        if (updatedPcdt !== user.pcdt) {
          updateData.pcdt = updatedPcdt;
        }
        if (updateProfession !== user.profession) {
          updateData.profession = updateProfession;
        }

        if (Object.keys(updateData).length === 0) {
          toast.info("No changes detected");
          return;
        }

        setLoading(true);
        const result = await axios.put(
          CONSTANTS.API_URL + "users/update/rsvp/details/v1/",
          { id: user._id, data: updateData }
        );

        toast.success(result.data.message);
        setEditSection(null);
        setLoading(false);
        dispatch(updateUserLocal(result.data.user));

      } catch (err) {
        toast.error("Update failed");
        setLoading(false);
      }
    };

     const handleDietarySave = async (section) => {
        try {
            const updateData = {};

            // Dietary check
            if (updatedDietary !== user.dietary) {
                updateData.dietary = updatedDietary;
            }

            if (JSON.stringify(updatedAllergies) !== JSON.stringify(user.allergies)) {
                  updateData.allergies = updatedAllergies;
            }

            if (Object.keys(updateData).length === 0) {
                toast.info("No changes detected");
                return;
            }

            setLoading(true);
            const result = await axios.put(CONSTANTS.API_URL + "users/update/rsvp/details/v1/",
                { id: user._id, 
                  data: updateData 
                }
            );

            // Sync Redux and Local Storage
            dispatch(updateUserLocal(result.data.user));

            // Update the display object locally so the UI updates title/badge immediately
            // Find the full diet object from our list to update 'myDietary' state
            const selectedDietObj = listDietary.find(d => d._id === updatedDietary);
            setMyDietary(selectedDietObj);

            toast.success(result.data.message);
            setEditSection(null);
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    const handlePharmacySave = async () => {
        // 1. Check if the code actually changed
        if (updatedPharmacyCode === user.pharmacycode) {
            toast.info("No changes detected");
            setEditSection(null);
            return;
        }

        try {
            setLoading(true);

            const updateData = {
                pharmacycode: updatedPharmacyCode
            };

            // 2. Perform the Update
            const result = await axios.put(CONSTANTS.API_URL + "users/update/rsvp/details/v1/",
                { id: user._id, data: updateData }
            );

            // 3. Sync Redux and Local Storage using our custom action
            dispatch(updateUserLocal(result.data.user));

            // 4. Refresh the Pharmacy Title display
            // We pass the new code directly to ensure the fetch happens with latest data
            await getCurrentPharmacy(updatedPharmacyCode);

            toast.success("Pharmacy updated successfully");
            setEditSection(null);
            
            setTimeout(() => {
              getCurrentPharmacy();
            }, 2000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update pharmacy code");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchPharmacy = async () => {
        try
            {
                 if(updatedPharmacyCode.length < 6){
                    toast.warning("Please ensure that you have valid pharmacy code!");
                    return;
                }
                setLoading(true);
                const response = await axios.get(CONSTANTS.API_URL +"settings/pharmacy/item/v1/" + updatedPharmacyCode);

                if(response.data != null){
                    setValidPharmacyCode(true);
                    toast.info("Your pharmacy code is valid, you can submit it.")
                }else {
                    toast.warning("Invalid Pharmacy Code!");
                }
            setLoading(false);
            
        }catch(err){
            console.log(err);
            setLoading(false);
            toast.error("Something went wrong, please try again later!");
        }
    }

    const handleAccommodationSave = async () => {
          try {
            setLoading(true);

            // --- Update Accommodation Collection ---
            const accommodationPayload = {
              userId: user._id,
              requireAccommodation: updatedRequireAccommodation,
              accomodationType: updatedAccommodationType,
              additionalArrangements: updatedAdditionalArrangements,
            };

            await axios.put(CONSTANTS.API_URL + "users/accomodation/update/single/details",
              accommodationPayload
            );

            // --- Update User Note if changed ---
            if (updatedUserAccommodationNote !== user.accommodation) {
              const userUpdate = {
                id: user._id,
                data: {
                  accommodation: updatedUserAccommodationNote,
                },
              };

              const result = await axios.put(CONSTANTS.API_URL + "users/update/rsvp/details/v1/",
                userUpdate
              );

              dispatch(updateUserLocal(result.data.user));
            }

            toast.success("Accommodation updated");

            await getAccommodation(); // refresh

            setEditSection(null);
            setLoading(false);

          } catch (error) {
            setLoading(false);
            toast.error("Update failed");
          }
    };

    const handleFlightSave = async () => {
      try {
          const updateData = {};
          if (updatedAirport === flightData?.airportId) {
            toast.info("No changes detected");
            return;
          }

          if (!updatedAirport) {
            toast.error("Please select an airport");
            return;
          }

        const payload = {
            userId: user._id,
            data: {
              airportId: updatedAirport,
              title: user.name + " " + user.phonenumber
            }
          };

        setLoading(true);

        await axios.post(
          CONSTANTS.API_URL + "flights/update/create/v1/",
          payload
        );

        toast.success("Flight updated");

        await getFlight();
        setEditSection(null);
        setLoading(false);

      } catch (error) {
        setLoading(false);
        toast.error("Update failed");
      }
    };
    
    if (loading) return <Loading />;
  return (
    <div className="rsvp-comps container">
      <h3 className="text-center opacity-25">{user.profile.profileName}</h3>
      {/* ================= BASIC INFO ================= */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header d-flex justify-content-between">
          <strong>Personal Information</strong>
          <button
            className={`btn btn-sm ${
              editSection === "personal"
                ? "btn-outline-secondary"
                : "btn-outline-primary"
            }`}
            onClick={() =>
              setEditSection(editSection === "personal" ? null : "personal")
            }
          >
            {editSection === "personal" ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="card-body">
          {editSection === "personal" ? (
            <>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Name</label>
                  <input
                      className="form-control"
                      value={updatedName || ""}
                      onChange={(e) => setUpdatedName(e.target.value)}
                    />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Surname</label>
                  <input
                      className="form-control"
                      value={updatedSurname || ""}
                      onChange={(e) => setUpdatedSurname(e.target.value)}
                    />
                </div>
              </div>
             
              <button
                  className="btn btn-success btn-sm"
                  onClick={() => handlePersonalSave("personal")}
                >
                Save
              </button>
            </>
            ) : (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Surname:</strong> {user.surname}</p>
              <p><strong>Profession:</strong> {user.profession}</p>
            </>
          )}
        </div>
      </div>

      {/* ================= PHARMACY ================= */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header d-flex justify-content-between">
          <strong>Pharmacy Details</strong>
   
          <button
            className={`btn btn-sm ${
              editSection === "pharmacy"
                ? "btn-outline-secondary"
                : "btn-outline-primary"
            }`}
            onClick={() =>
              setEditSection(editSection === "pharmacy" ? null : "pharmacy")
            }
          >
            {editSection === "pharmacy" ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="card-body">
          {editSection === "pharmacy" ? (
            <>
              <input
                  className="form-control mb-3"
                  placeholder="Enter Pharmacy Code"
                  value={updatedPharmacyCode}
                  onChange={(e) => setUpdatedPharmacyCode(e.target.value)}
                />

                <button className="btn btn-warning  btn-sm me-1" onClick={() => handleSearchPharmacy()}>
                  Confirm Pharmacy Code
                </button>
                {
                  validPharmacyCode &&  (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handlePharmacySave("pharmacy")}
                    >
                      Save
                    </button>
                  )
                }              
            </>
          ) : (
            <>
              <p><strong>Pharmacy Code:</strong> {user.pharmacycode}</p>
              <p><strong>Title:</strong>: {pharmacy ? pharmacy.title : "loading..."}</p>
            </>
          )}
        </div>
      </div>

      {/* ================= EVENTS ================= */}
      <div className="card mb-4 shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <strong>Event Attendance</strong>
            <button
              className={`btn btn-sm ${editSection === "events" ? "btn-outline-secondary" : "btn-outline-primary"}`}
              onClick={() => setEditSection(editSection === "events" ? null : "events")}
            >
              {editSection === "events" ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="card-body">
            {editSection === "events" ? (
              <>
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="pcdtCheck"
                    checked={updatedPcdt}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setUpdatedPcdt(checked);
                      // Automagically set the profession string
                      setUpdateProfession(checked ? "PCDT Pharmacist" : "Clinic Nurse");
                    }}
                  />
                  <label className="form-check-label" htmlFor="pcdtCheck">
                    PCDT Registered
                  </label>
                  <div className="form-text">
                    (Select if you are a PCDT Pharmacist)
                  </div>
                </div>

                <button className="btn btn-success btn-sm" onClick={handleEventsSave}>
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <div className="mb-2">
                  <strong>Profession:</strong> {user.profession || "Not Set"}
                </div>
                <div className="mb-2">
                  <strong>PCDT Status:</strong> {user.pcdt ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Registered Events:</strong>{" "}
                  <span className="badge bg-light text-dark border">
                    {user.events && user.events.length > 0 ? user.events.join(', ') : "None"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

      {/* ================= DIETARY ================= */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header d-flex justify-content-between">
          <strong>Dietary Information</strong>
          
          <button
            className={`btn btn-sm ${
              editSection === "dietary"
                ? "btn-outline-secondary"
                : "btn-outline-primary"
            }`}
            onClick={() =>
              setEditSection(editSection === "dietary" ? null : "dietary")
            }
          >
            {editSection === "dietary" ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="card-body">
          {editSection === "dietary" ? (
              <>
                <div className="mb-3">
                <label>Select Dietary Type</label>
                <select
                    className="form-control mb-3"
                    name="dietary"
                    value={updatedDietary} // Ensure this state is initialized with user.dietary
                    onChange={(e) => setUpdatedDietary(e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {
                      listDietary.map((diet) => (
                        <option key={diet._id} value={diet._id}>
                          {diet.title} 
                        </option>
                      ))
                    }
                  </select>
                  </div>
                  {/* 2. Allergy "To-Do" List */}
                  <div className="mb-3">
                    <label><strong>Allergies</strong></label>
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add an allergy (e.g. Peanuts)"
                        value={allergyInput}
                        onChange={(e) => setAllergyInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                      />
                      <button className="btn btn-outline-primary" type="button" onClick={addAllergy}>Add</button>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      {updatedAllergies.map((item, index) => (
                        <span key={index} className="badge bg-light text-dark border d-flex align-items-center p-2">
                          {item}
                          <button 
                            type="button" 
                            className="btn-close ms-2" 
                            style={{ fontSize: '0.6rem' }} 
                            onClick={() => removeAllergy(index)}
                          ></button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleDietarySave("dietary")}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                <p>
                  <strong>Dietary Type:</strong>{" "}
                  {myDietary ? (
                    <>
                      {myDietary.title} <br/>
                      {/* Show badge in parenthesis only if it exists and isn't empty */}
                      {myDietary.badge &&  <img src={myDietary.badge} className="badge-logo" />
                      }
                    </>
                  ) : (
                    "None"
                  )}
                </p>

                <p>
                  <strong>Allergies:</strong>{" "}
                  {user.allergies?.length > 0 ? user.allergies.join(", ") : "None"}
                </p>
              </>
            )}
        </div>
      </div>
      

      {/* ================= ACCOMMODATION ================= */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header d-flex justify-content-between">
          <strong>Accommodation</strong>
          
          <button
            className={`btn btn-sm ${
              editSection === "accommodation"
                ? "btn-outline-secondary"
                : "btn-outline-primary"
            }`}
            onClick={() =>
              setEditSection(editSection === "accommodation" ? null : "accommodation")
            }
          >
            {editSection === "accommodation" ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="card-body">
          {editSection === "accommodation" ? (
             <>
                {/* Require Accommodation */}
                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={updatedRequireAccommodation}
                    onChange={(e) =>
                      setUpdatedRequireAccommodation(e.target.checked)
                    }
                  />
                  <label className="form-check-label">
                    Require Accommodation?
                  </label>
                </div>

                {/* Accommodation Type */}
                {updatedRequireAccommodation && (
                  <div className="mb-3">
                  
                    {updatedRequireAccommodation && (
                      <div className="mb-3">
                        <label className="form-label">Accommodation Type</label>
                        <select
                          className="form-select"
                          value={updatedAccommodationType || ""}
                          onChange={(e) =>
                            setUpdatedAccommodationType(e.target.value)
                          }
                        >
                          <option value="">Select type</option>
                          <option value="single">Single (1 Person not sharing)</option>
                          <option value="double">Double (2 Person sharing)</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Arrangements */}
                <div className="mb-3">
                  <label>Additional Arrangements</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={updatedAdditionalArrangements}
                    onChange={(e) =>
                      setUpdatedAdditionalArrangements(e.target.value)
                    }
                  />
                </div>

                {/* Extra User Note */}
                <div className="mb-3">
                  <label>Additional Notes</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={updatedUserAccommodationNote}
                    onChange={(e) =>
                      setUpdatedUserAccommodationNote(e.target.value)
                    }
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={handleAccommodationSave}
                  >
                    Save
                  </button>

                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      getAccommodation(); // reset values
                      setUpdatedUserAccommodationNote(user.accommodation || "");
                      setEditSection(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
          ) : (
            <>
              <p>
                <strong>Require Accommodation:</strong>{" "}
                {accommodationData?.requireAccommodation ? "Yes" : "No"}
              </p>

              {accommodationData?.requireAccommodation && (
                <p>
                  <strong>Type:</strong>{" "}
                  {accommodationData?.accomodationType || "N/A"}
                </p>
              )}

              <p>
                <strong>Additional Arrangements:</strong>{" "}
                {accommodationData?.additionalArrangements || "None"}
              </p>

              <p>
                <strong>Additional Notes:</strong>{" "}
                {user.accommodation || "None"}
              </p>
            </>
          )}
        </div>
      </div>  
      {/* ================= Flights ================= */}
        <div className="card mb-4 shadow-sm">
            <div className="card-header d-flex justify-content-between">
              <strong>Flight Details</strong>

              <button
                className={`btn btn-sm ${
                  editSection === "flight"
                    ? "btn-outline-secondary"
                    : "btn-outline-primary"
                }`}
                onClick={() =>
                  setEditSection(editSection === "flight" ? null : "flight")
                }
              >
                {editSection === "flight" ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="card-body">
              {editSection === "flight" ? (
                <>

                   <div className="mb-3">
                    <label className="form-label">Airport</label>
                    <select
                      className="form-select"
                      value={updatedAirport || ""}
                      onChange={(e) => setUpdatedAirport(e.target.value)}
                    >
                      <option value="">Select Airport</option>

                      {airportList.map((airport) => (
                        <option
                          key={airport._id}
                          value={airport.title}   // storing airport name
                        >
                          {airport.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="btn btn-success btn-sm"
                    onClick={handleFlightSave}
                  >
                    Save
                  </button>
                </>
              ) : (

                <> 
                   {
                    hasFlight ? (
                      <div className="flight-details">
                         <p>
                          <strong>Date:</strong>{" "}
                          {flightData?.date || "Not Provided"}
                        </p>

                        <p>
                          <strong>Time:</strong>{" "}
                          {flightData?.time || "Not Provided"}
                        </p>

                        <p>
                          <strong>Airport:</strong>{" "}
                          {flightData?.airportId || "Not Provided"}
                        </p>

                        <p>
                          <strong>Ticket Code:</strong>{" "}
                          {flightData?.ticketCode || "Not Provided"}
                        </p>

                        <p>
                          <strong>Ticket URL:</strong>{" "}
                          {flightData?.ticketURL ? (
                            <a
                              href={flightData.ticketURL}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View Ticket
                            </a>
                          ) : (
                            "Not Provided"
                          )}
                        </p>
                      </div>
                    )
                    :
                     <p><strong>Flight:</strong> None</p>
                  }  
                 
                </>
              )}
            </div>
          </div>

    </div>
  )
}

export default ClinicRsvp