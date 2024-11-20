// const express = require('express');
// const app = express();
// const cors = require('cors');
// const port = 3001; // Ensure this port is correct

// app.use(cors());
// app.use(express.json());

// Employee data
const employees = [
  { employeeId: "100101", department: "Tims" },
  { employeeId: "100102", department: "Tims" },
  { employeeId: "100103", department: "Tims" },
  { employeeId: "200101", department: "Starbucks" },
  { employeeId: "200102", department: "Starbucks" },
  { employeeId: "200103", department: "Starbucks" },
  { employeeId: "300101", department: "Osmos" },
  { employeeId: "300102", department: "Osmos" },
  { employeeId: "300103", department: "Osmos" },
  { employeeId: "400101", department: "Sushi" },
  { employeeId: "400102", department: "Sushi" },
  { employeeId: "400103", department: "Sushi" }
];

module.exports = employees;


// Endpoint to validate employee ID
// app.post('/validate-employee', (req, res) => {
//   const { employeeId } = req.body;
//   console.log('Received Employee ID:', employeeId); // Debug log

//   // Check if the employee ID exists in the database
//   const employee = employees.find((emp) => emp.employeeId === employeeId);

//   if (employee) {
//     res.json({ valid: true });
//   } else {
//     res.json({ valid: false, message: 'Invalid Employee ID' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
