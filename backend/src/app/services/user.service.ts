import bcrypt from 'bcryptjs'
import { UserRepository } from '../repositories'
import { User } from '../entities'
import { UserRole } from '../dtos'

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  create = async (userData: User) => {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10)
    }
    const user = await this.userRepository.create(userData)
    return user
  }

  getAll = async () => {
    const users = await this.userRepository.getAll()
    return users.map(({ password, ...rest }) => rest)
  }

  getById = async (id: string) => {
    const user = await this.userRepository.getById(id)
    if (!user) return null

    const { password, ...rest } = user
    return rest
  }

  getByRole = async (role: UserRole) => {
    const users = await this.userRepository.getByRole(role)
    return users.map(({ password, ...rest }) => rest)
  }

  update = async (id: string, updateData: Partial<User>) => {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10)
    }
    const updatedUser = await this.userRepository.update(id, updateData)
    return updatedUser
  }

  delete = async (id: string) => {
    return this.userRepository.delete(id)
  }
}
