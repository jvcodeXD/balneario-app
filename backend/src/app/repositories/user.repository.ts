import { Repository, IsNull } from 'typeorm'
import { AppDataSource } from '../../config'
import { User } from '../entities'
import { UserRole } from '../dtos'

export class UserRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = AppDataSource.getRepository(User)
  }

  create = async (userData: Partial<User>) => {
    const user = this.repository.create(userData)
    return await this.repository.save(user)
  }

  getAll = async () => {
    return await this.repository.find({ where: { deleted_at: IsNull() } })
  }

  getById = async (id: string) => {
    return await this.repository.findOne({
      where: { id, deleted_at: IsNull() }
    })
  }

  update = async (id: string, updateData: Partial<User>) => {
    const user = await this.repository.findOne({
      where: { id, deleted_at: IsNull() }
    })
    if (!user) return null
    Object.assign(user, updateData)
    return await this.repository.save(user)
  }

  getByRole = async (role: UserRole) => {
    console.log(role)
    return await this.repository.find({
      where: { role, deleted_at: IsNull() }
    })
  }

  delete = async (id: string) => {
    const user = await this.repository.findOne({ where: { id } })
    if (!user) return false
    await this.repository.softDelete(id)
    return true
  }
}
