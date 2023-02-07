// 导出配置
export default () => {
  return {
    nacos: {
      server: `${process.env.NACOS_SERVICE_HOST}:${process.env.NACOS_SERVICE_PORT}`,
      namespace: process.env.NACOS_NAMESPACE,
    },

    jwt: {
      secret: '4vRk^ga52xVP$B2vYK$%r8a8hctLgbU9',
      expiresIn: '60000s',
    },

    database: {
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      autoLoadEntities: true,
      timezone: 'Z',
      synchronize: process.env.NODE_ENV == 'development', // only dev
    },

    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },

    proxy: {
      agent: process.env.PROXY_AGENT,
      path: process.env.PROXY_PATH,
    },

    browserless: process.env.BROWSERLESS,
  };
};
