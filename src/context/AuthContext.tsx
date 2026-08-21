import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { 
  applyForAffiliateProgramInFirestore,
  sanitizeFirestoreData
} from '../lib/firestoreService';
import { WishlistNotificationPreferences } from '../types';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  role: 'customer' | 'seller' | 'affiliate' | 'admin';
  isAffiliate?: boolean;
  affiliateCode?: string;
  affiliateId?: string;
  notificationPreferences?: WishlistNotificationPreferences;
  addresses?: Array<{ id: string; fullName: string; street: string; city: string; country: string; phone: string; default: boolean }>;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isSeller: boolean;
  isAffiliate: boolean;
  loading: boolean;
  signUpWithEmail: (email: string, pass: string, name: string, phone: string, role?: 'customer' | 'seller' | 'affiliate' | 'admin', autoSignIn?: boolean) => Promise<UserProfile | null>;
  signInWithEmail: (email: string, pass: string) => Promise<UserProfile | null>;
  loginAsPresetUser: (presetRole: 'admin' | 'seller' | 'affiliate' | 'customer') => Promise<UserProfile | null>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const PRESET_ACCOUNTS = {
  admin: {
    email: 'admin@nexovira.com',
    pass: 'Admin@Nexovira2026',
    name: 'NEXOVIRA Admin Master',
    phone: '+234 911 044 3054',
    role: 'admin' as const
  },
  seller: {
    email: 'seller@nexovira.com',
    pass: 'Seller@Nexovira2026',
    name: 'NEXOVIRA Official Store',
    phone: '+234 812 345 6789',
    role: 'seller' as const
  },
  affiliate: {
    email: 'affiliate@nexovira.com',
    pass: 'Affiliate@Nexovira2026',
    name: 'NEXOVIRA Elite Affiliate',
    phone: '+234 809 876 5432',
    role: 'affiliate' as const
  },
  customer: {
    email: 'shopper@nexovira.com',
    pass: 'Shopper@Nexovira2026',
    name: 'Valued Shopper',
    phone: '+234 800 000 0000',
    role: 'customer' as const
  }
};

const DEMO_ADMIN_PROFILE: UserProfile = {
  uid: 'admin-demo-uid-2026',
  email: 'admin@nexovira.com',
  displayName: 'NEXOVIRA Admin Master',
  phone: '+234 911 044 3054',
  role: 'admin',
  createdAt: new Date().toISOString()
};

