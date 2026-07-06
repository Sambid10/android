import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export async function onGoogleButtonPress() {
  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });

3
  await GoogleSignin.signOut();

  await GoogleSignin.signIn();

  const { idToken, accessToken } = await GoogleSignin.getTokens();

  if (!idToken) {
    throw new Error('No ID token found');
  }

  const credential = GoogleAuthProvider.credential(idToken, accessToken);

  // Wait until Firebase finishes signing in.
  const userCredential = await signInWithCredential(
    getAuth(),
    credential,
  );

  return userCredential;
}