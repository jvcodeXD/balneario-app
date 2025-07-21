import { UserRole } from '../app/dtos'
import { User } from '../app/entities'
import { AppDataSource } from '../config'
import bcrypt from 'bcryptjs'

const runSeed = async () => {
  await AppDataSource.initialize()

  const usuarioRepo = AppDataSource.getRepository(User)

  const existe = await usuarioRepo.findOneBy({ username: 'mio' })
  if (existe) {
    console.log('ℹ️ Ya existe un usuario administrador.')
  } else {
    const password = await bcrypt.hash('admin', 10)

    const admin = usuarioRepo.create({
      username: 'mio',
      password,
      role: UserRole.ADMIN,
      fullname: 'Mio',
      picture: '/uploads/default.jpg'
    })

    await usuarioRepo.save(admin)
    console.log('✅ Usuario administrador creado.')
  }

  await AppDataSource.destroy()
}

runSeed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error al ejecutar el seed:', err)
    process.exit(1)
  })
