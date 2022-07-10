# moto-backened

This is the backend API for an employee managment system. It is an express API utilizing a MongoDB atlass collection and mongoose library for queries. This ReadMe assumes you have some familiarity with MongoDB.

[Link to currently running live API](https://moto-backend.herokuapp.com/employees)

# Setting up MongoDB Atlas

This project utilizes the free tier of MongoDB atlas which provides a free DB cluster for development and testing.

You can find the instructions [here](https://www.mongodb.com/docs/atlas/getting-started/)

You will need to follow steps 1-5 - and "connect with your cluster", this shows a window with options. Select "connect to your application", copy the url that results and paste it in the .env file you will create in the next section.

# Setting up the Project

> Fork and Clone the project.

> In the terminal run "npm install"

> In the terminal run "npm run .env"

> In the .env file, copy and paste your MongoDB collection URL to the variable MONGO and save the file - the url you copy will have text that says "<password>" - replace that text with the password you set up in the previous section

> In the terminal, run "npm run migrate" to see your collection with sample data - the command automatically creates a collection called "employees" and seeds it with data

> In the terminal, run "npm run start:dev" this should start your sever, and you should see the message "Listening on port 4000" and "Connected successfully" in your terminal

> With postman, or another application for testing HTTP calls, send a GET request to http://localhost:4000/employees - you should get a response with 10 employee results.

# API Spec

There is one endpoint that respresents four CRUD operations - you interact with these by sending GET, POST, PUT, and DELETE requests to the URL. This allows you to perform CRUD operations on a collection of employees with the following Data Shape:

```
 {
            "_id": "62ca021d4129f709fe5be303",
            "FirstName": "Jonathon",
            "MiddleInitial": "M",
            "LastName": "Coath",
            "DateOfBirth": "3/6/2022",
            "DateOfEmployment": "07/09/2022",
            "Status": "ACTIVE",
            "__v": 0
}
```

`_id` represents an individual id automatically generated by MongoDB, and `__v` is a field that represents versioning of the individual document - it is automatically generated by mongoose.

URL: localhost:4000/employees

## GET -> localhost:4000/employees

A standard get request to this endpoint will return the first 10 results stored in the employees collection. Some basic pagination is built in, with the first page of 10 results automatically being returned. In order to specify which page and how many results you would like, you can send the GET request to the URL and add query parameters:

```
http://localhost:4000/employees?page=1&limit=1
```

A get request to the above URL will return the first page with 1 result.

```
{
    "employees": [
        {
            "_id": "62ca021d4129f709fe5be303",
            "FirstName": "Jonathon",
            "MiddleInitial": "M",
            "LastName": "Coath",
            "DateOfBirth": "3/6/2022",
            "DateOfEmployment": "07/09/2022",
            "Status": "ACTIVE",
            "__v": 0
        }
    ],
    "totalPages": 50,
    "currentPage": "1"
}
```

In the response, there is the field "totalPages" - which tells you how many pages of results exist in the database, and "currentPage" which tells you which page you are currently on.

ALl of the employee documents have a field "Status" which represents whether or not they are currently an employee of the company. Statuses that equal "ACTIVE" are employees that are still with the company, and "INACTIVE" employees have left the company and are considered deleted. By default, the API returns only those employees with an "ACTIVE" status. If you wish to include all employee document, you can use the query paramater "include=true"

```
http://localhost:4000/employees?include=true
```

A GET request to the above URL returns a 10 documents, on the first page and includes INACTIVE employees. Below is an example result:

```
{
    "employees": [
        {
            "_id": "62ca021d4129f709fe5be302",
            "FirstName": "Melesa",
            "MiddleInitial": "F",
            "LastName": "Heskins",
            "DateOfBirth": "10/25/2021",
            "DateOfEmployment": "07/09/2022",
            "Status": "INACTIVE",
            "__v": 0
        },
        ...more results omitted for brevity
    ],
    "totalPages": 5,
    "currentPage": 1
}
```

Endpoint returns 200 and Employee Info List upon success

# POST -> http://localhost:4000/employees

A post request to the above URL creates a new employee record. This request requires a body to be sent with it as JSON an all the below fields are required - if any are left out, the record will not be created.

```
{
    "FirstName":"String",
    "MiddleInitial": "String",
    "LastName": "String",
    "DateOfBirth": "MM/DD/YYYYY"
}
```

For DateOfBirth, the above format is required or it will not create the record. When the request is submitted, it automatically adds the DateOfEmployment - this API considers the date the record is created to be the first day of employment.

Endpoint returns 200 and Employee info upon success

# PUT -> http://localhost:4000/employees/:id

A put request to the above url will update the record of a specific employee. The path variable ":id" corresponds to the `_id` field each document has in MongoDB. This is required to update the employee. Additionally, this request takes the following body with each field being optional:

```
{
    "FirstName":"String",
    "MiddleInitial": "String",
    "LastName": "String",
}
```

The API does not allow you to update the DateOfBirth or DateOfEmployment.

Endpoint returns 200 and updated employee on success.

# GET -> http://localhost:4000/employees/:id

A get request to the above URL will return the information of the employee whose `_id` matches the ":id" sent with the request. If you try to request an employee who has alrady been deleted, an error message will be sent.

Endpoint returns 200 and Employee info.

# DELETE -> http://localhost:4000/employees/:id

A delete request to the above url will "delete" the employee where the ":id" matches the `_id` of the employee record in the DB. None of the records are actually deleted from the DB - the Status is set to "INACTIVE", and the employee will be eliminated from the GET results. If you try to delete an employee who has alrady been deleted, an error message will be sent.

This endpoint requires an authorization header that says `authorization: password` - obviously the choice to hardcode `password' into the codebase as the authcheck is not best practice, but this is just a POC.

End point returns 204 and empty body on success.

# Things I would Improve in the Future

> More detailed logging/set up logging to be persisted in cloud infrastructure

> More detailed validation and error messaging

> Better HTTP status codes for the responses - as it stands, most of them are 200 or 400. In the future, I would make it so that they correspond specifically to the type of HTTP request.
