import { onlyChat, onlyReply, onlyPm } from './middlewares'
import { getRedisChat, getTargetUser } from './utils'

/* ----- pm start command ----- */
export const start = [ onlyPm,
  ctx => ctx.reply('For counting rep just add bot to chat')
]
/* ----- pm start command ----- */

/* ----- change rep ----- */
const changeRep = num => ({ redis, message, chat }) =>
  redis.zincrby(getRedisChat(chat.id), num, message.reply_to_message.from.id).then(console.log)
export const plus = [ onlyChat, onlyReply, changeRep(1) ]
export const minus = [ onlyChat, onlyReply, changeRep(-1) ]
/* ----- change rep ----- */

/* ----- get rep ----- */
export const getRep = [ onlyChat, async ctx => {
  const { id } = getTargetUser(ctx.message)
  const redisChat = getRedisChat(ctx.chat.id)
  const [ score, rank ] = await Promise.all([
    ctx.redis.zscore(redisChat, id),
    ctx.redis.zrank(redisChat, id)
  ])
  if (score === null) {
    return ctx.reply('You don\'t have any rep')
  }
  return ctx.reply(`Have ${score} rep
Top ${rank + 1} in chat`)
} ]
/* ----- get rep ----- */

/* ----- rep top ----- */
export const top = [ onlyChat, async ({ redis, chat }) => {
  console.log(await redis.zrange(getRedisChat(chat.id), 0, -1))
} ]
/* ----- rep top ----- */
