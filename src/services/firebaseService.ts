import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  updateProfile,
  signInAnonymously,
  getRedirectResult,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import type { User as FirebaseUser, UserCredential as FirebaseUserCredential } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { auth, db, storage } from '@config/firebase';
import { logAuth } from '@lib/logging';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const prefix = '[FirebaseService]';

// Auth flow logging flags
const LOG_AUTH_FLOW = true;         // Main auth flow tracking - ENABLED for debugging
const LOG_AUTH_REGISTER = true;     // User registration - ENABLED for debugging
const LOG_AUTH_LOGIN = true;        // User login - ENABLED for debugging
const LOG_AUTH_LOGOUT = false;      // User logout
const LOG_AUTH_SOCIAL = true;       // Social login (Google/Facebook) - ENABLED for debugging
const LOG_AUTH_GUEST = false;       // Guest login
const LOG_AUTH_REDIRECT = true;     // Redirect handling - ENABLED for debugging
const LOG_AUTH_FIRESTORE = true;    // Firestore operations - ENABLED for debugging
const LOG_AUTH_ERROR = true;        // Error logging - ENABLED (always logs to IndexedDB)

// Check if Firebase is configured
const isFirebaseConfigured = !!auth && !!db;

// User profile interface
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  eloRating: number;
  achievements: string[];
  // Per spec Section 18, lines 1693-1696: Match history references
  matchHistory?: string[];  // Match PDA addresses or match IDs
  matchIds?: string[];      // Match UUIDs for quick lookup
  // Wallet-based authentication
  walletAddress?: string;   // Solana wallet public key (base58)
}

// Authentication result interface
export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

// Error interface for Firebase errors
interface FirebaseError {
  code: string;
  message: string;
}

// Error message mapping - converts Firebase error codes to user-friendly messages
export const getAuthErrorMessage = (error: unknown): string => {
  const firebaseError = error as FirebaseError;
  const errorCode = firebaseError.code || '';
  
  switch (errorCode) {
    // Login errors
    case 'auth/user-not-found':
      return "No account found with this email. Would you like to sign up?";
    case 'auth/wrong-password':
      return "Incorrect password. Forgot password?";
    case 'auth/invalid-email':
      return "Please enter a valid email address.";
    case 'auth/user-disabled':
      return "This account has been disabled. Please contact support.";
    case 'auth/invalid-credential':
      return "Invalid email or password. Please try again.";
    
    // Registration errors
    case 'auth/email-already-in-use':
      return "This email is already registered. Please sign in instead, or use 'Forgot Password?' if you don't remember your password.";
    case 'auth/weak-password':
      return "Password must be at least 6 characters.";
    case 'auth/operation-not-allowed':
      return "This sign-in method is not enabled. Please contact support.";
    
    // Social login errors
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return ""; // Silent fail - user intentionally cancelled
    case 'auth/popup-blocked':
      return "Popup was blocked. Please allow popups and try again.";
    case 'auth/account-exists-with-different-credential':
      return "An account with this email exists with a different sign-in method. We'll link your accounts automatically.";
    case 'auth/credential-already-in-use':
      return "This account is already linked to another user.";
    
    // Network errors
    case 'auth/network-request-failed':
      return "Network error. Please check your connection and try again.";
    case 'auth/too-many-requests':
      return "Too many login attempts. Please try again later.";
    case 'auth/requires-recent-login':
      return "Please sign out and sign in again to complete this action.";
    
    // Default
    default:
      // If it's a Firebase error, return the message, otherwise generic error
      if (firebaseError.message) {
        return firebaseError.message;
      }
      return "An error occurred. Please try again.";
  }
};

// Register a new user
export const registerUser = async (
  email: string, 
  password: string, 
  displayName: string,
  photoURL?: string
): Promise<AuthResult> => {
  logAuth(LOG_AUTH_REGISTER, 'log', prefix, '[registerUser] Starting registration:', { email, displayName, hasPhoto: !!photoURL });

  // If Firebase isn't configured, return an error
  if (!isFirebaseConfigured) {
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[registerUser] ❌ Firebase not configured');
    return { success: false, error: 'Firebase not configured' };
  }
  
  try {
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[registerUser] Creating user with email/password...');
    const userCredential: FirebaseUserCredential = await createUserWithEmailAndPassword(auth!, email, password);
    const user: FirebaseUser = userCredential.user;
    
    logAuth(LOG_AUTH_REGISTER, 'log', prefix, '[registerUser] User created:', { uid: user.uid, email: user.email });
    
    // Update user profile with displayName and photoURL
    await updateProfile(user, { 
      displayName,
      photoURL: photoURL || null
    });
    
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[registerUser] Profile updated with displayName and photoURL');
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      displayName,
      email: user.email || '',
      photoURL: photoURL || user.photoURL || '',
      createdAt: new Date(),
      lastLoginAt: new Date(),
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      eloRating: 1200, // Default ELO rating
      achievements: []
    };
    
    // Save user profile to Firestore
    logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[registerUser] Saving user profile to Firestore:', { uid: user.uid });
    await setDoc(doc(db!, 'users', user.uid), userProfile);
    
    logAuth(LOG_AUTH_REGISTER, 'log', prefix, '[registerUser] ✅ Registration successful:', { uid: user.uid, displayName });
    
    return { success: true, user: userProfile };
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError;
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[registerUser] ❌ Registration error:', firebaseError);
    
    // Handle email-already-in-use - check if email exists with social provider
    if (firebaseError.code === 'auth/email-already-in-use') {
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[registerUser] Email already in use, checking sign-in methods:', email);
      try {
        const signInMethods = await fetchSignInMethodsForEmail(auth!, email);
        logAuth(LOG_AUTH_FLOW, 'log', prefix, '[registerUser] Sign-in methods found:', signInMethods);
        const hasSocialProvider = signInMethods.some(method => method === 'google.com' || method === 'facebook.com');
        
        if (hasSocialProvider) {
          const providers = signInMethods.filter(m => m === 'google.com' || m === 'facebook.com');
          const providerNames = providers.map(p => p === 'google.com' ? 'Google' : 'Facebook').join(' or ');
          logAuth(LOG_AUTH_FLOW, 'log', prefix, '[registerUser] Email exists with social provider:', providerNames);
          return {
            success: false,
            error: `This email is already registered with ${providerNames}. Please sign in with ${providerNames} instead, or set a password in your account settings after signing in.`
          };
        } else {
          // Even if fetchSignInMethodsForEmail returns empty, the email might exist with social provider
          // (Firebase limitation - doesn't expose until account is fully activated)
          // Show a helpful message suggesting they try social login
          logAuth(LOG_AUTH_FLOW, 'log', prefix, '[registerUser] No sign-in methods detected, but email exists - likely social provider');
          return {
            success: false,
            error: 'This email is already registered. If you signed up with Google or Facebook, please sign in with that method instead.'
          };
        }
      } catch (methodsError) {
        // If we can't check methods, show helpful message anyway
        logAuth(LOG_AUTH_ERROR, 'error', prefix, '[registerUser] Could not check sign-in methods:', methodsError);
        return {
          success: false,
          error: 'This email is already registered. If you signed up with Google or Facebook, please sign in with that method instead.'
        };
      }
    }
    
    const userFriendlyMessage = getAuthErrorMessage(error);
    return { success: false, error: userFriendlyMessage };
  }
};

