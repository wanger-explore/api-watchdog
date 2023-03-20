const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().required(),
  robotId: Joi.string().required(),
  status: Joi.number().required(),
  version: Joi.string().required().allow(''),
});

const testData = [{
  name: 'test', robotId: '8db8d654', status: 1, version: ''
}, {
  name: 'test', robotId: '8db8d654', status: 1, version: '1.0.0', robot: '123'
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




