## Lastest Features 1.1.3

> What's new
- setDevMode - now a development mode to make ur life easier (must be on top of everything within main.js)
- getDevMode - return "auto" or boolean depending on setDevMode
- Parser is now built-in within dev mode
- server.config deprecated in favor of server.setOptions
- NodeJS v22.15.0
- built in sqlite [Guide Me](https://nodejs.org/api/sqlite.html)

## Lastest Features 1.1.2

> What's new?
- lookupPlayer -> takes integer and string; server.lookupPlayer("");

## Lastest Features 1.1.1

> Commands Handler [Guide Me](www.example.com)
- server.events.registerCommandPrefixes
- server.events.registerCommand
- server.events.triggerCommand

> Custom Server Events Handler [Guide Me](www.example.com)
- server.events.on('server.events', function);
- server.config(['serverOptions'], boolean);