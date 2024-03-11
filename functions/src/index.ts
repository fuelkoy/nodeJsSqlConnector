import "dotenv/config";
import * as dotenv from "dotenv";
import { initializeApp } from "firebase-admin/app";
import { onRequest } from "firebase-functions/v2/https";
import mysql from 'mysql2/promise';
import { Connector } from '@google-cloud/cloud-sql-connector';

dotenv.config({ path: "../.env" });

// Initialize the Firebase Admin SDK
initializeApp();

const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: 'fuelkdev:europe-north1:dev',
  // authType: AuthTypes.IAM,
});
const pool = await mysql.createPool({
  ...clientOpts,
  user: process.env.CLOUD_SQL_USER,
  password: process.env.CLOUD_SQL_PASSWORD,
  database: process.env.CLOUD_SQL_DATABASE,
});

// await pool.end();
// connector.close();

export const helloWorld = onRequest(async (request, response) => {
  response.send("Hello from Firebase!");

  const conn = await pool.getConnection();
  const [result] = await conn.query(`SELECT NOW();`);
  console.log(123);
  console.table(result); // prints returned time value from server
});