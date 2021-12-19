import './config/module-alias'
import { app } from '@/main/config/app'
import { env } from '@/main/config/env'

app.listen(3333, () => console.log(`Server running on port ${env.port}`))
