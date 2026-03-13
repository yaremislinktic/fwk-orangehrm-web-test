const credentials = {
  admin: {
    username: 'Admin',
    password: 'admin123',
  },
  wrongPassword: {
    username: 'Admin',
    password: 'wrongPassword123',
  },
  wrongUsername: {
    username: 'UsuarioNoExiste',
    password: 'admin123',
  },
  emptyUsername: {
    username: '',
    password: 'admin123',
  },
  emptyPassword: {
    username: 'Admin',
    password: '',
  },
  bothEmpty: {
    username: '',
    password: '',
  },
};

const _ts = Date.now().toString().slice(-5); 
const employees = [
  { firstName: 'Andrea',    middleName: 'Maria',     lastName: 'Martínez', employeeId: `QA${_ts}1` },
  { firstName: 'Laura',     middleName: 'Sofía',     lastName: 'González', employeeId: `QA${_ts}2` },
  { firstName: 'Juan',      middleName: 'David',     lastName: 'Rodríguez',employeeId: `QA${_ts}3` },
  { firstName: 'María',     middleName: 'Fernanda',  lastName: 'López',    employeeId: `QA${_ts}4` },
  { firstName: 'Andrés',    middleName: 'Felipe',    lastName: 'Ramírez',  employeeId: `QA${_ts}5` },
  { firstName: 'Daniela',   middleName: 'Patricia',  lastName: 'Torres',   employeeId: `QA${_ts}6` },
  { firstName: 'Luis',      middleName: 'Alberto',   lastName: 'Herrera',  employeeId: `QA${_ts}7` },
  { firstName: 'Camila',    middleName: 'Andrea',    lastName: 'Castro',   employeeId: `QA${_ts}8` },
  { firstName: 'Sebastián', middleName: 'Alejandro', lastName: 'Morales',  employeeId: `QA${_ts}9` },
  { firstName: 'Valentina', middleName: 'Isabel',    lastName: 'Rojas',    employeeId: `QA${_ts}0` },
];

const primaryEmployee = employees[0]; 
const expectedMessages = {
  login: {
    dashboardTitle     : 'Dashboard',
    invalidCredentials : 'Invalid credentials',
    requiredField      : 'Required',
  },
  pim: {
    moduleTitle          : 'Employee Information',
    addEmployeeTitle     : 'Add Employee',
    personalDetailsTitle : 'Personal Details',
    successSave          : 'Successfully Saved',
    requiredField        : 'Required',
  },
  directory: {
    moduleTitle: 'Directory',
  },
};

const urls = {
  login          : '/web/index.php/auth/login',
  dashboard      : /.*dashboard/,
  loginPage      : /.*auth\/login/,
  pimEmployee    : /.*pim\/viewEmployeeList/,
  pimAddEmployee : /.*pim\/addEmployee/,
  pimSavedProfile: /.*pim\/viewPersonalDetails.*/,
  directory      : /.*directory\/viewDirectory/,
};


const assets = {
  profilePhotoBase64: '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',
};

module.exports = {
  credentials,
  employees,
  primaryEmployee,
  expectedMessages,
  urls,
  assets,
};
