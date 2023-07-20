import { engine } from "express-handlebars";
import express from "express";
import productoRouter from "./routes/views.routes.js";
import realTimeProducts from "./routes/realTimeProducts.routes.js";
import { __dirname } from "./utils.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { guardarProducto } from "./service/productosUtils.js";
import { deleteProduct } from "./service/productosUtils.js";

const app = express();
const PORT = 8080;
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", productoRouter);
app.use("/realtimeproduct", realTimeProducts);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

httpServer.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

httpServer.on("error", (error) => {
  console.log(`Error: ${error}`);
});

const io = new Server(httpServer);

// Configurar el evento de conexión de Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Manejar eventos personalizados
  socket.on("mensaje", (data) => {
    console.log("Mensaje recibido:", data);

    // Enviar una respuesta al cliente
    socket.emit("respuesta", "Mensaje recibido correctamente");
  });

  // Escuchar evento 'agregarProducto' y emitir 'nuevoProductoAgregado'
  socket.on("agregarProducto", (newProduct) => {
    console.log("Nuevo producto recibido backend:", newProduct);
    guardarProducto(newProduct);
    // Agregar el nuevo producto a la lista de productos
    io.emit("nuevoProductoAgregado", newProduct);
  });
  socket.on("delete-product", (productId) => {
    const { id } = productId;
    deleteProduct(id); // fn que borra productos en services
    socket.emit("delete-product", id);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});
