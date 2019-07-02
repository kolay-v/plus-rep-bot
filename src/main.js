import 'dotenv/config'
import redis from 'redis'
import Telegraf from 'telegraf'
import { saveUser } from './middlewares'
import { promosifyRedis } from './utils'
import {
  plus, minus, getRep,
  start, top
} from './handlers'

const { BOT_TOKEN } = process.env

const client = redis.createClient()
client.on('error', console.error)
const bot = new Telegraf(BOT_TOKEN)

bot.context.redis = promosifyRedis(client)
bot.use(saveUser)
bot.command('rep', ...getRep)
bot.hears('+', ...plus)
bot.hears('-', ...minus)
bot.start(start)
bot.command('top', ...top)
process.on('SIGTERM', bot.stop)

bot.startPolling()
