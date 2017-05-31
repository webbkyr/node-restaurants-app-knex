

### Connecting to your database

Knex support 2 types of connection configurations. objects and strings

Examples: 
1) Just the DATABASE name in an object
Simplest. Good for development
E.g. 'dev-restaurants-app

  ```json
  {
    client: 'pg',
    connection: {
      database : '<DATABASE>'
    }
  }
  ```

2) SERVER and DATABASE name in a connection string (good for development and environment variables)
E.g. 'postgresql://localhost/dev-restaurants-app'

```json
{
  client: 'pg',
  connection: 'postgresql://<SERVER>/<DATABASE>' 
}
```

3) USERNAME, PASSWORD, SERVER and DATABASE (and PORT) in a connection string
Most common. Good for production deployment when used with environment variables
E.g:
  - ElephantSQL: 'postgres://iipldsligr:WfGNrE2xK3FQDW7@stampy.db.elephantsql.com:5432/iipldsligr'
  - localhostDB: 'postgres://username:password@localhost:5432/database'

```json
{
  client: 'pg',
  connection: 'postgresql://<USERNAME>:<PASSWORD@<SERVER>/<DATABASE>' 
}
```

4) USERNAME, PASSWORD, SERVER and DATABASE in an object
Versitile, can be used for deployment when used with env vars but not as convenient as a string

```json
{
  client: 'pg',
  connection: {
    host : '<SERVER>',        // 'localhost'
    user : '<USERNAME>',      // 'dev'
    password : '<PASSWORD>',  // 'password
    database : '<DATABASE>',  // 'dev-restaurants-app'
    port : <PORT>             // 5432
}
```

### configuring environment variables
- `process.env` contains the environment variables values so,
- `process.env.DATABASE_URL` points to => "postgres://iipigr:WfGNrE2xK3FQDW7@stampy.db.elephantsql.com:5432/iipgr"
