import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  components: {},
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#212121', // Negro grisáceo
          secondary: '#424242',
          background: '#F0F0F0',
        },
      },
      dark: {
        colors: {
          primary: '#1e1e1e', // negro más neutro
          secondary: '#757575',
          background: '#121212',
        },
      },
    },
  },
})
