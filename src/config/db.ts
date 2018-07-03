import * as pg from 'pg';
import { sql } from '../sql-string';
import * as dbConfig from './dbConfig';

const pool: pg.Pool = (function() {
  return new pg.Pool({ ...dbConfig.default });
})();

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export interface SQLPreparedStatement {
  get<T = any>(...params: any[]): Promise<T>;
  all<T = any>(...params: any[]): Promise<T[]>;
}

export default class PostgresDB implements SQLPreparedStatement {
  public static async setup(): Promise<PostgresDB> {
    const client = await pool.connect();

    try {
      let pgdb = new this(client);
      console.log('Connected to Postgres Database!');

      return pgdb;
    } catch (e) {
      console.error(`ERROR during posgres setup\n${e}`);
      throw e;
    } finally {
      client.release();
    }
  }

  private client: pg.Client;

  private constructor(client: pg.Client) {
    this.client = client;
  }
  // tslint:disable-next-line:no-empty
  public async shutdown(): Promise<void> {
    await pool.end();
  }
  public async run(query: string, ...params: any[]): Promise<{ lastID: string } | void> {
    let q = query.toLowerCase().trim();
    if (q.indexOf('insert into ') >= 0) {
      if (q[q.length - 1] === ';') {
        query = `${query.substr(0, query.length - 1)} RETURNING id;`;
      } else {
        query = `${query} RETURNING id;`;
      }
    }
    let res = await this.client.query(query, params);
    if (res.rows && res.rows.length > 0) {
      let lastID = null;
      lastID = res.rows[0].id;
      if (lastID === null) {
        throw new Error('Did not return a lastID');
      }
      return { lastID };
    }
  }

  public async get<T>(query: string, ...params: any[]): Promise<T> {
    return await this.client.query(query, params).then(result => result.rows[0]);
  }

  public async all<T>(query: string, ...params: any[]): Promise<T[]> {
    return await this.client.query(query, params).then(result => result.rows);
  }

  public async getIndicesForTable(tableName: string): Promise<string[]> {
    return (await this.all(sql`
        SELECT indexname AS name
        FROM pg_indexes 
        WHERE tablename = \'${tableName.toLowerCase()}\'`)).map((result: any) => result.name as string);
  }
  public async getAllTriggers(): Promise<string[]> {
    return (await this.all(sql`
        SELECT tgname AS name FROM pg_trigger,pg_proc 
        WHERE pg_proc.oid=pg_trigger.tgfoid AND tgisinternal = false`)).map((result: any) => result.name as string);
  }
  public async getAllMaterializedViews(): Promise<string[]> {
    return (await this.all(sql`
        SELECT oid::regclass::text 
        FROM pg_class WHERE  relkind = 'm'`)).map((result: any) => result.oid as string);
  }
  public async getAllViews(): Promise<string[]> {
    return (await this.all(sql`
        SELECT viewname AS name 
        FROM pg_catalog.pg_views;`)).map((result: any) => result.name as string);
  }
  public async getAllFunctions(): Promise<string[]> {
    return (await this.all(sql`
        SELECT routines.routine_name as name
        FROM information_schema.routines
        LEFT JOIN information_schema.parameters ON routines.specific_name=parameters.specific_name
        WHERE routines.specific_schema='public'
        ORDER BY routines.routine_name, parameters.ordinal_position;`)).map((result: any) => result.name as string);
  }
  public async getAllTableNames(): Promise<string[]> {
    return (await this.all(sql`
        SELECT table_name as name
        FROM information_schema.tables
        WHERE table_schema='public'
        AND table_type='BASE TABLE';`)).map((result: any) => result.name as string);
  }
}
