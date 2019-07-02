import { getFullName, getRedisUser, isReplyToUser } from './utils'

/**
 * @description allow only messages in chat
 * @param {Context} ctx
 * @param {*} next
 */
export const onlyChat = ({ chat }, next) =>
  chat.type === 'supergroup' || chat.type === 'group'
    ? next() : null

/**
 * @description allow only private messages
 * @param {Context} ctx
 * @param {*} next
 */
export const onlyPm = ({ chat }, next) =>
  chat.type === 'private' ? next() : null

const saveToRedis = (client, user) => {
  const {
    id,
    username
  } = user
  const name = getFullName(user)
  client.hmset(getRedisUser(id), {
    username: username | null,
    name
  })
}

/**
 * @description save user to redis
 * @param {Context} ctx
 * @param {*} next
 */
export const saveUser = ({ redis, from, message }, next) => {
  if (!message) return next()
  saveToRedis(redis, from)
  if (isReplyToUser(message)) {
    saveToRedis(redis, message.reply_to_message.from)
  }
  next()
}

/**
 * @description allow only reply to user messages
 * @param {Context} ctx
 * @param {*} next
 */
export const onlyReply = ({ message }, next) => isReplyToUser(message) ? next() : null
