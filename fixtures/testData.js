// Reqres.in public test credentials (documented on the site)
export const validLogin = {
  email: 'eve.holt@reqres.in',
  password: 'cityslicka',
};

export const validRegister = {
  email: 'eve.holt@reqres.in',
  password: 'pistol',
};

export const invalidLogin = {
  email: 'peter@klaven.com',
  // password intentionally omitted to trigger 400
};

export const newUser = {
  name: 'Test User',
  job: 'QA Automation Engineer',
};

export const updatedUser = {
  name: 'Test User',
  job: 'Senior QA Engineer',
};
