const { update } = require('../../../controllers/goats');
const db = require('../../../database/connect')
const Goat = require('../../../models/Goat')

describe('Goat', () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe('getAll', () => {
        it('resolves with goats on successful db query', async () => {
            //AAA = structure of tests
            // Arrange 
            const mockGoats = [         //creating a mock data to test the getAll method 
                {id: 1, name: 'g1', age: 1},
                {id: 2, name: 'g2', age: 2},
                {id: 3, name: 'g3', age: 3}
            ]
            //spyOn spies on an existing method
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockGoats})       //we are passing the mock data instead of the database through the getALL method and seeing what the output wil be 
            // Acts
            const goats = await Goat.getAll()

            // Assert
            expect(goats).toHaveLength(3)
            expect(goats[0]).toHaveProperty('id')
            expect(goats[0].name).toBe('g1')
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM goats')
        })

        it('should throw an Error when no goats are found', async () => {
            //Arrange
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: []})       //if nothing is passed

            //Act & Assert
            await expect(Goat.getAll()).rejects.toThrow('No goats available')
        })
    });

    //Testing the find by id method
    describe('findById', () => {
        it('resolves with goat on successful db query', async  () => {
        //Arrange
        const mockOneGoat = { id: 1, name: 'goat', age: 22}
        jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockOneGoat] })
        //Act
        const result = await Goat.findById(1)
        //Assert
        expect(result).toBeInstanceOf(Goat)
        expect(result.name).toBe('goat')
        expect(result.id).toBe(1)
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM goats WHERE id = $1', [1])
        })

        it('should throw an Error when goat is not found', async () => {
            //Arrange
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: []})
            //Assert &Act
            await expect(Goat.findById(999)).rejects.toThrow('This goat does not exist')
        })
    })

    //Testing the create function 
    describe( 'create', () => {
        it('resolves with goat on successful creation', async () => {
            //Arange 
            const goatData = {name: 'plum', age: 99}
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{...goatData, id: 1}] })
            //Acts
            const result = await Goat.create(goatData)
            //Asserts
            expect(result).toBeInstanceOf(Goat)
            expect(result).toHaveProperty('id', 1)
            expect(result).toHaveProperty('name', 'plum')
            expect(result).toHaveProperty('age', 99)
            expect(db.query).toHaveBeenCalledWith(
                'INSERT INTO goats(name, age) VALUES ($1, $2) RETURNING *',
                [goatData.name, goatData.age]
            )
        })

        it('should throw an Error when age is missing', async () => {
            //Arrange
            const incompleteGoatData = { name: 'plum'}

            //Act & Assert
            await expect(Goat.create(incompleteGoatData)).rejects.toThrow('age is missing')
        })
    })

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

    describe('destroy', () => {
        it('should resolve with goat information deleted from database', async () => {
            //Arrange
            const goat = new Goat({ id: 1, name: 'charlie', age: 99 });
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: [goat]})
            //Act
            const result = await goat.destroy()
            //Assert
            expect(result).toBeInstanceOf(Goat)
            expect(result.id).toBe(1)
            expect(result.name).toBe('charlie')
            expect(result.age).toBe(99)
            expect(db.query).toHaveBeenCalledWith("DELETE FROM goats WHERE id = $1 RETURNING *", [goat.id])
        })

        it('it should trow an error if the data was not deleted', async () => {
            //Arrange
            const goat = new Goat({ id: 1, name: 'charlie', age: 99 });
            jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'))
            //Assert &Act
            await expect(goat.destroy()).rejects.toThrow('Cannot delete.')

        })
    })

})

