import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase.js";
import {
  setAuthState,
  setAuthUser,
  setMongoUser,
  setToken,
} from "../../slices/authSlice.js";
import { setLoading } from "../../slices/loadingSlice.js";
import { getMongoUser } from "../../slices/usersApiSlice.js";
import Loader from "../Loader";

const Register = () => {
  const loading = useSelector((state) => state.loading.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [confirmOtp, setConfirmOtp] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [buttonLoader, setButtonLoader] = useState(false);
  const formatPhone = "+" + phoneNumber;

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  const recaptchaVerifier = (number) => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, formatPhone, recaptchaVerifier);
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const onSignup = async (e) => {
    e.preventDefault();
    setButtonLoader(true);
    setErrors("");

    if (phoneNumber === "" || phoneNumber.length !== 12) {
      setButtonLoader(false);
      return toast.error(
        "Please enter a valid phone number with country code."
      );
    }

    if (!termsChecked) {
      return toast.error("Please agree to terms and conditions");
    }

    try {
      const response = await recaptchaVerifier(formatPhone);
      setConfirmOtp(response);
      toast.success("OTP sent successfully!");
      setShowOtpScreen(true);
    } catch (err) {
      setErrors(err.message);
      toast.error("Please retry again");
    } finally {
      setButtonLoader(false);
    }
  };

  const onOtpVerify = async (e) => {
    e.preventDefault();

    if (otp === "") {
      toast.error("Please enter a valid OTP");
    } else {
      try {
        setButtonLoader(true);
        const result = await confirmOtp.confirm(otp);
        toast.success("Success");
        dispatch(setLoading(true));
        const user = auth.currentUser;

        localStorage.setItem("accessToken", result._tokenResponse.idToken);
        setToken(result._tokenResponse.idToken);

        dispatch(
          setAuthUser({
            email: user.email,
            emailVerified: user.emailVerified,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            providerData: user.providerData,
            stsTokenManager: {
              accessToken: user.stsTokenManager.accessToken,
              expirationTime: user.stsTokenManager.expirationTime,
              refreshToken: user.stsTokenManager.refreshToken,
            },
            uid: user.uid,
            displayName: user.displayName,
          })
        );

        const mongoUser = await getMongoUser(user.stsTokenManager.accessToken);
        dispatch(setMongoUser(mongoUser.data.initialUserSchema));

        if (mongoUser.status === 204) {
          dispatch(setAuthState("/verify"));
          navigate("/verify");
        } else if (mongoUser.data.InitialUserSchema.roles[0] === "superadmin") {
          dispatch(setAuthState("/superadmin"));
          navigate("/superadmin");
        } else if (mongoUser.data.InitialUserSchema.doc_verified === true) {
          dispatch(setAuthState("/dashboard"));
          navigate("/dashboard");
        } else {
          dispatch(setAuthState("/verify"));
          navigate("/verify");
        }
      } catch (err) {
        toast.error(
          err.message === "Firebase: Error (auth/invalid-verification-code)."
            ? "Invalid OTP"
            : "An error occurred, please try again later"
        );
      } finally {
        setButtonLoader(false);
        dispatch(setLoading(false));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required";
    else if (!/^\d+$/.test(phoneNumber))
      newErrors.phoneNumber = "Invalid phone number";
    if (!termsChecked)
      newErrors.terms = "You must agree to the terms and conditions";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div style={styles.wrapper}>
          <Container maxWidth="sm" style={styles.container}>
            <Toaster toastOptions={{ duration: 4000 }} />
            <Typography variant="h2" style={styles.title}>
              Login or Register
            </Typography>
            <Typography variant="subtitle1" style={styles.subtitle}>
              Please enter your details
            </Typography>
            <form style={styles.form} onSubmit={handleSubmit}>
              <Typography variant="subtitle2" style={styles.label}>
                Phone Number
              </Typography>
              <div>
                <PhoneInput
                  country={"in"}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  inputStyle={styles.phoneInput}
                  containerStyle={styles.phoneInputContainer}
                  buttonStyle={styles.phoneButton}
                  dropdownStyle={styles.phoneDropdown}
                />
                <style>
                  {`
          .react-tel-input .special-label { display: none; }
          .react-tel-input .selected-flag { 
            outline: none; 
            background: #121318; 
            color: black; 
            position: relative; 
            width: 52px; 
            height: 100%; 
            padding: 0 0 0 11px; 
            border-radius: 3px 0 0 3px; 
            display: flex; 
            align-items: center;
          }
          .react-tel-input .flag-dropdown.open .selected-flag { 
            background: black; 
            border-radius: 3px 0 0 0; 
          
          }
          // .react-tel-input .selected-flag:hover, .react-tel-input .selected-flag:focus { 
          //   background-color: black; 
          // }
          // .react-tel-input .country-list .country{ 
          //   padding: 15px 15px 15px 15px;
          //   background-color: black; 
          //   width: 300px; 
            
          // }
          
          // .react-tel-input .country-list .country.highlight { 
          //   background-color: #7CD6AB; 
          //   color: black; 
          // }
          .react-tel-input .country-list .country:hover { 
            background-color: #7CD6AB; 
            color: black; 
          }
          .country {
           
        `}
                </style>
              </div>

              {showOtpScreen && (
                <TextField
                  label="OTP"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  style={styles.textField}
                  InputLabelProps={{ style: { color: "grey" } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePassword}
                        >
                          {showPassword ? (
                            <Visibility style={{ color: "#7CD6AB" }} />
                          ) : (
                            <VisibilityOff style={{ color: "#7CD6AB" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              )}
              <div id="recaptcha-container" />

              {!showOtpScreen && (
                <FormControlLabel
                  control={<Checkbox style={styles.checkbox} />}
                  label="I agree to the terms and conditions"
                  style={styles.terms}
                  checked={termsChecked}
                  onChange={() => setTermsChecked(!termsChecked)}
                  error={errors.terms}
                />
              )}

              <Button
                type="submit"
                style={
                  showOtpScreen || buttonLoader
                    ? styles.disabledButton
                    : styles.submitButton
                }
                fullWidth
                onClick={showOtpScreen ? onOtpVerify : onSignup}
                disabled={buttonLoader || !termsChecked}
              >
                {buttonLoader ? (
                  <Box sx={{ display: "flex" }}>
                    <CircularProgress size={22} />
                  </Box>
                ) : showOtpScreen ? (
                  "Verify OTP"
                ) : (
                  "Send OTP"
                )}
              </Button>
              <Typography component={Link} to="/login" style={styles.loginLink}>
                Login with Email
              </Typography>
            </form>
          </Container>
        </div>
      )}
    </>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#121318",
  },
  container: {
    textAlign: "center",
    padding: "50px",
    color: "white",
    borderRadius: "1rem",
  },
  title: {
    color: "#7CD6AB",
  },
  subtitle: {
    margin: "15px 0",
    padding: "0px 120px",
    color: "#75777B",
  },
  form: {
    width: "70%",
    margin: "auto",
    textAlign: "left",
  },
  label: {
    margin: "8px 0",
    color: "#75777B",
  },
  phoneInput: {
    width: "100%",
    height: "40px",
    border: "1px solid #75777B",
    borderRadius: "5px",
    paddingLeft: "60px", // Adjust padding to ensure the flag doesn't overlap the text
    backgroundColor: "#121318",
    color: "white",
  },
  phoneInputContainer: {
    width: "100%",
  },
  phoneButton: {
    backgroundColor: "#121318",
    color: "white",
  },
  phoneDropdown: {
    backgroundColor: "#121318",

  },
  textField: {
    margin: "20px 0",
    width: "22rem",
  },
  checkbox: {
    color: "#7CD6AB",
  },
  terms: {
    paddingTop: "10px",
  },
  submitButton: {
    backgroundColor: "#7CD6AB",
    color: "#121318",
    marginTop: "101px",
    marginBottom: "30px",
    padding: "0.8rem",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    color: "#121318",
    margin: "30px 0",
    padding: "0.8rem",
    fontWeight: "bold",
  },
  loginLink: {
    color: "#7CD6AB",
    textAlign: "left",
    variant: "outlined",
    width: "100%",
    display: "block",
  },
};

export default Register;