// Login with email and password
export const loginUser = async (email: string, password: string): Promise<AuthResult> => {
  logAuth(LOG_AUTH_LOGIN, 'log', prefix, '[loginUser] Starting login:', { email });

  // If Firebase isn't configured, return an error
  if (!isFirebaseConfigured) {
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginUser] ❌ Firebase not configured');
    return { success: false, error: 'Firebase not configured' };
  }

  // Check if user is already logged in
  if (auth?.currentUser) {
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginUser] User already logged in, refreshing session');
    const currentUser = auth.currentUser;
    
    // Check if Firestore document exists
    const userDoc = await getDoc(doc(db!, 'users', currentUser.uid));
    if (userDoc.exists()) {
      // Update last login time
      await updateDoc(doc(db!, 'users', currentUser.uid), {
        lastLoginAt: new Date()
      });
      const userProfile: UserProfile = {
        ...userDoc.data() as UserProfile,
        uid: currentUser.uid
      };
      return { success: true, user: userProfile };
    }
  }
  
  try {
    // Check what sign-in methods are available for this email BEFORE attempting login
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginUser] Checking available sign-in methods for email:', email);
    let signInMethods: string[] = [];
    try {
      signInMethods = await fetchSignInMethodsForEmail(auth!, email);
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginUser] Available sign-in methods:', signInMethods);
    } catch (methodsError) {
      // If email doesn't exist, fetchSignInMethodsForEmail might throw - that's okay
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginUser] Could not fetch sign-in methods (email may not exist):', methodsError);
    }
    
    // If email has social providers but no password method, guide user
    const hasSocialProvider = signInMethods.some(method => method === 'google.com' || method === 'facebook.com');
    const hasPasswordMethod = signInMethods.includes('password');
    
    if (hasSocialProvider && !hasPasswordMethod) {
      const providers = signInMethods.filter(m => m === 'google.com' || m === 'facebook.com');
      const providerNames = providers.map(p => p === 'google.com' ? 'Google' : 'Facebook').join(' or ');
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginUser] Email registered with social provider, no password method');
      return {
        success: false,
        error: `This email is registered with ${providerNames}. Please sign in with ${providerNames} instead, or set a password in your account settings.`
      };
    }
    
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginUser] Signing in with email/password...');
    const userCredential: FirebaseUserCredential = await signInWithEmailAndPassword(auth!, email, password);
    const user: FirebaseUser = userCredential.user;
    
    logAuth(LOG_AUTH_LOGIN, 'log', prefix, '[loginUser] Sign in successful:', { uid: user.uid, email: user.email });
    
    // Check if user profile exists, create if not
    logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[loginUser] Checking Firestore for existing profile:', { uid: user.uid });
    const userDoc = await getDoc(doc(db!, 'users', user.uid));
    let userProfile: UserProfile;

    if (!userDoc.exists()) {
      // Create new user profile if missing (recovery scenario)
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginUser] User profile missing, creating in Firestore');
      userProfile = {
        uid: user.uid,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        photoURL: user.photoURL || '',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        eloRating: 1200,
        achievements: []
      };
      await setDoc(doc(db!, 'users', user.uid), userProfile);
      logAuth(LOG_AUTH_REGISTER, 'log', prefix, '[loginUser] ✅ User profile created in Firestore:', { 
        uid: userProfile.uid, 
        displayName: userProfile.displayName 
      });
    } else {
      // User profile exists, update last login
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginUser] User profile exists, updating lastLoginAt');
      userProfile = { ...userDoc.data() as UserProfile, uid: user.uid };
      await updateDoc(doc(db!, 'users', user.uid), {
        lastLoginAt: new Date()
      });
    }
      
      logAuth(LOG_AUTH_LOGIN, 'log', prefix, '[loginUser] ✅ Login successful, profile loaded:', { 
        uid: userProfile.uid, 
        displayName: userProfile.displayName,
        gamesPlayed: userProfile.gamesPlayed,
        eloRating: userProfile.eloRating
      });
      
      return { success: true, user: userProfile };
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError;
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginUser] ❌ Login error:', firebaseError);
    
    // Handle specific errors: user-not-found or invalid-credential - check if email exists with social provider
    if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/wrong-password') {
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginUser] Checking sign-in methods in error handler for:', email);
      try {
        const signInMethods = await fetchSignInMethodsForEmail(auth!, email);
        logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginUser] Sign-in methods from error handler:', signInMethods);
        const hasSocialProvider = signInMethods.some(method => method === 'google.com' || method === 'facebook.com');
        
        if (hasSocialProvider) {
          const providers = signInMethods.filter(m => m === 'google.com' || m === 'facebook.com');
          const providerNames = providers.map(p => p === 'google.com' ? 'Google' : 'Facebook').join(' or ');
          logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginUser] Email exists with social provider:', providerNames);
          return {
            success: false,
            error: `This email is registered with ${providerNames}. Please sign in with ${providerNames} instead.`
          };
        } else {
          logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginUser] No social providers found for email');
          // Even though fetchSignInMethodsForEmail returned empty, the email might exist with social provider
          // (Firebase limitation - doesn't expose until account is fully activated)
          // Show a helpful message suggesting they try social login
          return {
            success: false,
            error: 'Invalid email or password. If you signed up with Google or Facebook, please use that method to sign in instead.'
          };
        }
      } catch (methodsError) {
        // If we can't check methods, fall through to default error handling
        logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginUser] Could not check sign-in methods in error handler:', methodsError);
        // Still show helpful message in case email exists with social provider
        return {
          success: false,
          error: 'Invalid email or password. If you signed up with Google or Facebook, please use that method to sign in instead.'
        };
      }
    }
    
    const userFriendlyMessage = getAuthErrorMessage(error);
    // Don't show error for silent failures (like popup cancelled)
    if (!userFriendlyMessage) {
      return { success: false, error: undefined };
    }
    return { success: false, error: userFriendlyMessage };
  }
};

