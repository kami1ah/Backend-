# API Testing

## Usage

- Run `git clone <repo-link>`
- Run `cd server`
- Run `npm install`

### Setup the database

- Create a `.env` file within `server` & add the following:
  
    ```sh
    PORT=<pick a port>
    ## use Supabase for both DB_URL & DB_TEST_URL
    DB_URL=<link-db>
    DB_TEST_URL=<link-test-db>
    ```
    
- Run `npm run seed-db` to setup the dev database

### Run the server

- Run `npm run dev` to start the API & the app should run on `3000` (if that's the port you've set in the `.env` file)

### Setup testing database

- Run `npm run setup-test-db` within `server` to setup the test database

### Run the tests & display test coverage

- Run `npm run test` to run the tests
- Run `npm run coverage` to display the test coverage

## Building a backend

#### The MVC framework is used to structure an application by  separating the application code into 3 components:
- __Model__ manages the application's data including the database interactions. So it handles the data that is transferred between the view and controller
- __View__ is the user interface(UI) that the user of the application interacts with and it only linked to the controller. As it displays data provided by the controller as a result presented to the user.
- __Controller__ is the intermediary between the views and model components. It receives and processes the incoming request from the user into the model and then renders the output/result to the UI.

![MVC architectural framework](/assets/images/MVC_image.jpg "MVC framework")

- Model code 



- View Code


- Controller code






### API testing
This involves unit testing and integration testing through mocking. API mocking allows for the stimulation of the API responses and test the features without actually sending request to the external API. This is really useful for testers and developers as they don't have to rely on the availability, performance and not compromise the security conditions of the API service.

#### The unit testing is of the controller and the models of the server which are tested separately is to ensure they are behaving as they are meant to and it also allows early detection of bugs. 

- Controllers tests 
    - The models and controllers javascript are imported
    ```js 
    const goatsController = require('../../../controllers/goats')
    const Goat = require('../../../models/Goat')
    ```

    - Using jest, a javascript testing framework for node.js, mock functions are created with `jest.fn()` then these are executed  when their methods(`.send(), .json() and .end()`) are called. Using another mock function with the variable of `mockStatus()` that returns objects containing the other 3 mock functions

    ```js
    const mockSend = jest.fn()
    const mockJson = jest.fn()
    const mockEnd = jest.fn()

    const mockStatus = jest.fn(() => ({
        send: mockSend,
        json: mockJson,
        end: mockEnd
    })) 

    const mockRes = { status: mockStatus}
    ```

    - How a test is written and structured
        - `describe()` is used to block a group of tests and can be nested into each other to organise tests into smaller groups. 
        - `it` is where each test is defined is written and performed. 
        - `beforeEach` runs before every individual tests under the scope. Then it ensures the database is reset by clearing the database and adds new testing data. 
        - `jest.spyOn` is a jest method that creates a spy on a method belonging to a class allowing Jest to monitor calls to the method. An example is `jest.spyOn(Goat, 'create')` where a spy is created to spy on method 'create' belonging to 'Goat' class (Goat.create() function)
        - `mockResolvedValue()` tells Jest to mock the asynchronous function and return a promise that is resolved to the specific value. Using the example from below, `mockResolvedValue(new Goat(newGoat)` create a new instance of the Goat class becoming the resolved value of the promise.
        - An example of a test for a static function is;
        ```js
        describe('create', () => {
            let newGoat, mockReq
            beforeEach(() => {
                newGoat = { id: 1, name: 'New Goat', age: 22}
                mockReq = { body: { id: 1, name: 'New Goat', age: 22}}
            })

            it('should return a goat a 201 status code', async () => {
                jest.spyOn(Goat, 'create').mockResolvedValue(new Goat(newGoat))

                await goatsController.create(mockReq, mockRes)

                expect(Goat.create).toHaveBeenCalledTimes(1)
                expect(mockStatus).toHaveBeenCalledWith(201)
                expect(mockSend).toHaveBeenCalledWith({ data: new Goat(newGoat)})
            })
            it('should return with both name and age are required', async () => {
                jest.spyOn(Goat, 'create').mockRejectedValue(new Error('oh no'))

                await goatsController.create(mockReq, mockRes)

                expect(Goat.create).toHaveBeenCalledTimes(1)
                expect(mockStatus).toHaveBeenCalledWith(400)
                expect(mockSend).toHaveBeenCalledWith({ error: 'oh no'})
            })
        })
        ```

        - An example of a test for an instance function is;

        ```js
            describe('update', () => {
       let updatedGoat, mockReq
        beforeEach(() => {
            goat = { id: 1, name: 'Test Goat', age: 22}
            updatedGoat = { id: 1, name: 'Update Goat', age: 32}

            mockReq = { params: { id: 1 }, body: (updatedGoat)}
        })

        it('should return a goat a 200 status code', async () => {
            jest.spyOn(Goat, 'findById').mockResolvedValue(new Goat(goat))
            jest.spyOn(Goat.prototype, 'update').mockResolvedValue(updatedGoat)

            await goatsController.update(mockReq, mockRes)

            expect(Goat.findById).toHaveBeenCalledTimes(1)
            expect(Goat.prototype.update).toHaveBeenCalledWith(updatedGoat);
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith({ data: updatedGoat })
        })
        it('should return 400 error if the goat is not found', async () => {
            jest.spyOn(Goat, 'findById').mockRejectedValue(new Error('Goat information was not updated'))

            await goatsController.update(mockReq, mockRes)

            expect(Goat.findById).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockSend).toHaveBeenCalledWith({ error: 'Goat information was not updated'})
        })
        })
        ```
            - ```.prototype``` allows jest to spy on all the instances of the class.

