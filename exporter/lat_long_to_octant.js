"use strict";

/**************************** config ****************************/
const PLANET = "earth";
const URL_PREFIX = `https://kh.google.com/rt/${PLANET}/`;
const MAX_LEVEL = 18;
/****************************************************************/

const utils = require("./lib/utils")({
  URL_PREFIX,
  DUMP_JSON_DIR: null,
  DUMP_RAW_DIR: null,
  DUMP_JSON: false,
  DUMP_RAW: false,
});

const latLongToOctant = require("./lib/convert-lat-long-to-octant")(utils);

/***************************** main *****************************/
async function run() {
  // proxy
  let [p_ip, p_port] = [process.argv[4], process.argv[5]];
  process.env.P_IP = p_ip || "";
  process.env.P_PORT = p_port || "";

  if (p_ip && p_port) {
    console.log(`use proxy server:http://${p_ip}:${p_port}`);
  }
  let [p_user, p_password] = [process.argv[6], process.argv[7]];

  if (p_user && p_password) {
    process.env.P_USER = p_user || "";
    process.env.P_PASSWORD = p_password || "";
  }

  // start
  let [lat, lon] = [process.argv[2], process.argv[3]];

  if ([lat, lon].includes(undefined)) {
    const invoc = `node ${require("path").basename(__filename)}`;
    console.error(`Usage:`);
    console.error(`  ${invoc} [latitude] [longitude]`);
    console.error(`  ${invoc} 37.420806884765625 -122.08419799804688`);
    process.exit(1);
  }

  [lat, lon] = [parseFloat(lat), parseFloat(lon)];
  const foundOctants = await latLongToOctant(lat, lon, MAX_LEVEL);

  console.log(lat + ", " + lon);
  console.log("-------------");

  for (let octantLevel in foundOctants) {
    let octants = foundOctants[octantLevel].octants;
    let box = foundOctants[octantLevel].box;
    console.log("Octant Level:", octantLevel);
    console.log(box);
    for (let i = 0; i < octants.length; i++) {
      console.log("    " + octants[i]);
    }
  }
}

/****************************************************************/
(async function program() {
  await run();
})()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