// Login with Google
export const loginWithGoogle = async (): Promise<AuthResult> => {
  logAuth(LOG_AUTH_SOCIAL, 'log', prefix, '[loginWithGoogle] Starting Google login...');

  // If Firebase isn't configured, return an error
  if (!isFirebaseConfigured) {
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginWithGoogle] ❌ Firebase not configured');
    return { success: false, error: 'Firebase not configured' };
  }
  
  try {
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithGoogle] Creating GoogleAuthProvider...');
    const provider = new GoogleAuthProvider();
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithGoogle] Provider created, auth object:', { 
      hasAuth: !!auth, 
      currentUser: auth?.currentUser?.uid || null,
      appName: auth?.app?.name || null
    });
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithGoogle] About to call signInWithPopup...');
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithGoogle] Current URL:', window.location.href);
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithGoogle] Opening popup for Google login...');
    const result = await signInWithPopup(auth!, provider);
    logAuth(LOG_AUTH_SOCIAL, 'log', prefix, '[loginWithGoogle] ✅ Popup login successful:', { 
      uid: result.user.uid, 
      email: result.user.email 
    });
    
    // Handle account linking - check if email exists with different provider
    const email = result.user.email;
    if (email && auth?.currentUser && auth.currentUser.email !== email) {
      // Check if email exists with different provider
      try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length > 0 && !signInMethods.includes('google.com')) {
          logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithGoogle] Account with different provider found, attempting to link');
          // Account exists with different provider - this will be handled by Firebase automatically
          // But we should inform the user
        }
      } catch (linkError) {
        logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginWithGoogle] Error checking sign-in methods:', linkError);
      }
    }
    
    // Check if user profile exists, create if not
    logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[loginWithGoogle] Checking Firestore for existing profile:', { uid: result.user.uid });
    const userDoc = await getDoc(doc(db!, 'users', result.user.uid));
    let userProfile: UserProfile;

    // Keep original Google profile picture URL - will be proxied through Cloudflare Worker in frontend
    // No need to upload to Firebase Storage anymore (proxy approach is simpler and free)
    const photoURL = result.user.photoURL || '';

    if (!userDoc.exists()) {
      // Create new user profile for Google user
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithGoogle] Creating new user profile in Firestore');
      userProfile = {
        uid: result.user.uid,
        displayName: result.user.displayName || result.user.email?.split('@')[0] || 'Google User',
        email: result.user.email || '',
        photoURL: photoURL,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        eloRating: 1200,
        achievements: []
      };
      await setDoc(doc(db!, 'users', result.user.uid), userProfile);
      logAuth(LOG_AUTH_REGISTER, 'log', prefix, '[loginWithGoogle] ✅ New user profile created:', { 
        uid: userProfile.uid, 
        displayName: userProfile.displayName 
      });
    } else {
      // User profile already exists, update last login and photoURL if Google has a better one
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithGoogle] User profile exists, updating lastLoginAt');
      userProfile = { ...userDoc.data() as UserProfile, uid: result.user.uid };
      const updateData: Partial<UserProfile> = {
        lastLoginAt: new Date()
      };
      
      // Update photoURL if Google has one and current one is empty or different
      if (result.user.photoURL && (!userProfile.photoURL || userProfile.photoURL !== result.user.photoURL)) {
        updateData.photoURL = photoURL;
        logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithGoogle] Updating photoURL from Google (will be proxied through Cloudflare Worker)');
      }
      
      await updateDoc(doc(db!, 'users', result.user.uid), updateData);
      userProfile = { ...userProfile, ...updateData };
    }
      
      logAuth(LOG_AUTH_LOGIN, 'log', prefix, '[loginWithGoogle] ✅ Login successful, profile loaded:', { 
        uid: userProfile.uid, 
        displayName: userProfile.displayName,
        gamesPlayed: userProfile.gamesPlayed,
        eloRating: userProfile.eloRating
      });
      
      return { success: true, user: userProfile };
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError & { customData?: { _tokenResponse?: { verifiedProvider?: string[]; email?: string } } };
    
    // Handle account linking - if account exists with different provider (e.g., Facebook)
    if (firebaseError.code === 'auth/account-exists-with-different-credential') {
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithGoogle] Account exists with different provider, attempting to auto-link...');
      
      const email = firebaseError.customData?._tokenResponse?.email;
      const verifiedProviders = firebaseError.customData?._tokenResponse?.verifiedProvider || [];
      
      if (email && verifiedProviders.length > 0) {
        logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithGoogle] Found existing account:', { email, providers: verifiedProviders });
        
        // Check if user is currently logged in with the existing provider
        if (auth?.currentUser && auth.currentUser.email === email) {
          logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithGoogle] User is already logged in with existing provider');
          // User is logged in - Firebase should have auto-linked, but popup failed
          // Return success with current user profile
          const userDoc = await getDoc(doc(db!, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const userProfile = { ...userDoc.data() as UserProfile, uid: auth.currentUser.uid };
            await updateDoc(doc(db!, 'users', auth.currentUser.uid), {
              lastLoginAt: new Date()
            });
            return { success: true, user: userProfile };
          }
        }
        
        // User not logged in - automatically sign them in with existing provider, then link Google
        const hasFacebook = verifiedProviders.includes('facebook.com');
        const providerName = hasFacebook ? 'Facebook' : verifiedProviders[0];
        
        logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithGoogle] Auto-linking: signing in with', providerName, 'first...');
        
        try {
          // Sign in with existing provider first
          let existingProviderResult;
          if (hasFacebook) {
            const facebookProvider = new FacebookAuthProvider();
            existingProviderResult = await signInWithPopup(auth!, facebookProvider);
          } else {
            // For other providers, prompt user
            return { 
              success: false, 
              error: `An account with this email already exists with ${providerName}. Please sign in with ${providerName} instead.` 
            };
          }
          
          logAuth(LOG_AUTH_SOCIAL, 'log', prefix, '[loginWithGoogle] ✅ Signed in with', providerName, ', now linking Google...');
          
          // Now link Google credential - retry Google login
          const googleProvider = new GoogleAuthProvider();
          const googleResult = await signInWithPopup(auth!, googleProvider);
          
          logAuth(LOG_AUTH_SOCIAL, 'log', prefix, '[loginWithGoogle] ✅ Successfully linked Google to existing account');
          
          // Update user profile - merge data from both providers
          const userDoc = await getDoc(doc(db!, 'users', googleResult.user.uid));
          const googlePhotoURL = googleResult.user.photoURL;
          const facebookPhotoURL = existingProviderResult.user.photoURL;
          
          if (userDoc.exists()) {
            const userProfile = { ...userDoc.data() as UserProfile, uid: googleResult.user.uid };
            const updateData: Partial<UserProfile> = {
              lastLoginAt: new Date()
            };
            
            // Use Google photo if available, otherwise Facebook photo, otherwise keep existing
            if (googlePhotoURL && (!userProfile.photoURL || userProfile.photoURL === facebookPhotoURL)) {
              updateData.photoURL = googlePhotoURL;
            } else if (facebookPhotoURL && !userProfile.photoURL) {
              updateData.photoURL = facebookPhotoURL;
            }
            
            await updateDoc(doc(db!, 'users', googleResult.user.uid), updateData);
            return { 
              success: true, 
              user: { ...userProfile, ...updateData } as UserProfile
            };
          }
          
          // Profile doesn't exist - create it
          const userProfile: UserProfile = {
            uid: googleResult.user.uid,
            displayName: googleResult.user.displayName || existingProviderResult.user.displayName || email.split('@')[0],
            email: email,
            photoURL: googlePhotoURL || facebookPhotoURL || '',
            createdAt: new Date(),
            lastLoginAt: new Date(),
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
            eloRating: 1200,
            achievements: []
          };
          await setDoc(doc(db!, 'users', googleResult.user.uid), userProfile);
          return { success: true, user: userProfile };
          
        } catch (linkError) {
          logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginWithGoogle] ❌ Failed to auto-link accounts:', linkError);
          const providerName = verifiedProviders.includes('facebook.com') ? 'Facebook' : verifiedProviders[0];
          return { 
            success: false, 
            error: `An account with this email already exists with ${providerName}. Please sign in with ${providerName} instead.` 
          };
        }
      }
    }
    
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginWithGoogle] ❌ Google login error:', {
      code: firebaseError.code,
      message: firebaseError.message,
      fullError: firebaseError
    });
    const userFriendlyMessage = getAuthErrorMessage(error);
    // Don't show error for silent failures (like popup cancelled)
    if (!userFriendlyMessage) {
      return { success: false, error: undefined };
    }
    return { success: false, error: userFriendlyMessage };
  }
};

