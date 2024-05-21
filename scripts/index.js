const mongoose = require('mongoose');

const defaultScript = require('./default');
const initScript  = require('./init');
const { env } = require('../nodemon.json');

async function main() {
  const db = await mongoose.connect(env.MONGO_URL_DASHBOARD_PUBLIC_APIS);

  const permittedScripts = {
    default: defaultScript,
    init: initScript,
  }
  process.env.npm_config_name in permittedScripts
    ? await permittedScripts[process.env.npm_config_name](db)
    : permittedScripts['default']()

  await db.disconnect();
}

main().catch(err => console.log(err));
