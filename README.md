
# 49ers Dashboard App

## Description
This app implements a basic healtcare API that allows users to insert and query Patient records, as well as process an Appointment CSV from within the file structure and query those records. 

## Requirements
This project requires Docker and the Docker Compose plugin to run. To install, follow the instructions [here](https://docs.docker.com/compose/install/linux/).

## Instructions
To run, execute the following from the root directory of this project:

```bash
$> docker compose up
```

This will perform the following actions (in order):
1. Create the Docker network for secure cross-container communication
2. Create the create the RabbitMQ server
3. Create the Mongo DB
4. Create the NestJS server

For development purposes, or if you'd like to wipe the containers and force a full rebuild, you can run:

```bash
$> docker compose down -v && docker compose up -d --build --force-recreate
```

This will stop all Docker containers, rebuild the containers, and restart them.

## Backend
The NestJS server can be accessed at `localhost:3000`. Endpoints are as follows:

### POST `/patients`
- **Description**: Creates a new patient record.
- **Request Body**: 
  - Expects a JSON object representing a patient, **without** an `id` property.
  - Example:
    ```json
    {
      "name": "John Doe",
      "age": 30,
      "gender": "Male",
      "contact": "123-456-7890"
    }
    ```
- **Response**:
  - A JSON object representing the created patient with a unique `id` assigned.
  - **Status Code**: 201
  - Example Response:
    ```json
    {
      "id": 1,
      "name": "John Doe",
      "age": 30,
      "gender": "Male",
      "contact": "123-456-7890"
    }
    ```

### GET `/patients`
- **Description**: Returns a collection of all patient records.
- **Response**:
  - An array of JSON objects representing all patients.
  - **Status Code**: 200
  - Example Response:
    ```json
    [
      {
        "id": 1,
        "name": "John Doe",
        "age": 30,
        "gender": "Male",
        "contact": "123-456-7890"
      },
      {
        "id": 2,
        "name": "Jane Doe",
        "age": 28,
        "gender": "Female",
        "contact": "987-654-3210"
      }
    ]
    ```

### GET `/patients/:id`
- **Description**: Returns a patient record with the given `id`.
- **Parameters**:
  - `id`: The unique ID of the patient to retrieve.
- **Response**:
  - If a patient is found:
    - A JSON object representing the patient.
    - **Status Code**: 200
  - If no patient is found:
    - **Status Code**: 404
    - Example Response (404):
      ```json
      {
        "message": "Patient not found"
      }
      ```

## /appointments Endpoint

### GET `/appointments`
- **Description**: Returns a collection of all appointment records.
- **Query Parameters** (optional):
  - `patient_id`: Filter appointments by a specific patient ID.
  - `doctor`: Filter appointments by a specific doctor.
- **Response**:
  - An array of JSON objects representing all appointments.
  - **Status Code**: 200
  - Example Response:
    ```json
    [
      {
        "id": 1,
        "patient_id": 1,
        "doctor": "Dr. Smith",
        "date": "2024-12-01",
        "time": "10:00 AM"
      },
      {
        "id": 2,
        "patient_id": 2,
        "doctor": "Dr. Adams",
        "date": "2024-12-02",
        "time": "2:00 PM"
      }
    ]
    ```

### GET `/appointments/:id`
- **Description**: Returns an appointment with the given `id`.
- **Parameters**:
  - `id`: The unique ID of the appointment to retrieve.
- **Response**:
  - If an appointment is found:
    - A JSON object representing the appointment.
    - **Status Code**: 200
  - If no appointment is found:
    - **Status Code**: 404
    - Example Response (404):
      ```json
      {
        "message": "Appointment not found"
      }
      ```

### POST `/appointments`
- **Description**: Creates an event to process a file containing appointments.
- **Request Body**:
  - Expects a file path parameter in the body (this can be a local file path).
  - Example:
    ```json
    {
      "filepath": "/path/to/appointments.csv"
    }
    ```
- **Response**:
  - **Status Code**: 200
  - Example Response:
    ```json
    {
      "message": "File submitted for processing"
    }
    ```

## RabbitMQ
The Appointments processing system uses the `appointments_queue` to process CSV files upon request and store those appointments within MongoDB. You can see this queue in action at `http://localhost:15672/` - login is the default user/pass: guest/guest. This system requires all documents to be stored within the `documents` directory before the docker container is built. An example of a valid CSV format can be found in the `documents/file.csv` file.

## MongoDB
All records for this API are stored within MongoDB. Collections are: `patients`, `appointments`, and `counter`. The `counter` collection is used to maintain a unique index for each patient and appointment record via the `AutoIncrement` class.

## Final Notes
All requested functionality has been tested and works as expected! Components should have adequate test coverage. Unfortunately, I strugged to adequately mock some Mongoose components in limited cases. There are several unit tests which "fail" because of this, but otherwise would have full coverage. I'd love to learn more about the appropriate approach here, as lots of research returned limited results. Please reach out if you have any questions!