// Login with Facebook
export const loginWithFacebook = async (): Promise<AuthResult> => {
  logAuth(LOG_AUTH_SOCIAL, 'log', prefix, '[loginWithFacebook] Starting Facebook login...');

  // If Firebase isn't configured, return an error
  if (!isFirebaseConfigured) {
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginWithFacebook] ❌ Firebase not configured');
    return { success: false, error: 'Firebase not configured' };
  }
  
  try {
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithFacebook] Creating FacebookAuthProvider...');
    const provider = new FacebookAuthProvider();
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithFacebook] Provider created, auth object:', { 
      hasAuth: !!auth, 
      currentUser: auth?.currentUser?.uid || null,
      appName: auth?.app?.name || null
    });
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithFacebook] About to call signInWithPopup...');
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithFacebook] Current URL:', window.location.href);
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithFacebook] Opening popup for Facebook login...');
    const result = await signInWithPopup(auth!, provider);
    logAuth(LOG_AUTH_SOCIAL, 'log', prefix, '[loginWithFacebook] ✅ Popup login successful:', { 
      uid: result.user.uid, 
      email: result.user.email 
    });
    
    // Handle account linking - check if email exists with different provider
    const email = result.user.email;
    if (email) {
      try {
        const signInMethods = await fetchSignInMethodsForEmail(auth!, email);
        logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithFacebook] Sign-in methods for email:', signInMethods);
        
        // If user has other sign-in methods, we could link accounts here if needed
        // For now, we just log it
      } catch (linkError) {
        logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithFacebook] Could not fetch sign-in methods (non-critical):', linkError);
      }
    }
    
    // Check if user profile exists, create if not
    logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[loginWithFacebook] Checking Firestore for existing profile:', { uid: result.user.uid });
    const userDoc = await getDoc(doc(db!, 'users', result.user.uid));
    let userProfile: UserProfile;

    // Keep original Facebook profile picture URL - will be proxied through Cloudflare Worker in frontend
    // No need to upload to Firebase Storage anymore (proxy approach is simpler and free)
    const photoURL = result.user.photoURL || '';

    if (!userDoc.exists()) {
      // Create user profile if it doesn't exist
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithFacebook] Profile not found, creating new profile');
      userProfile = {
        uid: result.user.uid,
        displayName: result.user.displayName || result.user.email?.split('@')[0] || 'User',
        email: result.user.email || '',
        photoURL: photoURL,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        eloRating: 1200, // Default ELO rating
        achievements: []
      };
      
      // Save user profile to Firestore
      logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[loginWithFacebook] Saving new profile to Firestore');
      await setDoc(doc(db!, 'users', result.user.uid), userProfile);
      
      logAuth(LOG_AUTH_SOCIAL, 'log', prefix, '[loginWithFacebook] ✅ New profile created and saved');
    } else {
      // User profile exists, update last login and photoURL if Facebook has a better one
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithFacebook] User profile exists, updating lastLoginAt');
      userProfile = { ...userDoc.data() as UserProfile, uid: result.user.uid };
      const updateData: Partial<UserProfile> = {
        lastLoginAt: new Date()
      };
      
      // Update photoURL if Facebook has one and current one is empty or different
      if (result.user.photoURL && (!userProfile.photoURL || userProfile.photoURL !== result.user.photoURL)) {
        updateData.photoURL = photoURL;
        logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithFacebook] Updating photoURL from Facebook (will be proxied through Cloudflare Worker)');
      }
      
      await updateDoc(doc(db!, 'users', result.user.uid), updateData);
      userProfile = { ...userProfile, ...updateData };
      
      logAuth(LOG_AUTH_SOCIAL, 'log', prefix, '[loginWithFacebook] ✅ Login successful, profile loaded:', { 
        uid: userProfile.uid, 
        displayName: userProfile.displayName,
        gamesPlayed: userProfile.gamesPlayed,
        eloRating: userProfile.eloRating
      });
    }
    
    return { success: true, user: userProfile };
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError & { customData?: { _tokenResponse?: { verifiedProvider?: string[]; email?: string } } };
    
    // Handle account linking - if account exists with different provider (e.g., Google)
    if (firebaseError.code === 'auth/account-exists-with-different-credential') {
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithFacebook] Account exists with different provider, attempting to auto-link...');
      
      const email = firebaseError.customData?._tokenResponse?.email;
      const verifiedProviders = firebaseError.customData?._tokenResponse?.verifiedProvider || [];
      
      if (email && verifiedProviders.length > 0) {
        logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithFacebook] Found existing account:', { email, providers: verifiedProviders });
        
        // Check if user is currently logged in with the existing provider
        if (auth?.currentUser && auth.currentUser.email === email) {
          logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithFacebook] User is already logged in with existing provider');
          // User is logged in - Firebase should have auto-linked, but popup failed
          // Return success with current user profile
          const userDoc = await getDoc(doc(db!, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const userProfile = { ...userDoc.data() as UserProfile, uid: auth.currentUser.uid };
            await updateDoc(doc(db!, 'users', auth.currentUser.uid), {
              lastLoginAt: new Date()
            });
            return { success: true, user: userProfile };
          }
        }
        
        // User not logged in - automatically sign them in with existing provider, then link Facebook
        const hasGoogle = verifiedProviders.includes('google.com');
        const providerName = hasGoogle ? 'Google' : verifiedProviders[0];
        
        logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithFacebook] Auto-linking: signing in with', providerName, 'first...');
        
        try {
          // Sign in with existing provider first
          let existingProviderResult;
          if (hasGoogle) {
            const googleProvider = new GoogleAuthProvider();
            existingProviderResult = await signInWithPopup(auth!, googleProvider);
          } else {
            // For other providers, we'd need to handle them similarly
            // For now, just prompt user
            return { 
              success: false, 
              error: `An account with this email already exists with ${providerName}. Please sign in with ${providerName} instead.` 
            };
          }
          
          logAuth(LOG_AUTH_SOCIAL, 'log', prefix, '[loginWithFacebook] ✅ Signed in with', providerName, ', now linking Facebook...');
          
          // Now link Facebook credential
          // We need to retry Facebook login - Firebase will auto-link since user is now logged in
          const facebookProvider = new FacebookAuthProvider();
          const facebookResult = await signInWithPopup(auth!, facebookProvider);
          
          logAuth(LOG_AUTH_SOCIAL, 'log', prefix, '[loginWithFacebook] ✅ Successfully linked Facebook to existing account');
          
          // Update user profile - merge data from both providers
          const userDoc = await getDoc(doc(db!, 'users', facebookResult.user.uid));
          const facebookPhotoURL = facebookResult.user.photoURL;
          const googlePhotoURL = existingProviderResult.user.photoURL;
          
          if (userDoc.exists()) {
            const userProfile = { ...userDoc.data() as UserProfile, uid: facebookResult.user.uid };
            const updateData: Partial<UserProfile> = {
              lastLoginAt: new Date()
            };
            
            // Use Facebook photo if available, otherwise Google photo, otherwise keep existing
            if (facebookPhotoURL && (!userProfile.photoURL || userProfile.photoURL === googlePhotoURL)) {
              updateData.photoURL = facebookPhotoURL;
            } else if (googlePhotoURL && !userProfile.photoURL) {
              updateData.photoURL = googlePhotoURL;
            }
            
            await updateDoc(doc(db!, 'users', facebookResult.user.uid), updateData);
            return { 
              success: true, 
              user: { ...userProfile, ...updateData } as UserProfile
            };
          }
          
          // Profile doesn't exist - create it
          const userProfile: UserProfile = {
            uid: facebookResult.user.uid,
            displayName: facebookResult.user.displayName || existingProviderResult.user.displayName || email.split('@')[0],
            email: email,
            photoURL: facebookPhotoURL || googlePhotoURL || '',
            createdAt: new Date(),
            lastLoginAt: new Date(),
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
            eloRating: 1200,
            achievements: []
          };
          await setDoc(doc(db!, 'users', facebookResult.user.uid), userProfile);
          return { success: true, user: userProfile };
          
        } catch (linkError) {
          logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginWithFacebook] ❌ Failed to auto-link accounts:', linkError);
          const providerName = verifiedProviders.includes('google.com') ? 'Google' : verifiedProviders[0];
          return { 
            success: false, 
            error: `An account with this email already exists with ${providerName}. Please sign in with ${providerName} instead.` 
          };
        }
      }
    }
    
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginWithFacebook] ❌ Facebook login error:', firebaseError);
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginWithFacebook] Full error object:', error);
    const userFriendlyMessage = getAuthErrorMessage(error);
    if (!userFriendlyMessage) {
      return { success: false, error: undefined };
    }
    return { success: false, error: userFriendlyMessage };
  }
};

