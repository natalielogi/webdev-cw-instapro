const path = require("path");

module.exports = {
  mode: "development", // Для разработки; для финальной сборки можно установить 'production'
  entry: "./index.js", // путь к твоему основному файлу, например, index.js в папке src
  output: {
    filename: "bundle.js", // имя сгенерированного файла
    path: path.resolve(__dirname, "dist"), // папка, куда будет помещён bundle.js
  },
  devServer: {
    static: path.join(__dirname, "dist"), // папка, откуда сервер будет отдавать файлы
    compress: true,
    port: 9000, // порт, на котором будет работать сервер
    open: true, // автоматически откроет браузер при запуске сервера
  },
  watch: true,
};
