//models/Goat.js
const db = require('../database/connect')

class Goat {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.age = data.age
  }

  static async getAll() {
    const response = await db.query("SELECT * FROM goats");
    if (response.rows.length === 0) {
      throw new Error("No goats available.")
    }
    return response.rows.map(g => new Goat(g));
  }

  static async findById(id) {
    try {
      const goatData = await db.query('SELECT * FROM goats WHERE id = $1', [id])
      const goat = new Goat(goatData.rows[0]);
      return goat;
    } catch (err) {
      throw new Error('This goat does not exist!');
    }
  }

  static async create(data) {
    if (!data.name) { throw new Error("Name is missing") }

    if (!data.age) {
      throw new Error("age is missing")
    }

    if (!data.name || !data.age) {
      throw new Error("age or name missing")
    }

    const response = await db.query("INSERT INTO goats(name, age) VALUES ($1, $2) RETURNING *", [data.name, data.age])
    return new Goat(response.rows[0])
  }

  async update(data) {
    if (!data.name || !data.age) {
      throw new Error("age or name missing")
    }

    try {
      const response = await db.query(" UPDATE goats SET name = $1, age = $2 WHERE id = $3 RETURNING * ", [data.name, data.age, this.id])
      return new Goat(response.rows[0])
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async destroy() {
    try {
      const response = await db.query("DELETE FROM goats WHERE id = $1 RETURNING *", [this.id])
      return new Goat(response.rows[0])
    } catch(err) {
      throw new Error("Cannot delete.")
    }
  }
}

module.exports = Goat
