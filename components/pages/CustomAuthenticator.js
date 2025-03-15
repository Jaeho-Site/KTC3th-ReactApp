import React, { useState } from 'react';
import image22 from '../../assets/images/image22.png';
import image23 from '../../assets/images/image23.png';
import image24 from '../../assets/images/image24.png';
import { Global } from '@emotion/react';
import createGlobalStyles from '../../styles/globalStyles';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Telegram as TelegramIcon, 
  Google as GoogleIcon, 
  Apple as AppleIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, signOut, resetPassword, confirmSignUp, confirmResetPassword, resendSignUpCode, signInWithRedirect } from 'aws-amplify/auth';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '../../contexts/UserContext';
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Button 
} from '@mui/material';
import '../../styles/CustomAuthenticator.css';

const SignInForm = ({ 
  setAuthState, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  setIsVerifying,
  showDialog 
}) => {
  const { t } = useTranslation();
  const { setError, checkSession } = useUserContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginError('');
    setError('');
    try {
      await signOut();
      const signInResult = await signIn({ username: email, password: password });
      if (signInResult.isSignedIn) {
        await checkSession();
        navigate('/dashboard', { replace: true });
      } else if (signInResult.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        showDialog(
          t('auth.signIn.title'),
          t('auth.signIn.confirmAccount')
        );
        setAuthState('signUp');
        setIsVerifying(true);
      } else {
        showDialog(
          t('auth.signIn.title'),
          t('auth.signIn.additionalStepRequired')
        );
      }
    } catch (err) {
      if (err.name === 'UserNotConfirmedException') {
        showDialog(
          t('auth.signIn.title'),
          t('auth.signIn.confirmAccount')
        );
        setAuthState('signUp');
        setIsVerifying(true);
      } else if (err.name === 'NotAuthorizedException') {
        showDialog(
          t('auth.signIn.title'),
          t('auth.signIn.invalidCredentials')
        );
      } else {
        showDialog(
          t('auth.signIn.title'),
          `${t('auth.signIn.loginFailed')}: ${err.message}`
        );
      }
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      if (provider === 'google') {
        await signInWithRedirect({ provider: 'Google' });
      }
      // 다른 소 로그인 구현
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Email address</label>
          <input 
            className="input"
            type="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="label">Password</label>
          <input 
            className="input"
            type="password" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {loginError && <div className="error-message">{loginError}</div>}
        </div>
        <div className="forgot-password-button">
          <button 
            type="button" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAuthState('forgotPassword');
            }}
          >
            Forgot Password?
          </button>
        </div>
        <div className="login-button-container">
          <div className="login-button-shadow" />
          <button className="login-button" type="submit">Login Account</button>
        </div>
      </form>

      <div className="divider">or continue with</div>

      <div className="social-buttons-container">
        <button className="social-button" onClick={() => handleSocialLogin('telegram')}>
          <TelegramIcon />
        </button>
        <button className="social-button" onClick={() => handleSocialLogin('google')}>
          <GoogleIcon />
        </button>
        <button className="social-button" onClick={() => handleSocialLogin('apple')}>
          <AppleIcon />
        </button>
      </div>

      <div className="sign-up-text">
        Don't have an account?
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setAuthState('signUp');
          }}
          type="button"
        >
          Create Account
        </button>
      </div>
    </>
  );
};

