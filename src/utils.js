import { promisify } from 'util'

export const getFullName = ({ last_name: lastName, first_name: firstName }) =>
  lastName ? `${firstName} ${lastName}` : firstName

export const getRedisUser = id => `user:${id}`
export const getRedisChat = id => `top:${id}`

export const promosifyRedis = (client) => ({
  hmset: promisify(client.hmset).bind(client),
  hmget: promisify(client.hmget).bind(client),
  zincrby: promisify(client.zincrby).bind(client),
  zscore: promisify(client.zscore).bind(client),
  zrank: promisify(client.zrank).bind(client)
})

export const isReplyToUser = msg =>
  msg.reply_to_message && !msg.reply_to_message.is_bot

export const getTargetUser = msg =>
  (isReplyToUser(msg)
    ? msg.reply_to_message : msg).from
