import { Pool, Client } from 'pg';
import { CidSharingQuery, ProviderDistributionQuery, ReplicaDistributionQuery } from './queries';
import config from './config';
import { getCurrentEpoch } from './utils';

// Configure the connection settings
const dbConfig = {
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
};


// Create a new instance of the connection pool
const pool = new Pool(dbConfig);

// Example query to fetch all rows from a table
// pool.query('SELECT COUNT(*) FROM current_state WHERE current_state.verified_deal = false', (err:any, result:any) => {
// pool.query('SELECT * FROM current_state WHERE current_state.verified_deal = true LIMIT 1', (err:any, result:any) => {
const runQuery = (query: string, args: any[], name?: string) => {
  pool.query(query, [...args], (err: any, result: any) => {
    if (err) {
      console.error('Error executing query',name,  err);
      return;
    }

    console.log('Query result:', name, result.rows);
  });

  // pool.end();
}


const client = 'f1k6ebid57tjpreo3n7yjkivccx4gue2m4nt2lbkq'
const epoch = getCurrentEpoch()
runQuery(ProviderDistributionQuery, [[client], epoch], "ProviderDistributionQuery")
runQuery(ReplicaDistributionQuery, [[client], epoch], "ReplicaDistributionQuery")
runQuery(CidSharingQuery, [[client]], "CidSharingQuery")

pool.end();