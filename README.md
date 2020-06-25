central-client
=====================

central client sdk

install: 

```shell script
npm i @btctop/central-client
```

usage:

```javascript
const { Client } = require('@btctop/central-client');

const clientId = 'your client id';
const secretKey = 'your secret key';
const endPoint = 'root url of central service';


const client = new Client({ clientId, secretKey, endPoint });

const path = '/activity/create';
const data = { pool: 1 };
const method = 'POST';

const result = await client.call(path, data, method);
```
