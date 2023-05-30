import { Pool, Client } from 'pg';
import { CidSharingQuery, ProviderDistributionQuery } from './queries';
import config from './config';

// Configure the connection settings
const dbConfig = {
  user: config.user,
  host: config.host,
  database: config.database,
  password:config.password,
  port: config.port,
};


// Create a new instance of the connection pool
const pool = new Pool(dbConfig);

// Example query to fetch all rows from a table
// pool.query('SELECT COUNT(*) FROM current_state WHERE current_state.verified_deal = false', (err:any, result:any) => {
// pool.query('SELECT * FROM current_state WHERE current_state.verified_deal = true LIMIT 1', (err:any, result:any) => {
const client = ['f1k6ebid57tjpreo3n7yjkivccx4gue2m4nt2lbkq']
pool.query(CidSharingQuery, [client], (err: any, result: any) => {
  if (err) {
    console.error('Error executing query', err);
    return;
  }

  // Process the query results
  console.log('Query result:', result.rows);
});

// Don't forget to release the pool when you're done
pool.end();