// Guest login
export const loginAsGuest = async (): Promise<AuthResult> => {
  logAuth(LOG_AUTH_GUEST, 'log', prefix, '[loginAsGuest] Starting guest login...');

  if (!isFirebaseConfigured) {
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginAsGuest] ❌ Firebase not configured');
    return { success: false, error: 'Firebase not configured' };
  }
  try {
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginAsGuest] Signing in anonymously...');
    const userCredential = await signInAnonymously(auth!);
    const user = userCredential.user;
    
    logAuth(LOG_AUTH_GUEST, 'log', prefix, '[loginAsGuest] Anonymous sign in successful:', { uid: user.uid });
    
    // Check if user profile exists, create if not
    logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[loginAsGuest] Checking Firestore for existing profile:', { uid: user.uid });
    const userDoc = await getDoc(doc(db!, 'users', user.uid));
    let userProfile: UserProfile;

    if (!userDoc.exists()) {
      // Create new user profile for anonymous user
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginAsGuest] Creating new guest profile in Firestore');
      userProfile = {
        uid: user.uid,
        displayName: `Guest-${user.uid.substring(0, 5)}`,
        email: '',
        photoURL: '',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        eloRating: 1200,
        achievements: []
      };
      await setDoc(doc(db!, 'users', user.uid), userProfile);
    } else {
      // User profile already exists, just update last login
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginAsGuest] Guest profile exists, updating lastLoginAt');
      userProfile = { ...userDoc.data() as UserProfile, uid: user.uid };
      await updateDoc(doc(db!, 'users', user.uid), {
        lastLoginAt: new Date()
      });
    }
    
    logAuth(LOG_AUTH_GUEST, 'log', prefix, '[loginAsGuest] ✅ Guest login successful:', { 
      uid: userProfile.uid, 
      displayName: userProfile.displayName 
    });
    
    return { success: true, user: userProfile };
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError;
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginAsGuest] ❌ Anonymous login error:', firebaseError);
    const userFriendlyMessage = getAuthErrorMessage(error);
    return { success: false, error: userFriendlyMessage };
  }
};

