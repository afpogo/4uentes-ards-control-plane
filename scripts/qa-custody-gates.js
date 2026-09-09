"use strict";
// Run the owner-owned synthetic HTTP regression with an explicit checkout.
const path = require("node:path");
if (!process.argv[2]) throw new Error("Supply the SST owner checkout");
require(path.resolve(process.argv[2], "scripts/test-custody-http-postgres.js"));
