import 'dotenv/config'
import redis from 'redis'
import Telegraf from 'telegraf'
import { saveUser } from './middlewares'
import { promosifyRedis } from './utils'
import {
  plusRep, minusRep, getRep,
  start
} from './handlers'

const { BOT_TOKEN } = process.env

const client = redis.createClient()
client.on('error', console.error)
const bot = new Telegraf(BOT_TOKEN)

bot.context.redis = promosifyRedis(client)
bot.use(saveUser)
bot.command('rep', ...getRep)
bot.hears(/\+rep/, ...plusRep)
bot.hears(/\-rep/, ...minusRep)
bot.start(start)

bot.startPolling()
