'use strict';

function makeStartServer({logger, app}) {
  return function startServer() {
    return new Promise((resolve, reject) => {
      logger.log(`starting plugin server`);
      const server = app.listen(0, err => {
        if (err) {
          logger.log('error starting plugin server', err);
          reject(err);
        } else {
          logger.log(`plugin server running at port: ${server.address().port}`);
          resolve({
            eyesPort: server.address().port,
            closeServer: server.close.bind(server),
          });
        }
      });

      server.on('error', err => {
        if (err.code === 'EADDRINUSE') {
          logger.log(
            `error: plugin server could not start at port ${
              server.address().port
            }: port is already in use.`,
          );
        } else {
          logger.log('error in plugin server:', err);
        }
        reject(err);
      });
    });
  };
}

module.exports = makeStartServer;
