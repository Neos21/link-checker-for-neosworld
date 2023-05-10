/** Logger */
export const logger = {
  info : (...messages) => console.log  (`[${new Date().toISOString()}] [INFO ]`, ...messages),
  warn : (...messages) => console.warn (`[${new Date().toISOString()}] [WARN ]`, ...messages),
  error: (...messages) => console.error(`[${new Date().toISOString()}] [ERROR]`, ...messages)
};
