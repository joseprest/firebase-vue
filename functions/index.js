// Google Cloud documentation References:
// https://firebase.google.com/docs/functions/pubsub-events
// https://firebase.google.com/docs/functions/schedule-functions
// https://firebase.google.com/docs/functions/callable

const shortid = require('shortid');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mqtt = require('./mqtt');

admin.initializeApp();

// REMINDER: the frontend expects those states explicitely! And it expects numbers! (because of Firebase queries)
// make sure this object is in sync with /src/utils/action-states.js
const states = {
  waiting: 0,
  executing: 1,
  completed: 2,
};

const milliSecondsBeforeOffline = 10 * 60 * 1000;

const updatePing = async (deviceId) => {
  const db = admin.firestore();
  await db.collection('devicesPing').doc(deviceId).set({
    lastUpdated: admin.firestore.Timestamp.now(),
    ts: Date.now(),
  }, { merge: true });
};

const buildShadow = (key, value) => {
  const shadow = {};
  shadow[key] = value;
  if (key !== 'online') {
    shadow.online = true; // When we receive a telemetry event, we know the device is online
  }
  return shadow;
}

const updateShadow = async (deviceId, shadow) => {
  const db = admin.firestore();
  const doc = { shadow };
  if (shadow.online === false) {
    doc.lastOffline = admin.firestore.Timestamp.now();
  } else {
    doc.lastSeen = admin.firestore.Timestamp.now();
  }
  await db.collection('devices').doc(deviceId).set(doc, { merge: true });
};

exports.telemetryPubSub = functions.pubsub.topic('telemetry').onPublish(async (message) => {
  const messageBody = message.data ? Buffer.from(message.data, 'base64').toString() : null;
  const jsonData = messageBody ? JSON.parse(messageBody) : { v: 'n/a' };
  const { deviceId, subFolder } = message.attributes;
  const db = admin.firestore();
  let value;

  console.log(`subFolder: ${subFolder}, jsonData: ${JSON.stringify(jsonData)}`);

  await updatePing(deviceId);
  switch (subFolder) {
    case 'o':
      await updateShadow(deviceId, buildShadow('online', messageBody));
      break;
    case 't':
      value = messageBody ? parseFloat(messageBody) || '!!!' : null;
      await updateShadow(deviceId, buildShadow('temperature', value));
      break;
    case 'tv':
      await updateShadow(deviceId, buildShadow('television', messageBody));
      break;
    case 'CSQ':
      value = messageBody ? parseInt(messageBody) || null : null;
      await updateShadow(deviceId, buildShadow('modem', { signal: { quality: value } }));
      break;
    case 'actions':
      if (jsonData.action === 'camera-picture') {
        let docData = jsonData.response || jsonData.data || {};
        if (typeof docData === 'string') {
          try {
            docData = JSON.parse(docData);
          } catch (e) {
            console.log(`JSON.parse error: ${e}`);
          }
        }
        await updateShadow(deviceId, buildShadow('camera', docData));
      }
      db.collection('action-requests').doc(jsonData.requestId).set({
        ts: admin.firestore.Timestamp.now(),
        state: states.completed,
        response: jsonData,
      }, { merge: true });
      break;
    default:
      if (jsonData.v !== null) {
        await updateShadow(deviceId, buildShadow(subFolder, jsonData.v));
      }
      break;
  }
});

exports.statesPubSub = functions.pubsub.topic('states').onPublish(async (message) => {
  const messageBody = message.data ? Buffer.from(message.data, 'base64').toString() : null;
  console.log(`messageBody: "${messageBody}"`);
  let state;
  try {
    state = messageBody ? JSON.parse(messageBody) : {};
  } catch {
    state = { data: messageBody };
  }
  state.lastUpdated = admin.firestore.Timestamp.now();
  const { deviceId } = message.attributes;
  await updatePing(deviceId);
  const db = admin.firestore();
  await db.collection('devices').doc(deviceId).set({
    lastSeen: admin.firestore.Timestamp.now(),
    state,
  }, { merge: true });
});

exports.updateShadowOnlineValue = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
  const now = Date.now();
  const db = admin.firestore();
  const devicesSnapshot = await db.collection('devicesPing').get();
  devicesSnapshot.forEach(async doc => {
    const { ts } = doc.data();
    console.log(`now: ${now}, ts: ${ts}, (now - ts) = ${(now - ts)} < ${milliSecondsBeforeOffline}: ${((now - ts) < milliSecondsBeforeOffline)}`);
    const shadow = buildShadow('online', ((now - ts) < milliSecondsBeforeOffline));
    await updateShadow(doc.id, shadow);
  });
});

exports.killTimedOutActionRequests = functions.pubsub.schedule('every 1 minutes').onRun(async () => {
  const timeouts = { 'camera-picture': 60000 };
  const defaultTimeout = 60000;
  const now = Date.now();
  const db = admin.firestore();
  const devicesSnapshot = await db.collection('action-requests').where('state', '<', states.completed).get();
  const deletions = [];
  devicesSnapshot.forEach(doc => {
    const created = doc.get('created');
    const ts = created && created.toDate().getTime() || 0;
    const action = doc.get('action');
    const timeout = timeouts[action] || defaultTimeout;
    if ((now - ts) > timeout) {
      // console.log('About to delete', doc.ref.id);
      deletions.push(doc.ref.update({ state: states.completed, error: 'timeout' }));
    }
  });
  return Promise.all(deletions);
});

exports.startAction = functions.https.onCall(async (data, context) => {
  const { deviceId, action, params = {} } = data;
  console.log(`Begin: ${deviceId}, ${action}, ${JSON.stringify(params)}`);

  if (!deviceId) throw new functions.https.HttpsError('invalid-argument', 'No deviceId');
  if (!action) throw new functions.https.HttpsError('invalid-argument', 'No action');

  // TODO: Make sure the user can execute action on this device. (Hint: context)

  const requestId = shortid.generate();
  const db = admin.firestore();
  const device = db.collection('devices').doc(deviceId);
  const user = db.doc('users/' + context.auth.uid);

  params.requestId = requestId;

  const options = {
    deviceId,
    projectId: functions.config().iot.project,
    region: functions.config().iot.region,
    registryId: functions.config().iot.registry,
  };

  console.log(`mqtt.sendCommandToDevice: ${JSON.stringify(options)}, ${action}, ${JSON.stringify(params)}`);

  try {
    await mqtt.sendCommandToDevice(options, action, params);
  } catch (e) {
    return { result: 'error', error: e.message };
  }

  await db.collection('action-requests').doc(requestId).set({
    device,
    user,
    action,
    params,
    created: new Date(),
    state: states.executing,
  });

  return { result: 'request-created', requestId };
});

exports.update = functions.https.onCall(async (data, context) => {
  const { id = null, collection, payload = {} } = data;

  if (!collection) throw new functions.https.HttpsError('invalid-argument', 'No collection');

  const db = admin.firestore();

  let docRef = id ? db.collection(collection).doc(id) : null;
  let action;
  if (id) {
    await docRef.set(payload, { merge: true });
    action = 'edited';
  } else {
    docRef = await db.collection(collection).add(payload);
    action = 'created';
  }

  return { action, id: docRef.id };
});
