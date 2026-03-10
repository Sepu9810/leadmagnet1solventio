const args = { action: "auth:signIn", args: { provider: "google", params: { redirectTo: "http://localhost:3000" } } };
fetch("http://localhost:3000/api/auth", {
  method: "POST",
  body: JSON.stringify(args)
}).then(async r => {
  console.log(r.status);
  console.log(await r.text());
}).catch(e => console.error(e));
