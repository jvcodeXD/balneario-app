import { AppDataSource } from '../config'
import bcrypt from 'bcryptjs'
import { User } from '../app/entities/user.entity'
import { EstadoAmbiente, TipoAmbiente, UserRole } from '../app/dtos'
import { Precio } from '../app/entities/precio.entity'
import { Ambiente } from '../app/entities/ambiente.entity'

const runSeed = async () => {
  await AppDataSource.initialize()

  const usuarioRepo = AppDataSource.getRepository(User)
  const precioRepo = AppDataSource.getRepository(Precio)
  const ambienteRepo = AppDataSource.getRepository(Ambiente)

  // Usuario administrador
  const existe = await usuarioRepo.findOneBy({ username: 'mio' })
  if (!existe) {
    const password = await bcrypt.hash('admin', 10)
    const admin = usuarioRepo.create({
      username: 'mio',
      password: password,
      role: UserRole.ADMIN,
      fullname: 'Mio',
      picture: '/uploads/perfil-mio.jpg'
    })
    await usuarioRepo.save(admin)
    console.log('✅ Usuario administrador creado.')
  } else {
    console.log('ℹ️ Ya existe un usuario administrador.')
  }

  // Precios
  let piscinaNinos = await precioRepo.findOneBy({ tipo: 'PISCINA NIÑOS' })
  if (!piscinaNinos) {
    piscinaNinos = precioRepo.create({ tipo: 'PISCINA NIÑOS', precio: 3 })
    await precioRepo.save(piscinaNinos)
    console.log('✅ Precio PISCINA NIÑOS creado.')
  }

  let piscinaAdultos = await precioRepo.findOneBy({ tipo: 'PISCINA ADULTOS' })
  if (!piscinaAdultos) {
    piscinaAdultos = precioRepo.create({ tipo: 'PISCINA ADULTOS', precio: 5 })
    await precioRepo.save(piscinaAdultos)
    console.log('✅ Precio PISCINA ADULTOS creado.')
  }

  // Ambientes
  const yaExisteNinos = await ambienteRepo.findOneBy({
    nombre: 'PISCINA NIÑOS'
  })
  const yaExisteAdultos = await ambienteRepo.findOneBy({
    nombre: 'PISCINA ADULTOS'
  })

  if (!yaExisteNinos) {
    await ambienteRepo.save({
      tipo: TipoAmbiente.SAUNA_MIXTO,
      nombre: 'PISCINA NIÑOS',
      estado: EstadoAmbiente.HABILITADO,
      precio_id: piscinaNinos.id
    })
    console.log('✅ Ambiente PISCINA NIÑOS creado.')
  }

  if (!yaExisteAdultos) {
    await ambienteRepo.save({
      tipo: TipoAmbiente.SAUNA_MIXTO,
      nombre: 'PISCINA ADULTOS',
      estado: EstadoAmbiente.HABILITADO,
      precio_id: piscinaAdultos.id
    })
    console.log('✅ Ambiente PISCINA ADULTOS creado.')
  }

  await AppDataSource.destroy()
}

runSeed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error al ejecutar el seed:', err)
    process.exit(1)
  })
