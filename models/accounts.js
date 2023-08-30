const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const accounts = prisma.accounts

module.exports = accounts