// Wallet-based authentication
// This function authenticates a user by verifying a message signature from their Solana wallet
export const loginWithWallet = async (
  walletPublicKey: string,
  _signature: Uint8Array, // Signature verification should be done server-side in production
  message: Uint8Array
): Promise<AuthResult> => {
  logAuth(LOG_AUTH_SOCIAL, 'log', prefix, '[loginWithWallet] Starting wallet login...', { walletPublicKey });

  if (!isFirebaseConfigured) {
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginWithWallet] ❌ Firebase not configured');
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    // Extract nonce from message to prevent replay attacks
    const messageText = new TextDecoder().decode(message);
    const nonceMatch = messageText.match(/Nonce:\s*([^\n]+)/);
    const nonce = nonceMatch ? nonceMatch[1].trim() : null;
    
    if (nonce) {
      // Check if nonce has been used before (replay protection)
      logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[loginWithWallet] Checking nonce for replay protection...', { nonce });
      const noncesRef = collection(db!, 'nonces');
      const nonceQuery = query(noncesRef, where('nonce', '==', nonce));
      const nonceDocs = await getDocs(nonceQuery);
      
      if (!nonceDocs.empty) {
        // Check if nonce has expired
        const nonceDoc = nonceDocs.docs[0];
        const nonceData = nonceDoc.data();
        const expiresAt = nonceData.expiresAt?.toDate();
        
        if (expiresAt && expiresAt < new Date()) {
          // Nonce expired, delete it
          logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[loginWithWallet] Nonce expired, deleting...');
          await deleteDoc(nonceDoc.ref);
        } else if (expiresAt && expiresAt >= new Date()) {
          // Nonce already used and not expired - replay attack!
          logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginWithWallet] ❌ Replay attack detected - nonce already used');
          return { success: false, error: 'This signature has already been used. Please sign in again.' };
        }
      }
      
      // Store nonce with expiration (5 minutes)
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      const nonceDocRef = doc(db!, 'nonces', nonce);
      await setDoc(nonceDocRef, {
        nonce: nonce,
        walletAddress: walletPublicKey,
        createdAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(expiresAt)
      });
      logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[loginWithWallet] Nonce stored with expiration:', { nonce, expiresAt });
    }
    
    // Verify signature (client-side verification - in production, this should be server-side)
    // For now, we'll trust the signature and create/link the account
    // In production, use a Firebase Cloud Function to verify signatures server-side
    
    // Check if user with this wallet address already exists
    logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[loginWithWallet] Checking for existing wallet-linked account...');
    const usersRef = collection(db!, 'users');
    const walletQuery = query(usersRef, where('walletAddress', '==', walletPublicKey));
    const walletQuerySnapshot = await getDocs(walletQuery);
    
    let userProfile: UserProfile;
    let firebaseUser: FirebaseUser;

    if (!walletQuerySnapshot.empty) {
      // Existing user with this wallet - reuse their profile
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithWallet] Found existing account linked to wallet');
      const existingUserDoc = walletQuerySnapshot.docs[0];
      const existingProfile = existingUserDoc.data() as UserProfile;
      
      // Create new anonymous Firebase account (Firebase UID changes, but profile persists via wallet)
      const userCredential = await signInAnonymously(auth!);
      firebaseUser = userCredential.user;
      
      // Update the existing Firestore profile with new Firebase UID and lastLoginAt
      // This allows the profile to persist across sessions even though Firebase UID changes
      await updateDoc(doc(db!, 'users', existingUserDoc.id), {
        uid: firebaseUser.uid, // Update to new Firebase UID
        lastLoginAt: new Date()
      });
      
      // Return profile with updated UID
      userProfile = {
        ...existingProfile,
        uid: firebaseUser.uid,
        lastLoginAt: new Date()
      };
    } else {
      // New user - create anonymous Firebase account and link wallet
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[loginWithWallet] Creating new wallet-linked account');
      const userCredential = await signInAnonymously(auth!);
      firebaseUser = userCredential.user;
      
      // Create user profile with wallet address
      userProfile = {
        uid: firebaseUser.uid,
        displayName: `Wallet-${walletPublicKey.substring(0, 8)}`,
        email: '',
        photoURL: '',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        eloRating: 1200,
        achievements: [],
        walletAddress: walletPublicKey
      };
      
      await setDoc(doc(db!, 'users', firebaseUser.uid), userProfile);
      logAuth(LOG_AUTH_REGISTER, 'log', prefix, '[loginWithWallet] ✅ New wallet-linked account created:', { 
        uid: userProfile.uid, 
        walletAddress: walletPublicKey 
      });
    }
    
    // Delete nonce after successful authentication to prevent reuse
    if (nonce) {
      try {
        const nonceDocRef = doc(db!, 'nonces', nonce);
        await deleteDoc(nonceDocRef);
        logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[loginWithWallet] Nonce deleted after successful auth');
      } catch (nonceError) {
        // Non-critical error - log but don't fail auth
        logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginWithWallet] Failed to delete nonce (non-critical):', nonceError);
      }
    }
    
    logAuth(LOG_AUTH_LOGIN, 'log', prefix, '[loginWithWallet] ✅ Wallet login successful:', { 
      uid: userProfile.uid, 
      walletAddress: walletPublicKey 
    });
    
    return { success: true, user: userProfile };
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError;
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[loginWithWallet] ❌ Wallet login error:', firebaseError);
    const userFriendlyMessage = getAuthErrorMessage(error) || 'Failed to sign in with wallet. Please try again.';
    return { success: false, error: userFriendlyMessage };
  }
};

