import { onlyChat, onlyReply } from './middlewares'
import { getRedisChat, getTargetUser } from './utils'

/* ----- pm start command ----- */
export const start = ctx => ctx
/* ----- pm start command ----- */

/* ----- change rep ----- */
const changeRep = num => ({ redis, message, chat }) =>
  redis.zincrby(getRedisChat(chat.id), num, message.reply_to_message.from.id).then(console.log)
export const plusRep = [ onlyChat, onlyReply, changeRep(1) ]
export const minusRep = [ onlyChat, onlyReply, changeRep(-1) ]
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
