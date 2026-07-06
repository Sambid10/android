import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import type { AppDispatch, RootState } from '../redux/store';
import { setUser, clearUser } from '../redux/slices/userSlice';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import AuthStack from './AuthStack';
import MainLoader from '../components/Loaders/MainLoader';
import { RootStack } from './RootStack';

export function NavigationController() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), firebaseUser => {
      if (firebaseUser) {
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName ?? '',
            email: firebaseUser.email ?? '',
            photourl: firebaseUser.photoURL ?? '',
          }),
        );
      } else {
        dispatch(clearUser());
      }

      setInitializing(false);
    });

    return unsubscribe;
  }, [dispatch]);

  if (initializing) {
    return <MainLoader />;
  }

  return user ? <RootStack /> : <AuthStack />;
}