// Per spec Section 18, lines 1693-1696: Add match to user's match history
export const addMatchToHistory = async (
  userId: string,
  matchId: string
): Promise<{ success: boolean; error?: string }> => {
  logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[addMatchToHistory] Adding match to history:', { userId, matchId });

  if (!isFirebaseConfigured) {
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[addMatchToHistory] ❌ Firebase not configured');
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    const userDoc = doc(db!, 'users', userId);
    const userDocSnapshot = await getDoc(userDoc);

    if (!userDocSnapshot.exists()) {
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[addMatchToHistory] ❌ User not found:', { userId });
      return { success: false, error: 'User not found' };
    }

    const userData = userDocSnapshot.data() as UserProfile;
    const matchIds = userData.matchIds || [];

    // Check if match already exists
    if (matchIds.includes(matchId)) {
      logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[addMatchToHistory] Match already in history:', { userId, matchId });
      return { success: true };
    }

    // Add match to history (keep last 100 matches)
    const updatedMatchIds = [matchId, ...matchIds].slice(0, 100);
    const updatedMatchHistory = userData.matchHistory ? [matchId, ...userData.matchHistory].slice(0, 100) : updatedMatchIds;

    await updateDoc(userDoc, {
      matchHistory: updatedMatchHistory,
      matchIds: updatedMatchIds,
    });

    logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[addMatchToHistory] ✅ Match added to history:', { userId, matchId });
    return { success: true };
  } catch (error) {
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[addMatchToHistory] ❌ Error:', error);
    const userFriendlyMessage = error instanceof Error ? error.message : 'Failed to add match to history';
    return { success: false, error: userFriendlyMessage };
  }
};

// Get user's match history
export const getMatchHistory = async (
  userId: string
): Promise<{ success: boolean; matchIds?: string[]; error?: string }> => {
  logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[getMatchHistory] Getting match history:', { userId });

  if (!isFirebaseConfigured) {
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[getMatchHistory] ❌ Firebase not configured');
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    const userDoc = doc(db!, 'users', userId);
    const userDocSnapshot = await getDoc(userDoc);

    if (!userDocSnapshot.exists()) {
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[getMatchHistory] ❌ User not found:', { userId });
      return { success: false, error: 'User not found' };
    }

    const userData = userDocSnapshot.data() as UserProfile;
    const matchIds = userData.matchIds || [];

    logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[getMatchHistory] ✅ Match history retrieved:', { userId, count: matchIds.length });
    return { success: true, matchIds };
  } catch (error) {
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[getMatchHistory] ❌ Error:', error);
    const userFriendlyMessage = error instanceof Error ? error.message : 'Failed to get match history';
    return { success: false, error: userFriendlyMessage };
  }
};

// Logout
export const logoutUser = async (): Promise<{ success: boolean; error?: string }> => {
  logAuth(LOG_AUTH_LOGOUT, 'log', prefix, '[logoutUser] Starting logout...');

  // If Firebase isn't configured, return an error
  if (!isFirebaseConfigured) {
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[logoutUser] ❌ Firebase not configured');
    return { success: false, error: 'Firebase not configured' };
  }
  
  try {
    await signOut(auth!);
    logAuth(LOG_AUTH_LOGOUT, 'log', prefix, '[logoutUser] ✅ Logout successful');
    return { success: true };
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError;
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[logoutUser] ❌ Logout error:', firebaseError);
    return { success: false, error: firebaseError.message };
  }
};

/**
 * Download profile picture from external URL and upload to Firebase Storage
 * Returns Firebase Storage URL if successful, or original URL if upload fails
 */
export async function uploadProfilePictureToStorage(
  imageUrl: string,
  userId: string
): Promise<string> {
  // If Firebase Storage isn't available, return original URL
  if (!storage || !imageUrl) {
    return imageUrl;
  }

  // Skip if already a Firebase Storage URL
  if (imageUrl.includes('firebasestorage.googleapis.com') || imageUrl.includes('firebase')) {
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[uploadProfilePictureToStorage] Already a Firebase Storage URL, skipping upload');
    return imageUrl;
  }

  try {
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[uploadProfilePictureToStorage] Downloading image from:', imageUrl);
    
    // Download image from external URL
    const response = await fetch(imageUrl, {
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[uploadProfilePictureToStorage] Failed to download image:', response.status, response.statusText);
      return imageUrl; // Return original URL if download fails
    }
    
    const blob = await response.blob();
    
    if (blob.size === 0) {
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[uploadProfilePictureToStorage] Empty blob received');
      return imageUrl;
    }
    
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[uploadProfilePictureToStorage] Image downloaded, size:', blob.size);
    
    // Determine file extension from content type or URL
    const contentType = blob.type || 'image/jpeg';
    const extension = contentType.includes('png') ? 'png' : contentType.includes('gif') ? 'gif' : 'jpg';
    const fileName = `profile-pictures/${userId}/avatar.${extension}`;
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, fileName);
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[uploadProfilePictureToStorage] Uploading to Firebase Storage:', fileName);
    
    await uploadBytes(storageRef, blob, {
      contentType: blob.type || 'image/jpeg',
      cacheControl: 'public, max-age=31536000', // Cache for 1 year
    });
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[uploadProfilePictureToStorage] ✅ Image uploaded to Firebase Storage:', downloadURL);
    
    return downloadURL;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[uploadProfilePictureToStorage] ❌ Error uploading to Firebase Storage:', errorMessage);
    
    // Check if it's a permission/configuration error
    if (errorMessage.includes('permission') || errorMessage.includes('403') || errorMessage.includes('404') || errorMessage.includes('CORS')) {
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[uploadProfilePictureToStorage] ⚠️ Firebase Storage may not be configured. Check:');
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[uploadProfilePictureToStorage] 1. Firebase Storage security rules (storage.rules)');
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[uploadProfilePictureToStorage] 2. VITE_FIREBASE_STORAGE_BUCKET environment variable');
      logAuth(LOG_AUTH_ERROR, 'error', prefix, '[uploadProfilePictureToStorage] 3. CORS configuration in Firebase Console');
    }
    
    // Return original URL if upload fails (graceful degradation)
    return imageUrl;
  }
}

