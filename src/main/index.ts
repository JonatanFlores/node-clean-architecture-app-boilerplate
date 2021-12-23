import './config/module-alias'
import { app } from '@/main/config/app'
import { env } from '@/main/config/env'
import { MongoHelper } from '@/infra/repos/mongo'

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    app.listen(3333, () => console.log(`Server running on port ${env.port}`))
  })
  .catch(console.error)