const SignUpForm = ({ 
  setAuthState, 
  showDialog,
  initialEmail, 
  initialPassword, 
  isVerifying: initialIsVerifying = false 
}) => {
  const { t } = useTranslation();
  const { setError, checkSession } = useUserContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState(initialPassword || '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isVerifying, setIsVerifying] = useState(initialIsVerifying);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isResendingCode, setIsResendingCode] = useState(false);

  const handleVerificationCodeChange = (e) => {
    const value = e.target.value;
    
    if (!/^\d*$/.test(value)) {
      setCodeError(t('auth.signUp.codeNumbersOnly'));
    } else if (value.length > 6) {
      setCodeError(t('auth.signUp.codeMaxLength'));
    } else {
      setCodeError('');
    }

    if (/^\d{0,6}$/.test(value)) {
      setVerificationCode(value);
    }
  };

  const handleVerifyAndSignUp = async (event) => {
    event.preventDefault();
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode,
      });
      try {
        const signInResult = await signIn({ username: email, password: password });
        if (signInResult.isSignedIn) {
          await checkSession();
          navigate('/dashboard', { replace: true });
        } else {
          showDialog(
            t('auth.signUp.errorTitle'),
            t('auth.signUp.loginFailed')
          );
        }
      } catch (signInErr) {
        if (signInErr.name === 'NotAuthorizedException') {
          showDialog(
            t('auth.signUp.dialogTitle'),
            t('auth.signUp.existingAccountOptions'),
            true
          );
        } else {
          showDialog(
            t('auth.signUp.errorTitle'),
            signInErr.message
          );
        }
      }
    } catch (err) {
      if (err.message && err.message.includes("failed to satisfy constraint")) {
        showDialog(
          t('auth.signUp.errorTitle'),
          t('auth.signUp.invalidCodeFormatError')
        );
      } else {
        showDialog(
          t('auth.signUp.errorTitle'),
          err.message
        );
      }
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Email is required to resend the code");
      return;
    }
    setIsResendingCode(true);
    try {
      await resendSignUpCode({ username: email });
      setError("Verification code resent. Please check your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsResendingCode(false);
    }
  };

  const handleSendVerificationCode = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      showDialog(
        t('auth.signUp.errorTitle'),
        t('auth.signUp.passwordsDoNotMatch')
      );
      return;
    }
    if (!email) {
      showDialog(
        t('auth.signUp.errorTitle'),
        t('auth.signUp.emailRequired')
      );
      return;
    }
    if (!agreeToTerms) {
      showDialog(
        t('auth.signUp.errorTitle'),
        t('auth.signUp.termsRequired')
      );
      return;
    }
    try {
      await signUp({
        username: email,
        password: password,
        attributes: {
          email: email,
        },
      });
      setIsVerifying(true);
    } catch (err) {
      if (err.name === 'UsernameExistsException') {
        try {
          await resendSignUpCode({ username: email });
          setIsVerifying(true);
        } catch (resendErr) {
          setError(resendErr.message);
        }
      } else {
        setError(err.message);
      }
    }
  };

  if (isVerifying) {
    return (
      <form className="form-container" onSubmit={handleVerifyAndSignUp}>
        <div className="form-group">
          <label className="label">Verification Code</label>
          <input
            className="input"
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={handleVerificationCodeChange}
            error={!!codeError}
            required
          />
          {codeError && <div className="error-message">{codeError}</div>}
        </div>
        <div className="login-button-container">
          <div className="login-button-shadow" />
          <button className="login-button" type="submit">Verify Code and Sign up</button>
        </div>
        <div className="forgot-password-button">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResendingCode}
          >
            {isResendingCode ? 'Resending Code...' : 'Resend Code'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <>
      <form className="form-container" onSubmit={handleSendVerificationCode}>
        <div className="form-group">
          <label className="label">Email address</label>
          <input 
            className="input" 
            type="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="label">Password</label>
          <input 
            className="input" 
            type="password" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="label">Confirm Password</label>
          <input 
            className="input" 
            type="password" 
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              className="checkbox" 
              type="checkbox" 
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
            />
            I agree to the terms and conditions
          </label>
        </div>
        <div className="login-button-container">
          <div className="login-button-shadow" />
          <button className="login-button" type="submit">Create Account</button>
        </div>
      </form>

      <div className="sign-up-text">
        Already have an account?
        <button onClick={() => setAuthState('signIn')}>
          Sign In
        </button>
      </div>
    </>
  );
};

