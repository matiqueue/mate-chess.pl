// // import prisma from "@/lib/db/prisma";
// import { PrismaClient } from "@prisma/client"
// import { ObjectId } from "mongodb";

// const prisma = new PrismaClient()

// export async function seedTestData() {
//   console.log("Seeding test data...");

//   // 1. Tworzymy 2 użytkowników z clerkID
//   const user1 = await prisma.user.create({
//     data: {
//       id: new ObjectId().toString(),
//       clerkID: "clerk_test_1",
//       username: "TestUser1",
//       elo: 1200,
//       createdAt: new Date(),
//       lastOnline: new Date(),
//       settings: {},
//       gamesWon: 0,
//       gamesLost: 0,
//     },
//   });

//   const user2 = await prisma.user.create({
//     data: {
//       id: new ObjectId().toString(),
//       clerkID: "clerk_test_2",
//       username: "TestUser2",
//       elo: 1300,
//       createdAt: new Date(),
//       lastOnline: new Date(),
//       settings: {},
//       gamesWon: 0,
//       gamesLost: 0,
//     },
//   });

//   console.log(`Created users with clerkID: ${user1.clerkID}, ${user2.clerkID}`);

//   for (let i = 0; i < 5; i++) {
//     const isUser1Winner = i % 2 === 0;
//     const player1_result = isUser1Winner ? "win" : "loss";
//     const player2_result = isUser1Winner ? "loss" : "win";

//     await prisma.game.create({
//       data: {
//         id: new ObjectId().toString(),
//         gameType: "standard",
//         createdAt: new Date(),
//         player1: user1.id,
//         player2: user2.id,
//         player1_PGN: `PGN Game ${i + 1} for ${user1.username}`,
//         player2_PGN: `PGN Game ${i + 1} for ${user2.username}`,
//         player1_result,
//         player2_result,
//       },
//     });
//   }

//   console.log("Seeded 2 users and 5 games between them.");
// }

// /**
//  * Aktualizuje pole lastOnline dla użytkownika, wyszukując go po clerkID.
//  */
// export async function updateLastOnlineByClerkID(clerkID: string) {
//   await prisma.user.update({
//     where: { clerkID },
//     data: { lastOnline: new Date() },
//   });
// }

// export interface NewUserData {
//   clerkID: string;
//   username: string;
//   elo?: number;       // domyślnie 300
//   settings?: object;  // jeśli chcesz nadawać custom settings
// }

// /**
//  * Sprawdza, czy istnieje user po clerkID.
//  * Jeśli nie istnieje, tworzy go.
//  * Zwraca obiekt user.
//  */
// export async function ensureUserExists(userData: NewUserData) {
//   let user = await prisma.user.findUnique({
//     where: { clerkID: userData.clerkID },
//   });

//   if (!user) {
//     user = await prisma.user.create({
//       data: {
//         id: new ObjectId().toString(),
//         clerkID: userData.clerkID,
//         username: userData.username,
//         elo: userData.elo ?? 300,
//         createdAt: new Date(),
//         lastOnline: new Date(),
//         settings: userData.settings ?? {},
//         gamesWon: 0,
//         gamesLost: 0,
//       },
//     });
//   }

//   return user;
// }

// /**
//  * Typ wyniku gry dla każdego gracza: "win", "loss" lub "draw".
//  */
// export type GameResultType = "win" | "loss" | "draw";

// interface RecordGameOutcomeParams {
//   clerkID_player1: string;     // clerkID dla player1
//   clerkID_player2: string;     // clerkID dla player2
//   player1_PGN: string;
//   player2_PGN: string;
//   player1_result: GameResultType;
//   player2_result: GameResultType;
//   gameType?: string;           // default = "standard"
// }

// /**
//  * Funkcja wywoływana po zakończeniu gry:
//  *  - Aktualizuje gamesWon/gamesLost u obu userów (po clerkID).
//  *  - Tworzy nowy rekord Game w bazie (player1, player2 to ObjectId).
//  */
// export async function recordGameOutcome(params: RecordGameOutcomeParams) {
//   const {
//     clerkID_player1,
//     clerkID_player2,
//     player1_PGN,
//     player2_PGN,
//     player1_result,
//     player2_result,
//     gameType = "standard",
//   } = params;

//   // 1. Pobierz userów z bazy, bo potrzebujemy ich _id (String) do player1 i player2
//   const user1 = await prisma.user.findUnique({
//     where: { clerkID: clerkID_player1 },
//   });

//   const user2 = await prisma.user.findUnique({
//     where: { clerkID: clerkID_player2 },
//   });

//   if (!user1 || !user2) {
//     throw new Error("recordGameOutcome: One or both clerkIDs do not exist in DB");
//   }

//   // 2. Aktualizacja statystyk
//   if (player1_result === "win") {
//     await prisma.user.update({
//       where: { clerkID: clerkID_player1 },
//       data: { gamesWon: { increment: 1 } },
//     });
//     await prisma.user.update({
//       where: { clerkID: clerkID_player2 },
//       data: { gamesLost: { increment: 1 } },
//     });
//   } else if (player2_result === "win") {
//     await prisma.user.update({
//       where: { clerkID: clerkID_player1 },
//       data: { gamesLost: { increment: 1 } },
//     });
//     await prisma.user.update({
//       where: { clerkID: clerkID_player2 },
//       data: { gamesWon: { increment: 1 } },
//     });
//   }
//   // draw = brak zmian w statystykach, chyba że chcesz liczyć remisy osobno

//   // 3. Tworzymy nowy rekord Game
//   await prisma.game.create({
//     data: {
//       id: new ObjectId().toString(),
//       gameType,
//       createdAt: new Date(),
//       player1: user1.id, // np. "643e58..."
//       player2: user2.id,
//       player1_PGN,
//       player2_PGN,
//       player1_result,
//       player2_result,
//     },
//   });
// }

// /**
//  * Zwraca podstawowe dane usera (po clerkID) oraz ostatnie 5 gier,
//  * gdzie user występuje jako player1 lub player2 (sortowane po createdAt desc).
//  */
// export async function getUserStatisticsByClerkID(clerkID: string) {
//   // 1. Pobierz użytkownika po clerkID
//   const user = await prisma.user.findUnique({
//     where: { clerkID },
//     select: {
//       username: true,
//       lastOnline: true,
//       createdAt: true,
//       gamesWon: true,
//       gamesLost: true,
//       id: true, // Potrzebne do wyszukania gier
//     },
//   });

//   if (!user) return null; // lub rzuć błędem

//   // 2. Pobierz ostatnie 5 gier, w których wystąpił user
//   const games = await prisma.game.findMany({
//     where: {
//       OR: [{ player1: user.id }, { player2: user.id }],
//     },
//     orderBy: { createdAt: "desc" },
//     take: 5,
//     select: {
//       id: true,
//       gameType: true,
//       createdAt: true,
//       player1: true,
//       player2: true,
//       player1_PGN: true,
//       player2_PGN: true,
//       player1_result: true,
//       player2_result: true,
//     },
//   });

//   return {
//     user: user,
//     games: games
//   };
// }
