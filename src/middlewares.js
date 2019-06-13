import { getFullName, getRedisUser, isReplyToUser } from './utils'

export const onlyChat = ({ chat }, next) =>
  chat.type === 'supergroup' || chat.type === 'group'
    ? next() : null

const saveToRedis = (client, user) => {
  const {
    id,
    username
  } = user
  const name = getFullName(user)
  client.hmset(getRedisUser(id), { username, name })
}

export const saveUser = ({ redis, from, message }, next) => {
  saveToRedis(redis, from)
  if (isReplyToUser(message)) {
    saveToRedis(redis, message.reply_to_message.from)
  }
  next()
}

export const onlyReply = ({ message }, next) => isReplyToUser(message) ? next() : null
