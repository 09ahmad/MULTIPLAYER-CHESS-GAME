const zod=require("zod");

const username=zod.string().email().min(8);

const password=zod.string().min(8).regex(/[A-Z]/).regex(/[^A-Za-z0-9]/);

module.exports={username,password}