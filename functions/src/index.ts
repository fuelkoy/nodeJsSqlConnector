import "dotenv/config";
import * as dotenv from "dotenv";
import { initializeApp } from "firebase-admin/app";
import { onRequest } from "firebase-functions/v2/https";
import mysql from 'mysql2/promise';
import { Connector } from '@google-cloud/cloud-sql-connector';
import { setGlobalOptions } from "firebase-functions/v2";

dotenv.config({ path: "../.env" });

// Initialize the Firebase Admin SDK
initializeApp();

// Set global options for all functions
setGlobalOptions({
	region: "europe-north1",
});


console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: process.env.CLOUD_INSTANCE_CONNECTION_NAME as string,
  // authType: AuthTypes.IAM,
});

const pool = mysql.createPool({
  ...clientOpts,
  user: process.env.CLOUD_SQL_USER,
  password: process.env.CLOUD_SQL_PASSWORD,
  database: process.env.CLOUD_SQL_DATABASE,
});
const conn = await pool.getConnection();

export const helloWorld = onRequest(async (request, response) => {
  console.log("⏳ Running...");
	const start = Date.now();

  const [result] = await conn.query(`SELECT NOW();`);
  console.table(result); // prints returned time value from server

  response.send("Hello from Firebase v2!");

  const end = Date.now();
	console.log(`✅ Function call completed in ${end - start}ms`);
});

// import "dotenv/config";
// import * as dotenv from "dotenv";
// import { initializeApp } from "firebase-admin/app";
// import { onRequest } from "firebase-functions/v2/https";
// import mysql from 'mysql2/promise';
// import { AuthTypes, Connector } from '@google-cloud/cloud-sql-connector';
// import { setGlobalOptions } from "firebase-functions/v2";

// dotenv.config({ path: "../.env" });

// // Initialize the Firebase Admin SDK
// initializeApp();

// // Set global options for all functions
// setGlobalOptions({
// 	region: "europe-north1",
// 	serviceAccount: process.env.CLOUD_SERVICE_ACCOUNT,
// });


// const createPool = async() => {
  
// console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
// const connector = new Connector();
// const clientOpts = await connector.getOptions({
//   instanceConnectionName: process.env.CLOUD_INSTANCE_CONNECTION_NAME as string,
//   authType: AuthTypes.IAM,
// });

// const pool = mysql.createPool({
//   ...clientOpts,
//   user: "functionsServiceAccount",
//   // user: process.env.CLOUD_SQL_USER,
//   // password: process.env.CLOUD_SQL_PASSWORD,
//   database: process.env.CLOUD_SQL_DATABASE,
// });

//   return { connector, pool  };
// }


// export const helloWorld = onRequest(async (request, response) => {
//   console.log("⏳ Running...");
// 	const start = Date.now();
//   const { connector, pool } = await createPool();
//   const conn = await pool.getConnection();
  
//   const end1 = Date.now();
// 	console.log(`✅ Connection made in ${end1 - start}ms`);
  
//   const [result] = await conn.query(`SELECT NOW();`);
//   console.table(result); // prints returned time value from server

//   response.send("Hello from Firebase v2!");

//   const end = Date.now();
// 	console.log(`✅ Function call completed in ${end - start}ms`);

//   await pool.end();
//   connector.close();
// });