- Models tests
    - The test file starts with importing the controllers file, the file used to connect the database and the models file
    ```js
    const { update } = require('../../../controllers/goats');
    const db = require('../../../database/connect')
    const Goat = require('../../../models/Goat')
    ```
    - The tests are also structured using `describe()` and `it()`. But each tests follow the pattern AAA, Arrange, Acts and Assert. 
        - Arrange: the code that would be tested. 
        - Act: on the code to be tested and executes it.
        - Assert: verifies the outcome of the test matches the expected result.

    - An example is: 
    ```js 
    describe('update', () => {
        it('it resolves with successful updated information', async () => {
            //Arrange
            const goat = new Goat({id: 1, name: 'plum', age: 99})
            const updateGoatData = ({ id: 1, name: 'charlie', age: 65 })
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows:[{...updateGoatData, id: 1}]})
            //Act
            const result = await goat.update(updateGoatData)
            //Assert
            expect(result).toBeInstanceOf(Goat)
            expect(result.id).toBe(1)
            expect(result).toHaveProperty('name', 'charlie')
            expect(result).toHaveProperty('age', 65)
            expect(db.query).toHaveBeenCalledWith(
                " UPDATE goats SET name = $1, age = $2 WHERE id = $3 RETURNING * ",
                [updateGoatData.name, updateGoatData.age, 1]
            )
        })
            it('should throw an Error when update did not occur', async () => {
            //Arrange
            const goat = new Goat({id: 1, name: 'plum', age: 99})
            jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));

            //Act & Assert
            await expect(goat.update({ id: 1, name: 'charlie', age: 65 })).rejects.toThrow('Database error')
        })
    })
     ```


#### Integration testing verifies that the interaction between the each components of the backend are communicating and functioning correctly and as expected. It is usually prepared and performed after unit testing have been completed. 
To begin integration testing a [test server](__tests__\integration\config.js) and a [test database](__tests__\integration\reset.sql) is set up. 
- In this case the API endpoints are being tested. 
An example of how these tests is:
```js
    describe('GET /goats/:id', () => {
        it('should return a specific goat by ID', async () => {
            const goatId = 1
            const response = await request(api).get(`/goats/${goatId}`)

            expect(response.status).toBe(200)
            expect(response.body.data).toHaveProperty('id', goatId)

        })

        it('should return a 404 if goat is not found', async () => {
            const nonGoatId = 999
            const response = await request(api).get(`/goats/${nonGoatId}`)

            expect(response.status).toBe(404)
            expect(response.body.error).toBe('This goat does not exist!')
        })
    })
```





    
    
