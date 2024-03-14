import "dotenv/config";
import * as dotenv from "dotenv";
import { initializeApp } from "firebase-admin/app";
import { onRequest } from "firebase-functions/v2/https";
import mysql from 'mysql2/promise';
import { AuthTypes, Connector } from '@google-cloud/cloud-sql-connector';
import { setGlobalOptions } from "firebase-functions/v2";

dotenv.config({ path: "../.env" });

// Initialize the Firebase Admin SDK
initializeApp();

// Set global options for all functions
setGlobalOptions({
	region: "europe-north1",
	serviceAccount: process.env.CLOUD_SERVICE_ACCOUNT,
});


const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: process.env.CLOUD_INSTANCE_CONNECTION_NAME as string,
  authType: AuthTypes.IAM,
});
const pool = await mysql.createPool({
  ...clientOpts,
  user: "functionsServiceAccount",
  database: process.env.CLOUD_SQL_DATABASE,
});

export const helloWorld = onRequest(async (request, response) => {
  const conn = await pool.getConnection();
  const [result] = await conn.query(`SELECT NOW();`);
  console.table(result); // prints returned time value from server

  response.send("Hello from Firebase v2!");
});