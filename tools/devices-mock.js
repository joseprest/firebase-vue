const uuid = require('uuid');

const devices = [
  {
    name: 'FDMQ/TV 1234',
    location: 'Test JPBlais',
    statuses: {
      online: true,
      tv: 'on',
    },
  },
  {
    name: 'FDMQ/TV 5678',
    location: 'IGA XYZ',
    statuses: {
      online: false,
    },
  },
  {
    name: 'FDMQ/TV 876',
    location: 'Marché Toit Rouge',
    statuses: {
      online: true,
      tv: 'off',
    },
  },
  {
    name: 'FDMQ/TV 123',
    location: 'IGA St-Sauveur',
    statuses: {
      online: true,
      tv: 'on',
    },
  },
  {
    name: 'FDMQ/TV 136',
    location: 'IGA Repentigny',
    statuses: {
      online: true,
      tv: 'on',
    },
  },
];

let output = {};

devices.forEach((device) => {
  output[uuid.v4()] = device;
});

console.log(JSON.stringify(output));