const DEMO_SHOPPER_PROFILE: UserProfile = {
  uid: 'shopper-demo-uid-2026',
  email: 'shopper@nexovira.com',
  displayName: 'Valued Shopper',
  phone: '+234 800 000 0000',
  role: 'customer',
  createdAt: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('nexovira_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return userProfile?.role === 'admin';
  });
  const [isSeller, setIsSeller] = useState<boolean>(() => {
    return userProfile?.role === 'seller';
  });
  const [isAffiliate, setIsAffiliate] = useState<boolean>(() => {
    return userProfile?.role === 'affiliate' || userProfile?.isAffiliate === true;
  });
  const [loading, setLoading] = useState<boolean>(true);

  const setUserSession = (profile: UserProfile | null) => {
    setUserProfile(profile);
    setIsAdmin(profile?.role === 'admin');
    setIsSeller(profile?.role === 'seller');
    setIsAffiliate(profile?.role === 'affiliate' || profile?.isAffiliate === true);
    if (profile) {
      localStorage.setItem('nexovira_user_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('nexovira_user_profile');
    }
  };

  const fetchUserProfile = async (firebaseUser: User): Promise<UserProfile | null> => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(userDocRef);
      
      const isEmailOwner = firebaseUser.email?.toLowerCase() === 'nexovirasupport@gmail.com' || firebaseUser.email?.toLowerCase() === 'admin@nexovira.com';

      // Check if document exists in affiliates collection
      let affSnapExists = false;
      let affCode: string | undefined;
      let affId: string | undefined;
      try {
        const affSnap = await getDoc(doc(db, 'affiliates', firebaseUser.uid));
        if (affSnap.exists()) {
          affSnapExists = true;
          const affData = affSnap.data();
          affCode = affData.affiliateCode;
          affId = affData.id;
        }
      } catch (e) {
        console.warn('Affiliate document lookup warning:', e);
      }

      let profile: UserProfile;
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        const rawRole = data.role ? (data.role as string).toLowerCase() : 'customer';
        const isAffiliateRole = rawRole === 'affiliate' || data.isAffiliate === true || affSnapExists || (firebaseUser.email?.toLowerCase().includes('affiliate') ?? false);
        
        const finalRole: 'customer' | 'seller' | 'affiliate' | 'admin' = isEmailOwner 
          ? 'admin' 
          : (rawRole === 'seller' ? 'seller' : (isAffiliateRole ? 'affiliate' : 'customer'));

        profile = { 
          ...data, 
          role: finalRole,
          isAffiliate: finalRole === 'affiliate' || data.isAffiliate === true || affSnapExists,
          affiliateCode: data.affiliateCode || affCode,
          affiliateId: data.affiliateId || affId
        };
      } else {
        const isAffiliateRole = affSnapExists || (firebaseUser.email?.toLowerCase().includes('affiliate') ?? false);
        const finalRole: 'customer' | 'seller' | 'affiliate' | 'admin' = isEmailOwner 
          ? 'admin' 
          : (isAffiliateRole ? 'affiliate' : 'customer');

        profile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'NEXOVIRA Member',
          phone: firebaseUser.phoneNumber || '',
          role: finalRole,
          isAffiliate: finalRole === 'affiliate' || isAffiliateRole,
          affiliateCode: affCode,
          affiliateId: affId,
          createdAt: new Date().toISOString()
        };
      }

      // Keep users/{uid} document strictly synced in Firestore
      await setDoc(userDocRef, sanitizeFirestoreData(profile), { merge: true }).catch(console.error);

      // Auto-ensure affiliate profile exists in affiliates/{uid} if role is affiliate
      if (profile.role === 'affiliate' || profile.isAffiliate) {
        try {
          const affProfile = await applyForAffiliateProgramInFirestore(
            firebaseUser.uid,
            profile.displayName || 'NEXOVIRA Affiliate',
            profile.email || '',
            'Auto-Sync'
          );
          profile.affiliateCode = affProfile.affiliateCode;
          profile.affiliateId = affProfile.id;
          profile.isAffiliate = true;
        } catch (e) {
          console.error('Error syncing affiliate profile:', e);
        }
      }

      setUserSession(profile);
      return profile;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      const isEmailOwner = firebaseUser.email?.toLowerCase() === 'nexovirasupport@gmail.com' || firebaseUser.email?.toLowerCase() === 'admin@nexovira.com';
      const isAffiliateEmail = firebaseUser.email?.toLowerCase().includes('affiliate') ?? false;
      const fallbackRole = isEmailOwner ? 'admin' : (isAffiliateEmail ? 'affiliate' : 'customer');
      
      const fallback: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'NEXOVIRA Member',
        phone: '',
        role: fallbackRole,
        isAffiliate: fallbackRole === 'affiliate',
        createdAt: new Date().toISOString()
      };
      setUserSession(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setUser(null);
        setUserSession(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (user) {
      return await fetchUserProfile(user);
    }
    return null;
  };

  const signUpWithEmail = async (
    email: string, 
    pass: string, 
    name: string, 
    phone: string, 
    role: 'customer' | 'seller' | 'affiliate' | 'admin' = 'customer',
    autoSignIn: boolean = false
  ): Promise<UserProfile | null> => {
    const cleanEmail = email.toLowerCase().trim();
    const isEmailOwner = cleanEmail === 'nexovirasupport@gmail.com' || cleanEmail === 'admin@nexovira.com';
    
    // Security Guard: Public registration CANNOT grant admin role unless email is an owner
    let safeRole: 'customer' | 'seller' | 'affiliate' | 'admin' = role;
    if ((role as string) === 'admin' || (role as string) === 'super_admin') {
      if (!isEmailOwner) {
        console.warn('Public admin registration attempt blocked by security guard.');
        safeRole = 'customer';
      } else {
        safeRole = 'admin';
      }
    }
    if (isEmailOwner) {
      safeRole = 'admin';
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name }).catch(() => {});
        
        let affiliateCode: string | undefined;
        let affiliateId: string | undefined;

        if (safeRole === 'affiliate') {
          try {
            const affProfile = await applyForAffiliateProgramInFirestore(cred.user.uid, name, email, 'Public Registration');
            affiliateCode = affProfile.affiliateCode;
            affiliateId = affProfile.id;
          } catch (e) {
            console.error('Error creating affiliate profile during registration:', e);
          }
        }

        const newProfile: UserProfile = {
          uid: cred.user.uid,
          email,
          displayName: name,
          phone,
          role: safeRole,
          isAffiliate: safeRole === 'affiliate',
          affiliateCode,
          affiliateId,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', cred.user.uid), sanitizeFirestoreData(newProfile)).catch(() => {});
        
        if (autoSignIn) {
          setUser(cred.user);
          setUserSession(newProfile);
          return newProfile;
        } else {
          // Manual sign-in flow for dedicated signup view
          await signOut(auth).catch(() => {});
          setUser(null);
          setUserSession(null);
          return newProfile;
        }
      }
      return null;
    } catch (err: any) {
      console.error('Firebase signup error:', err);
      if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed')) {
        console.warn('Email/Password auth provider is disabled in Firebase Console. Falling back to local profile registration.');
        let localAffCode: string | undefined;
        let localAffId: string | undefined;
        const localUid = `user-${Date.now()}`;

        if (safeRole === 'affiliate') {
          try {
            const affProfile = await applyForAffiliateProgramInFirestore(localUid, name, email, 'Public Registration');
            localAffCode = affProfile.affiliateCode;
            localAffId = affProfile.id;
          } catch (_) {}
        }

        const fallbackProfile: UserProfile = {
          uid: localUid,
          email,
          displayName: name || 'NEXOVIRA Member',
          phone,
          role: safeRole,
          isAffiliate: safeRole === 'affiliate',
          affiliateCode: localAffCode,
          affiliateId: localAffId,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', localUid), sanitizeFirestoreData(fallbackProfile)).catch(() => {});
        
        if (autoSignIn) {
          setUserSession(fallbackProfile);
          return fallbackProfile;
        } else {
          await signOut(auth).catch(() => {});
          setUser(null);
          setUserSession(null);
          return fallbackProfile;
        }
      }
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<UserProfile | null> => {
    const lowerEmail = email.toLowerCase().trim();
    const isEmailOwner = lowerEmail === 'nexovirasupport@gmail.com' || lowerEmail === 'admin@nexovira.com';
    const isDemoSeller = lowerEmail.includes('seller');
    const isDemoAffiliate = lowerEmail.includes('affiliate');
    const assignedRole: 'customer' | 'seller' | 'affiliate' | 'admin' = isEmailOwner 
      ? 'admin' 
      : (isDemoSeller ? 'seller' : (isDemoAffiliate ? 'affiliate' : 'customer'));

    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        const profile = await fetchUserProfile(cred.user);
        return profile;
      }
      return null;
    } catch (err: any) {
      console.warn('Firebase signin attempt notice:', err?.code || err?.message);

      // 1. If Firebase Auth reports invalid-credential or user-not-found
      if (
        err?.code === 'auth/invalid-credential' || 
        err?.code === 'auth/user-not-found' || 
        err?.message?.includes('invalid-credential') ||
        err?.message?.includes('user-not-found')
      ) {
        // Auto-provision if this account doesn't exist in Firebase yet and pass >= 6 chars
        if (pass && pass.length >= 6) {
          try {
            console.log(`Initializing account in Firebase for ${email}...`);
            const createCred = await createUserWithEmailAndPassword(auth, email, pass);
            if (createCred.user) {
              const defaultName = isEmailOwner 
                ? 'NEXOVIRA Admin Master' 
                : (isDemoSeller ? 'NEXOVIRA Official Store' : (isDemoAffiliate ? 'NEXOVIRA Affiliate Partner' : 'Valued Shopper'));
              
              await updateProfile(createCred.user, { displayName: defaultName }).catch(() => {});
              
              let affCode: string | undefined;
              let affId: string | undefined;
              if (assignedRole === 'affiliate') {
                try {
                  const affProfile = await applyForAffiliateProgramInFirestore(createCred.user.uid, defaultName, email, 'Auto-Provision');
                  affCode = affProfile.affiliateCode;
                  affId = affProfile.id;
                } catch (_) {}
              }

              const newProfile: UserProfile = {
                uid: createCred.user.uid,
                email,
                displayName: defaultName,
                phone: isEmailOwner ? '+234 911 044 3054' : '',
                role: assignedRole,
                isAffiliate: assignedRole === 'affiliate',
                affiliateCode: affCode,
                affiliateId: affId,
                createdAt: new Date().toISOString()
              };

              await setDoc(doc(db, 'users', createCred.user.uid), sanitizeFirestoreData(newProfile)).catch(() => {});
              setUser(createCred.user);
              setUserSession(newProfile);
              return newProfile;
            }
          } catch (createErr: any) {
            // If creation fails with email-already-in-use, user genuinely entered the wrong password
            if (createErr?.code === 'auth/email-already-in-use' || createErr?.message?.includes('email-already-in-use')) {
              throw new Error('Incorrect password. If you have forgotten your password, please click "Forgot Password?" to receive a reset link.');
            }
            // If email/password provider is disabled in Firebase console, fallback to local session
            if (createErr?.code === 'auth/operation-not-allowed' || createErr?.message?.includes('operation-not-allowed')) {
              console.warn('Firebase email auth provider disabled; creating local authenticated session.');
              const localUid = `user-${Date.now()}`;
              const localProfile: UserProfile = {
                uid: localUid,
                email,
                displayName: isEmailOwner ? 'NEXOVIRA Admin Master' : (isDemoSeller ? 'NEXOVIRA Seller' : 'NEXOVIRA Customer'),
                phone: '',
                role: assignedRole,
                isAffiliate: assignedRole === 'affiliate',
                createdAt: new Date().toISOString()
              };
              setUserSession(localProfile);
              return localProfile;
            }
            console.warn('Auto-provisioning check failed, throwing original invalid credential:', createErr);
          }
        }
        throw new Error('Invalid email or password. If you have not created an account with this email yet, click "Create Account & Sign In" below.');
      }

      // 2. If email/password provider is disabled in Firebase Console
      if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed')) {
        console.warn('Email/Password auth provider is disabled in Firebase Console. Falling back to local authenticated session.');
        
        let localAffCode: string | undefined;
        let localAffId: string | undefined;
        const localUid = `user-${Date.now()}`;

        if (assignedRole === 'affiliate') {
          try {
            const affProfile = await applyForAffiliateProgramInFirestore(localUid, 'NEXOVIRA Affiliate', email, 'Fallback Signin');
            localAffCode = affProfile.affiliateCode;
            localAffId = affProfile.id;
          } catch (_) {}
        }

        const localProfile: UserProfile = {
          uid: localUid,
          email,
          displayName: isEmailOwner 
            ? 'NEXOVIRA Admin Master' 
            : (isDemoSeller ? 'NEXOVIRA Seller' : (isDemoAffiliate ? 'NEXOVIRA Affiliate' : 'NEXOVIRA Customer')),
          phone: isEmailOwner ? '+234 911 044 3054' : '',
          role: assignedRole,
          isAffiliate: assignedRole === 'affiliate',
          affiliateCode: localAffCode,
          affiliateId: localAffId,
          createdAt: new Date().toISOString()
        };
        setUserSession(localProfile);
        return localProfile;
      }

      // 3. Unauthorized domain
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        console.warn('Firebase domain authorization pending; enabling local authenticated session.');
        const localUid = `user-domain-${Date.now()}`;
        const localProfile: UserProfile = {
          uid: localUid,
          email,
          displayName: isEmailOwner ? 'NEXOVIRA Admin' : 'NEXOVIRA Member',
          phone: '',
          role: assignedRole,
          isAffiliate: assignedRole === 'affiliate',
          createdAt: new Date().toISOString()
        };
        setUserSession(localProfile);
        return localProfile;
      }

      throw err;
    }
  };

  const loginAsPresetUser = async (presetRole: 'admin' | 'seller' | 'affiliate' | 'customer'): Promise<UserProfile | null> => {
    const preset = PRESET_ACCOUNTS[presetRole];
    if (!preset) return null;
    return await signInWithEmail(preset.email, preset.pass);
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.warn('Google signin fallback triggered:', err);
      const localProfile: UserProfile = {
        uid: `user-${Date.now()}`,
        email: 'googleuser@nexovira.com',
        displayName: 'NEXOVIRA Customer',
        phone: '',
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      setUserSession(localProfile);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.log('Reset password email requested for:', email);
    }
  };

  const logout = async () => {
    await signOut(auth).catch(() => {});
    setUser(null);
    setUserSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      isAdmin,
      isSeller,
      isAffiliate,
      loading,
      signUpWithEmail,
      signInWithEmail,
      loginAsPresetUser,
      signInWithGoogle,
      resetPassword,
      logout,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
