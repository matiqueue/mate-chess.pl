import prismaClient from './prisma.js';

//import { PrismaClient } from "@prisma/client"

//const prismaClient = new PrismaClient();



export const createUser = async (clerkID: string, username: string, email: string ) => {
  const user = await prismaClient.user.create({
    data: {
      clerkID: clerkID,
      username: username,
      email: email

    },
  })

  console.log(user)
}


export const getUserClerkID = async (clerkID: string) => {
  const user = await prismaClient.user.findFirst({
    where: {
      clerkID: clerkID,
    }
  })

  console.log(user)
}

export const updateLastOnline = async (clerkID: string) => {
  const user = await prismaClient.user.update({
    where: {clerkID: clerkID},
    data: {lastOnline: new Date()}
  })
  
}

async function main() {
  //createUser("123", "test1" ,"mail@mail.com")
  //getUserClerkID("123")
}

main()
  .then(async () => {
    await prismaClient.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prismaClient.$disconnect()
    process.exit(1)
  })