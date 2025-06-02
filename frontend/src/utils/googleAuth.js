import { gapi } from "gapi-script";

const CLIENT_ID = "1090062578992-5cdfqu3tfqa5a8kcsjs9eb2s5qdeoglu.apps.googleusercontent.com"; // Replace with your actual Client ID
const SCOPES = "openid email profile https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.sleep.read https://www.googleapis.com/auth/fitness.body.read https://www.googleapis.com/auth/fitness.nutrition.read https://www.googleapis.com/auth/fitness.heart_rate.read";



export const initGoogleAuth = () => {
  gapi.load("client:auth2", () => {
    gapi.client
      .init({
        clientId: CLIENT_ID,
        scope: SCOPES,
      })
      .then(() => {
        console.log("Google API Initialized");
      })
      .catch((err) => console.error("Google API Initialization Error:", err));
  });
};

export const signInWithGoogle = async () => {
  const authInstance = gapi.auth2.getAuthInstance();
  try {
    const user = await authInstance.signIn();
    return user.getAuthResponse().access_token;
  } catch (error) {
    console.error("Google Sign-In Failed:", error);
    return null;
  }
};
