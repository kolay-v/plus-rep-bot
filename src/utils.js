import { promisify } from 'util'

/**
 * @param {User} user
 * @returns {String} user's full name
 */
export const getFullName = ({ last_name: lastName, first_name: firstName }) =>
  lastName ? `${firstName} ${lastName}` : firstName

/**
 *
 * @param {Number} id
 * @returns {String}
 */
export const getRedisUser = id => `user:${id}`
/**
 *
 * @param {Number} id
 * @returns {String}
 */
export const getRedisChat = id => `top:${id}`

/**
 * @description make client use {Promise}
 * @param {RedisClient} client
 */
export const promosifyRedis = (client) => ({
  hmset: promisify(client.hmset).bind(client),
  hmget: promisify(client.hmget).bind(client),
  zincrby: promisify(client.zincrby).bind(client),
  zrange: promisify(client.zrange).bind(client),
  zscore: promisify(client.zscore).bind(client),
  zrank: promisify(client.zrank).bind(client)
})

/**
 * @description check is message reply to user
 * @param {Message} msg
 */
export const isReplyToUser = ({ from, reply_to_message: reply }) =>
//  console.log(reply_to_message) ||
  reply && !reply.from.is_bot &&
  from.id !== reply.from.id

/**
 * @param {Message} msg
 * @returns {User} return `msg.from` or `msg.reply_to_message.from`
 */
export const getTargetUser = msg =>
  (isReplyToUser(msg)
    ? msg.reply_to_message : msg).from
