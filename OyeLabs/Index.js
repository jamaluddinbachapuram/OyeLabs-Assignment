// 1. Make a api for phone number login 

const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
});

app.post('/customers', (req, res) => {
  const { name, phoneNumber } = req.body;
  
  if (!name || !phoneNumber) {
    return res.status(400).json({ error: 'Name and phone number are required' });
  }

  pool.query('SELECT * FROM customers WHERE phoneNumber = ?', [phoneNumber], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Phone number already exists' });
    }
    
    const customerId = generateUniqueId();
    
    pool.getConnection((error, connection) => {
      if (error) {
        return res.status(500).json({ error: 'Database error' });
      }

      connection.beginTransaction((error) => {
        if (error) {
          connection.release();
          return res.status(500).json({ error: 'Database error' });
        }
        
        const sql = 'INSERT INTO customers (customerId, name, phoneNumber) VALUES (?, ?, ?)';
        const values = [customerId, name, phoneNumber];

        connection.query(sql, values, (error) => {
          if (error) {
            connection.rollback(() => {
              connection.release();
              return res.status(500).json({ error: 'Database error' });
            });
          }

          connection.commit((error) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                return res.status(500).json({ error: 'Database error' });
              });
            }

            connection.release();
            return res.status(201).json({ message: 'Customer added successfully' });
          });
        });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// 2. Refer to the tables below, Write a sql query for finding the subjects for each student, the subjects should be order by alphabetically .

SELECT customer.customerId, customer.name, GROUP_CONCAT(subjects.subjectName ORDER BY subjects.subjectName) AS subjects
FROM customers customer
JOIN mapping map ON customer.customerId = map.customerId
JOIN subjects s ON map.subjectId = subjects.subjectId
GROUP BY customer.customerId, customer.name
ORDER BY customer.name;


// 3. Write a function in node that inserts the following data in mysql , the email should be unique and if the email already exists in the system then the name of the customer will be updated with the new name that is there in the array for that customer.

const mysql = require('mysql');

const customers = [
  {
    email: "anurag11@yopmail.com",
    name: "anurag"
  },
  {
    email: "sameer11@yopmail.com",
    name: "sameer"
  },
  {
    email: "ravi11@yopmail.com",
    name: "ravi"
  },
  {
    email: "akash11@yopmail.com",
    name: "akash"
  },
  {
    email: "anjali11@yopmail.com",
    name: "anjai"
  },
  {
    email: "santosh11@yopmail.com",
    name: "santosh"
  }
];

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
});

function insertCustomers(customers) {
  customers.forEach(customer => {
    const { email, name } = customer;
    
    connection.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return;
      }

      if (results.length > 0) {
        connection.query('UPDATE customers SET name = ? WHERE email = ?', [name, email], (error) => {
          if (error) {
            console.error('Database error:', error);
          } else {
            console.log(`Updated name for customer with email ${email}`);
          }
        });
      } else {
        connection.query('INSERT INTO customers (name, email) VALUES (?, ?)', [name, email], (error) => {
          if (error) {
            console.error('Database error:', error);
          } else {
            console.log(`Inserted new customer with email ${email}`);
          }
        });
      }
    });
  });
}

connection.connect((error) => {
  if (error) {
    console.error('Database connection error:', error);
  } else {
    console.log('Connected to the database');
    insertCustomers(customers);
  }
});


// 4. Create a new object which have all the properties of object person and student

const person = {
  id: 2,
  gender: 'mail'
};

const student = {
  name: "ravi",
  email: "ravi11@yopmail.com"
};

const mergedObject = {
  ...person,
  ...student
};

console.log(mergedObject);


// 5. Make a promisify function for the function having callback below , after the function is promisify then call the function like you call a promise

const request = require('request');
const util = require('util');

const getGoogleHomePagePromise = util.promisify(getGoogleHomePage);

function getGoogleHomePage(finalCallBack) {
  request('http://www.google.com', function (error, response, body) {
    console.error('error:', error);
    finalCallBack(error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
    finalCallBack(null, body);
  });
}

getGoogleHomePagePromise()
  .then((result) => {
    console.log("RESULT==>", result);
  })
  .catch((error) => {
    console.error("ERROR==>", error);
  });


// 6. Imagine you have array of integer from 1 to 100 , the numbers are randomly ordered, one number from 1 to 100 is missing , Please write the code for finding the missing number

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ,13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69,70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]; 

function findMissingNumber(numbers) {
  const sortedNumbers = numbers.sort((a, b) => a - b);
  for (let i = 0; i < sortedNumbers.length; i++) {
    if (sortedNumbers[i] !== i + 1) {
      return i + 1;
    }
  }
  return null;
}
const missingNumber = findMissingNumber(numbers);
console.log("Missing number:", missingNumber);
