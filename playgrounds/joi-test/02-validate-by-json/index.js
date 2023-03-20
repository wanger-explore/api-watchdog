const Enjoi = require('enjoi');

const schema = Enjoi.schema({
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    robotId: {
      type: 'string'
    },
    status: {
      type: 'number'
    },
    version: {
      type: 'string'
    }
  },
  required: ['name', 'robotId', 'status', 'version']
});


const testData = [{
  name: 'test', robotId: '8db8d654', status: 1, version: '1.0.0'
}, {
  robotName: 'test', robotId: '8db8d654', status: 1, version: '1.0.0'
}, {
  name: 'test', robotId: '8db8d654', status: 1
}]

testData.forEach((item) => {
  const { error, value } = schema.validate(item);
  if (error) {
    console.log('error', error);
  } else {
    console.log('value', value);
  }
})




