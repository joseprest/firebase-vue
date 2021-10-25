const iot = require('@google-cloud/iot');

const iotClient = new iot.v1.DeviceManagerClient({});

function devicePath(options) {
  return iotClient.devicePath(
    options.projectId,
    options.region,
    options.registryId,
    options.deviceId
  );
}

function buildRequest(options, command, params) {
  console.log(`buildRequest: ${JSON.stringify(params)}`);
  return {
    name: devicePath(options),
    binaryData: Buffer.from(JSON.stringify(params)),
    subfolder: command
  };
}

module.exports.sendCommandToDevice = async (options, command, params) => {
  const request = buildRequest(options, command, params);
  return await iotClient.sendCommandToDevice(request);
}

module.exports.setDeviceConfig = async (options, command, params) => {
  //const iotClient = new iot.v1.DeviceManagerClient();
  try {
    const request = buildRequest(options, command, params);
    const responses = await iotClient.sendCommandToDevice(request);

    console.log('Sent command: ', responses[0]);
  } catch (err) {
    console.error('Could not send command:', err);
  }
}
