const goatsController = require('../../../controllers/goats')
const Goat = require('../../../models/Goat')

//mock response methods
const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({
    send: mockSend,
    json: mockJson,
    end: mockEnd
})) 

const mockRes = { status: mockStatus}

describe ('Goats controllers', () => {

    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())

    describe('index', () => {
        it('should return goats with a status code 200', async () => {
            const testGoats = ['g1', 'g2']
            jest.spyOn(Goat, 'getAll').mockResolvedValue(testGoats)

            await goatsController.index(null, mockRes )

            expect(Goat.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith({ data: testGoats })
        });
        it('should return an error upon failure', async () => {
            jest.spyOn(Goat, 'getAll').mockRejectedValue(new Error('Something happened to your db'))

            await goatsController.index(null, mockRes)

            expect(Goat.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ error: 'Something happened to your db'})
        });
    });

    describe('show', () => {
        let testGoat, mockReq
        beforeEach(() => {
            testGoat = { id: 1, name: 'Test Goat', age: 22}
            mockReq = { params: { id: 1 }}
        })

        it('should return a goat a 200 status code', async () => {
            jest.spyOn(Goat, 'findById').mockResolvedValue(new Goat(testGoat))

            await goatsController.show(mockReq, mockRes)

            expect(Goat.findById).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith({ data: new Goat(testGoat)})
        })
        it('should return n error if the goat is not found', async () => {
            jest.spyOn(Goat, 'findById').mockRejectedValue(new Error('oh no'))

            await goatsController.show(mockReq, mockRes)

            expect(Goat.findById).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({ error: 'oh no'})
        })
    })

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

    describe('destroy', () => {
        let deleteGoat, mockReq
        beforeEach(() => {
            deleteGoat = { id: 1, name: 'Goat', age: 22}
            mockReq = { params: { id: 1 }}
        })

        it('should return a goat a 204 status code', async () => {
            jest.spyOn(Goat, 'findById').mockResolvedValue(new Goat(deleteGoat))
            jest.spyOn(Goat.prototype, 'destroy').mockResolvedValue();

            await goatsController.destroy(mockReq, mockRes)


            expect(Goat.findById).toHaveBeenCalledTimes(1)
            expect(Goat.prototype.destroy).toHaveBeenCalledTimes(1);

            expect(mockStatus).toHaveBeenCalledWith(204)
            expect(mockSend).not.toHaveBeenCalledWith({ data: new Goat(deleteGoat)})
        })
        it('should return with an error that goat was not successfully deleted', async () => {

            jest.spyOn(Goat, 'findById').mockRejectedValue(new Error('Goat not found'))

            await goatsController.destroy(mockReq, mockRes)

            expect(Goat.findById).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({ error: 'Goat not found'})
        })
    })


})

/**
 * 
 */