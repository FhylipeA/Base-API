const knex = require('../database/knex')
const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")

class UsersController {

   async create(request, response) {
      const { name, email, password } = request.body

      const checkUserExists = await knex("users").where({ email }).first()

      if (checkUserExists) {
         throw new AppError("este email ja está em uso.")
      }

      const hashedPassword = await hash(password, 8)

      await knex("users").insert({
         name,
         email,
         password: hashedPassword
      })

      return response.status(201).json()

   }


   async update(request, response) {
      const { name, email, password, old_password } = request.body
      const { id } = request.params

      let user = await knex("users").where({ id }).first()

      if (!user) {
         throw new AppError("Usuáro não encontrado")
      }

      const userWithUpdatedEmail = await knex("users")
         .where({ email })
         .whereNot({ id })
         .first();

      if (userWithUpdatedEmail) {
         throw new AppError("Este email já está em uso.")
      }

      user.name = name ?? user.name;
      user.email = email ?? user.email;

      if (password && !old_password) {
         throw new AppError("É necessária a a senha antiga pra redefinir a senha")
      }

      if (password && old_password) {
         const checkOldPassword = await compare(old_password, user.password)

         if (!checkOldPassword) {
            throw new AppError("A senha antiga não confere.")
         }

         user.password = await hash(password, 8)
      }


      await knex("users").where({ id }).update({
         name: user.name,
         email: user.email,
         password: user.password,
         updated_at: knex.fn.now()
      })

      return response.json()
   }

}

module.exports = UsersController;