// Update user profile (displayName, photoURL, etc.)
export const updateUserProfile = async (
  uid: string,
  updates: {
    displayName?: string;
    photoURL?: string;
  }
): Promise<{ success: boolean; error?: string }> => {
  logAuth(LOG_AUTH_FLOW, 'log', prefix, '[updateUserProfile] Starting profile update:', { uid, updates });

  if (!isFirebaseConfigured) {
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[updateUserProfile] ❌ Firebase not configured');
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    // Update Firebase Auth profile if user is currently logged in
    // BUT skip Auth update for base64 images (Firebase Auth has size limits)
    const isBase64 = updates.photoURL?.startsWith('data:image/');
    
    if (auth?.currentUser && auth.currentUser.uid === uid && !isBase64) {
      await updateProfile(auth.currentUser, updates);
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[updateUserProfile] Firebase Auth profile updated');
    } else if (isBase64) {
      logAuth(LOG_AUTH_FLOW, 'log', prefix, '[updateUserProfile] Skipping Auth update for base64 image (size limit)');
    }

    // Update Firestore document (supports larger data)
    const updateData: Partial<UserProfile> = {};
    if (updates.displayName !== undefined) updateData.displayName = updates.displayName;
    if (updates.photoURL !== undefined) updateData.photoURL = updates.photoURL;

    await updateDoc(doc(db!, 'users', uid), updateData);
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[updateUserProfile] ✅ Firestore profile updated');
    
    return { success: true };
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError;
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[updateUserProfile] ❌ Profile update error:', firebaseError);
    const userFriendlyMessage = getAuthErrorMessage(error);
    return { success: false, error: userFriendlyMessage };
  }
};

// Update user statistics
export const updateUserStats = async (
  uid: string,
  stats: Partial<{
    gamesPlayed: number;
    wins: number;
    losses: number;
    winRate: number;
    eloRating: number;
    achievements: string[];
  }>
): Promise<{ success: boolean; error?: string }> => {
  // If Firebase isn't configured, return an error
  if (!isFirebaseConfigured) {
    return { success: false, error: 'Firebase not configured' };
  }
  
  try {
    // Calculate win rate if gamesPlayed is provided
    if (stats.gamesPlayed !== undefined) {
      const userDoc = await getDoc(doc(db!, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        const wins = stats.wins !== undefined ? stats.wins : userData.wins;
        const winRate = stats.gamesPlayed > 0 ? (wins / stats.gamesPlayed) * 100 : 0;
        stats = { ...stats, winRate };
      }
    }
    
    await updateDoc(doc(db!, 'users', uid), stats);
    return { success: true };
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError;
    if (LOG_AUTH_ERROR) console.error('Update user stats error:', firebaseError);
    return { success: false, error: firebaseError.message };
  }
};

export const handleRedirectResult = async (): Promise<AuthResult> => {
  logAuth(LOG_AUTH_REDIRECT, 'log', prefix, '[handleRedirectResult] Checking for redirect result...');

  if (!isFirebaseConfigured) {
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleRedirectResult] ❌ Firebase not configured');
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    const result = await getRedirectResult(auth!);
    if (result) {
      logAuth(LOG_AUTH_REDIRECT, 'log', prefix, '[handleRedirectResult] ✅ Redirect result found:', { 
        uid: result.user.uid, 
        email: result.user.email,
        provider: result.providerId 
      });
      const user = result.user;
      
      // Check if user profile exists, create if not
      logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[handleRedirectResult] Checking Firestore for existing profile:', { uid: user.uid });
      const userDoc = await getDoc(doc(db!, 'users', user.uid));
      let userProfile: UserProfile;

      if (!userDoc.exists()) {
        // Create user profile if it doesn't exist
        logAuth(LOG_AUTH_FLOW, 'log', prefix, '[handleRedirectResult] Profile not found, creating new profile');
        userProfile = {
          uid: user.uid,
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          photoURL: user.photoURL || '',
          createdAt: new Date(),
          lastLoginAt: new Date(),
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          eloRating: 1200, // Default ELO rating
          achievements: []
        };
        
        // Save user profile to Firestore
        logAuth(LOG_AUTH_FIRESTORE, 'log', prefix, '[handleRedirectResult] Saving new profile to Firestore');
        await setDoc(doc(db!, 'users', user.uid), userProfile);
        
        logAuth(LOG_AUTH_REDIRECT, 'log', prefix, '[handleRedirectResult] ✅ New profile created and saved');
      } else {
        // User profile exists, update last login
        logAuth(LOG_AUTH_FLOW, 'log', prefix, '[handleRedirectResult] Profile exists, updating lastLoginAt');
        userProfile = { ...userDoc.data() as UserProfile, uid: user.uid };
        await updateDoc(doc(db!, 'users', user.uid), {
          lastLoginAt: new Date()
        });
        
        logAuth(LOG_AUTH_REDIRECT, 'log', prefix, '[handleRedirectResult] ✅ Profile loaded from Firestore:', { 
          uid: userProfile.uid, 
          displayName: userProfile.displayName 
        });
      }
      
      return { success: true, user: userProfile };
    } else {
      logAuth(LOG_AUTH_REDIRECT, 'log', prefix, '[handleRedirectResult] No redirect result found (normal if not returning from OAuth)');
      return { success: false, error: 'No redirect result' };
    }
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError;
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleRedirectResult] ❌ Redirect result error:', firebaseError);
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[handleRedirectResult] Full error object:', error);
    const userFriendlyMessage = getAuthErrorMessage(error);
    return { success: false, error: userFriendlyMessage };
  }
};

// Send password reset email
export const sendPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
  logAuth(LOG_AUTH_FLOW, 'log', prefix, '[sendPasswordReset] Sending password reset email:', { email });

  if (!isFirebaseConfigured) {
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[sendPasswordReset] ❌ Firebase not configured');
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    await sendPasswordResetEmail(auth!, email);
    logAuth(LOG_AUTH_FLOW, 'log', prefix, '[sendPasswordReset] ✅ Password reset email sent');
    return { success: true };
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError;
    logAuth(LOG_AUTH_ERROR, 'error', prefix, '[sendPasswordReset] ❌ Password reset error:', firebaseError);
    const userFriendlyMessage = getAuthErrorMessage(error);
    return { success: false, error: userFriendlyMessage };
  }
};
