import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

import firebaseConfigDev from '../../firebase-config-dev.json';
import firebaseConfigProd from '../../firebase-config-prod.json';

const useProdConfig = process.env.VUE_APP_PROD_CONFIG === 'yes';
const firebaseConfig = useProdConfig ? firebaseConfigProd : firebaseConfigDev;
firebase.initializeApp(firebaseConfig);
if (process.env.NODE_ENV !== 'production') {
  // firebase.functions().useFunctionsEmulator('http://localhost:5001');
}
