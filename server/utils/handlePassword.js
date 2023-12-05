const bcrypt = require('bcryptjs');

exports.hash = (password) => {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)
  return hash
},
exports.compare = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword)
}