const ForgotPasswordForm = ({ setAuthState, showDialog }) => {
  const { t } = useTranslation();
  const { setError } = useUserContext();
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetError, setResetError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!codeSent) {
      try {
        await resetPassword({ username: email });
        setCodeSent(true);
        showDialog(
          t('auth.forgotPassword.successTitle'),
          t('auth.forgotPassword.codeSent')
        );
      } catch (err) {
        showDialog(
          t('auth.forgotPassword.errorTitle'),
          err.message
        );
      }
    } else {
      try {
        await confirmResetPassword({ 
          username: email, 
          confirmationCode: code, 
          newPassword 
        });
        showDialog(
          t('auth.forgotPassword.successTitle'),
          t('auth.forgotPassword.passwordReset')
        );
        setAuthState('signIn');
      } catch (err) {
        showDialog(
          t('auth.forgotPassword.errorTitle'),
          err.message
        );
      }
    }
  };

  return (
    <>
      <form className="form-container" onSubmit={handleSubmit}>
        {!codeSent ? (
          <>
            <div className="form-group">
              <label className="label">Email address</label>
              <input 
                className="input" 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {resetError && <div className="error-message">{resetError}</div>}
            <div className="login-button-container">
              <div className="login-button-shadow" />
              <button className="login-button" type="submit">
                Send Code
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="label">Verification Code</label>
              <input 
                className="input" 
                type="text" 
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="label">New Password</label>
              <input 
                className="input" 
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            {resetError && <div className="error-message">{resetError}</div>}
            <div className="login-button-container">
              <div className="login-button-shadow" />
              <button className="login-button" type="submit">
                Reset Password
              </button>
            </div>
          </>
        )}
      </form>

      <div className="sign-up-text">
        Remember your password?
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setAuthState('signIn');
          }}
          type="button"
        >
          Back to Login
        </button>
      </div>
    </>
  );
};

const CustomAuthenticator = () => {
  const { themeMode } = useTheme();
  const { t } = useTranslation();
  const globalStyles = createGlobalStyles(themeMode);
  const [authState, setAuthState] = useState('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogReset = () => {
    setDialogOpen(false);
    setAuthState('forgotPassword');
  };

  const handleDialogSignIn = () => {
    setDialogOpen(false);
    setAuthState('signIn');
  };

  const showDialog = (title, message, isPasswordReset = false) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const renderForm = () => {
    switch (authState) {
      case 'signUp':
        return (
          <SignUpForm 
            setAuthState={setAuthState}
            showDialog={showDialog}
            initialEmail={email}
            initialPassword={password}
            isVerifying={isVerifying}
          />
        );
      case 'forgotPassword':
        return (
          <ForgotPasswordForm 
            setAuthState={setAuthState}
            showDialog={showDialog}
          />
        );
      default:
        return (
          <SignInForm 
            setAuthState={setAuthState}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            setIsVerifying={setIsVerifying}
            showDialog={showDialog}
          />
        );
    }
  };

  return (
    <>
      <Global styles={globalStyles} />
      <div className="login-page">
        <div className="main-container">
          <div className="outer-rectangle" />
          <div className="inner-rectangle" />
          <div className="image24-wrapper">
            <img src={image24} alt="Decoration 1" />
          </div>
          <div className="image22-wrapper">
            <img src={image22} alt="Decoration 2" />
          </div>
          <div className="image23-wrapper">
            <img src={image23} alt="Decoration 3" />
          </div>
          <div className="login-container">
            <div className="black-box" />
            <div className="white-box">
              <h1 className="title">
                {authState === 'signUp' 
                  ? 'Create Account' 
                  : authState === 'forgotPassword' 
                    ? 'Reset Password' 
                    : 'Login Account'}
              </h1>
              <div className="image24-right-wrapper">
                <img src={image24} alt="Decoration 4" />
              </div>
              {renderForm()}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>{dialogMessage}</DialogContent>
        <DialogActions>
          {dialogMessage === t('auth.signUp.existingAccountOptions') ? (
            <>
              <Button onClick={handleDialogReset} color="primary">
                {t('auth.signUp.dialogOkButton')}
              </Button>
              <Button onClick={handleDialogSignIn}>
                {t('auth.signUp.dialogCancelButton')}
              </Button>
            </>
          ) : (
            <Button onClick={handleDialogClose} color="primary">
              {t('common.ok')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomAuthenticator;